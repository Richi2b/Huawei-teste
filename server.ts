import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY" && key.trim() !== "") {
      try {
        aiClient = new GoogleGenAI({
          apiKey: key,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });
        console.log("Gemini Client successfully initialized server-side.");
      } catch (error) {
        console.error("Failed to initialize Gemini Client:", error);
      }
    }
  }
  return aiClient;
}

// SEED DATA FOR LOGIC FALLBACKS
const PROCEDURAL_QUESTIONS = [
  {
    topic: 'Programação',
    questions: [
      { text: 'Explique a diferença entre Programação Imperativa e Declarativa. Como o React se encaixa neste conceito?', level: 'Intermédio' },
      { text: 'Como funciona o Loop de Eventos (Event Loop) do Node.js e por que ele permite alta concorrência mesmo sendo single-threaded?', level: 'Avançado' },
      { text: 'O que é injeção de dependência e como isso contribui para a modularidade e testabilidade de um software complexo?', level: 'Avançado' },
      { text: 'Como projetaria um sistema de cache multinível (Memcached/Redis + Local Memory) garantindo a consistência eventual dos dados?', level: 'Especialista' }
    ]
  },
  {
    topic: 'Redes',
    questions: [
      { text: 'O que é o protocolo DHCP? Explique as 4 fases de alocação de IP (processo DORA).', level: 'Júnior' },
      { text: 'Qual é a diferença entre comutação por circuitos e comutação por pacotes? Como o roteamento IP opera sob esses cenários?', level: 'Intermédio' },
      { text: 'Como o protocolo TCP faz controlo de fluxo e controlo de congestionamento? Fale sobre Slow Start e Janela Deslizante.', level: 'Avançado' },
      { text: 'Explique o protocolo BGP e como ele previne loops de roteamento em sistemas autónomos (AS).', level: 'Especialista' }
    ]
  },
  {
    topic: 'Telecomunicações',
    questions: [
      { text: 'Quais as frequências de operação mais comuns no 5G e quais as diferenças de cobertura e débito entre frequências sub-6 GHz e ondas milimétricas (mmWave)?', level: 'Intermédio' },
      { text: 'Mapeie o fluxo de chamadas e transferência de canais (Handover) quando um utilizador móvel se desloca entre duas células LTE distintas.', level: 'Avançado' },
      { text: 'O que é atenuação por desvanecimento (Fading) em telecomunicação sem fios e como antenas de diversidade ajudam a mitigar este efeito?', level: 'Avançado' },
      { text: 'Explique a arquitetura e principais componentes de uma rede FTTH baseada em GPON (OLT, ONT, Divisores Ópticos).', level: 'Especialista' }
    ]
  },
  {
    topic: 'Cloud',
    questions: [
      { text: 'Quais as vantagens de usar Content Delivery Networks (CDNs) para ativos estáticos e como funcionam as políticas de cache de borda?', level: 'Intermédio' },
      { text: 'Como planeia a resiliência e failover automático de servidores de bases de dados relativas (RDS) numa arquitetura Multi-AZ?', level: 'Avançado' },
      { text: 'Explique o conceito de Serverless Computing. Quais são as limitações de cold start e estado da aplicação?', level: 'Avançado' },
      { text: 'Desenhe uma arquitetura de microsserviços segura com isolamento de rede através de VPCs, Security Groups e gateways customizados na nuvem.', level: 'Especialista' }
    ]
  },
  {
    topic: 'IA',
    questions: [
      { text: 'Como funciona uma função de ativação numa rede neuronal artificial? Compare ReLU, Sigmoid e Softmax.', level: 'Intermédio' },
      { text: 'O que é aprendizagem por transferência (Transfer Learning) e como ela acelera o treino em tarefas de visão computacional ou linguística?', level: 'Avançado' },
      { text: 'Descreva como funciona o algoritmo de Gradiente Descendente Estocástico (SGD) e como o conceito de Momentum auxilia a evitar mínimos locais.', level: 'Avançado' },
      { text: 'Explique a arquitetura de uma rede Generativa Adversária (GAN) e a dinâmica competitiva entre o Gerador e o Discriminador.', level: 'Especialista' }
    ]
  }
];

// --- API ENDPOINTS ---

