/**
 * app.js — Entry point da SPA
 *
 * Registra as rotas e inicializa o router.
 * Gerencia o estado ativo do nav da sidebar.
 */

import { on, initRouter } from './router.js'
import { renderFeed } from './views/feed.js'
import { renderPost } from './views/post.js'
import { renderProfile } from './views/profile.js'

const app = document.getElementById('app')
const navItems = document.querySelectorAll('.nav-item[data-route]')

/**
 * Marca o nav-item correspondente à rota ativa.
 * @param {string|null} route - valor do atributo data-route
 */
function setActiveNav(route) {
  navItems.forEach((item) => {
    item.classList.toggle('nav-item--active', item.dataset.route === route)
  })
}

// ── Rotas ────────────────────────────────────────────────

on('/feed', () => {
  setActiveNav('feed')
  renderFeed(app)
})

on('/post/:id', (id) => {
  setActiveNav(null)
  renderPost(app, id)
})

on('/profile/:username', (username) => {
  setActiveNav(null)
  renderProfile(app, username)
})

// ── Init ─────────────────────────────────────────────────

initRouter()
