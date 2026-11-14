# 📋 Contexto do Projeto B2B Conexão (Para Continuação no Claude)

Este documento foi gerado para fornecer todo o contexto técnico, de regras de negócio e do estado atual do projeto **B2B Conexão** para dar continuidade ao desenvolvimento com o **Claude**.

---

## 🏢 1. Visão Geral do Projeto

O **B2B Conexão** é uma plataforma web de fidelidade e incentivo voltada para o mercado corporativo (construtoras, incorporadoras e parceiros B2B). 

### Objetivos do Sistema:
- Permitir que clientes corporativos acumulem pontos a cada compra faturada.
- Exibir extrato detalhado de notas fiscais e saldo em tempo real.
- Disponibilizar catálogo para resgate de prêmios de alto valor (tecnologia, climatização, escritório e lazer) via WhatsApp.
- Apresentar metas de faturamento para desbloqueio de viagens nacionais e internacionais com acompanhamento visual de progresso.
- Disponibilizar um Painel Administrativo para cadastro de empresas, lançamento de compras com pontuação automática e auditoria de pontos.

---

## 🛠️ 2. Stack Tecnológica

- **Frontend**: React 18, TypeScript, Vite
- **Estilização**: Tailwind CSS / Vanilla CSS moderno com suporte a Dark Mode
- **Ícones**: Lucide React (`lucide-react`)
- **Backend / Banco de Dados**: Supabase (PostgreSQL, Auth com JWT, Row Level Security - RLS)
- **Hospedagem / CI/CD**: Vercel / GitHub
- **Repositório**: `https://github.com/tropicalcenter/b2b.git`

---

## 📁 3. Estrutura de Arquivos

```text
b2b/
├── public/                     # Ativos estáticos
├── src/
│   ├── components/
│   │   ├── AdminDashboard.tsx      # Painel administrativo (gestão de clientes, compras e pontos)
│   │   ├── CatalogSection.tsx      # Catálogo de prêmios com busca, filtros por categoria e cálculo de pontos
│   │   ├── ConexaoLogo.tsx         # Componente do Logotipo vetorial (SVG)
│   │   ├── LoginScreen.tsx         # Tela de autenticação (e-mail/senha) com recuperação
│   │   ├── ResetPasswordModal.tsx  # Modal de redefinição de senha
│   │   └── TripDetailsSection.tsx  # Seção detalhada das metas de viagens
│   ├── lib/
│   │   └── supabase.ts             # Cliente de inicialização do Supabase (URL e Anon Key)
│   ├── App.tsx                     # Componente principal / Gerenciamento de estado global
│   ├── data.ts                     # Constantes de regras, catálogo de produtos e destinos de viagens
│   ├── index.css                   # Estilos globais e tokens de animação
│   ├── main.tsx                    # Ponto de entrada React
│   └── types.ts                    # Interfaces e tipos TypeScript
├── manual.md                   # Manual completo do sistema
├── supabase_setup.sql          # Script SQL de criação das tabelas, views e RLS
├── tsconfig.json               # Configuração do TypeScript
├── vite.config.ts              # Configurações do Vite
└── package.json                # Dependências e scripts
```

---

## 🧮 4. Regras de Negócio e Sistema de Pontuação

### Fator de Conversão:
No arquivo `src/data.ts`:
```typescript
export const FATOR_CONVERSAO = 0.03;
export const WHATSAPP_LINK = "https://wa.me/5596991968631";
```

### Fórmulas:
1. **Ganho de Pontos (Compras)**:
   $$\text{Pontos Gerados} = \text{Valor da Compra (R\$)} \times 0.03$$
   *Exemplo*: R$ 100.000 em compras = 3.000 pontos.

2. **Cálculo de Pontos no Catálogo**:
   $$\text{Pontos Necessários} = \text{Math.round}\left(\frac{\text{Preço do Produto (R\$)}}{0.03}\right)$$

---

## 🎁 5. Catálogo de Produtos Atualizado (`src/data.ts`)

Atualmente o catálogo possui **9 produtos**:

