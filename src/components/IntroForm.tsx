import React, { useState } from 'react';
import { UserProfile, UserTrack, AdmissionMode } from '../types';
import { Award, GraduationCap, Globe, ShieldAlert, Cpu } from 'lucide-react';

interface IntroFormProps {
  onProfileCreated: (profile: UserProfile, rawPlan: any) => void;
}

const TRACKS: UserTrack[] = [
  'Programação', 'Redes', 'Telecomunicações', 'Cloud', 'IA', 'Segurança', 'Base de Dados', 'Desenvolvimento Web', 'Flutter', 'DevOps'
];

const ADMISSION_MODES: { value: AdmissionMode; label: string; desc: string }[] = [
  { value: 'Angola', label: 'Huawei Angola Direct', desc: 'Processo customizado focado no mercado de Luanda, telecomunicações locais e infraestrutura nacional.' },
  { value: 'Graduate', label: 'Huawei Graduate Program', desc: 'Processo global de alto desempenho para recém-licenciados com simulação técnica exigente e inglês fluente.' },
  { value: 'Internship', label: 'Huawei Internship', desc: 'Programa de estágio com ênfase em fundamentos de engenharia e adaptabilidade comportamental rápida.' },
  { value: 'ICTAcademy', label: 'Huawei ICT Academy', desc: 'Certificações integradas de laboratório para estudantes universitários parceiros com testes objetivos específicos.' }
];

