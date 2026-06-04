/**
 * api.js — Camada de acesso à API (JSON Server)
 *
 * Base URL dinâmica: http://<hostname>:3001
 * O hostname é detectado via window.location.hostname — funciona em localhost e pelo IP da rede local.
 * Todos os métodos retornam dados já parseados (JSON).
 * Lançam Error em caso de resposta não-ok.
 */

const API_BASE = `http://${window.location.hostname}:3001`;

async function request(path) {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
    return res.json();
}

export const api = {
    /**
     * Lista todos os posts com dados do autor expandidos.
     * Ordenados do mais recente para o mais antigo.
     *
     * GET /posts?_expand=user&_sort=createdAt&_order=desc
     * @returns {Promise<Array>}
     */
    getPosts() {
        return request("/posts?_expand=user&_sort=createdAt&_order=desc");
    },

    /**
     * Busca um post pelo ID com dados do autor expandidos.
     *
     * GET /posts/:id?_expand=user
     * @param {string|number} id
     * @returns {Promise<Object>}
     */
    getPost(id) {
        return request(`/posts/${id}?_expand=user`);
    },

    /**
     * Busca um usuário pelo username.
     * Retorna o primeiro resultado (username é único).
     *
     * GET /users?username=:username
     * @param {string} username
     * @returns {Promise<Object>}
     */
    async getUserByUsername(username) {
        const users = await request(`/users?username=${username}`);
        if (!users.length) throw new Error(`Usuário "@${username}" não encontrado`);
        return users[0];
    },

    /**
     * Lista todos os posts de um usuário.
     * Ordenados do mais recente para o mais antigo.
     *
     * GET /posts?userId=:userId&_sort=createdAt&_order=desc
     * @param {number} userId
     * @returns {Promise<Array>}
     */
    getPostsByUser(userId) {
        return request(`/posts?userId=${userId}&_sort=createdAt&_order=desc`);
    },
};
