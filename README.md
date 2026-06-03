# promptdown-ui

Frontend prototype do Promptdown — feed público, post individual e perfil do autor.

Stack: Vanilla JS ES Modules · JSON Server · sem bundler · Design System próprio.

---

## Setup

```bash
npm install
```

---

## Rodar

**Terminal 1 — API (JSON Server na porta 3001)**

```bash
npm run api
```

Acessar: http://localhost:3001

Ou via CLI:

```bash
npx serve public -p 5173
```

Acessar: http://localhost:5173

---

## Estrutura de repositório

| Arquivo / Diretório          | Responsabilidade                                |
| ---------------------------- | ----------------------------------------------- |
| `api/database.json`          | Banco de dados do JSON Server: posts e usuários |
| `api/server.js`              | JSON Server — porta 3001                        |
| `public/css/tokens.css`      | Design System tokens + componentes              |
| `public/js/views/feed.js`    | View: feed público                              |
| `public/js/views/post.js`    | View: post individual                           |
| `public/js/views/profile.js` | View: perfil do autor                           |
| `public/js/api.js`           | Camada de acesso à API                          |
| `public/js/router.js`        | Hash router                                     |
| `public/js/utils.js`         | Helpers (`formatDate`, `truncate`)              |
| `public/js/app.js`           | Entry point                                     |
| `public/index.html`          | HTML raiz — único documento                     |
| `package.json`               | Dependências e scripts npm                      |

---

## JSON Server — endpoints úteis para aprender

```bash
# Todos os posts
curl http://localhost:3001/posts

# Posts com dados do autor expandidos
curl "http://localhost:3001/posts?_expand=user"

# Posts ordenados (mais recente primeiro)
curl "http://localhost:3001/posts?_sort=createdAt&_order=desc"

# Post individual
curl http://localhost:3001/posts/1

# Usuário por username
curl "http://localhost:3001/users?username=devlucas"

# Posts de um usuário
curl "http://localhost:3001/posts?userId=1"

# Filtro por tag (busca parcial não suportada nativamente — usar ?tags_like)
curl "http://localhost:3001/posts?tags_like=segurança"
```

---

## Routing — promptdown-ui

O promptdown-ui utiliza routing 100% client-side via hash (`#`).

Navegação entre views NUNCA dispara HTTP request.
O servidor não participa da transição de rotas.

### Como funciona

O browser interpreta tudo após `#` como fragmento local.
Trocar o hash dispara o evento `hashchange` no próprio browser.
O router.js escuta esse evento e renderiza a view correspondente.

### Rotas registradas

| Hash                  | View            | API chamada                                               |
| --------------------- | --------------- | --------------------------------------------------------- |
| `#/feed`              | Feed público    | `GET /posts?_expand=user&_sort=createdAt&_order=desc`     |
| `#/post/:id`          | Post individual | `GET /posts/:id?_expand=user`                             |
| `#/profile/:username` | Perfil do autor | `GET /users?username=:username` + `GET /posts?userId=:id` |

### O que FAZ HTTP request

Apenas as chamadas fetch() dentro das views, direcionadas ao JSON Server:

- GET /posts?\_expand=user&\_sort=createdAt&\_order=desc
- GET /posts/:id?\_expand=user
- GET /users?username=:username
- GET /posts?userId=:id&\_sort=createdAt&\_order=desc

Routing e data fetching são responsabilidades completamente separadas.
O router decide o que renderizar. A API fornece os dados.

---

## Persistência

- O roteamento é sempre baseado em arquivo (`database.json`), nunca em objeto em memória
- Todo POST, PUT, PATCH e DELETE é automaticamente gravado em `api/database.json` pelo JSON Server
- Nunca trocar `jsonServer.router()` para receber um objeto JS — isso quebra a persistência
