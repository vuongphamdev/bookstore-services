import { HelmetOptions } from 'helmet';

/**
 * Helmet is used to secure Express apps by setting various HTTP headers.
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const helmetConfig: HelmetOptions = {
  // Disables Content Security Policy (CSP) since this API does not serve HTML pages
  contentSecurityPolicy: false,

  // Cross-Origin Embedder Policy - more restrictive for security
  crossOriginEmbedderPolicy: false, // Let CORS handle this more granularly

  // Cross-Origin Resource Policy - align with CORS configuration
  crossOriginResourcePolicy: isDevelopment
    ? false // Disable in development for easier testing
    : { policy: 'same-site' }, // More restrictive in production, let CORS handle cross-origin

  // Prevents clickjacking by denying the site from being loaded in an iframe
  frameguard: { action: 'deny' },

  // Enforces HTTP Strict Transport Security (HSTS) for one year
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true, // Enable HSTS preload for better security
  },

  // Ensures no referrer information is sent with requests
  referrerPolicy: { policy: 'no-referrer' },

  // Modern XSS protection (xssFilter is deprecated)
  crossOriginOpenerPolicy: { policy: 'same-origin' },

  // Prevents browsers from MIME-sniffing a response away from the declared content-type
  noSniff: true,

  // Disables DNS prefetching to reduce privacy leaks
  dnsPrefetchControl: { allow: false },

  // Hide server information
  hidePoweredBy: true,

  // Additional security headers for APIs
  originAgentCluster: true,

  // Disable features that aren't needed for APIs
  permittedCrossDomainPolicies: false,
};
