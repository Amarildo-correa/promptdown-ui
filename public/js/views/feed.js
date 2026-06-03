/**
 * views/feed.js — View: Feed público de prompts
 *
 * Rota: #/feed
 * API:  GET /posts?_expand=user&_sort=createdAt&_order=desc
 */

import { api } from '../api.js'
import { formatDate, truncate, renderLoading, renderError } from '../utils.js'

/**
 * Renderiza o feed de posts no container fornecido.
 * @param {HTMLElement} container
 */
export async function renderFeed(container) {
  container.innerHTML = renderLoading()

  try {
    const posts = await api.getPosts()
    container.innerHTML = buildFeed(posts)
  } catch (err) {
    container.innerHTML = renderError(err.message)
  }
}

function buildFeed(posts) {
  return `
    <div class="view-header">
      <h1 class="view-title">Feed público</h1>
      <span class="view-count">${posts.length} prompts</span>
    </div>
    <div class="card-list">
      ${posts.map(buildCard).join('')}
    </div>
  `
}

function buildCard(post) {
  const initial = post.user.username[0].toUpperCase()
  const preview = truncate(post.body, 160)

  return `
    <article class="card">
      <div class="card__author">
        <div class="avatar">${initial}</div>
        <a href="#/profile/${post.user.username}" class="link">${post.user.name}</a>
        <span class="separator">·</span>
        <time class="card__meta">${formatDate(post.createdAt)}</time>
      </div>

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
