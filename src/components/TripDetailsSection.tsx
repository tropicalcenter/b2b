import { useState, useMemo } from 'react';
import { Mountain, Utensils, Wine, Plane, Palmtree, Waves, Compass, MessageSquare } from 'lucide-react';
import { WHATSAPP_LINK } from '../data';
import { TripDestination } from '../types';

interface TripDetailsSectionProps {
  selectedTripId: string;
  selectedTrip: TripDestination;
}

export function TripDetailsSection({ selectedTripId, selectedTrip }: TripDetailsSectionProps) {
  const [activeTabTrip, setActiveTabTrip] = useState('roteiro');

  const tripDetails = useMemo(() => {
    return {
      campos: {
        roteiro: [
          { dia: "01", tit: "Boas-vindas à Serra", desc: "Chegada a Campos do Jordão com acomodação na hospedagem. À noite, fondue tradicional da região." },
          { dia: "02", tit: "Tour Amantikir & Baden Baden", desc: "Visita ao Parque Amantikir para conhecer os jardins. Após, um passeio para saborear a culinária local e a choperia artesanal." },
          { dia: "03", tit: "Passeio na Natureza e Vinícolas", desc: "Dia livre para conhecer pontos turísticos naturais, vinícolas, ou fazer as tradicionais compras no centro." }
        ],
        inclusoes: [
          { label: "Hospedagem", icon: <Mountain className="w-5 h-5 text-emerald-400" /> },
          { label: "Jantar de Fondue", icon: <Utensils className="w-5 h-5 text-emerald-400 flex-shrink-0" /> },
          { label: "Entradas para Passeios", icon: <Wine className="w-5 h-5 text-emerald-400" /> },
          { label: "Passagens & Translados", icon: <Plane className="w-5 h-5 text-emerald-400" /> }
        ],
        regras: [
          "O prêmio garante viagem completa com direito a 01 acompanhante sem custos adicionais de logística principal.",
          "Período de faturamento válido de 01/01/2026 até 31/12/2026.",
          "O resgate de viagens não consome sua pontuação de produtos físicos — é um bônus exclusivo por faturamento acumulado."
        ]
      },
      maragogi: {
        roteiro: [
          { dia: "01", tit: "Chegada a Maragogi", desc: "Chegada a Maceió ou Recife e viagem para Maragogi. Check-in na hospedagem e momento para descansar ou conhecer as praias próximas." },
          { dia: "02", tit: "Passeio às Galés", desc: "Passeio de catamarã nas famosas piscinas naturais da região, famosas por suas águas cristalinas." },
          { dia: "03", tit: "Aproveitando a Estrutura", desc: "Dia livre para curtir a estrutura All Inclusive do resort, as piscinas e as atividades de lazer." }
        ],
        inclusoes: [
          { label: "Hospedagem All Inclusive", icon: <Utensils className="w-5 h-5 text-emerald-400 flex-shrink-0" /> },
          { label: "Resort Frente Mar", icon: <Palmtree className="w-5 h-5 text-emerald-400" /> },
          { label: "Passeio às Piscinas Naturais (Galés)", icon: <Waves className="w-5 h-5 text-emerald-400 flex-shrink-0" /> },
          { label: "Passagens & Transfers", icon: <Plane className="w-5 h-5 text-emerald-400" /> }
        ],
        regras: [
          "Atingindo os R$ 700.000,00 faturados, você pode optar pela substituição da viagem de Campos por Maragogi.",
          "A reserva deve ser agendada com no mínimo 40 dias de antecedência junto ao setor de marketing.",
          "O período de validade das viagens é de até 1 ano após a conquista fiscal."
        ]
      },
      gramado: {
        roteiro: [
          { dia: "01", tit: "Chegada na Serra Gaúcha", desc: "Chegada em Porto Alegre ou Caxias do Sul e ida para Gramado. Acomodação no hotel escolhido e caminhada leve pela cidade." },
          { dia: "02", tit: "Rota das Vinícolas", desc: "Passeio na rota dos vinhos e espumantes do Vale dos Vinhedos em Bento Gonçalves, com almoço típico da região." },
          { dia: "03", tit: "Maria Fumaça & Fondue", desc: "Passeio de trem Maria Fumaça. À noite, um tradicional jantar com foundue em Gramado." }
        ],
        inclusoes: [
          { label: "Hospedagem em Gramado", icon: <Mountain className="w-5 h-5 text-emerald-400" /> },
          { label: "Passeio de Trem Maria Fumaça", icon: <Waves className="w-5 h-5 text-emerald-400 flex-shrink-0" /> },
          { label: "Passeio ao Vale dos Vinhedos", icon: <Wine className="w-5 h-5 text-emerald-400" /> },
          { label: "Passagens & Translados", icon: <Plane className="w-5 h-5 text-emerald-400" /> }
        ],
        regras: [
          "O Nível de R$ 900.000,00 desbloqueia a viagem mais exclusiva nacional da campanha, com direito à categoria executiva de aéreos caso disponível na data.",
          "Não acumulável com os destinos anteriores — ao atingir as metas você escolhe a sua premiação ideal.",
          "Sujeito a bloqueio de datas de alta temporada (como Natal Luz) se solicitado tardiamente."
        ]
      },
      lisboa: {
        roteiro: [
          { dia: "01", tit: "Chegada a Lisboa", desc: "Chegada em Lisboa e ida ao hotel no centro. Tarde livre para caminhar pela Praça do Comércio e explorar a região histórica." },
          { dia: "02", tit: "Tour Histórico", desc: "Visita aos pontos turísticos de Belém e passeios pela cidade. À noite, opção de um jantar nas típicas Casas de Fado." },
          { dia: "03", tit: "Castelos de Sintra", desc: "Passeio de um dia na vila de Sintra, explorando seus antigos castelos e palácios, junto a degustações de vinhos." }
        ],
        inclusoes: [
          { label: "Hospedagem em Lisboa", icon: <Mountain className="w-5 h-5 text-emerald-400" /> },
          { label: "Passeios e Degustações", icon: <Utensils className="w-5 h-5 text-emerald-400 flex-shrink-0" /> },
          { label: "Passeio em Sintra", icon: <Wine className="w-5 h-5 text-emerald-400" /> },
          { label: "Passagens Aéreas & Transfers", icon: <Plane className="w-5 h-5 text-emerald-400" /> }
        ],
        regras: [
          "O Nível de R$ 1.200.000,00 garante a viagem internacional (Lisboa).",
          "Passaporte válido por no mínimo 6 meses é obrigatório.",
          "Não acumulável com destinos anteriores."
        ]
      }
    }[selectedTripId] || { roteiro: [], inclusoes: [], regras: [] };
  }, [selectedTripId]);

  return (
    <section className="bg-slate-950/60 rounded-2xl border border-slate-800/80 p-6 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800/80 pb-4 mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            <span>Experiência {selectedTrip.name} - Roteiro & Inclusões</span>
          </h3>
          <p className="text-xs text-slate-400">Detalhes completos da premiação de nível {selectedTrip.badge.split(' • ')[0]}</p>
        </div>
        
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 mt-4 md:mt-0 overflow-x-auto whitespace-nowrap">
          <button 
            onClick={() => setActiveTabTrip('roteiro')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${activeTabTrip === 'roteiro' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
          >
            Roteiro Sugerido
          </button>
          <button 
            onClick={() => setActiveTabTrip('inclusoes')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${activeTabTrip === 'inclusoes' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
          >
            Inclusões VIP
          </button>
          <button 
            onClick={() => setActiveTabTrip('regras')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${activeTabTrip === 'regras' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
          >
            Regras e Prazos
          </button>
          <button 
            onClick={() => setActiveTabTrip('contato')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${activeTabTrip === 'contato' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-emerald-400/90 border border-emerald-500/20 bg-emerald-500/5 hover:text-white'}`}
          >
            Fale com a Gente
          </button>
        </div>
      </div>

      {activeTabTrip === 'roteiro' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tripDetails.roteiro.map((item, idx) => (
            <div key={idx} className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 flex flex-col">
              <div className="flex items-center space-x-2 mb-3">
                <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {item.dia}
                </span>
                <h4 className="text-sm font-bold text-slate-200 leading-tight">{item.tit}</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTabTrip === 'inclusoes' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {tripDetails.inclusoes.map((inc, idx) => (
            <div key={idx} className="p-3 bg-slate-900/30 rounded-xl flex items-center space-x-3 border border-slate-800/60">
              <span className="text-emerald-400 flex-shrink-0">
                {inc.icon}
              </span>
              <span className="text-xs text-slate-200 font-medium">{inc.label}</span>
            </div>
          ))}
        </div>
      )}

      {activeTabTrip === 'regras' && (
        <div className="space-y-3 text-xs text-slate-400 bg-slate-900/30 p-5 rounded-xl border border-slate-800/50">
          {tripDetails.regras.map((reg, idx) => (
              <p key={idx} className="flex gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{reg}</span>
              </p>
          ))}
        </div>
      )}

      {activeTabTrip === 'contato' && (
        <div className="bg-gradient-to-r from-emerald-950/20 to-slate-900/40 p-6 rounded-xl border border-emerald-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h4 className="text-base font-bold text-slate-200 flex items-center justify-center md:justify-start gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              Atendimento Integrado Conexão B2B
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dúvidas sobre sua pontuação, novos faturamentos, metas de viagens ou detalhes sobre os prêmios do catálogo? Fale diretamente com o setor de Marketing do Grupo Monte pelo nosso WhatsApp oficial.
            </p>
          </div>
          <a 
            href={WHATSAPP_LINK} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition duration-300 shadow-lg shadow-emerald-500/15 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            Iniciar Atendimento
          </a>
        </div>
      )}
    </section>
  );
}
