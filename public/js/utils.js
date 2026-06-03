/**
 * utils.js — Helpers reutilizáveis entre views
 */

/**
 * Formata ISO date string para pt-BR legível
 * @param {string} isoString
 * @returns {string} ex: "18 de mai. de 2025"
 */
export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Trunca texto preservando palavras inteiras
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '...'
}

/**
 * HTML do estado de carregamento
 * @returns {string}
 */
export function renderLoading() {
  return `
    <div class="state-loading">
      <i class="ti ti-loader-2"></i>
      Carregando...
    </div>
  `
}

/**
 * HTML do estado de erro
 * @param {string} message
 * @returns {string}
 */
export function renderError(message) {
  return `
    <div class="state-error">
      <i class="ti ti-alert-circle"></i>
      ${message}
    </div>
  `
}
