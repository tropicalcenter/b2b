import React, { useState } from 'react';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { ConexaoLogo } from './ConexaoLogo';
import { supabase } from '../lib/supabase';
import { DEFAULT_USER } from '../data';
import { UserProfile } from '../types';

interface LoginScreenProps {
  onLogin: (user: UserProfile) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isForgotPassword) {
      if (!email) {
        setAuthError('Por favor, preencha o email para recuperar a senha.');
        return;
      }
      setLoading(true);
      setAuthError('');
      setSuccessMsg('');
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setSuccessMsg('Email de recuperação enviado! Verifique sua caixa de entrada.');
      } catch (err: any) {
        setAuthError(err.message || 'Erro ao enviar email.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!email || !password) {
      setAuthError('Por favor, preencha email e senha.');
      return;
    }

    if (isSignUp && (!companyName || !companyName.trim())) {
      setAuthError('Por favor, preencha o nome da empresa.');
      return;
    }

    setLoading(true);
    setAuthError('');

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              companyName: companyName.trim()
            }
          }
        });

        if (error) throw error;
        
        if (data.user) {
          onLogin({ ...DEFAULT_USER, companyName: companyName.trim() });
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        if (data.user) {
          const fetchedCompanyName = data.user.user_metadata?.companyName || 'Sua Empresa';
          onLogin({ ...DEFAULT_USER, companyName: fetchedCompanyName });
        }
      }
    } catch (err: any) {
      console.error(err);
      if (err.message === 'Invalid login credentials') {
         setAuthError('Credenciais inválidas. Verifique seu email e senha.');
      } else {
         setAuthError(err.message || 'Erro de autenticação.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('teste@construtoragama.com.br');
    setPassword('senha123');
    setAuthError('');
  };

  return (
    <div className="min-h-screen bg-[#070a13] bg-gradient-to-br from-[#070a13] via-[#0b1120] to-[#04060b] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0,transparent_100%)] pointer-events-none" />
      
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800/90 rounded-3xl p-8 shadow-2xl backdrop-blur-md relative overflow-hidden flex flex-col items-center">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
        
        <div className="mb-6">
          <ConexaoLogo className="w-24 h-24 transform hover:scale-105 transition-all duration-300" />
        </div>

        <h2 className="text-xl font-black text-white tracking-tight text-center">CONEXÃO B2B</h2>
        <p className="text-xs text-slate-400 font-medium tracking-wide uppercase mt-1 mb-6">Portal de Relacionamento Premium</p>
        
        <form onSubmit={handleAuth} className="w-full space-y-4">
          {isSignUp && !isForgotPassword && (
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Nome da Empresa
              </label>
              <input 
                type="text"
                placeholder="Razão Social ou Nome Fantasia"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-emerald-500 text-slate-100 placeholder-slate-600 transition font-mono tracking-wider text-center"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Email Corporativo
            </label>
            <input 
              type="email"
              placeholder="exemplo@empresa.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-emerald-500 text-slate-100 placeholder-slate-600 transition font-mono tracking-wider text-center"
            />
          </div>

          {!isForgotPassword && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Senha
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setAuthError('');
                      setSuccessMsg('');
                    }}
                    className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold transition"
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <input 
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-emerald-500 text-slate-100 placeholder-slate-600 transition font-mono tracking-wider text-center"
              />
            </div>
          )}

          {authError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2.5 text-left">
              <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="text-[11px] text-red-400 font-medium leading-relaxed">
                {authError}
              </span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-2.5 text-left">
              <span className="text-[11px] text-emerald-400 font-medium leading-relaxed">
                {successMsg}
              </span>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition duration-300 shadow-lg active:scale-95 hover:shadow-emerald-500/10 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isForgotPassword ? (
              'Enviar Email de Recuperação'
            ) : (
              isSignUp ? 'Criar Conta' : 'Aceder ao Portal'
            )}
          </button>
          
          <div className="text-center mt-4">
            {isForgotPassword ? (
              <button
                 type="button"
                 onClick={() => {
                   setIsForgotPassword(false);
                   setAuthError('');
                   setSuccessMsg('');
                 }}
                 className="text-xs text-slate-400 hover:text-emerald-400 transition underline decoration-dashed underline-offset-4"
              >
                Voltar para o login
              </button>
            ) : (
              <button
                 type="button"
                 onClick={() => {
                   setIsSignUp(!isSignUp);
                   setAuthError('');
                   setSuccessMsg('');
                 }}
                 className="text-xs text-slate-400 hover:text-emerald-400 transition underline decoration-dashed underline-offset-4"
              >
                {isSignUp ? 'Já tem uma conta? Acesse aqui' : 'Não tem conta? Registre-se'}
              </button>
            )}
          </div>
        </form>

        <div className="mt-6 border-t border-slate-800/60 pt-4 w-full text-center">
          <p className="text-[10px] text-slate-500">
            Ambiente de demonstração segura integrado no Bitrix.
          </p>
          <button 
            type="button"
            onClick={handleDemoLogin}
            className="mt-2 text-xs font-bold text-emerald-400/90 hover:text-emerald-300 transition underline decoration-dashed underline-offset-4"
          >
            Preencher credenciais de teste
          </button>
        </div>
      </div>
    </div>
  );
}
