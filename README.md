# Foreva — SaaS de cartas de amor eternas

SaaS para o Dia dos Namorados. Pessoas escrevem uma carta, anexam fotos,
protegem com senha e pagam um PIX único — a página fica eterna na internet.

## Stack

- **Next.js 16** (App Router, Turbopack, React 19.2)
- **Tailwind v4**
- **Prisma 6** + **PostgreSQL**
- **AWS S3** (presigned URL) para imagens
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
│       ├── upload/route.ts            # POST presign S3
│       ├── access/route.ts            # POST valida senha
│       └── payment/
│           ├── create/route.ts        # POST gera cobrança PIX
│           ├── status/route.ts        # GET polling
│           └── webhook/route.ts       # POST transparent.completed
├── components/Letter.tsx
└── lib/
    ├── prisma.ts
    ├── abacate.ts                     # createPixCharge / checkPixStatus
    ├── s3.ts                          # presigned PUT
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
- `AWS_REGION` — região do bucket (sugestão: `sa-east-1` São Paulo)
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` — credenciais IAM
- `S3_BUCKET` — nome do bucket
- `S3_PUBLIC_BASE_URL` — opcional, CloudFront ou domínio próprio (ex: `https://cdn.foreva.com.br`)
- `PRICE_CENTS` — preço em centavos (default 1990 = R$19,90)
- `NEXT_PUBLIC_BASE_URL` — usado em links

### 2. Banco

```bash
npm run db:push      # cria tabelas no Postgres
# ou para migrações versionadas:
npm run db:migrate
```

### 3. AWS S3

1. Criar bucket S3 (sugestão: região `sa-east-1`).
2. Configurar **CORS** do bucket para permitir `PUT` do seu domínio:
   ```json
   [
     {
       "AllowedOrigins": ["http://localhost:3000", "https://foreva.com.br"],
       "AllowedMethods": ["PUT", "GET"],
       "AllowedHeaders": ["*"],
       "ExposeHeaders": ["ETag"]
     }
   ]
   ```
3. Bucket policy: liberar `s3:GetObject` público (ou servir via CloudFront com OAC).
4. Criar usuário IAM com policy mínima:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [{
       "Effect": "Allow",
       "Action": ["s3:PutObject", "s3:GetObject"],
       "Resource": "arn:aws:s3:::foreva-uploads/*"
     }]
   }
   ```
5. Gerar access key do usuário IAM, preencher `AWS_ACCESS_KEY_ID` e `AWS_SECRET_ACCESS_KEY`.

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

1. Usuário escreve carta em `/criar` → upload de fotos para S3 → `POST /api/pages`.
2. Redirect para `/pagamento/[id]` → `POST /api/payment/create` cria cobrança no Abacate (`/v2/transparents/create`) → exibe QR + brCode.
3. Cliente faz polling em `GET /api/payment/status?pageId=…` (e o webhook `transparent.completed` confirma em paralelo).
4. Quando `paid=true`, redireciona para `/m/[slug]`.
5. Se a carta tem senha, usuário digita em `PasswordGate` → `POST /api/access` valida via bcrypt e seta cookie HMAC `foreva_access`.
6. Cookie válido → renderiza `<Letter />` com texto + galeria.

## Webhook — segurança

- O webhook do Abacate inclui `?secret=...` na query (verificado com `timingSafeEqual`).
- A documentação descreve adicionalmente um header `X-Webhook-Signature` (HMAC-SHA256 do raw body, verificado com a chave pública pública do Abacate). Para produção, adicione essa verificação em `src/app/api/payment/webhook/route.ts`.

## Próximos passos sugeridos

- Verificação completa de `X-Webhook-Signature` com chave pública do Abacate.
- Validação de tipo/tamanho de arquivo no servidor antes de assinar URL S3.
- Rate limit em `/api/access` para prevenir brute force.
- Limite de tamanho da carta + sanitização de markdown se for adicionar formatação.
- Página `/minhas-cartas` com login mágico por e-mail.
