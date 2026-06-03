/**
 * router.js — Hash router simples para SPA
 *
 * Rotas registradas via on(pattern, handler).
 * Padrões suportam parâmetros dinâmicos: /post/:id
 * Navega via window.location.hash.
 *
 * Exemplos de rotas:
 *   on('/feed', () => { ... })
 *   on('/post/:id', (id) => { ... })
 *   on('/profile/:username', (username) => { ... })
 */

/** @type {Map<string, Function>} */
const routes = new Map()

/**
 * Registra uma rota.
 * @param {string} pattern - ex: '/feed', '/post/:id'
 * @param {Function} handler - chamado com os params capturados
 */
export function on(pattern, handler) {
  routes.set(pattern, handler)
}

/**
 * Navega para um path (atualiza o hash).
 * @param {string} path - ex: '/feed', '/post/3'
 */
export function navigate(path) {
  window.location.hash = path
}

/**
 * Resolve o hash atual contra as rotas registradas.
 * Chama o handler do primeiro padrão que casar.
 */
function resolve() {
  const hash = window.location.hash.slice(1) || '/feed'

  for (const [pattern, handler] of routes) {
    const regexStr = '^' + pattern.replace(/:[\w]+/g, '([^/]+)') + '$'
    const regex = new RegExp(regexStr)
    const match = hash.match(regex)

    if (match) {
      handler(...match.slice(1))
      return
    }
  }

  // Fallback: rota não encontrada
  const app = document.getElementById('app')
  if (app) {
    app.innerHTML = `
      <div class="state-error">
        <i class="ti ti-alert-circle"></i>
        Página não encontrada: ${hash}
      </div>
    `
  }
}

/**
 * Inicializa o router.
 * Deve ser chamado uma vez, após todas as rotas registradas.
 */
export function initRouter() {
  window.addEventListener('hashchange', resolve)
  resolve()
}
