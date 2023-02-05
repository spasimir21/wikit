const DOMAIN = 'wikit.eu';

enum Service {
  AUTH = 'auth',
  DATA = 'data',
  RATING = 'rating',
  SEARCH = 'search',
  IMAGE = 'image'
}

const MathJaxConfig = {
  'tex2jax': {
    inlineMath: [['$', '$']],
    displayMath: [['$$', '$$']],
    processEscapes: true,
    processEnvironments: true
  },
  'displayAlign': 'left',
  'HTML-CSS': {
    scale: 135,
    linebreaks: { automatic: true }
  },
  '$wikitConfig': true
};

export { DOMAIN, Service, MathJaxConfig };
