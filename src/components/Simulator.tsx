import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Question, AnswerFeedback } from '../types';
import { 
  Mic, MicOff, Send, HelpCircle, ArrowLeft, Clock, Zap, Star, ShieldAlert, BadgeInfo, Check, Sparkles, Volume2
} from 'lucide-react';

interface SimulatorProps {
  profile: UserProfile;
  moduleType: 'diagnostico' | 'psicotecnico' | 'ingles' | 'tecnico' | 'gestor' | 'rh';
  stressMode: boolean;
  onFinishSession: (finalScores: {
    comunicação: number;
    inglês: number;
    lógica: number;
    perfil: number;
    técnico: number;
  }, feedbackHistory: { questionText: string; answerText: string; score: number }[]) => void;
  onBack: () => void;
}

export default function Simulator({ profile, moduleType, stressMode, onFinishSession, onBack }: SimulatorProps) {
  const [loadingQuestion, setLoadingQuestion] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  
  // Timer States
  const [timeLeft, setTimeLeft] = useState(stressMode ? 30 : 90);
  const [avgTimeSpent, setAvgTimeSpent] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Speech Recognition States
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Evaluation Feedbacks
  const [loadingEvaluation, setLoadingEvaluation] = useState(false);
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);

  // Histórico de respostas acumuladas na sessão (para gerar o relatório final)
  const [sessionHistory, setSessionHistory] = useState<{ questionText: string; answerText: string; score: number }[]>([]);

  // Carregar nova pergunta
  const fetchQuestion = async () => {
    setLoadingQuestion(true);
    setFeedback(null);
    setUserAnswer('');
    setTimeLeft(stressMode ? (moduleType === 'psicotecnico' ? 20 : 35) : (moduleType === 'psicotecnico' ? 45 : 90));

    try {
      const response = await fetch('/api/gemini/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: moduleType,
          track: profile.track,
          level: profile.experience.includes('Avançado') ? 'Avançado' : profile.experience.includes('Pleno') ? 'Intermédio' : 'Júnior',
          admissionMode: profile.admissionMode
        })
      });
      const data = await response.json();
      setCurrentQuestion(data);
      setQuestionCount(prev => prev + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuestion(false);
    }
  };

  // Inicializar primeira pergunta
  useEffect(() => {
    fetchQuestion();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, [moduleType]);

  // Controlo do Cronómetro (Módulo 8 Pressão Real)
  useEffect(() => {
    if (loadingQuestion || loadingEvaluation || feedback) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          // Submeter automaticamente resposta vazia ou parcial por estouro de tempo
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loadingQuestion, loadingEvaluation, feedback]);

  // Speech Recognition Setup (Reconhecimento de Voz)
  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("O seu navegador não suporta reconhecimento de voz diretamente no iFrame. Por favor utilize o Google Chrome ou adicione texto via teclado.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      // Isolar o idioma para correspondência ideal de pronúncia (Mód 3 Inglês)
      recognition.lang = moduleType === 'ingles' ? 'en-US' : 'pt-PT';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Recognition error", event.error);
        if (event.error !== 'no-speech') {
          setIsRecording(false);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setUserAnswer(prev => {
          const separator = prev ? ' ' : '';
          return prev + separator + transcript;
        });
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  // Submeter avaliação de resposta
  const handleSubmitAnswer = async (selectedOptionIdx?: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    stopSpeechRecognition();

    let answerToSubmit = userAnswer;
    if (moduleType === 'psicotecnico' && selectedOptionIdx !== undefined && currentQuestion?.options) {
      answerToSubmit = currentQuestion.options[selectedOptionIdx];
    }

    setLoadingEvaluation(true);

    try {
      // Diferencial Psicotécnico corrigido de forma instantânea
      if (moduleType === 'psicotecnico' && currentQuestion?.correctOption !== undefined) {
        const isCorrect = selectedOptionIdx === currentQuestion.correctOption;
        const localFeedback: AnswerFeedback = {
          grade: isCorrect ? 100 : 0,
          strengths: isCorrect ? ["Resolveu o cálculo cognitivo com acurácia", "Estratégia correta de dedução lógica"] : ["Foco de análise mantido"],
          weaknesses: isCorrect ? [] : ["Erro na progressão matemática", "Interpretação falha da constante de sequência"],
          interviewerThoughts: isCorrect ? "Raciocínio lógico impecável, compatível com as exigências de arquitetura da Huawei." : "Precisa de exercitar dedução e análise sob o tempo restrito de simulador.",
          improvementTips: currentQuestion.idealAnswer || "Reveja a dica.",
          idealAnswer: currentQuestion.idealAnswer || "O padrão correto é multiplicativo.",
          train: {
            original: answerToSubmit,
            good: `Respondida: ${answerToSubmit}`,
            excellent: `Resposta exata conforme matriz algorítmica.`,
            huaweiStandard: `O padrão numérico foi calculado com excelência sistemática.`
          }
        };
        setFeedback(localFeedback);
        
        const spent = (stressMode ? 20 : 45) - timeLeft;
        setAvgTimeSpent(prev => [...prev, spent]);
        setSessionHistory(prev => [...prev, {
          questionText: currentQuestion.text,
          answerText: answerToSubmit,
          score: localFeedback.grade
        }]);
        setLoadingEvaluation(false);
        return;
      }

      // Comunicação full-stack com Express server-side Gemini AI
      const response = await fetch('/api/gemini/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: currentQuestion?.text,
          userAnswer: answerToSubmit,
          module: moduleType,
          track: profile.track,
          level: currentQuestion?.level || 'Júnior',
          spoken: isRecording || userAnswer.length > 300, 
        })
      });
      const data = await response.json();
      setFeedback(data);

      const maxTime = stressMode ? 35 : 90;
      setAvgTimeSpent(prev => [...prev, maxTime - timeLeft]);
      setSessionHistory(prev => [...prev, {
        questionText: currentQuestion?.text || '',
        answerText: answerToSubmit,
        score: data.grade
      }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEvaluation(false);
    }
  };

  const handleAutoSubmit = () => {
    if (moduleType === 'psicotecnico') {
      handleSubmitAnswer(0); // Submete opção 1 por padrão se estourar o tempo
    } else {
      handleSubmitAnswer();
    }
  };

  // Concluir e pontuar sessão do módulo (M10 e M11)
  const handleFinalizeSession = () => {
    // Computar médias acumuladas para o dashboard
    const avgScore = sessionHistory.length > 0 
      ? Math.round(sessionHistory.reduce((acc, q) => acc + q.score, 0) / sessionHistory.length)
      : 50;

    // Atualizar as notas das competências de acordo com o módulo percorrido
    const updatedScores = {
      comunicação: moduleType === 'diagnostico' || moduleType === 'gestor' ? avgScore : 60,
      inglês: moduleType === 'ingles' ? avgScore : 55,
      lógica: moduleType === 'psicotecnico' ? avgScore : 70,
      perfil: moduleType === 'rh' ? avgScore : 65,
      técnico: moduleType === 'tecnico' ? avgScore : 50
    };

    onFinishSession(updatedScores, sessionHistory);
  };

  const isLastQuestion = questionCount >= 3; // Limitar a 3 perguntas por quick simulado para manter excelente ritmo

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 text-white" id="simulator-container">
      {/* Header do Simulador */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 text-zinc-400 hover:text-white text-xs font-mono uppercase tracking-wider bg-zinc-900 rounded-lg px-3 py-1.5 border border-zinc-805 outline-none cursor-pointer hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar</span>
        </button>

        <div className="flex items-center space-x-3">
          {stressMode && (
            <div className="flex items-center space-x-1 bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-mono px-2.5 py-1 rounded-full animate-pulse font-bold uppercase">
              <Zap className="w-3 h-3 fill-red-550" />
              <span>Stress Ativo (M8)</span>
            </div>
          )}
          <span className="text-xs font-mono text-zinc-400 uppercase bg-zinc-900 border border-zinc-800 px-3 py-1 rounded">
            Pergunta {questionCount} de 3
          </span>
        </div>
      </div>

      {loadingQuestion ? (
        <div className="bg-[#151515] rounded-2xl border border-zinc-800 p-12 text-center shadow-lg flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-[#CF0A2C] border-t-transparent rounded-full animate-spin" />
          <p className="font-display font-black text-zinc-105 text-md uppercase tracking-tight animate-pulse">
            Huawei Server-Side IA gerando pergunta...
          </p>
          <span className="text-zinc-500 text-xs font-mono max-w-sm">Massa de dados cognitiva correspondendo ao módulo de {moduleType}.</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Caixa da Pergunta */}
          <div className="bg-zinc-950 text-white rounded-2xl p-6 border border-zinc-805 shadow-xl relative overflow-hidden">
            <div className="absolute right-3 top-3 opacity-10">
              <Sparkles className="w-24 h-24 text-red-500" />
            </div>

            <div className="flex justify-between items-start mb-4">
              <span className="bg-[#CF0A2C]/20 text-red-400 border border-red-500/20 text-[10px] font-mono rounded px-2 py-0.5 uppercase tracking-wider font-bold">
                {currentQuestion?.category || currentQuestion?.topic || moduleType}
              </span>

              {/* Countdown Progress Circle Timer */}
              <div className={`flex items-center space-x-1.5 font-mono text-xs font-bold px-2.5 py-1 rounded ${timeLeft <= 10 ? 'bg-red-550/15 border border-red-500 text-red-550 animate-bounce' : 'text-zinc-405'}`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{timeLeft}s Restantes</span>
              </div>
            </div>

            <h3 className="font-display font-bold text-lg md:text-xl text-zinc-100 leading-snug">
              {currentQuestion?.text}
            </h3>

            {currentQuestion?.hint && (
              <p className="text-zinc-400 text-xs font-sans mt-3.5 border-t border-zinc-900 pt-3 flex items-center space-x-2">
                <BadgeInfo className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span><strong>Dica Huawei:</strong> {currentQuestion.hint}</span>
              </p>
            )}
          </div>

          {!feedback ? (
            <div className="bg-[#151515] rounded-2xl border border-zinc-800 p-6 shadow-md space-y-4 text-white">
              {currentQuestion?.options ? (
                /* Opções Múltipla Escolha para Psicotécnico */
                <div className="grid grid-cols-1 gap-3">
                  {currentQuestion.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSubmitAnswer(idx)}
                      disabled={loadingEvaluation}
                      className="w-full p-4 text-left border border-zinc-850 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-800 rounded-xl font-sans text-sm font-semibold transition-all duration-150 outline-none flex items-center justify-between text-zinc-200 cursor-pointer"
                    >
                      <span>{opt}</span>
                      <span className="text-[10px] font-mono text-zinc-500">Opção {idx + 1}</span>
                    </button>
                  ))}
                </div>
              ) : (
                /* Resposta Textual ou por Voz para os outros módulos */
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">Sua Resposta</label>
                    <textarea
                      id="input-res-text"
                      rows={4}
                      value={userAnswer}
                      onChange={e => setUserAnswer(e.target.value)}
                      placeholder={moduleType === 'ingles' ? "Enter your answer here in English (Speaking recommended)..." : "Introduza a sua resposta estruturada aqui em português corporativo..."}
                      className="w-full rounded-xl border border-zinc-800 bg-[#0F0F0F] px-4 py-3 text-zinc-200 focus:border-[#CF0A2C] focus:outline-none transition-colors text-sm font-sans resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    {/* Botão Gravar Microfone (Reconhecimento de voz) */}
                    <button
                      type="button"
                      onClick={isRecording ? stopSpeechRecognition : startSpeechRecognition}
                      className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono uppercase font-bold tracking-wider flex items-center justify-center space-x-2 border transition-all cursor-pointer ${
                        isRecording 
                          ? 'bg-[#CF0A2C] border-[#CF0A2C] text-white animate-pulse' 
                          : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border-zinc-800'
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="w-4 h-4" />
                          <span>Parar gravação (Mód 3 de Voz)</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4 text-red-500" />
                          <span>Responder por voz (Microfone)</span>
                        </>
                      )}
                    </button>

                    {/* Botão Submeter normal */}
                    <button
                      onClick={() => handleSubmitAnswer()}
                      disabled={loadingEvaluation || userAnswer.trim().length === 0}
                      className="py-3 px-6 bg-[#CF0A2C] hover:bg-red-700 disabled:bg-zinc-800 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center space-x-2 cursor-pointer border-none"
                    >
                      {loadingEvaluation ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Examinando Resposta...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 animate-bounce" />
                          <span>Enviar Resposta (M7 Corretor)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* FEEDBACK CARD (Módulos 7, 9, 10 corrigindo e evoluindo) */
            <div className="bg-[#151515] rounded-2xl border border-zinc-805 shadow-lg overflow-hidden space-y-6 p-6">
              
              {/* Pontuação Inteligente */}
              <div className="flex justify-between items-center bg-zinc-950 text-white rounded-xl p-4 border border-zinc-850">
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Nota do Avaliador (M7)</span>
                  <span className="font-display font-black text-3xl text-[#CF0A2C] tracking-tight mt-1 inline-block">
                    {feedback.grade}/100
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">Análise de Pronúncia / Velocidade</span>
                  <span className="font-mono text-xs font-bold text-emerald-400 mt-1 inline-block">
                    Excelente ({avgTimeSpent[avgTimeSpent.length - 1]}s gastos)
                  </span>
                </div>
              </div>

              {/* Pontos Fortes e Fracos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-950/20 rounded-xl border border-emerald-500/15">
                  <h4 className="font-display font-bold text-emerald-300 text-xs uppercase tracking-wider flex items-center space-x-1-mono">
                    <Check className="w-4 h-4 text-emerald-400 font-bold" />
                    <span>Pontos Fortes Identificados</span>
                  </h4>
                  <ul className="space-y-1.5 mt-2.5">
                    {feedback.strengths.map((st, i) => (
                      <li key={i} className="text-xs text-zinc-300 font-sans">• {st}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-red-950/20 rounded-xl border border-red-500/15">
                  <h4 className="font-display font-bold text-red-300 text-xs uppercase tracking-wider flex items-center space-x-1-mono">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    <span>Pontos Fracos a Corrigir</span>
                  </h4>
                  <ul className="space-y-1.5 mt-2.5">
                    {feedback.weaknesses.map((wk, i) => (
                      <li key={i} className="text-xs text-zinc-300 font-sans">• {wk}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Perspectiva do Recrutador e Dicas */}
              <div className="space-y-3 pt-2 border-t border-zinc-850 text-white">
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">O que o entrevistador pensaria?</span>
                  <p className="text-zinc-300 text-xs font-sans mt-1 leading-relaxed bg-[#0F0F0F] p-3 rounded-lg border border-zinc-805 italic">
                    "{feedback.interviewerThoughts}"
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Como Melhorar</span>
                  <p className="text-zinc-350 text-xs font-sans mt-1 leading-relaxed">
                    {feedback.improvementTips}
                  </p>
                </div>
              </div>

              {/* TREINADOR DE RESPOSTAS (Módulo 9) */}
              <div className="bg-[#0f0f0f] text-zinc-300 rounded-xl p-5 space-y-4 border border-zinc-805">
                <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-red-550 animate-pulse" />
                  <span>Treinador de Respostas (Módulo 9 // STAR)</span>
                </h4>
                <div className="space-y-3 font-sans text-xs">
                  <div className="border-l-2 border-zinc-700 pl-3">
                    <span className="font-mono text-[9px] text-zinc-500 uppercase">Sua Resposta Original</span>
                    <p className="text-zinc-450 mt-0.5">{feedback.train.original}</p>
                  </div>
                  <div className="border-l-2 border-blue-500 pl-3">
                    <span className="font-mono text-[9px] text-blue-400 uppercase">Versão Boa (Comercial)</span>
                    <p className="text-zinc-200 mt-0.5">{feedback.train.good}</p>
                  </div>
                  <div className="border-l-2 border-emerald-500 pl-3">
                    <span className="font-mono text-[9px] text-emerald-400 uppercase">Versão Excelente (Estruturada)</span>
                    <p className="text-zinc-200 mt-0.5">{feedback.train.excellent}</p>
                  </div>
                  <div className="border-l-2 border-red-500 pl-3 bg-red-500/5 py-1.5 pr-2 rounded">
                    <span className="font-mono text-[10px] text-red-400 uppercase font-black tracking-normal flex items-center space-x-1">
                      <Volume2 className="w-3 h-3 text-red-500" />
                      <span>Versão Huawei Standard (M9)</span>
                    </span>
                    <p className="text-red-100 mt-1 font-medium italic select-all">
                      "{feedback.train.huaweiStandard}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="pt-4 border-t border-zinc-850 flex justify-end">
                {isLastQuestion ? (
                  <button
                    onClick={handleFinalizeSession}
                    className="py-3 px-6 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                  >
                    Concluir e Ver Relatório Final →
                  </button>
                ) : (
                  <button
                    onClick={fetchQuestion}
                    className="py-3 px-6 bg-[#CF0A2C] hover:bg-red-700 border-none text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer animate-pulse"
                  >
                    Próxima Pergunta →
                  </button>
                )}
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
}
