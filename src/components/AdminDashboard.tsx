import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Plus, Minus, SearchIcon, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { UserProfile } from '../types';

interface AdminDashboardProps {
  onBack: () => void;
}

interface UserAuthProfile extends UserProfile {
  id: string;
  email: string;
}

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [users, setUsers] = useState<UserAuthProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [selectedUser, setSelectedUser] = useState<UserAuthProfile | null>(null);
  const [pointsAmount, setPointsAmount] = useState('');
  const [pointsType, setPointsType] = useState<'credit'|'debit'>('credit');
  const [observation, setObservation] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: usersData, error: usersErr } = await supabase.from('profiles').select('*');
      const { data: saldoData, error: saldoErr } = await supabase.from('saldo_pontos').select('*');

      if (usersErr) {
        if (usersErr.code === 'PGRST205' || usersErr.message.includes('relation "public.profiles" does not exist')) {
          setErrorMsg('Tabela "profiles" não encontrada. PGRST205');
        } else {
           setErrorMsg(usersErr.message);
        }
      } else if (usersData) {
        setUsers(usersData.map(d => {
           const saldos = (saldoData || []).find(s => s.usuario_id === d.id) || { saldo_atual: 0 };
           return {
             ...d,
             companyName: d.nome_empresa || d.email,
             totalPurchases: Number(saldos.saldo_atual) || 0,
           }
        }));
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !pointsAmount || !observation.trim()) {
      setErrorMsg('Preencha os pontos, usuário e observação.');
      return;
    }

    const amt = parseFloat(pointsAmount);
    if (isNaN(amt) || amt <= 0) {
      setErrorMsg('Valor inválido.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
        const amtFinal = pointsType === 'credit' ? amt : -amt;
        const newTotal = selectedUser.totalPurchases + amtFinal;

        // add transaction in movimentacoes_pontos
        const { error: txErr } = await supabase
          .from('movimentacoes_pontos')
          .insert({
             usuario_id: selectedUser.id,
             pontos: amt,
             tipo: pointsType,
             observacao: observation.trim()
          });
        
        if (txErr) throw txErr;

        setSuccessMsg('Movimentação salva com sucesso!');
        setPointsAmount('');
        setObservation('');
        fetchUsers();
        setSelectedUser(prev => prev ? { ...prev, totalPurchases: newTotal } : null);

        setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
        setErrorMsg('Erro: ' + err.message);
    } finally {
        setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const search = searchTerm.toLowerCase();
    return (
       (u.companyName && u.companyName.toLowerCase().includes(search)) ||
       (u.email && u.email.toLowerCase().includes(search)) ||
       (u.cnpj && u.cnpj.toLowerCase().includes(search)) ||
       (u.phone && u.phone.toLowerCase().includes(search))
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-300">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-white px-2">Painel de Lançamentos</h1>
            <p className="text-sm text-slate-400 px-2 mt-1">Gerencie os pontos (faturamento) dos clientes</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Users */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col h-[600px]">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Buscar usuário..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="animate-spin text-emerald-500 w-6 h-6" /></div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">Nenhum usuário encontrado.</div>
            ) : (
               filteredUsers.map(u => (
                  <button
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className={`w-full text-left p-3 rounded-xl border transition ${selectedUser?.id === u.id ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800'}`}
                  >
                    <div className="font-bold text-sm text-slate-200 truncate">{u.companyName}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{u.email}</div>
                    <div className="text-xs font-mono text-emerald-400 mt-2 font-bold">R$ {u.totalPurchases?.toLocaleString('pt-BR')} PTS</div>
                  </button>
               ))
            )}
          </div>
        </div>

        {/* Right Col: Operations */}
        <div className="lg:col-span-2">
          {errorMsg && errorMsg.includes('PGRST205') ? (
             <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-red-500 mb-4">Tabelas não encontradas no Supabase</h2>
                <p className="text-slate-400 text-sm mb-4">
                  O painel precisa das tabelas corretas para funcionar. Abra o <strong>supabase_setup.sql</strong> na raiz do projeto, copie o conteúdo e rode no SQL Editor do Supabase.
                </p>
             </div>
          ) : selectedUser ? (
             <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-6">
                   <div>
                      <h2 className="text-xl font-bold text-white mb-1">{selectedUser.companyName}</h2>
                      <p className="text-sm text-slate-400">{selectedUser.email}</p>
                   </div>
                   <div className="text-right">
                      <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1">Saldo Atual em Reais</div>
                      <div className="text-2xl font-black text-emerald-400">R$ {selectedUser.totalPurchases?.toLocaleString('pt-BR')}</div>
                   </div>
                </div>

                {errorMsg && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/50 px-4 py-3 rounded-lg flex items-center text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4 mr-2" /> {errorMsg}
                    </div>
                )}
                
                {successMsg && (
                    <div className="mb-6 bg-emerald-500/10 border border-emerald-500/50 px-4 py-3 rounded-lg flex items-center text-emerald-400 text-sm">
                        <CheckCircle2 className="w-4 h-4 mr-2" /> {successMsg}
                    </div>
                )}

                <form onSubmit={handleTransaction}>
                   <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tipo de Lançamento</label>
                          <div className="flex bg-slate-950 rounded-lg p-1">
                             <button
                                type="button"
                                onClick={() => setPointsType('credit')}
                                className={`flex-1 flex items-center justify-center py-2 rounded-md text-sm font-bold transition ${pointsType === 'credit' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                             >
                                <Plus className="w-4 h-4 mr-1"/> Adicionar (R$)
                             </button>
                             <button
                                type="button"
                                onClick={() => setPointsType('debit')}
                                className={`flex-1 flex items-center justify-center py-2 rounded-md text-sm font-bold transition ${pointsType === 'debit' ? 'bg-red-500 text-white' : 'text-slate-400 hover:text-white'}`}
                             >
                                <Minus className="w-4 h-4 mr-1"/> Remover (R$)
                             </button>
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Valor (R$)</label>
                          <input 
                             type="number"
                             step="0.01"
                             min="0.01"
                             required
                             value={pointsAmount}
                             onChange={e => setPointsAmount(e.target.value)}
                             className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors h-[40px] font-mono"
                             placeholder="Ex: 5000.00"
                          />
                      </div>
                   </div>

                   <div className="mb-6">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Observação (Motivo) *</label>
                      <textarea
                         required
                         rows={3}
                         value={observation}
                         onChange={e => setObservation(e.target.value)}
                         className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                         placeholder="Ex: Faturamento referente a NF 10245..."
                      />
                   </div>

                   <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black text-sm uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]"
                   >
                     {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmar Lançamento'}
                   </button>
                </form>
             </div>
          ) : (
             <div className="h-[600px] flex flex-col items-center justify-center bg-slate-900 border border-slate-800 border-dashed rounded-2xl p-6 text-center">
                 <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                     <SearchIcon className="w-8 h-8 text-slate-600" />
                 </div>
                 <h3 className="text-lg font-bold text-slate-300 mb-2">Nenhum usuário selecionado</h3>
                 <p className="text-slate-500 text-sm max-w-sm">Busque e selecione um usuário na lista ao lado para realizar adicionamento/remoção de pontos.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
