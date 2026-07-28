import { useState, useMemo, useEffect } from 'react';
import { 
  MessageSquare, Gem, Info, Clock, CheckCircle, 
  Mountain, Palmtree, Wine, LogOut, ShieldAlert, KeyRound 
} from 'lucide-react';
import { ConexaoLogo } from './components/ConexaoLogo';
import { LoginScreen } from './components/LoginScreen';
import { CatalogSection } from './components/CatalogSection';
import { TripDetailsSection } from './components/TripDetailsSection';
import { AdminDashboard } from './components/AdminDashboard';
import { ResetPasswordModal } from './components/ResetPasswordModal';
import { DEFAULT_USER, TRIP_DESTINATIONS, WHATSAPP_LINK } from './data';
import { supabase } from './lib/supabase';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [activeStatementTab, setActiveStatementTab] = useState<'acumulos' | 'resgates'>('acumulos');
  const [selectedTripId, setSelectedTripId] = useState('campos');

  const [user, setUser] = useState(DEFAULT_USER);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleUserLoaded(session.user);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setShowResetModal(true);
      }
      if (session?.user) {
        handleUserLoaded(session.user);
      } else {
        setIsAuthenticated(false);
        setUser(DEFAULT_USER);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUserLoaded = async (authUser: any) => {
    // Determine admin status
    const { data: adminData } = await supabase.from('admins').select('usuario_id').eq('usuario_id', authUser.id).single();
    const isAdmin = !!adminData || authUser.email === 'fabriciosilvaananis@gmail.com';

    // Fetch profile and balances
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', authUser.id).single();
    const { data: saldo } = await supabase.from('saldo_pontos').select('*').eq('usuario_id', authUser.id).single();

    // Fetch transaction history
    const { data: historico } = await supabase.from('movimentacoes_pontos').select('*').eq('usuario_id', authUser.id).order('criado_em', { ascending: false });

    const accumulatedHistory = (historico || []).filter(h => h.tipo === 'credito').map(h => ({
       amount: h.pontos,
       date: new Date(h.criado_em).toLocaleDateString('pt-BR'),
       pointsEarned: h.pontos,
       invoiceNumber: 'Resumo / NF',
       operator: h.observacao
    }));

    const redemptions = (historico || []).filter(h => h.tipo === 'debito').map(h => ({
       pointsRedeemed: h.pontos,
       date: new Date(h.criado_em).toLocaleDateString('pt-BR'),
       description: h.observacao,
       authorizedBy: 'Admin',
       status: 'Processado'
    }));

    setUser({
      ...DEFAULT_USER,
      id: authUser.id,
      email: authUser.email,
      companyName: profile?.nome_empresa || authUser.user_metadata?.companyName || 'Sua Empresa',
      cnpj: profile?.cnpj || 'Não cadastrado',
      totalPurchases: Number(saldo?.total_acumulado) || 0,
      pointsRedeemed: Number(saldo?.total_resgatado) || 0,
      purchaseHistory: accumulatedHistory,
      redemptionHistory: redemptions,
      isAdmin: isAdmin
    });
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const totalPointsEarned = user.totalPurchases; 
  const currentPointsBalance = totalPointsEarned - user.pointsRedeemed;

  const selectedTrip = useMemo(() => {
    return TRIP_DESTINATIONS.find(t => t.id === selectedTripId) || TRIP_DESTINATIONS[0];
  }, [selectedTripId]);

  const progressToSelectedTrip = Math.min((user.totalPurchases / selectedTrip.target) * 100, 100);
  const isSelectedTripUnlocked = user.totalPurchases >= selectedTrip.target;

  const currentLevel = useMemo(() => {
    if (user.totalPurchases >= 1200000) return { name: 'Nível Black', color: 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10', next: 'Trilha Suprema Concluída!' };
    if (user.totalPurchases >= 900000) return { name: 'Nível Diamante', color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10', next: `Faltam R$ ${(1200000 - user.totalPurchases).toLocaleString('pt-BR')} para o Nível Black (Lisboa)` };
    if (user.totalPurchases >= 700000) return { name: 'Nível Ouro', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10', next: `Faltam R$ ${(900000 - user.totalPurchases).toLocaleString('pt-BR')} para o Nível Diamante (Gramado)` };
    if (user.totalPurchases >= 600000) return { name: 'Nível Prata', color: 'text-slate-300 border-slate-400/30 bg-slate-400/10', next: `Faltam R$ ${(700000 - user.totalPurchases).toLocaleString('pt-BR')} para o Nível Ouro (Maragogi)` };
    return { name: 'Nível Bronze', color: 'text-orange-400 border-orange-500/30 bg-orange-500/10', next: `Faltam R$ ${(600000 - user.totalPurchases).toLocaleString('pt-BR')} para o Nível Prata (Campos do Jordão)` };
  }, [user.totalPurchases]);

  if (!isAuthenticated) {
    return <LoginScreen onLogin={(authenticatedUser) => {
      setUser(authenticatedUser);
      setIsAuthenticated(true);
    }} />;
  }

  if (showAdminDashboard && user.isAdmin) {
    return <AdminDashboard onBack={() => setShowAdminDashboard(false)} />;
  }

  return (
    <div className="font-sans antialiased selection:bg-emerald-500 selection:text-white pb-24 overflow-x-hidden">
      
      <a 
        href={WHATSAPP_LINK} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 hover:scale-105 text-slate-950 font-black px-5 py-3.5 rounded-full shadow-2xl flex items-center space-x-2 transition-all duration-300 border-2 border-slate-950/80 group active:scale-95"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-950" />
        </span>
        <MessageSquare className="w-5 h-5" />
        <span className="text-xs uppercase tracking-wider">Fale com a gente</span>
      </a>

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-md sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <ConexaoLogo className="w-16 h-16 transform hover:rotate-6 transition-all duration-300" />
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-2xl font-black tracking-tight text-white">CONEXÃO</span>
                <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">B2B</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase hidden sm:block">
                Conectando parceiros e benefícios de verdade
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user.isAdmin && (
               <button
                 onClick={() => setShowAdminDashboard(true)}
                 className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-extrabold text-slate-300 tracking-wider uppercase transition-all active:scale-95 duration-250"
               >
                 <ShieldAlert className="w-4 h-4 text-emerald-400" />
                 <span className="hidden sm:inline">Admin</span>
               </button>
            )}

            <a 
              href={WHATSAPP_LINK} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-emerald-500/10 hover:bg-emerald-500 hover:text-slate-950 border border-emerald-500/40 px-4 py-2.5 rounded-xl text-xs font-extrabold text-emerald-400 tracking-wider uppercase transition-all active:scale-95 duration-250"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Fale com a Gente</span>
              <span className="sm:hidden">Suporte</span>
            </a>

            <div className="hidden md:flex items-center space-x-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-black text-base shadow-lg uppercase">
                {user.companyName ? user.companyName.substring(0, 2) : 'EM'}
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h4 className="text-xs font-bold text-slate-200">{user.companyName || 'Sua Empresa'}</h4>
                  <span className="text-[9px] px-1 py-0.5 bg-emerald-500/10 rounded text-emerald-400 font-semibold">B2B</span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">CNPJ: {user.cnpj}</p>
              </div>
              <button 
                onClick={() => setShowResetModal(true)}
                className="ml-2 p-2 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 rounded-lg transition"
                title="Mudar Senha"
              >
                <KeyRound className="w-4 h-4" />
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg transition"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {showResetModal && <ResetPasswordModal onClose={() => setShowResetModal(false)} />}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* GRID DE CARDS PRINCIPAIS */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 01 - Saldo de Pontos */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">Saldo Atual de Pontos</span>
                <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                  <Gem className="w-5 h-5" />
                </span>
              </div>
              
              <div>
                <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  {currentPointsBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h1>
                <p className="text-xs text-slate-400 mt-1">Sua pontuação líquida de faturamento para resgates físicos.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Total Acumulado</span>
                  <span className="text-sm font-bold text-slate-200">
                    {totalPointsEarned.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-[10px] font-normal text-slate-500">pts</span>
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Pontos Resgatados</span>
                  <span className="text-sm font-bold text-red-400">
                    {user.pointsRedeemed.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-[10px] font-normal text-slate-500">pts</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 bg-slate-950 rounded-xl border border-slate-800/50 text-[11px] text-slate-400 flex items-start space-x-2">
              <Info className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                Fórmula de Paridade: Cada <strong>R$ 1,00</strong> em compras unificadas na Monte & Tropical equivale a <strong>1 ponto</strong>.
              </span>
            </div>
          </div>

          {/* Card 02 - Nível da Trilha */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Evolução de Categoria</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${currentLevel.color}`}>
                  {currentLevel.name}
                </span>
              </div>

              <div className="space-y-4">
                <div className="relative pt-1">
                  <div className="flex justify-between text-[9px] text-slate-400 mb-2 font-bold tracking-tight">
                    <span className="text-orange-400">Bronze</span>
                    <span className={user.totalPurchases >= 600000 ? 'text-slate-300' : 'text-slate-400'}>Prata (600k)</span>
                    <span className={user.totalPurchases >= 700000 ? 'text-amber-400' : 'text-slate-400'}>Ouro (700k)</span>
                    <span className={user.totalPurchases >= 900000 ? 'text-cyan-400' : 'text-slate-400'}>Diamante (900k)</span>
                    <span className={user.totalPurchases >= 1200000 ? 'text-fuchsia-400' : 'text-slate-400'}>Black (1.2M)</span>
                  </div>

                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden relative">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 via-slate-300 via-amber-400 via-cyan-400 to-fuchsia-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((user.totalPurchases / 1200000) * 100, 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between relative -top-3 px-1 pointer-events-none">
                    <div className={`w-4 h-4 rounded-full border-2 bg-slate-950 ${user.totalPurchases >= 0 ? 'border-orange-500' : 'border-slate-700'}`} />
                    <div className={`w-4 h-4 rounded-full border-2 bg-slate-950 ${user.totalPurchases >= 600000 ? 'border-slate-300' : 'border-slate-700'}`} />
                    <div className={`w-4 h-4 rounded-full border-2 bg-slate-950 ${user.totalPurchases >= 700000 ? 'border-amber-400' : 'border-slate-700'}`} />
                    <div className={`w-4 h-4 rounded-full border-2 bg-slate-950 ${user.totalPurchases >= 900000 ? 'border-cyan-400' : 'border-slate-700'}`} />
                    <div className={`w-4 h-4 rounded-full border-2 bg-slate-950 ${user.totalPurchases >= 1200000 ? 'border-fuchsia-400' : 'border-slate-700'}`} />
                  </div>
                </div>

                <div className="text-xs space-y-1.5 text-slate-300">
                  <div className="flex items-center justify-between">
                    <span>Evolução da Trilha:</span>
                    <span className="font-semibold text-white text-right text-[11px] leading-tight">{currentLevel.next}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Faturamento Acumulado:</span>
                    <span className="font-bold text-emerald-400">R$ {user.totalPurchases.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/85">
              <div className="flex border-b border-slate-800/80 mb-2.5">
                <button 
                  onClick={() => setActiveStatementTab('acumulos')}
                  className={`flex-1 pb-2 text-[10px] font-bold uppercase tracking-wider text-center border-b-2 ${activeStatementTab === 'acumulos' ? 'border-emerald-500 text-slate-200' : 'border-transparent text-slate-500 hover:text-slate-400'}`}
                >
                  Acúmulos ({user.purchaseHistory.length})
                </button>
                <button 
                  onClick={() => setActiveStatementTab('resgates')}
                  className={`flex-1 pb-2 text-[10px] font-bold uppercase tracking-wider text-center border-b-2 ${activeStatementTab === 'resgates' ? 'border-emerald-500 text-slate-200' : 'border-transparent text-slate-500 hover:text-slate-400'}`}
                >
                  Resgates ({user.redemptionHistory.length})
                </button>
              </div>

              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {activeStatementTab === 'acumulos' ? (
                  user.purchaseHistory.map((historyItem, idx) => (
                    <div key={idx} className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 space-y-1 text-[11px]">
                      <div className="flex justify-between items-center font-semibold">
                        <span className="text-emerald-400 font-mono">{historyItem.date}</span>
                        <span className="text-slate-200">{historyItem.invoiceNumber}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400 text-[10px]">
                        <span>{historyItem.operator}</span>
                        <span className="font-bold text-slate-300">R$ {historyItem.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      {historyItem.details && (
                        <p className="text-[9px] text-slate-500 italic border-t border-slate-900 pt-0.5 mt-0.5">
                          {historyItem.details}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  user.redemptionHistory.map((redemptionItem, idx) => (
                    <div key={idx} className="bg-slate-950/60 p-2.5 rounded-xl border border-red-500/10 space-y-1 text-[11px]">
                      <div className="flex justify-between items-center font-semibold">
                        <span className="text-red-400 font-mono">{redemptionItem.date}</span>
                        <span className="text-slate-200 font-bold">Resgate</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400 text-[10px]">
                        <span>{redemptionItem.description}</span>
                        <span className="font-bold text-red-400">-{redemptionItem.pointsRedeemed.toLocaleString('pt-BR')} pts</span>
                      </div>
                      <p className="text-[9px] text-slate-400 italic border-t border-slate-900 pt-0.5 mt-0.5 flex justify-between">
                        <span>Autorizado por:</span>
                        <strong className="text-emerald-400">{redemptionItem.authorizedBy}</strong>
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Card 03 - Painel do Destino Selecionado */}
          <div className={`bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 p-6 rounded-2xl border-2 ${selectedTrip.borderTheme} flex flex-col justify-between relative overflow-hidden shadow-2xl col-span-1`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-4 relative z-10">
              <div className="flex bg-slate-950/60 p-1 rounded-lg border border-slate-800/80 gap-1 mb-2">
                {TRIP_DESTINATIONS.map(trip => (
                  <button
                    key={trip.id}
                    onClick={() => setSelectedTripId(trip.id)}
                    className={`flex-1 text-[10px] py-1.5 rounded font-bold transition-all uppercase tracking-wider ${
                      selectedTripId === trip.id 
                        ? 'bg-slate-800 text-white shadow-sm' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {trip.name.split(' ')[0]}
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/30 font-bold uppercase tracking-wider">
                    ★ {selectedTrip.badge.split(' • ')[0]}
                  </span>
                  <h3 className="text-xl font-black text-white tracking-tight mt-2 flex items-center gap-1.5">
                    {selectedTripId === 'campos' ? <Mountain className="w-5 h-5" /> : selectedTripId === 'maragogi' ? <Palmtree className="w-5 h-5" /> : <Wine className="w-5 h-5" />}
                    {selectedTrip.name}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedTrip.desc}
              </p>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Progresso da Meta</span>
                  <span className={selectedTrip.textTheme}>{progressToSelectedTrip.toFixed(1)}%</span>
                </div>
                <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className={`h-full bg-gradient-to-r ${selectedTrip.colorTheme} transition-all duration-500 rounded-full`}
                    style={{ width: `${progressToSelectedTrip}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                  <span>R$ {user.totalPurchases.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} faturados</span>
                  <span>Meta: R$ {(selectedTrip.target / 1000).toLocaleString('pt-BR')}k</span>
                </div>
              </div>

              <div className="mt-3 rounded-xl overflow-hidden border border-slate-800/80 aspect-[16/9] bg-slate-950 relative shadow-inner">
                <img 
                  src={selectedTrip.image} 
                  alt={selectedTrip.name} 
                  className="w-full h-full object-cover opacity-90 hover:scale-105 transition-all duration-500"
                />
              </div>
            </div>

            <div className="mt-6 relative z-10">
              {isSelectedTripUnlocked ? (
                <div className="w-full py-2.5 bg-emerald-500/10 border border-emerald-500 text-emerald-400 rounded-xl text-center text-xs font-bold flex items-center justify-center space-x-1.5 shadow-lg">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Faturamento Atingido!</span>
                </div>
              ) : (
                <div className="w-full py-2.5 bg-slate-900 border border-slate-800 text-amber-400/80 rounded-xl text-center text-xs font-bold flex items-center justify-center space-x-1">
                  <Clock className="w-4 h-4 text-emerald-500 animate-spin-slow" />
                  <span>Faltam R$ {(selectedTrip.target - user.totalPurchases).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SEÇÃO DAS VIAGENS DINÂMICAS */}
        <TripDetailsSection selectedTripId={selectedTripId} selectedTrip={selectedTrip} />

        {/* CATÁLOGO DE RESGATES */}
        <CatalogSection currentPointsBalance={currentPointsBalance} />
      </main>

      {/* Rodapé */}
      <footer className="border-t border-slate-900 bg-slate-950 mt-16 py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-300">PROGRAMA CONEXÃO B2B</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-bold text-emerald-400">PORTARIA 00/2026</span>
              </div>
              <p className="leading-relaxed">
                Regulamentado pelo Grupo Monte MTA, composto pelas empresas operadoras Monte & Cia Ltda e Tropical Materiais de Construção Ltda.
              </p>
            </div>

            <div className="space-y-3">
              <span className="font-bold text-slate-300 block">Bases Legais LGPD</span>
              <ul className="space-y-1.5">
                <li>• Execução de Contrato (Gestão de Saldos e Resgates)</li>
                <li>• Obrigação Legal (Faturamento e Emissões Fiscais)</li>
                <li>• Legítimo Interesse (Auditoria interna e prevenção a fraudes)</li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="font-bold text-slate-300 block">Cultura de Integridade</span>
              <p className="leading-relaxed">
                As regras deste regulamento são claras. Os participantes são totalmente livres para realizarem negócios com qualquer concorrente do mercado de varejo e atacado. O programa não constitui vínculo empregatício de qualquer natureza.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>© 2026 Grupo Monte MTA. Todos os direitos reservados. Macapá - Amapá.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-slate-300 transition">Regulamento Completo</a>
              <span>•</span>
              <a href="#" className="hover:text-slate-300 transition">Canal LGPD</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
