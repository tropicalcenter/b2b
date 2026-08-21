# 📘 Manual do Sistema B2B Conexão - Programa de Fidelidade & Premiações

Bem-vindo ao manual completo da plataforma **B2B Conexão**, um ecossistema de fidelidade e pontuação desenvolvido sob medida para construtoras, incorporadoras e parceiros corporativos.

---

## 📑 Sumário
1. [Visão Geral](#1-visão-geral)
2. [Arquitetura & Tecnologias](#2-arquitetura--tecnologias)
3. [Estrutura do Projeto](#3-estrutura-do-projeto)
4. [Instalação e Execução Local](#4-instalação-e-execução-local)
5. [Regras de Negócio e Sistema de Pontos](#5-regras-de-negócio-e-sistema-de-pontos)
6. [Catálogo de Prêmios e Metas de Viagens](#6-catálogo-de-prêmios-e-metas-de-viagens)
7. [Módulos do Sistema e Telas](#7-módulos-do-sistema-e-telas)
8. [Integração com Banco de Dados (Supabase)](#8-integração-com-banco-de-dados-supabase)
9. [Resolução de Problemas (FAQ / Troubleshooting)](#9-resolução-de-problemas-faq--troubleshooting)

---

## 1. Visão Geral

A plataforma **B2B Conexão** permite que clientes corporativos acumulem pontos a cada compra faturada e realizem o resgate de premiações de alto valor (tecnologia, climatização, escritório, lazer) ou atinjam metas para viagens exclusivas (nacionais e internacionais).

### Principais Funcionalidades:
- **Área do Cliente**: Extrato de pontos acumulados, histórico de compras/notas fiscais, progresso para viagens e catálogo interativo de resgates.
- **Painel Administrativo (Admin)**: Gestão de clientes, lançamento de compras com cálculo automático de pontos, histórico de movimentações e controle de administradores.
- **Autenticação Segura**: Login via e-mail e senha integrado ao Supabase com controle de permissões por perfil (RLS).
- **Resgate Direto**: Canal integrado via WhatsApp com atendente dedicado para validação e envio dos prêmios.

---

## 2. Arquitetura & Tecnologias

- **Frontend**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool / Bundler**: [Vite](https://vitejs.dev/)
- **Estilização**: Tailwind CSS / Vanilla CSS moderno com suporte a tema escuro (Dark Mode)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Backend / Banco de Dados**: [Supabase](https://supabase.com/) (PostgreSQL com Row Level Security)
- **Hospedagem / Deploy**: [Vercel](https://vercel.com/)

---

## 3. Estrutura do Projeto

```text
b2b/
├── public/                 # Arquivos estáticos
├── src/
│   ├── components/         # Componentes modulares da interface
│   │   ├── AdminDashboard.tsx      # Painel administrativo de gestão e lançamentos
│   │   ├── CatalogSection.tsx      # Catálogo de produtos e resgate de prêmios
│   │   ├── ConexaoLogo.tsx         # Logotipo SVG vetorial da Conexão
│   │   ├── LoginScreen.tsx         # Tela de autenticação e login
│   │   ├── ResetPasswordModal.tsx  # Modal de recuperação de senha
│   │   └── TripDetailsSection.tsx  # Seção de detalhes e metas de viagens
│   ├── lib/
│   │   └── supabase.ts             # Cliente de inicialização do Supabase
│   ├── App.tsx             # Componente raiz e controle de estado principal
│   ├── data.ts             # Dados padrão do catálogo, viagens e regras
│   ├── index.css           # Estilos globais e tokens de animação
│   ├── main.tsx            # Ponto de entrada da aplicação React
│   └── types.ts            # Definições de tipos TypeScript
├── index.html              # HTML base da aplicação
├── manual.md               # Este manual de documentação
├── supabase_setup.sql      # Script SQL de criação das tabelas, views e RLS
├── tsconfig.json           # Configuração do compilador TypeScript
├── vite.config.ts          # Configurações do Vite
└── package.json            # Dependências e scripts do projeto
```

---

## 4. Instalação e Execução Local

### Pré-requisitos
- **Node.js** (versão 18 ou superior)
- **Git** instalado

### Passo a Passo

1. **Clonar ou abrir o repositório:**
   ```bash
   git clone https://github.com/tropicalcenter/b2b.git
   cd b2b
   ```

2. **Instalar as dependências:**
   ```bash
   npm install
   ```

3. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   O terminal exibirá o endereço local, geralmente: **`http://localhost:5173/`**.

---

## 5. Regras de Negócio e Sistema de Pontos

### 🧮 Fator de Conversão
O cálculo de conversão entre valor em Reais (R$) e Pontos é definido pela constante:
- `FATOR_CONVERSAO = 0.03`

### Como funciona:
- **Ganho de Pontos (Compras)**:
  $$\text{Pontos Gerados} = \text{Valor da Compra (R\$)} \times 0.03$$
  *Exemplo*: Uma compra de **R\$ 100.000,00** gera **3.000 pontos**.

- **Cálculo do Custo em Pontos dos Prêmios**:
  $$\text{Pontos Necessários} = \frac{\text{Preço do Produto (R\$)}}{0.03}$$
  *Exemplo*: Um produto com preço cadastrado de **R\$ 7.506,00** exige **250.200 pontos** para resgate.

---

## 6. Catálogo de Prêmios e Metas de Viagens

### 🎁 Produtos Disponíveis no Catálogo (`src/data.ts`)
| Categoria | Produto | Pontos Necessários | Destaque |
| :--- | :--- | :--- | :---: |
| **Tecnologia** | iPhone 16 128GB | 399.967 pts | ⭐ Sim |
| **Tecnologia** | MacBook Air M3 15" 16GB / 512GB | 549.967 pts | Não |
| **Escritório** | Smart TV 75" Samsung Crystal UHD 4K | 283.300 pts | ⭐ Sim |
| **Escritório** | Smart TV 65" 4K UHD | 250.200 pts | Não |
| **Escritório** | Cadeira Ergonômica Presidente Premium | 196.633 pts | Não |
| **Escritório** | Ar Condicionado Split Inverter WindFree 18.000 BTU | 223.300 pts | Não |
| **Lazer** | Cafeteira Expresso Super Automática Oster | 209.967 pts | Não |
| **Lazer** | Cervejeira Premium Venax Blue Light 100L | 183.300 pts | Não |
| **Lazer** | Parrilla Gourmet Inox com Tijolos Refratários | 260.000 pts | ⭐ Sim |

### ✈️ Metas de Viagens Premium
| Destino | Subtítulo | Meta de Faturamento | Duração | Categoria |
| :--- | :--- | :--- | :--- | :--- |
| **Campos do Jordão** | A Suíça Brasileira | R$ 600.000 | 4 Dias / 3 Noites | Prata (Romântico & Gourmet) |
| **Salinas Maragogi** | Caribe Brasileiro All Inclusive | R$ 700.000 | 6 Dias / 5 Noites | Ouro (Sol & Resort 5★) |
| **Gramado - RS** | Estilo de Vida Europeu na Serra | R$ 900.000 | 5 Dias / 4 Noites | Diamante (Elite & Prestígio) |
| **Lisboa - Portugal** | Experiência Europeia | R$ 1.200.000 | 7 Dias / 6 Noites | Black (Viagem Internacional) |

---

## 7. Módulos do Sistema e Telas

### 1. Tela de Login (`src/components/LoginScreen.tsx`)
- Acesso com e-mail e senha.
- Redirecionamento para visão do cliente ou painel administrativo.

### 2. Dashboard do Cliente (`src/App.tsx`)
- Saldo atual, compras faturadas e prêmios resgatados.
- Barra de progresso para a viagem selecionada.
- Histórico detalhado de notas fiscais.
- Catálogo de resgate com busca, filtro e botão WhatsApp.

### 3. Painel Administrativo (`src/components/AdminDashboard.tsx`)
- Gestão de clientes e saldo de pontos.
- Lançamento de compras por nota fiscal com cálculo automático de pontos.
- Extrato geral de movimentações e auditoria.

---

## 8. Integração com Banco de Dados (Supabase)

Script em `supabase_setup.sql`:
1. **`profiles`**: Dados cadastrais das construtoras e parceiros.
2. **`admins`**: Usuários com permissão administrativa.
3. **`movimentacoes_pontos`**: Registro de créditos e débitos.
4. **`saldo_pontos` (View)**: Cálculo dinâmico do saldo atual.

---

## 9. Resolução de Problemas (FAQ / Troubleshooting)

- **Comando `npm` ou `node` não reconhecido**: Abra uma nova aba de terminal para carregar o PATH do Node.js recém-instalado.
- **Alteração do WhatsApp de Suporte**: Atualize a constante `WHATSAPP_LINK` no arquivo `src/data.ts`.
