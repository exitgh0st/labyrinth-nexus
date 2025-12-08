/**
 * Production environment configuration
 *
 * NOTE: These values are used as fallback when runtime configuration fails to load.
 * The primary configuration is loaded from /assets/config/app-config.json at runtime.
 *
 * For production deployment:
 * 1. Update app-config.json with production values, OR
 * 2. Use environment variables with Docker to generate app-config.json at runtime
 *
 * See STARTER-TEMPLATE-RECOMMENDATIONS.md for deployment strategies
 */
export const environment = {
    production: true,
    apiUrl: 'http://localhost:3000/api' // Fallback API URL - update for your production environment
};