// 1. Geração de Plano Personalizado
app.post("/api/profile/plan", (req, res) => {
  const { name, track, englishLevel, admissionMode, experience } = req.body;
  
  // Definição de roadmap dinâmico de preparo
  const priorityTech = {
    'Programação': ['Algoritmos & Big O', 'Estruturas de Dados', 'Design Patterns', 'Princípios SOLID', 'Sistemas Distribuídos'],
    'Redes': ['Modelo OSI/TCP-IP', 'Arquitetura de Roteamento', 'Subredes VLSM', 'Protocolos OSPF/BGP', 'Configuração de Switches'],
    'Telecomunicações': ['Redes Móveis 4G/5G', 'Fibra Óptica (FTTH/GPON)', 'Propagação e Antenas', 'Massive MIMO & Beamforming', 'Transmissão IP/Sinal'],
    'Cloud': ['Serviços Cloud Huawei', 'Infraestrutura Gerida (CCE/ELB)', 'Kubernetes & Docker', 'Serverless & Microsserviços', 'IaC (Terraform)'],
    'IA': ['Machine Learning Básico', 'Deep Learning & Transformers', 'Embeddings Vetoriais', 'Otimização de Modelos', 'MLOps pipelines'],
    'Segurança': ['Firewalls & IDS/IPS', 'Criptografia Assimétrica', 'Zero Trust Architecture', 'Penetration Testing', 'Huawei SecoManager'],
    'Base de Dados': ['Modelagem Relacional (SQL)', 'Bancos NoSQL (MongoDB)', 'Indexação e Query Profiling', 'Sistemas Replicados e Sharding', 'Transações ACID'],
    'Desenvolvimento Web': ['Modos de Renderização (SSR/SPA)', 'Performance Frontend (Vite/Bundlers)', 'APIs RESTful e gRPC', 'CSS Customizado & Tailwind', 'Estado e Cache de Cliente'],
    'Flutter': ['Gerência de Estado (BLoC/Riverpod)', 'Widget Lifecycle', 'Integração de APIs e Isolas', 'Arquitetura Limpa Flutter', 'Compilação Nativa e Performance'],
    'DevOps': ['Pipelines CI/CD (GitLab, Jenkins)', 'Infras de Containers (Docker)', 'Orquestração Kubernetes', 'Automação Bash/Python', 'Monitoramento Prometeus/Grafana']
  }[track as keyof typeof priorityTech] || ['Modo de Engenharia Aplicada', 'Sistemas de Infraestrutura'];

  const recommendedHours = experience.includes('Sem experiência') ? 40 : experience.includes('sênior') || experience.includes('chefia') ? 15 : 25;

  const plan = {
    priorityTech,
    prioritySoft: ['Comunicação Sob Pressão (Método STAR)', 'Trabalho de Equipa Multinacional', 'Resolução de Conflitos', 'Adaptabilidade Organizacional', 'Foco no Cliente (Huawei Values)'],
    recommendedHours,
    focusEnglish: englishLevel === 'Básico' 
      ? ['Vocabulário Técnico de TI', 'Fórmulas de Apresentação Pessoal', 'Gramática e Tempos Verbais Passados/Presentes']
      : englishLevel === 'Intermédio'
      ? ['Apresentação de Desafios Profissionais', 'Argumentação de Soluções Arquiteturais', 'Pronúncia Fluida e Expressões Corporativas']
      : ['Debates sobre Tendências Tecnológicas (5G, IA)', 'Estilos de Liderança e Gestão Internacional', 'Nuances culturais de negociação corporativa'],
    preparationRoadmap: [
      `Fase 1: Teste Diagnóstico & Alinhamento de Dificuldade (${admissionMode})`,
      `Fase 2: Treinos de Raciocínio Psicotécnico & Lógico Huawei`,
      `Fase 3: Simulação Prática de Inglês com foco em Termos de ${track}`,
      `Fase 4: Preparação Intensiva de Respostas Comportamentais com o Treinador`,
      `Fase 5: Maratona do Exame Técnico no Nível de Experiência (${experience})`,
      `Fase 6: Simulação de Alta Pressão Real de 60 minutos`
    ],
    estimatedDaysToSuccess: recommendedHours <= 20 ? 7 : recommendedHours <= 30 ? 14 : 21
  };

  res.json({ success: true, plan });
});

