/**
 * Development environment configuration
 *
 * NOTE: These values are used as fallback when runtime configuration fails to load.
 * The primary configuration is loaded from /assets/config/app-config.json at runtime.
 *
 * For local development:
 * 1. Copy app-config.example.json to app-config.json
 * 2. Update app-config.json with your local API URL
 *
 * See STARTER-TEMPLATE-RECOMMENDATIONS.md for configuration options
 */
export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000/api' // Fallback API URL for development
};
