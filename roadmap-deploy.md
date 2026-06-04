# Roadmap — Deploy promptdown-ui com Docker

## Visão geral
Frontend (Nginx) + API (JSON Server) em 2 containers.
Dados persistidos em volume Docker. Acesso via domínio.com com HTTPS.

---

## Etapa 1 — Ajustar o projeto local

**Problema:** `api.js` aponta para `http://localhost:3001` hardcoded.
**Solução:** trocar a base URL para `/api/` — o Nginx vai redirecionar internamente.

**Por quê?** No servidor, o browser não conhece `localhost:3001`.
Tudo passa pelo Nginx na porta 80. O Nginx faz o proxy para o container da API.

Arquivos a criar na raiz do projeto:
- Dockerfile.frontend
- Dockerfile.api
- nginx.conf
- docker-compose.yml

---

## Etapa 2 — Criar os Dockerfiles

**Dockerfile.frontend**
Usa imagem `nginx:alpine` (leve).
Copia a pasta `public/` para dentro do Nginx.
Copia o `nginx.conf` customizado.

**Dockerfile.api**
Usa imagem `node:20-alpine`.
Instala dependências com `npm install`.
Roda `npm run api` (JSON Server na porta 3001).

---

## Etapa 3 — Configurar o Nginx

O `nginx.conf` tem duas responsabilidades:

1. Servir os arquivos estáticos do frontend (HTML, CSS, JS)
2. Fazer proxy das requisições `/api/*` para o container da API

O Nginx é a única porta exposta para o mundo (porta 80).
A API fica isolada — nunca acessível diretamente de fora.

---

## Etapa 4 — Configurar o docker-compose.yml

Define os 2 serviços: `frontend` e `api`.

Volume nomeado `db-data` mapeado para `/app/api` no container da API.
Isso garante que o `database.json` sobrevive a reinicializações e atualizações.

O `frontend` depende da `api` — Docker sobe a API primeiro.

---

## Etapa 5 — Subir no servidor (Vultr)

    git clone https://github.com/Amarildo-correa/promptdown-ui
    cd promptdown-ui
    docker compose up -d --build

Verificar se está rodando:

    docker compose ps
    docker compose logs -f

---

## Etapa 6 — Domínio e HTTPS

1. Apontar o DNS do domínio.com para o IP do servidor Vultr
2. Instalar Certbot no servidor (fora do Docker)
3. Emitir certificado Let's Encrypt gratuito
4. Atualizar nginx.conf para escutar na porta 443 com SSL

---

## Etapa 7 — Acesso restrito aos colegas

Opção A — Whitelist de IPs no Nginx (mais simples):
Libera acesso apenas para os IPs dos colegas.

Opção B — Autenticação básica HTTP no Nginx:
Login e senha solicitados ao abrir o site no browser.

---

## Ordem de execução resumida

1. Ajustar api.js
2. Criar Dockerfiles
3. Criar nginx.conf
4. Criar docker-compose.yml
5. Deploy no Vultr
6. Domínio + HTTPS
7. Restringir acesso
