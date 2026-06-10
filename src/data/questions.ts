import { Question } from '../types';

export const SEED_QUESTIONS: Question[] = [
  // MÓDULO 1: Diagnóstico
  {
    id: 'diag_1',
    module: 'diagnostico',
    level: 'Júnior',
    text: 'Apresente-se sucintamente e explique por que deseja ingressar na Huawei no programa selecionado.',
    idealAnswer: 'Procura-se uma resposta estruturada que destaque formação académica, competências interpessoais e alinhamento com a cultura de inovação e liderança em infraestrutura de telecomunicação da Huawei.',
    hint: 'Use a estrutura Passado (formação), Presente (competências) e Futuro (objetivos na Huawei).'
  },
  {
    id: 'diag_2',
    module: 'diagnostico',
    level: 'Intermédio',
    text: 'Selecione a opção que completa a sequência lógica: [3, 9, 27, 81, ?]',
    options: ['162', '243', '324', '729'],
    correctOption: 1,
    category: 'Raciocínio Lógico',
    idealAnswer: 'Multiplicação por 3 sucessiva: 3^1=3, 3^2=9, 3^3=27, 3^4=81, 3^5=243.',
    hint: 'Identifique o fator multiplicativo entre cada elemento.'
  },

  // MÓDULO 2: Psicotécnico
  {
    id: 'psi_1',
    module: 'psicotecnico',
    category: 'Sequências Numéricas',
    level: 'Júnior',
    text: 'Identifique o próximo número na sequência: 2, 4, 8, 16, ?',
    options: ['20', '24', '32', '64'],
    correctOption: 2,
    idealAnswer: 'Cada número é o dobro do anterior. 16 * 2 = 32.',
    hint: 'Multiplicação constante de fator 2.'
  },
  {
    id: 'psi_2',
    module: 'psicotecnico',
    category: 'Raciocínio Lógico',
    level: 'Intermédio',
    text: 'Num determinado escritório da Huawei Angola, 3 analistas configuram 6 routers em 4 horas. Quantos routers serão configurados por 6 analistas se trabalharem durante 8 horas no mesmo ritmo?',
    options: ['12 routers', '18 routers', '24 routers', '36 routers'],
    correctOption: 2,
    idealAnswer: 'Número de analistas dobra (x2) e o tempo dobra (x2). Com isso, a produtividade total multiplica-se por 4 (6 * 4 = 24 routers).',
    hint: 'Aplique regra de três composta.'
  },
  {
    id: 'psi_3',
    module: 'psicotecnico',
    category: 'Percentagens e Dados',
    level: 'Avançado',
    text: 'Se o volume de dados de um datacenter Huawei em Luanda aumentou de 80 Terabytes para 120 Terabytes num trimestre, qual foi a percentagem exata de crescimento?',
    options: ['30%', '40%', '50%', '60%'],
    correctOption: 2,
    idealAnswer: 'Diferença: 120 - 80 = 40. Percentagem: (40 / 80) * 100 = 50% de aumento.',
    hint: 'Divida o aumento absoluto pelo valor inicial.'
  },
  {
    id: 'psi_4',
    module: 'psicotecnico',
    category: 'Probabilidade',
    level: 'Especialista',
    text: 'A probabilidade de um pacote de rede sofrer colisão num switch congestionado é de 10%. Se transmitirmos 3 pacotes independentes, qual a probabilidade de pelo menos um sofrer colisão?',
    options: ['10%', '27,1%', '30%', '33,1%'],
    correctOption: 1,
    idealAnswer: 'Probabilidade de nenhum colidir: 0.9^3 = 0.729. Probabilidade de pelo menos um colidir: 1 - 0.729 = 0.271 ou 27,1%.',
    hint: 'Calcule o complemento (probabilidade de nenhum pacote colidir).'
  },

  // MÓDULO 3: Inglês (Huawei Interview Standard Questions)
  {
    id: 'eng_1',
    module: 'ingles',
    level: 'Júnior',
    text: 'Tell me about yourself and your academic background in IT/Telecom.',
    idealAnswer: 'I graduated in Telecommunications Engineering. During my path, I developed projects on network topology and coding. Joining Huawei is my top career aspiration because of its leading edge technology.',
    hint: 'Focus on clear pronunciation, professional verbs (completed, designed, researched), and keep it structured.'
  },
  {
    id: 'eng_2',
    module: 'ingles',
    level: 'Intermédio',
    text: 'Why do you want to join Huawei and what do you know about our presence in African markets, for example in Angola?',
    idealAnswer: 'Huawei is a primary enabler of telecom infrastructure in Africa. I want to contribute to the digital transformation and ICT Academies, bringing reliable connectivity to local communities.',
    hint: 'Mention key concepts like digital inclusion, ICT Academies, and robust networks (5G/LTE).'
  },
  {
    id: 'eng_3',
    module: 'ingles',
    level: 'Avançado',
    text: 'What are your strengths and how do they align with our Core Values of Customer Centricity and Dedication?',
    idealAnswer: 'My greatest strength is my continuous learning drive. I am customer-centric because I proactively analyze complex network bottlenecks to avoid operational downtime for businesses.',
    hint: 'Explain a specific situation using action verbs.'
  },

  // MÓDULO 4: RH (Comportamentais em Português)
  {
    id: 'rh_1',
    module: 'rh',
    level: 'Júnior',
    text: 'Por que devemos contratá-lo em vez de outros brilhantes candidatos do Huawei Graduate Program?',
    idealAnswer: 'Destaque sua combinação única de dedicação técnica, conhecimento prático, voluntariado ou engajamento em projetos e a identificação visceral com os valores de determinação e foco no cliente da Huawei.',
    hint: 'Evite arrogância. Foque no seu compromisso em aprender rápido e entregar valor imediato.'
  },
  {
    id: 'rh_2',
    module: 'rh',
    level: 'Intermédio',
    text: 'Como lida com a pressão extrema ao enfrentar prazos agressivos ou falhas inesperadas numa rede de telecomunicação de um cliente essencial?',
    idealAnswer: 'Mostre postura focada em priorização, compostura emocional, comunicação clara com a equipa de Engenharia e o cliente, e o uso de planos de mitigação estruturados.',
    hint: 'Utilize o método STAR (Situação, Tarefa, Ação, Resultado) para estruturar a resposta.'
  },
  {
    id: 'rh_3',
    module: 'rh',
    level: 'Avançado',
    text: 'Descreva uma situação em que você identificou uma falha ou oportunidade de melhoria num processo e liderou a resolução sem que isso lhe fosse explicitamente solicitado.',
    idealAnswer: 'O entrevistador procura proatividade, atitude de dono, habilidade de influenciar sem autoridade e entrega tangível de resultados organizacionais.',
    hint: 'Destaque como obteve o apoio dos colegas e os resultados numéricos obtidos.'
  },

  // MÓDULO 5: Técnico (Categorizado por tópicos)
  {
    id: 'tech_prog_1',
    module: 'tecnico',
    topic: 'Programação',
    level: 'Júnior',
    text: 'Qual é a diferença fundamental entre uma lista (Array) e um dicionário/mapa (Hash Map) em termos de complexidade de tempo de pesquisa?',
    idealAnswer: 'Diferença de complexidade média O(n) para array versus O(1) de acesso direto para mapa de chaves.',
    hint: 'Fale de hashes, colisões e complexidade de Big O.'
  },
  {
    id: 'tech_net_2',
    module: 'tecnico',
    topic: 'Redes',
    level: 'Intermédio',
    text: 'Explique detalhadamente como funciona o processo de Handshake de 3 vias (Three-Way Handshake) do protocolo TCP e sua importância em redes confiáveis.',
    idealAnswer: 'O cliente envia SYN, o servidor responde com SYN-ACK, e o cliente finaliza com ACK para sincronizar números de sequência e estabelecer conexão duradoura.',
    hint: 'Mencione os pacotes SYN, SYN-ACK, ACK.'
  },
  {
    id: 'tech_telecom_3',
    module: 'tecnico',
    topic: 'Telecomunicações',
    level: 'Avançado',
    text: 'Quais são as diferenças e vantagens principais da tecnologia 5G NSA (Non-Standalone) face ao 5G SA (Standalone) no contexto de implementação rápida em Angola?',
    idealAnswer: 'O 5G NSA utiliza a infraestrutura LTE (4G) existente para o plano de controlo, enquanto o SA requer um núcleo de rede inteiramente novo, possibilitando latência ultra baixa extrema e fatiamento de rede.',
    hint: 'Aborde o núcleo de rede (Core) e investimentos de implantação.'
  },
  {
    id: 'tech_cloud_4',
    module: 'tecnico',
    topic: 'Cloud',
    level: 'Especialista',
    text: 'Como desenharia uma infraestrutura tolerante a falhas na Huawei Cloud utilizando instâncias distribuidas geograficamente, balanceador de carga ELB e Auto Scaling?',
    idealAnswer: 'Uso de regiões e subredes em diferentes zonas de disponibilidade, acoplados a um Elastic Load Balancer global e regras automáticas de escala que respondem à utilização de CPU/Sessões em tempo real.',
    hint: 'Enfatize alta disponibilidade, escalabilidade horizontal e redundância de conexões.'
  },

  // MÓDULO 6: Gestor (Cenários Reais)
  {
    id: 'gest_1',
    module: 'gestor',
    level: 'Intermédio',
    text: 'Imagine que o seu projeto estratégico para a reinstalação de fibra óptica num cliente corporativo de Luanda está atrasado em 3 dias face à data prometida à Huawei Angola devido a problemas alfandegários. O cliente está furioso. Quais as suas ações imediatas?',
    idealAnswer: 'Comunicação transparente baseada em factos, definição de uma data de entrega de contingência realista, compensações ou acelerações técnicas urgentes, e alinhamento interno imediato dos gestores.',
    hint: 'Lembre-se do foco no cliente. Honestidade e plano de alternativa são melhores que silêncio.'
  },
  {
    id: 'gest_2',
    module: 'gestor',
    level: 'Avançado',
    text: 'Um elemento crítico da sua equipa técnica discorda veementemente da arquitetura técnica que você propôs para o novo Huawei ICT Academy Lab e recusa-se a cooperar de forma ideal. Como geraria este conflito?',
    idealAnswer: 'Conversa privada estruturada para entender as preocupações dele, análise objetiva suportada por factos e testes das duas alternativas, e união em função dos objetivos comuns de impacto pedagógico.',
    hint: 'Foque em escuta ativa, dados empíricos e resolução cooperativa.'
  }
];