export default function IntroForm({ onProfileCreated }: IntroFormProps) {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('Angola');
  const [course, setCourse] = useState('');
  const [university, setUniversity] = useState('');
  const [track, setTrack] = useState<UserTrack>('Redes');
  const [englishLevel, setEnglishLevel] = useState('Intermédio');
  const [experience, setExperience] = useState('Sem experiência (Estudante/Júnior)');
  const [interviewDate, setInterviewDate] = useState('2026-07-20');
  const [admissionMode, setAdmissionMode] = useState<AdmissionMode>('Angola');
  const [loading, setLoading] = useState(false);

  // Botão de preenchimento rápido para testar o sistema facilmente
  const handleQuickFill = () => {
    setName('Bernardo Matundo');
    setCountry('Angola');
    setCourse('Engenharia de Telecomunicações');
    setUniversity('Universidade Agostinho Neto (UAN)');
    setTrack('Telecomunicações');
    setEnglishLevel('Intermédio');
    setExperience('Nível Júnior (Projetos académicos)');
    setInterviewDate('2026-07-15');
    setAdmissionMode('Angola');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !course || !university) return;

    setLoading(true);
    try {
      const response = await fetch('/api/profile/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, country, course, university, track, englishLevel, experience, interviewDate, admissionMode })
      });
      const data = await response.json();
      if (data.success) {
        onProfileCreated({
          name, country, course, university, track, englishLevel, experience, interviewDate, admissionMode
        }, data.plan);
      }
    } catch (err) {
      console.error(err);
      // Local fallback plan
      onProfileCreated({
        name, country, course, university, track, englishLevel, experience, interviewDate, admissionMode
      }, {
        priorityTech: ['Fundamentos de Sistemas Distribuídos', 'Hardware e Redes de Transmissão'],
        prioritySoft: ['Comunicação e Escuta Ativa', 'Resolução de Conflitos'],
        recommendedHours: 20,
        focusEnglish: ['English technical fundamentals'],
        preparationRoadmap: ['Módulos integrados 1-11 de preparação.'],
        estimatedDaysToSuccess: 14
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4" id="intro-form-container">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center space-x-2 bg-red-500/10 text-red-500 font-mono text-xs uppercase px-3 py-1.5 rounded-full border border-red-500/20 mb-4 animate-pulse">
          <Cpu className="w-3.5 h-3.5" />
          <span>Huawei Prep Pro Max v2.0 // 2026</span>
        </div>
        <h1 className="font-display font-extrabold text-4xl text-white tracking-tight leading-none uppercase">
          HUAWEI PREP PRO MAX
        </h1>
        <p className="font-sans text-zinc-400 mt-2 text-sm max-w-xl mx-auto leading-relaxed">
          Centro Inteligente de Preparação Profissional para Admissões nos Departamentos Técnicos e Executivos
        </p>
        <button
          type="button"
          onClick={handleQuickFill}
          className="mt-4 px-4 py-1.5 bg-zinc-900 hover:bg-[#151515] text-[#CF0A2C] font-mono text-xs rounded transition-all duration-200 border border-zinc-800 cursor-pointer"
        >
          ⏱️ Simular Preenchimento Rápido (Angola)
        </button>
      </div>

      <div className="bg-[#151515] rounded-2xl shadow-xl border border-zinc-800 overflow-hidden text-white">
        <div className="bg-zinc-950 p-6 text-white flex justify-between items-center border-b border-zinc-800">
          <div>
            <h3 className="font-display font-bold text-lg text-zinc-100">Ficha Informativa do Candidato</h3>
            <p className="text-zinc-400 text-xs font-sans mt-0.5">Preencha os dados abaixo para configurar o seu plano de treino de 10 módulos por IA.</p>
          </div>
          <GraduationCap className="text-red-500 w-8 h-8" />
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome */}
            <div className="space-y-1">
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider">Nome Completo</label>
              <input
                id="candidato-nome"
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Bernardo Matundo"
                className="w-full rounded-lg border border-zinc-800 bg-[#0F0F0F] px-4 py-2.5 text-zinc-150 focus:border-[#CF0A2C] focus:bg-[#151515] focus:outline-none transition-colors text-sm"
              />
            </div>

            {/* País */}
            <div className="space-y-1">
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider">País de Residência</label>
              <div className="relative">
                <input
                  id="candidato-pais"
                  type="text"
                  required
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  placeholder="Ex: Angola"
                  className="w-full rounded-lg border border-zinc-800 bg-[#0F0F0F] px-4 py-2.5 text-zinc-150 focus:border-[#CF0A2C] focus:bg-[#151515] focus:outline-none transition-colors text-sm"
                />
                <span className="absolute right-3 top-3 text-sm">🇦🇴</span>
              </div>
            </div>

            {/* Curso */}
            <div className="space-y-1">
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider">Curso / Graduação</label>
              <input
                id="candidato-curso"
                type="text"
                required
                value={course}
                onChange={e => setCourse(e.target.value)}
                placeholder="Ex: Engenharia Informática / Telecomunicações"
                className="w-full rounded-lg border border-zinc-800 bg-[#0F0F0F] px-4 py-2.5 text-zinc-150 focus:border-[#CF0A2C] focus:bg-[#151515] focus:outline-none transition-colors text-sm"
              />
            </div>

            {/* Universidade */}
            <div className="space-y-1">
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider">Universidade / Instituto</label>
              <input
                id="candidato-universidade"
                type="text"
                required
                value={university}
                onChange={e => setUniversity(e.target.value)}
                placeholder="Ex: Universidade Agostinho Neto (UAN)"
                className="w-full rounded-lg border border-zinc-800 bg-[#0F0F0F] px-4 py-2.5 text-zinc-150 focus:border-[#CF0A2C] focus:bg-[#151515] focus:outline-none transition-colors text-sm"
              />
            </div>

            {/* Area de Interesse */}
            <div className="space-y-1">
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider">Área de Interesse Principal</label>
              <select
                id="candidato-track"
                value={track}
                onChange={e => setTrack(e.target.value as UserTrack)}
                className="w-full rounded-lg border border-zinc-800 bg-[#0F0F0F] px-4 py-2.5 text-zinc-150 focus:border-[#CF0A2C] focus:bg-[#151515] focus:outline-none tracking-tight text-sm cursor-pointer"
              >
                {TRACKS.map(t => (
                  <option key={t} value={t} className="bg-zinc-950 text-white">{t}</option>
                ))}
              </select>
            </div>

            {/* Nível de Inglês */}
            <div className="space-y-1">
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider">Nível de Inglês (Módulo 3)</label>
              <select
                id="candidato-ingles"
                value={englishLevel}
                onChange={e => setEnglishLevel(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-[#0F0F0F] px-4 py-2.5 text-zinc-150 focus:border-[#CF0A2C] focus:bg-[#151515] focus:outline-none text-sm cursor-pointer"
              >
                <option value="Básico" className="bg-zinc-950 text-white">Básico (Iniciação / Estudo)</option>
                <option value="Intermédio" className="bg-zinc-950 text-white">Intermédio (Conversa Fluida)</option>
                <option value="Avançado / Fluente" className="bg-zinc-950 text-white">Avançado / Fluente (Profissional)</option>
              </select>
            </div>

            {/* Experiencia Profissional */}
            <div className="space-y-1">
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider">Experiência Profissional</label>
              <select
                id="candidato-experiencia"
                value={experience}
                onChange={e => setExperience(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-[#0F0F0F] px-4 py-2.5 text-zinc-150 focus:border-[#CF0A2C] focus:bg-[#151515] focus:outline-none text-sm cursor-pointer"
              >
                <option value="Sem experiência (Estudante/Júnior)" className="bg-zinc-950 text-white">Sem experiência (Estudante e Academia)</option>
                <option value="Nível Júnior (Projetos académicos ou Freelancer)" className="bg-zinc-950 text-white">Nível Júnior (Estágios ou Freelancer)</option>
                <option value="Nível Pleno / Intermédio (1 a 3 anos de trabalho)" className="bg-zinc-950 text-white">Nível Pleno / Intermédio (1 a 3 anos de trabalho)</option>
                <option value="Nível Avançado / Especialista (3+ anos)" className="bg-zinc-950 text-white">Nível Avançado / Especialista (3+ anos)</option>
              </select>
            </div>

            {/* Data Prevista da Entrevista */}
            <div className="space-y-1">
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider">Data Prevista da Avaliação</label>
              <input
                id="candidato-data"
                type="date"
                required
                value={interviewDate}
                onChange={e => setInterviewDate(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-[#0F0F0F] px-4 py-2.5 text-zinc-150 focus:border-[#CF0A2C] focus:bg-[#151515] focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Seleção do Modo de Admissão Huawei */}
          <div className="space-y-3 pt-4 border-t border-zinc-800">
            <span className="block text-xs font-mono text-zinc-450 uppercase tracking-wider mb-2">Selecione o Fluxo de Recrutamento</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ADMISSION_MODES.map(mode => {
                const isSelected = admissionMode === mode.value;
                return (
                  <div
                    key={mode.value}
                    id={`mode-card-${mode.value}`}
                    onClick={() => setAdmissionMode(mode.value)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-150 relative ${
                      isSelected 
                        ? 'bg-[#CF0A2C]/10 border-[#CF0A2C] shadow-lg shadow-[#CF0A2C]/10' 
                        : 'bg-[#0F0F0F]/60 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#CF0A2C]' : 'border-zinc-500'}`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-[#CF0A2C]" />}
                      </div>
                      <span className={`font-display font-bold text-sm ${isSelected ? 'text-white' : 'text-zinc-350'}`}>{mode.label}</span>
                    </div>
                    <p className="text-zinc-400 text-xs font-sans mt-2 leading-relaxed">{mode.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4">
            <button
              id="btn-submeter"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#CF0A2C] hover:bg-red-700 disabled:bg-zinc-800 text-white font-mono font-bold text-sm rounded-xl transition-colors duration-150 uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-red-500/20 cursor-pointer border-none"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analisando Perfil & Construindo Roteiro IA...</span>
                </>
              ) : (
                <>
                  <span>Gerar Plano de Preparação Personalizado →</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
