# Linha Reta Turismo — Next.js 14

Site completo com painel admin, blog com IA, email marketing e catálogo de destinos.

## Stack

- **Next.js 14** App Router + TypeScript
- **Supabase** — banco de dados, autenticação e storage
- **Vercel** — deploy e CDN
- **Resend** — email transacional e marketing
- **Tiptap** — editor rico para o blog
- **Framer Motion** — animações
- **Claude API (Anthropic)** — IA para geração de conteúdo no blog

---

## Setup local (Fase 1)

### 1. Clone e instale

```bash
git clone https://github.com/SEU_USUARIO/linha-reta-turismo.git
cd linha-reta-turismo
npm install
```

### 2. Configure variáveis de ambiente

```bash
cp .env.local.example .env.local
# Abra .env.local e preencha todos os valores
```

### 3. Configure o Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. No painel do Supabase, vá em **SQL Editor**
3. Cole e execute o conteúdo de `supabase/migrations/001_initial_schema.sql`
4. Vá em **Authentication → Users** e crie o usuário admin com seu email/senha
5. Copie a URL e anon key do projeto para o `.env.local`

### 4. Rode em desenvolvimento

```bash
npm run dev
```

Site: http://localhost:3000
Admin: http://localhost:3000/admin

---

## Deploy no Vercel

1. Faça push do projeto para o GitHub
2. Acesse [vercel.com](https://vercel.com) e importe o repositório
3. Configure as variáveis de ambiente (mesmas do `.env.local`)
4. Deploy automático a cada push na `main`

### Domínio próprio (Hostinger → Vercel)

1. No Vercel: **Settings → Domains** → adicione seu domínio
2. O Vercel exibirá os registros DNS necessários
3. Na Hostinger: **DNS → Zona DNS** → adicione os registros CNAME/A fornecidos
4. Aguarde propagação (pode levar até 48h)

---

## Estrutura do projeto

```
app/
├── (public)/          # Páginas públicas (home, destinos, blog)
├── admin/             # Painel administrativo (protegido por auth)
│   ├── destinos/      # CRUD de destinos e pacotes
│   ├── blog/          # Editor de posts com IA
│   ├── email/         # Campanhas de email marketing
│   └── leads/         # Gestão de contatos
├── api/               # Rotas de API
│   ├── leads/         # Salva contatos + notificação por email
│   ├── subscribe/     # Inscrição na lista (LGPD compliant)
│   ├── unsubscribe/   # Descadastro (obrigatório pela LGPD)
│   └── ai/            # IA para geração de conteúdo do blog
└── layout.tsx         # Layout raiz com fontes e metadata

components/
├── ui/                # Componentes base (button, input, etc.)
├── public/            # Componentes das páginas públicas
└── admin/             # Componentes do painel admin

lib/
├── supabase/
│   ├── client.ts      # Supabase client (browser)
│   └── server.ts      # Supabase client (server) + admin client
├── resend.ts          # Email helpers
└── utils.ts           # Funções utilitárias

supabase/
└── migrations/
    └── 001_initial_schema.sql   # Schema + RLS + seed de destinos

types/
└── database.ts        # Tipos TypeScript gerados do schema
```

---

## Próximos passos (Fases 2–5)

- [ ] Página de destinos com filtros
- [ ] Página individual de destino com galeria
- [ ] Blog com listagem e post individual
- [ ] Página de captura de email
- [ ] CRUD de destinos no admin
- [ ] Editor Tiptap no admin com assistente IA
- [ ] Módulo de email marketing com editor de blocos
- [ ] Gestão de leads com kanban de status
- [ ] Vídeos Higgsfield integrados ao hero
- [ ] Animações Framer Motion
- [ ] SEO completo (sitemap, schema.org, robots)
- [ ] Política de privacidade (LGPD)
- [ ] Cookie banner

---

## LGPD

Este projeto inclui:
- Checkbox de consentimento obrigatório na inscrição
- Token de descadastro único por assinante
- Endpoint `/api/unsubscribe` para opt-out via link
- Link de descadastro em todos os emails de marketing

**Ainda faltando antes do go-live:**
- Página `/privacidade` com política de privacidade completa
- Cookie banner no site público
