# Amora — SaaS de cartas de amor eternas

SaaS para o Dia dos Namorados. Pessoas escrevem uma carta, anexam fotos,
protegem com senha e pagam um PIX único — a página fica eterna na internet.

## Stack

- **Next.js 16** (App Router, Turbopack, React 19.2)
- **Tailwind v4**
- **Prisma 6** + **PostgreSQL**
- **Cloudflare R2** (S3-compatible) para imagens
- **Abacate Pay** (PIX) como gateway
- **bcryptjs** para hash de senha + cookie HMAC para sessão de leitura

## Estrutura

```
src/
├── app/
│   ├── page.tsx                       # landing
│   ├── criar/page.tsx                 # form de criação
│   ├── pagamento/[id]/                # geração + polling do PIX
│   ├── m/[slug]/                      # carta + portão de senha
│   └── api/
│       ├── pages/route.ts             # POST cria carta
│       ├── upload/route.ts            # POST presign R2
│       ├── access/route.ts            # POST valida senha
│       └── payment/
│           ├── create/route.ts        # POST gera cobrança PIX
│           ├── status/route.ts        # GET polling
│           └── webhook/route.ts       # POST transparent.completed
├── components/Letter.tsx
└── lib/
    ├── prisma.ts
    ├── abacate.ts                     # createPixCharge / checkPixStatus
    ├── r2.ts                          # presigned PUT
    ├── access.ts                      # hash, cookie HMAC
    └── slug.ts
```

## Setup

### 1. Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

```bash
cp .env.example .env
```

Variáveis obrigatórias:

- `DATABASE_URL` — Postgres
- `ABACATE_API_KEY` — JWT do Abacate Pay
- `ABACATE_WEBHOOK_SECRET` — string aleatória, usada como `?secret=` na URL do webhook
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`
- `R2_PUBLIC_BASE_URL` — domínio público do bucket R2 (ex: `https://pub-xxx.r2.dev`)
- `PRICE_CENTS` — preço em centavos (default 1990 = R$19,90)
- `NEXT_PUBLIC_BASE_URL` — usado em links

### 2. Banco

```bash
npm run db:push      # cria tabelas no Postgres
# ou para migrações versionadas:
npm run db:migrate
```

### 3. Cloudflare R2

1. Criar bucket no R2.
2. Configurar **CORS** do bucket para permitir `PUT` do seu domínio:
   ```json
   [
     {
       "AllowedOrigins": ["http://localhost:3000", "https://seudominio.com"],
       "AllowedMethods": ["PUT", "GET"],
       "AllowedHeaders": ["*"]
     }
   ]
   ```
3. Tornar o bucket público (ou usar um CDN próprio) para servir imagens.
4. Criar API token com permissão `Object Read & Write`.

### 4. Abacate Pay

1. Criar conta + obter API key.
2. Criar webhook apontando para:
   `https://seudominio.com/api/payment/webhook?secret=<ABACATE_WEBHOOK_SECRET>`
3. Em desenvolvimento, use [ngrok](https://ngrok.com) para expor o endpoint.

### 5. Rodar

```bash
npm run dev
# http://localhost:3000
```

## Fluxo

1. Usuário escreve carta em `/criar` → upload de fotos para R2 → `POST /api/pages`.
2. Redirect para `/pagamento/[id]` → `POST /api/payment/create` cria cobrança no Abacate (`/v2/transparents/create`) → exibe QR + brCode.
3. Cliente faz polling em `GET /api/payment/status?pageId=…` (e o webhook `transparent.completed` confirma em paralelo).
4. Quando `paid=true`, redireciona para `/m/[slug]`.
5. Se a carta tem senha, usuário digita em `PasswordGate` → `POST /api/access` valida via bcrypt e seta cookie HMAC `amora_access`.
6. Cookie válido → renderiza `<Letter />` com texto + galeria.

## Webhook — segurança

- O webhook do Abacate inclui `?secret=...` na query (verificado com `timingSafeEqual`).
- A documentação descreve adicionalmente um header `X-Webhook-Signature` (HMAC-SHA256 do raw body, verificado com a chave pública pública do Abacate). Para produção, adicione essa verificação em `src/app/api/payment/webhook/route.ts`.

## Próximos passos sugeridos

- Verificação completa de `X-Webhook-Signature` com chave pública do Abacate.
- Validação de tipo/tamanho de arquivo no servidor antes de assinar URL R2.
- Rate limit em `/api/access` para prevenir brute force.
- Limite de tamanho da carta + sanitização de markdown se for adicionar formatação.
- Página `/minhas-cartas` com login mágico por e-mail.
