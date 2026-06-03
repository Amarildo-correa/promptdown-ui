/**
 * views/post.js — View: Post individual (prompt completo)
 *
 * Rota: #/post/:id
 * API:  GET /posts/:id?_expand=user
 */

import { api } from '../api.js'
import { formatDate, renderLoading, renderError } from '../utils.js'

/**
 * Renderiza o detalhe de um post no container fornecido.
 * @param {HTMLElement} container
 * @param {string} id - ID do post vindo do hash
 */
export async function renderPost(container, id) {
  container.innerHTML = renderLoading()

  try {
    const post = await api.getPost(id)
    container.innerHTML = buildPost(post)

    // Botão copiar — evento adicionado após render
    container.querySelector('[data-action="copy"]').addEventListener('click', () => {
      navigator.clipboard.writeText(post.body).then(() => {
        const btn = container.querySelector('[data-action="copy"]')
        btn.innerHTML = '<i class="ti ti-check"></i> Copiado'
        setTimeout(() => {
          btn.innerHTML = '<i class="ti ti-copy"></i> Copiar prompt'
        }, 2000)
      })
    })
  } catch (err) {
    container.innerHTML = renderError(err.message)
  }
}

function buildPost(post) {
  const initial = post.user.username[0].toUpperCase()

  return `
    <div class="post-detail">

      <div class="post-back">
        <a href="#/feed" class="btn btn--ghost btn--sm">
          <i class="ti ti-arrow-left"></i> Voltar
        </a>
      </div>

      <article>
        <header class="post-header">
          <div class="post-tags">
            ${post.tags.map((tag) => `<span class="badge"><i class="ti ti-hash"></i>${tag}</span>`).join('')}
          </div>

          <h1 class="post-title">${post.title}</h1>

          <div class="post-meta">
            <div class="avatar">${initial}</div>
            <div class="post-meta__info">
              <a href="#/profile/${post.user.username}" class="link link--accent">
                ${post.user.name}
              </a>
              <time class="post-meta__date">${formatDate(post.createdAt)}</time>
            </div>
            <span class="post-likes">
              <i class="ti ti-heart"></i> ${post.likes}
            </span>
          </div>
        </header>

        <div class="post-body">
          <pre class="post-content">${post.body}</pre>
        </div>

        <footer class="post-footer">
          <button class="btn btn--ghost" data-action="copy">
            <i class="ti ti-copy"></i> Copiar prompt
          </button>
        </footer>
      </article>

    </div>
  `
}
