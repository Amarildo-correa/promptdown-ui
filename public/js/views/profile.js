/**
 * views/profile.js — View: Perfil do autor
 *
 * Rota: #/profile/:username
 * API:  GET /users?username=:username  →  usuário
 *       GET /posts?userId=:id&_sort=createdAt&_order=desc  →  posts do usuário
 */

import { api } from '../api.js'
import { formatDate, truncate, renderLoading, renderError } from '../utils.js'

/**
 * Renderiza o perfil de um usuário no container fornecido.
 * @param {HTMLElement} container
 * @param {string} username
 */
export async function renderProfile(container, username) {
  container.innerHTML = renderLoading()

  try {
    const user = await api.getUserByUsername(username)
    const posts = await api.getPostsByUser(user.id)
    container.innerHTML = buildProfile(user, posts)
  } catch (err) {
    container.innerHTML = renderError(err.message)
  }
}

function buildProfile(user, posts) {
  const initial = user.username[0].toUpperCase()

  return `
    <header class="profile-header">
      <div class="avatar avatar--lg">${initial}</div>
      <div class="profile-info">
        <h1 class="profile-name">${user.name}</h1>
        <span class="profile-username">@${user.username}</span>
        ${user.bio ? `<p class="profile-bio">${user.bio}</p>` : ''}
        <span class="profile-joined">
          <i class="ti ti-calendar"></i>
          Membro desde ${formatDate(user.joinedAt)}
        </span>
      </div>
    </header>

    <div class="profile-stats">
      <span class="stat">
        <strong>${posts.length}</strong> prompts publicados
      </span>
    </div>

    <div class="view-header">
      <h2 class="view-title">Prompts de ${user.name}</h2>
    </div>

    <div class="card-list">
      ${posts.length ? posts.map(buildCard).join('') : buildEmpty(user.name)}
    </div>
  `
}

function buildCard(post) {
  const preview = truncate(post.body, 150)

  return `
    <article class="card">
      <h2 class="card__title">
        <a href="#/post/${post.id}" class="link link--heading">${post.title}</a>
      </h2>

      <pre class="card__body">${preview}</pre>

      <div class="card__footer">
        <div class="tags">
          ${post.tags.map((tag) => `<span class="badge"><i class="ti ti-hash"></i>${tag}</span>`).join('')}
        </div>
        <span class="card__meta">
          <i class="ti ti-heart"></i> ${post.likes}
        </span>
      </div>
    </article>
  `
}

function buildEmpty(name) {
  return `
    <div class="state-loading">
      <i class="ti ti-file-off"></i>
      ${name} ainda não publicou nenhum prompt.
    </div>
  `
}
