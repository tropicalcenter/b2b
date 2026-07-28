import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { X, Loader2, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';

interface ResetPasswordModalProps {
  onClose: () => void;
}

export function ResetPasswordModal({ onClose }: ResetPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;
      setSuccessMsg('Senha atualizada com sucesso!');
      setTimeout(() => onClose(), 2000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao atualizar a senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Alterar Senha</h2>
            <p className="text-xs text-slate-400 mt-1">Crie uma nova senha para sua conta</p>
          </div>
        </div>

        {errorMsg && (
            <div className="mb-4 bg-red-500/10 border border-red-500/50 px-4 py-3 rounded-lg flex items-center text-red-500 text-sm">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" /> {errorMsg}
            </div>
        )}
        
        {successMsg && (
            <div className="mb-4 bg-emerald-500/10 border border-emerald-500/50 px-4 py-3 rounded-lg flex items-center text-emerald-400 text-sm">
                <CheckCircle2 className="w-4 h-4 mr-2 flex-shrink-0" /> {successMsg}
            </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Nova Senha
            </label>
            <input 
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono tracking-wider"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Confirmar Nova Senha
            </label>
            <input 
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono tracking-wider"
              required
            />
          </div>

          <button
             type="submit"
             disabled={loading || !!successMsg}
             className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black text-sm uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar Nova Senha'}
          </button>
        </form>
      </div>
    </div>
  );
}
