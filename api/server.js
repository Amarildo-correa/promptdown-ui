import jsonServer from "json-server";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(join(__dirname, "database.json"));
const middlewares = jsonServer.defaults({ noCors: false, logger: true, static: '__no_static__' });

server.use(middlewares);
server.use(router);

const PORT = 3001;

server.listen(PORT, () => {
    console.log("");
    console.log("  JSON Server rodando em http://localhost:" + PORT);
    console.log("");
    console.log("  Endpoints disponíveis:");
    console.log("  GET /posts                          lista todos os posts");
    console.log("  GET /posts?_expand=user             posts com dados do autor");
    console.log("  GET /posts?_expand=user&_sort=createdAt&_order=desc");
    console.log("  GET /posts/:id?_expand=user         post individual");
    console.log("  GET /posts?userId=:id               posts de um usuário");
    console.log("  GET /users                          lista todos os usuários");
    console.log("  GET /users/:id                      usuário individual");
    console.log("  GET /users?username=:username       usuário por username");
    console.log("");
    console.log("  Frontend (porta 5173): npm run serve");
    console.log("");
});
