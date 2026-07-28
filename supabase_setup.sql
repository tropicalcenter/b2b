-- ==========================================
-- SCRIPT DE CONFIGURAÇÃO DO SUPABASE
-- Sistema de Pontuação de Clientes B2B com RLS
-- ==========================================

-- 1. EXTENSÕES NECESSÁRIAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 2. CRIAÇÃO DAS TABELAS
-- ==========================================

-- Tabela de Perfis (Profiles)
-- Armazena os dados dos clientes, vinculada ao auth.users
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text NOT NULL,
  nome_empresa text,
  cnpj text,
  telefone text,
  criado_em timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
COMMENT ON TABLE public.profiles IS 'Perfis dos usuários complementares à tabela auth.users.';

-- Tabela de Administradores (Admins)
-- Define quais usuários têm privilégios administrativos
CREATE TABLE public.admins (
  usuario_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  criado_em timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
COMMENT ON TABLE public.admins IS 'Lista de usuários com acesso de administrador.';

-- Tabela de Movimentações de Pontos
-- Histórico de transações de crédito e débito de cada usuário
CREATE TABLE public.movimentacoes_pontos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  pontos numeric NOT NULL CHECK (pontos > 0),
  tipo text NOT NULL CHECK (tipo IN ('credito', 'debito')),
  observacao text NOT NULL,
  criado_por uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  criado_em timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
COMMENT ON TABLE public.movimentacoes_pontos IS 'Registro histórico de créditos e débitos de pontos.';

-- ==========================================
-- 3. CRIAÇÃO DE VIEWS
-- ==========================================

-- View de Saldo de Pontos
-- Calcula automaticamente o saldo e os totais baseados no histórico
CREATE OR REPLACE VIEW public.saldo_pontos AS
SELECT 
  p.id AS usuario_id,
  COALESCE(SUM(CASE WHEN m.tipo = 'credito' THEN m.pontos ELSE -m.pontos END), 0) AS saldo_atual,
  COALESCE(SUM(CASE WHEN m.tipo = 'credito' THEN m.pontos ELSE 0 END), 0) AS total_acumulado,
  COALESCE(SUM(CASE WHEN m.tipo = 'debito' THEN m.pontos ELSE 0 END), 0) AS total_resgatado
FROM public.profiles p
LEFT JOIN public.movimentacoes_pontos m ON p.id = m.usuario_id
GROUP BY p.id;
COMMENT ON VIEW public.saldo_pontos IS 'Calcula dinamicamente os saldos baseados nas movimentações.';

-- ==========================================
-- 4. HABILITANDO RLS (Row Level Security)
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimentacoes_pontos ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 5. POLÍTICAS DE SEGURANÇA (CREATE POLICY)
-- ==========================================

-- Função auxiliar para verificar se usuário logado é admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uid uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins WHERE usuario_id = user_uid
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- -------- POLÍTICAS DA TABELA: profiles --------
-- Admins podem ler e alterar todos os perfis. Usuário comum apenas o seu.
CREATE POLICY "Admins_podem_gerenciar_profiles" ON public.profiles
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Usuarios_podem_ler_proprio_profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuarios_podem_atualizar_proprio_profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- -------- POLÍTICAS DA TABELA: admins --------
-- Todos podem ler quem é admin (útil para interface), ou limitamos só para admins.
-- Vamos permitir leitura apenas para admins ou usuário próprio (para saber se ele próprio é).
CREATE POLICY "Leitura_admins" ON public.admins
  FOR SELECT USING (auth.uid() = usuario_id OR public.is_admin(auth.uid()));

-- -------- POLÍTICAS DA TABELA: movimentacoes_pontos --------
-- Admins podem ler e inserir lançamentos livremente
CREATE POLICY "Admins_gerenciam_movimentacoes" ON public.movimentacoes_pontos
  FOR ALL USING (public.is_admin(auth.uid()));

-- Usuários comuns só podem ler suas próprias movimentações
CREATE POLICY "Usuarios_leem_suas_movimentacoes" ON public.movimentacoes_pontos
  FOR SELECT USING (auth.uid() = usuario_id);

-- ==========================================
-- 6. GATILHOS (TRIGGERS)
-- ==========================================

-- Trigger para criar perfil automaticamente no momento do Cadastro (SignUp)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome_empresa)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'companyName', new.raw_user_meta_data->>'company_name', new.email)
  );
  -- Adicional: tornar admin se o email for especifico (Opcional, pode remover depois)
  IF new.email = 'fabriciosilvaananis@gmail.com' THEN
    INSERT INTO public.admins (usuario_id) VALUES (new.id);
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- 7. ÍNDICES DE PERFORMANCE
-- ==========================================
CREATE INDEX idx_profiles_email ON public.profiles (email);
CREATE INDEX idx_movimentacoes_usuario ON public.movimentacoes_pontos (usuario_id);
CREATE INDEX idx_movimentacoes_tipo ON public.movimentacoes_pontos (tipo);
CREATE INDEX idx_movimentacoes_criado_em ON public.movimentacoes_pontos (criado_em DESC);

-- ================= FIM DO SCRIPT =================
