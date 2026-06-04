# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repositório

https://github.com/Amarildo-correa/promptdown-ui

## Comandos de Desenvolvimento

Para rodar localmente, são necessários dois terminais:

```bash
npm install
npm run api     # Terminal 1 — JSON Server na porta 3001
npm run serve   # Terminal 2 — Servidor estático na porta 5173
```

Acesse o frontend em `http://localhost:5173` e a API em `http://localhost:3001`.

Não há comandos de build, lint ou testes configurados.

## Arquitetura

### Visão Geral

SPA vanilla JavaScript com roteamento por hash e um mock de API via JSON Server. Sem bundler, sem TypeScript, sem framework — os arquivos são servidos diretamente.

**Fluxo de dados:** `router.js` captura mudanças no hash → `app.js` chama a view correspondente → a view faz fetch via `api.js` → renderiza HTML como string no `#app`.

### Módulos principais (`public/js/`)

- **router.js** — Roteador hash customizado. Converte padrões com params (`:id`, `:username`) em regex. Eventos `hashchange` disparam a resolução das rotas.
- **app.js** — Registra as três rotas (`#/feed`, `#/post/:id`, `#/profile/:username`) e controla o estado ativo do nav lateral.
- **api.js** — Camada HTTP sobre JSON Server. Base URL dinâmica: `http://${window.location.hostname}:3001` — funciona em localhost e pelo IP da rede local sem configuração manual. Usa `_expand=user` para embutir dados relacionais em uma única requisição.
- **utils.js** — `formatDate()` (ISO → pt-BR), `truncate()` (preserva fronteiras de palavras), `renderLoading()`, `renderError()`.
- **views/** — Cada view faz fetch assíncrono, exibe loading/error e injeta HTML string no DOM. Listeners de eventos são adicionados após o render.

### Backend (mock)

`api/server.js` inicializa o JSON Server usando `api/database.json` como banco de dados em arquivo. Endpoints REST completos gerados automaticamente.

**Modelos de dados:**

- `posts`: `id, title, slug, body, tags[], userId, likes, createdAt`
- `users`: `id, name, username, bio, joinedAt`

## Design System

Documentado em `DESIGN-SYSTEM.md`. Regras críticas para manter consistência visual:

- **Tema escuro minimalista** — bg `#181a18`, texto `#c8c5d0`
- **Sem border-radius** em nenhum componente
- **Sem sombras ou gradientes** — apenas cores sólidas
- **Bordas separam componentes** — `1px solid` como único divisor
- **Inter** para UI geral; **Roboto Mono** exclusivamente para blocos de código e conteúdo markdown
- Todas as medidas em `rem`, nunca `px` hardcoded
- Tokens em `public/css/tokens.css` — usar variáveis CSS, nunca valores hardcoded

## Convenções

- Todo o conteúdo da UI, documentação e dados de exemplo estão em pt-BR.
- Feed trunca preview a 160 chars; perfil a 150 chars (ambos com `truncate()` de `utils.js`).
- Listas sempre ordenadas por `createdAt` decrescente via `_sort=createdAt&_order=desc`.
- Pattern de renderização: substituir todo o `innerHTML` do container — não há atualizações parciais de DOM.