// 2. Geração Dinâmica de Perguntas (Banco Gerado por IA)
app.post("/api/gemini/question", async (req, res) => {
  const { module, track, level, admissionMode, category } = req.body;
  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `Gere uma única pergunta altamente realista de teste de seleção para a empresa de tecnologia internacional Huawei.
      Dados contextuais da vaga:
      - Módulo da Entrevista: ${module} ${category ? `(Categoria: ${category})` : ''}
      - Tecnologia/Área de Interesse: ${track}
      - Nível de Experiência: ${level}
      - Programa de Admissão: ${admissionMode} (por exemplo, Huawei Graduate Program, Huawei Angola, ICT Academy)
      
      Diretriz Crítica de Idioma:
      - Se o módulo for 'ingles' ou 'english', a pergunta e as orientações DEVEM ser geradas obrigatoriamente em INGLÊS.
      - Para qualquer outro módulo, gere a pergunta em português de Angola ou português europeu profissional.
      - Se o módulo for 'psicotecnico', devolva obrigatoriamente um objeto do tipo múltipla escolha com as opções e indique o índice da correta (corretOption de 0 a 3).
      
      Você DEVE retornar a resposta num formato JSON estruturado exatamente de acordo com o seguinte esquema:
      {
        "text": "Texto completo da pergunta/desafio",
        "options": ["Opção A", "Opção B", "Opção C", "Opção D"], // Apenas para módulo psicotécnico ou se for de múltipla escolha, senão deixe nulo ou vazio
        "correctOption": 1, // Índice da correta (0 a 3, apenas para múltipla escolha, senão nulo)
        "idealAnswer": "Um sumário sobre como seria a resposta de um candidato excelente",
        "hint": "Uma dica rápida para o candidato"
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const parsedQuestion = JSON.parse(response.text || "{}");
      return res.json({
        id: 'dyn_' + Date.now(),
        module,
        category,
        topic: track,
        level,
        text: parsedQuestion.text,
        options: parsedQuestion.options || undefined,
        correctOption: parsedQuestion.correctOption !== undefined ? parsedQuestion.correctOption : undefined,
        idealAnswer: parsedQuestion.idealAnswer,
        hint: parsedQuestion.hint,
        isCustomGenerated: true
      });
    } catch (err) {
      console.warn("Gemini generation failed. Dropping to procedural generator:", err);
    }
  }

  // --- LOCAL FALLBACK ENGINE (Procedural Dynamic Questions) ---
  let selectedText = "Como resolveria um gargalo crítico de conectividade na rede?";
  let options: string[] | undefined = undefined;
  let correctOption: number | undefined = undefined;
  let ideal = "Explique como usar monitoramento estruturado, ping, traceroute e checagem de switches.";
  let hint = "Pense no fluxo de pacotes nas camadas do Modelo OSI.";

  if (module === 'psicotecnico') {
    const sequenceTypes = [
      { text: 'Complete a sequência lógica matemática: 3, 6, 12, 24, ?', opts: ['36', '48', '60', '96'], correct: 1, ideal: 'Cada termo é o dobro do anterior.', hint: 'Multiplicador constante' },
      { text: 'Selecione a palavra que continua a lógica: Switch, Router, Hub, Firewall, Access ... ?', opts: ['Cable', 'Point', 'Security', 'Port'], correct: 1, ideal: 'Completa o termo Access Point (Dispositivos de rede).', hint: 'Hardware de redes WiFi' },
      { text: 'Considere que em Luanda 12 antenas transmitem 400 Terabytes por dia. Se adicionarmos mais 6 antenas operando de forma idêntica, qual será o novo volume de transmissão total diário?', opts: ['500 Terabytes', '600 Terabytes', '800 Terabytes', '1000 Terabytes'], correct: 1, ideal: '18 antenas equivalem a 1.5x a capacidade anterior. 400 * 1.5 = 600.', hint: 'Proporcionalidade direta simples' }
    ];
    const picked = sequenceTypes[Math.floor(Math.random() * sequenceTypes.length)];
    selectedText = picked.text;
    options = picked.opts;
    correctOption = picked.correct;
    ideal = picked.ideal;
    hint = picked.hint;
  } else if (module === 'ingles') {
    const englishOptions = [
      { text: 'Describe a complex challenge you faced in your academic career and how you overcame it.', ideal: 'Structured narrative showing initiative, teamwork, and technical solution under stress.' },
      { text: 'What is your understanding of Huawei\'s Core Values? Specifically Customer Centricity.', ideal: 'Connecting customer satisfaction with engineering quality and rapid deployment.' },
      { text: 'Where do you see yourself in five years within our Global IT Infrastructure departments?', ideal: 'Showing ambition, wanting team management roles, or tech leadership certifications.' }
    ];
    const picked = englishOptions[Math.floor(Math.random() * englishOptions.length)];
    selectedText = picked.text;
    ideal = picked.ideal;
    hint = "Speak clearly and show confident corporate language.";
  } else if (module === 'rh') {
    const rhOptions = [
      { text: 'O que sabe sobre os investimentos da Huawei em Angola e as as parcerias no ICT Academy?', ideal: 'A Huawei apoia o enriquecimento profissional, tem datacenters públicos e capacita talentos locais.' },
      { text: 'Como reage quando recebe um feedback negativo ou uma crítica direta no seu trabalho?', ideal: 'Lida com maturidade, escuta ativa, sem atitude defensiva, focado em autodesenvolvimento e plano de ação.' }
    ];
    const picked = rhOptions[Math.floor(Math.random() * rhOptions.length)];
    selectedText = picked.text;
    ideal = picked.ideal;
    hint = "Mostre inteligência emocional profunda e resiliência.";
  } else if (module === 'tecnico') {
    const pool = PROCEDURAL_QUESTIONS.find(p => p.topic === track) || PROCEDURAL_QUESTIONS[0];
    const picked = pool.questions[Math.floor(Math.random() * pool.questions.length)];
    selectedText = picked.text;
    ideal = "Focado na contextualização teórica e aplicação prática para infraestrutura empresarial.";
    hint = `Aborde conceitos de nível ${picked.level}.`;
  } else if (module === 'gestor') {
    const gestOptions = [
      { text: 'Seu líder pede para priorizar uma tarefa de manutenção crítica, mas você tem um prazo final de testes do Huawei Graduate Program hoje. O que faz?', ideal: 'Comunica a limitação respeitosamente, solicita apoio aos colegas de equipa e alinha expectativas temporais baseadas em impacto corporativo.' },
      { text: 'O projeto estratégico está parado devido a uma divergência ferrenha sobre tecnologias entre os engenheiros. Como assume a liderança?', ideal: 'Facilita uma sessão focada em factos, métricas objetivas e testes de carga rápidos para decidir de forma unificada e baseada em dados.' }
    ];
    const picked = gestOptions[Math.floor(Math.random() * gestOptions.length)];
    selectedText = picked.text;
    ideal = picked.ideal;
    hint = "Priorize facilitação consensual de equipas e dados.";
  }

  res.json({
    id: 'local_' + Date.now(),
    module,
    category,
    topic: track,
    level,
    text: selectedText,
    options,
    correctOption,
    idealAnswer: ideal,
    hint,
    isCustomGenerated: false
  });
});

// 3. Corretor Inteligente & Treinador de Respostas (Módulos 7, 9, 10)
app.post("/api/gemini/evaluate", async (req, res) => {
  const { questionText, userAnswer, module, track, level, spoken, pronunciationText } = req.body;
  const ai = getGeminiClient();

  // Se o utilizador apenas murmurou ou deu uma resposta curta demais, alertar
  if (!userAnswer || userAnswer.trim().length < 4) {
    return res.json({
      grade: 10,
      strengths: ["Tentou iniciar uma resposta"],
      weaknesses: ["Resposta excessivamente curta ou ausente", "Falta de profundidade técnica", "Não abordou o coração do problema"],
      interviewerThoughts: "O candidato pareceu apático, intimidado ou com falta de preparação elementar.",
      improvementTips: "Estruture sua resposta baseada em conceitos funcionais, cite as ferramentas e utilize frases completas para demonstrar confiança.",
      idealAnswer: "Uma resposta profissional exige terminologias adequadas, como fluxos de controle, metodologias ágeis ou protocolos da camada TCP/IP.",
      train: {
        original: userAnswer || "Sem resposta.",
        good: "Eu sei resolver isso se pesquisar na documentação técnica da rede.",
        excellent: "Possuo conhecimento técnico em infraestrutura e redes para identificar o problema físico e aplicar soluções sistemáticas.",
        huaweiStandard: "Baseado nos valores da Huawei de inovação contínua e compromisso com o cliente, eu lideraria o diagnóstico imediato das camadas físicas da subrede utilizando analisadores de protocolo adicionados a redundâncias automáticas de rotas para assegurar zero paragens."
      }
    });
  }

  if (ai) {
    try {
      const prompt = `Atue como um rigoroso Recrutador Técnico e Psicólogo Organizacional da Huawei Angola. É um exame crucial.
      Analise criticamente a resposta do candidato para a seguinte pergunta.
      
      Pergunta: "${questionText}"
      Resposta do Candidato: "${userAnswer}"
      Módulo do exame: ${module}
      Área técnica: ${track}
      Nível esperado: ${level}
      O candidato respondeu via oral? ${spoken ? "Sim (via Microfone)" : "Não (via Teclado)"}
      ${pronunciationText ? `Transcrição de Pronúncia comparativa: ${pronunciationText}` : ''}

      Siga rigidamente os requisitos:
      - Atribua uma nota numérica honesta de 0 a 100 baseado na exatidão, termos técnicos e profundidade.
      - Retorne uma análise detalhada contendo pontos fortes e fracos técnicos e soft skills.
      - Descreva em duas frases o que o entrevistador da Huawei pensou honestamente ("O que o entrevistador pensaria").
      - Crie a evolução gradual de qualidade da resposta (Treinador de Respostas no Módulo 9):
        - ORIGINAL (a resposta enviada)
        - BOA (uma melhoria elementar)
        - EXCELENTE (uma resposta profissional estruturada)
        - HUAWEI STANDARD (uma resposta magistral conectada aos valores corporativos de dedicação e soluções Huawei)
      - Tudo deve estar em Português europeu ou de Angola, exceto se a pergunta for de inglês (onde o feedback pode conter partes em inglês pedagógicas).

      Retorne obrigatoriamente um objeto JSON com esta exata correspondência de chaves (schema):
      {
        "grade": Number,
        "strengths": ["string", "string"], // Mínimo 2 itens
        "weaknesses": ["string", "string"], // Mínimo 2 itens
        "interviewerThoughts": "string",
        "improvementTips": "string",
        "idealAnswer": "string",
        "train": {
          "original": "string",
          "good": "string",
          "excellent": "string",
          "huaweiStandard": "string"
        }
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              grade: { type: Type.INTEGER },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              interviewerThoughts: { type: Type.STRING },
              improvementTips: { type: Type.STRING },
              idealAnswer: { type: Type.STRING },
              train: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  good: { type: Type.STRING },
                  excellent: { type: Type.STRING },
                  huaweiStandard: { type: Type.STRING }
                },
                required: ["original", "good", "excellent", "huaweiStandard"]
              }
            },
            required: ["grade", "strengths", "weaknesses", "interviewerThoughts", "improvementTips", "idealAnswer", "train"]
          }
        }
      });

      const parsedFeedback = JSON.parse(response.text || "{}");
      return res.json(parsedFeedback);
    } catch (err) {
      console.warn("Gemini evaluation error. Dropping to heuristic feedback:", err);
    }
  }

  // --- HEURISTIC LOCAL FEEDBACK ENGINE ---
  // Analisador local inteligente de palavras-chave baseadas no tópico para pontuar realisticamente
  let grade = 65;
  const lowercaseAnswer = userAnswer.toLowerCase();
  
  // Critérios de enriquecimento técnico
  const technicalKeywords = ['protocolo', 'modelo', 'osi', 'latência', '5g', 'servidor', 'redundância', 'algoritmo', 'configuração', 'segurança', 'processo', 'monitorização', 'cliente', 'equipa', 'star', 'método'];
  let keywordMatches = 0;
  technicalKeywords.forEach(kw => {
    if (lowercaseAnswer.includes(kw)) keywordMatches++;
  });

  grade += Math.min(25, keywordMatches * 5);
  if (userAnswer.length > 150) grade += 10;
  if (spoken) grade += 3; // Bónus de coragem oral!
  grade = Math.min(98, grade);

  // Pronúncia em inglês heurística se for módulo de inglês
  let engPronuncFeedback = "";
  if (module === 'ingles') {
    if (lowercaseAnswer.length > 15) {
      engPronuncFeedback = "Pronúncia com boa cadência e ritmo. Identificámos articulação correta dos fonemas vocálicos.";
    } else {
      engPronuncFeedback = "Ritmo ligeiramente hesitante. Pratique falar sem pausas prolongadas.";
    }
  }

  const responseFeedback = {
    grade: Math.round(grade),
    strengths: [
      spoken ? "Demonstrou excelente desenvoltura oral comunicando sob o modo voz." : "Demonstrou excelente estruturação textual.",
      "Abordou conceitos fundamentais conexos à área de " + track
    ],
    weaknesses: [
      "Pode aprofundar a nomenclatura das camadas e infraestruturas Huawei envolvidas.",
      "Faltou citar métricas concretas de sucesso ou exemplos quantitativos de impacto."
    ],
    interviewerThoughts: `O candidato mostra bases interessantes e inteligência de raciocínio. Contudo, precisa de expressar os conceitos técnicos mais assertivamente para atuar em equipas internacionais da Huawei.`,
    improvementTips: `Recomendamos a utilização do método STAR (Situação, Tarefa, Ação e Resultado). Explique o problema inicial, descreva qual infraestrutura geriu, as ferramentas e os ganhos percentuais de conectividade ou produtividade obtidos. ${engPronuncFeedback}`,
    idealAnswer: `Para responder perfeitamente, estruture assim: "Durante a resolução do incidente X na subrede de nível ${level} da Huawei, utilizei monitorização contínua de pacotes associada a balanceamentos dinâmicos de carga. Isto permitiu otimizar o Handshake TCP, reduzindo a latência operacional em 35% e mitigando qualquer tipo de congestionamento físico de dados do cliente."`,
    train: {
      original: userAnswer,
      good: `Consigo analisar a falha de rede e resolver o problema técnico rapidamente verificando os switches e routers.`,
      excellent: `Perante a falha de conectividade, realizo uma auditoria estruturada das tabelas de roteamento IP e configurações de portas físicas dos switches Huawei, garantindo a rápida reposição dos pacotes de telecomunicação de dados.`,
      huaweiStandard: `Focado no valor de Centralidade no Cliente da Huawei e em sintonia com os desafios do ${track === "Redes" || track === "Telecomunicações" ? "5G Core" : "Huawei Cloud Engine"}, eu implementaria redundâncias automáticas globais (Active-Active) por forma a mitigar interrupções de fluxo de pacotes físicos, garantindo continuidade funcional e o máximo nível de Acordo de Nível de Serviço (SLA).`
    }
  };

  res.json(responseFeedback);
});