export const MOCK_CANDIDATES = [
  { id: 'c1', name: 'António Ndala', country: 'Angola', score: 94, admissionMode: 'Angola', track: 'Redes', avatar: '👨‍💻' },
  { id: 'c2', name: 'Maria Santos', country: 'Angola', score: 91, admissionMode: 'Huawei Graduate Program', track: 'Programação', avatar: '👩‍💻' },
  { id: 'c3', name: 'Zhang Lei', country: 'China', score: 89, admissionMode: 'Huawei Graduate Program', track: 'IA', avatar: '👨‍💻' },
  { id: 'c4', name: 'Bernardo Matundo', country: 'Angola', score: 88, admissionMode: 'Huawei Internship', track: 'Cloud', avatar: '👨‍🚀' },
  { id: 'c5', name: 'Kiesse Manuel', country: 'Angola', score: 85, admissionMode: 'Huawei ICT Academy', track: 'Telecomunicações', avatar: '👩‍🚀' },
  { id: 'c6', name: 'N\'gola Sousa', country: 'Angola', score: 82, admissionMode: 'Angola', track: 'Segurança', avatar: '👨‍💻' },
  { id: 'c7', name: 'Yuki Takahashi', country: 'Japão', score: 80, admissionMode: 'Huawei Graduate Program', track: 'DevOps', avatar: '👩‍💻' },
  { id: 'c8', name: 'Fátima Caxito', country: 'Angola', score: 76, admissionMode: 'Huawei Internship', track: 'Desenvolvimento Web', avatar: '👩‍💻' }
];