| ID | Nome do Produto | Categoria | Preço (R$) | Pontos Necessários | Destaque |
| :--- | :--- | :--- | :---: | :---: | :---: |
| `iphone-16` | **iPhone 16 128GB** | Tecnologia | R$ 11.999 | **399.967 pts** | ⭐ Sim |
| `macbook-air-m3` | **MacBook Air M3 15" 16GB / 512GB** | Tecnologia | R$ 16.499 | **549.967 pts** | Não |
| `smart-tv-75` | **Smart TV 75" Samsung Crystal UHD 4K** | Escritório & Climatização | R$ 8.499 | **283.300 pts** | ⭐ Sim |
| `smart-tv-65` | **Smart TV 65" 4K UHD** | Escritório & Climatização | R$ 7.506 | **250.200 pts** | Não |
| `cadeira-ergonomica`| **Cadeira Ergonômica Presidente Premium** | Escritório & Climatização | R$ 5.899 | **196.633 pts** | Não |
| `ar-split-18k` | **Ar Condicionado Split Inverter 18.000 BTU** | Escritório & Climatização | R$ 6.699 | **223.300 pts** | Não |
| `expresso-oster` | **Cafeteira Expresso Super Automática Oster** | Lazer | R$ 6.299 | **209.967 pts** | Não |
| `cervejeira-premium` | **Cervejeira Premium 100L** | Lazer | R$ 5.499 | **183.300 pts** | Não |
| `churrasqueira-parrilla`| **Parrilla Gourmet Inox Tijolos Refratários** | Lazer | R$ 7.800 | **260.000 pts** | ⭐ Sim |

---

## ✈️ 6. Metas de Viagens (`src/data.ts`)

| ID | Destino | Subtítulo | Meta de Faturamento | Duração | Badge |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `campos` | **Campos do Jordão** | A Suíça Brasileira | R$ 600.000 | 4 Dias / 3 Noites | Nível Prata • Romântico & Gourmet |
| `maragogi` | **Salinas Maragogi** | Caribe Brasileiro All Inclusive | R$ 700.000 | 6 Dias / 5 Noites | Nível Ouro • Sol, Praia & Resort 5★ |
| `gramado` | **Gramado - RS** | Estilo de Vida Europeu na Serra | R$ 900.000 | 5 Dias / 4 Noites | Nível Diamante • Elite & Prestígio |
| `lisboa` | **Lisboa - Portugal**| Experiência Europeia | R$ 1.200.000 | 7 Dias / 6 Noites | Nível Black • Viagem Internacional |

---

## 🗄️ 7. Banco de Dados e Supabase (`supabase_setup.sql`)

### Tabelas:
- **`public.profiles`**: `id (uuid, FK auth.users)`, `email`, `nome_empresa`, `cnpj`, `telefone`, `criado_em`
- **`public.admins`**: `usuario_id (uuid, FK auth.users)`, `criado_em`
- **`public.movimentacoes_pontos`**: `id (uuid)`, `usuario_id (FK profiles)`, `pontos (numeric)`, `tipo ('credito' | 'debito')`, `observacao`, `criado_por`, `criado_em`
- **`public.saldo_pontos` (View)**: Calcula dinamicamente `saldo_atual`, `total_acumulado` e `total_resgatado`

### Políticas RLS:
- Função `public.is_admin(user_uid)` verifica se o usuário é administrador.
- Clientes normais só leem e editam seu próprio perfil e histórico.
- Administradores têm acesso total de leitura e inserção de movimentações de pontos.

---

## 🔄 8. Histórico Recente de Alterações Realizadas

1. **Atualização do iPhone**: O item anterior (`iPhone 15 Pro Max`) foi atualizado para `iPhone 16 128GB` (`id: 'iphone-16'`).
2. **Aumento Geral dos Prêmios**: Todas as premiações do catálogo foram elevadas em **+100.000 pontos** (adicionado R$ 3.000 ao campo `price` de cada item).
3. **Novo Item de Resgate**: Inserida a **Smart TV 65" 4K UHD** com exatos **250.200 pontos** (`price: 7506`). As viagens não sofreram alterações.
4. **Documentação**: Criado o `manual.md` detalhado com arquitetura, cálculos e troubleshooting.
5. **Configuração de Ambiente**: Node.js v20.18 LTS instalado no perfil local do usuário.

---

## 🚀 9. Como Rodar o Projeto

```powershell
npm install
npm run dev
```
Acesse: `http://localhost:5173`