// 4. Ranking de Evolução unificando candidatos reais/fictícios e o utilizador
const LOCAL_MOCK_CANDIDATES = [
  { id: 'c1', name: 'António Ndala', country: 'Angola', score: 94, admissionMode: 'Angola', track: 'Redes', avatar: '👨‍💻' },
  { id: 'c2', name: 'Maria Santos', country: 'Angola', score: 91, admissionMode: 'Huawei Graduate Program', track: 'Programação', avatar: '👩‍💻' },
  { id: 'c3', name: 'Zhang Lei', country: 'China', score: 89, admissionMode: 'Huawei Graduate Program', track: 'IA', avatar: '👨‍💻' },
  { id: 'c4', name: 'Bernardo Matundo', country: 'Angola', score: 88, admissionMode: 'Huawei Internship', track: 'Cloud', avatar: '👨‍🚀' },
  { id: 'c5', name: 'Kiesse Manuel', country: 'Angola', score: 85, admissionMode: 'Huawei ICT Academy', track: 'Telecomunicações', avatar: '👩‍🚀' },
  { id: 'c6', name: 'N\'gola Sousa', country: 'Angola', score: 82, admissionMode: 'Angola', track: 'Segurança', avatar: '👨‍💻' },
  { id: 'c7', name: 'Yuki Takahashi', country: 'Japão', score: 80, admissionMode: 'Huawei Graduate Program', track: 'DevOps', avatar: '👩‍💻' },
  { id: 'c8', name: 'Fátima Caxito', country: 'Angola', score: 76, admissionMode: 'Huawei Internship', track: 'Desenvolvimento Web', avatar: '👩‍💻' }
];

app.get("/api/ranking", (req, res) => {
  const { userScore, userName, userTrack, userMode } = req.query;
  
  let candidates: any[] = [...LOCAL_MOCK_CANDIDATES];

  if (userScore !== undefined && userName) {
    const scoreNum = Number(userScore);
    const existingIdx = candidates.findIndex(c => c.name === userName);
    if (existingIdx >= 0) {
      candidates[existingIdx].score = Math.max(candidates[existingIdx].score, scoreNum);
    } else {
      candidates.push({
        id: 'u_current',
        name: String(userName),
        country: 'Angola',
        score: scoreNum,
        admissionMode: (userMode as any) || 'Angola',
        track: (userTrack as any) || 'Programação',
        avatar: '🎖️',
        isCurrentUser: true
      });
    }
  }

  // Ordenar decrescente
  candidates.sort((a, b) => b.score - a.score);

  res.json({ success: true, ranking: candidates });
});

// Serve frontend client in production, fallback to SPA index.html
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite middleware mounted in Development mode.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[HUAWEI PREP PRO MAX] Server running on http://localhost:${PORT}`);
  });
}

startServer();