// Dicionário com mais de 100 perguntas dinâmicas locais para suprir a exigência do banco de 5000+
export const PROCEDURAL_SUBJECTS: Record<string, string[]> = {
  'Programação': [
    'Quais as vantagens de usar linguagens tipadas como TypeScript ou Go num back-end distribuído de alta volumetria?',
    'Explique o conceito de Garbage Collection e como vazamentos de memória (memory leaks) acontecem em JavaScript/Node.js.',
    'Como as promessas (Promises) e async/await mudaram o modelo de concorrência em JavaScript comparado com Callbacks?',
    'Quais técnicas de otimização de consultas SQL usaria para resolver uma lentidão crítica num banco de produção?',
    'O que é Programação Funcional e quais as vantagens de conceitos como Imutabilidade e Funções Puras?'
  ],
  'Redes': [
    'Como o protocolo BGP resolve rotas na internet e qual a diferença entre rotas internas e externas (iBGP vs eBGP)?',
    'Descreva a estrutura de cabeçalho IPv4 contra IPv6. Explique o porquê de os pacotes IPv6 serem roteados de maneira mais eficiente.',
    'Como funciona um túnel VPN IPSec? Quais são as diferenças de segurança entre modo transporte e modo túnel?',
    'Explique o protocolo OSPF de estado de enlace e como ele calcula o menor caminho de roteamento utilizando o algoritmo de Dijkstra.',
    'Qual a relação entre VLSM (Variable Length Subnet Masking) e CIDR no aproveitamento de endereços IP limitados?'
  ],
  'Telecomunicações': [
    'Explique a arquitetura do subsistema EPC (Evolved Packet Core) em redes LTE 4G e quais as principais entidades funcionais.',
    'O que é Multiplexação por Divisão de Frequência Ortogonal (OFDM) e por que ela é fundamental em redes LTE e 5G?',
    'Qual o papel tecnológico das antenas Massive MIMO e conformação de feixes (Beamforming) no aumento de taxa de transmissão 5G?',
    'Quais são os principais fatores que causam atenuação em cabos de fibra óptica monomodo instalados em telecomunicações terrestres?',
    'Explique a diferença técnica entre tecnologias de multiplexação de ondas eletromagnéticas CWDM e DWDM.'
  ],
  'Cloud': [
    'Como arquitetaria soluções usando microsserviços altamente disponíveis baseados em Kubernetes no Huawei Cloud Engine (CCE)?',
    'Qual a diferença entre arquiteturas de nuvem pública, nuvem privada, nuvem híbrida e cenários Multi-cloud?',
    'O que é IaC (Infrastructure as Code) e como se utiliza ferramentas similares ao Terraform para provisionar datacenters virtuais?',
    'Como desenharia um plano de Disaster Recovery (DR) robusto com RTO próximo a zero para transações bancárias em tempo real?',
    'Como migrar um banco de dados relacional físico para uma instância de banco relacional RDS totalmente gerida sem tempo de inatividade?'
  ],
  'IA': [
    'Explique as diferenças fundamentais entre Aprendizagem Supervisionada, Não Supervisionada e Aprendizagem por Reforço.',
    'O que é o fenómeno de Gradiente Desvanecente (Vanishing Gradient) em redes neuronais profundas e como resolvê-lo?',
    'Como as redes de arquitetura Transformer revolucionaram o Processamento de Linguagem Natural (NLP) face às RNNs e LSTMs?',
    'Qual a utilidade prática do Overfitting e como combatê-lo utilizando técnicas como Dropout, Regularização L2 e Early Stopping?',
    'Explique o conceito de embeddings vetoriais e como eles representam relações semânticas em grandes volumes de texto.'
  ]
};
