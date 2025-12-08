# Security Policy

## Supported Versions

We release security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

**⚠️ DO NOT create a public GitHub issue for security vulnerabilities.**

### How to Report

Please report security vulnerabilities by emailing:

**[your-security-email@example.com]**

Include the following information:

- **Description** - Detailed description of the vulnerability
- **Steps to Reproduce** - Clear steps to reproduce the issue
- **Impact** - Potential impact and severity
- **Affected Versions** - Which versions are affected
- **Suggested Fix** - If you have a solution (optional)
- **Your Contact Info** - For follow-up questions

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 1 week
- **Status Update**: Every 2 weeks until resolved
- **Fix Release**: Depends on severity (critical: ASAP, high: 1-2 weeks, medium: 2-4 weeks)

### Disclosure Policy

- We will work with you to understand and validate the issue
- We will develop and test a fix
- We will release a security advisory and patched version
- We will credit you in the advisory (unless you prefer anonymity)

## Security Features

### Authentication & Authorization

#### JWT-Based Authentication
- Access tokens stored in memory (default - most secure)
- Refresh tokens as HTTP-only cookies
- Automatic token refresh before expiry
- Configurable token storage (memory, localStorage, sessionStorage)

**Configuration** (app.config.ts):
```typescript
provideAuth({
  token: {
    storage: 'memory', // Recommended for production
  },
  session: {
    inactivityTimeout: 30 * 60 * 1000, // 30 minutes
    refreshBeforeExpiry: 2 * 60 * 1000, // Refresh 2 min before expiry
  }
})
```

#### Role-Based Access Control (RBAC)
- Permission-based UI rendering with `*can` and `*cannot` directives
- Route guards for protected pages
- Runtime permission checking

**Example**:
```typescript
// Route protection
{
  path: 'admin',
  canActivate: [authGuard, roleGuard([RoleEnum.ADMIN])]
}

// Template permission check
<button *can="'users:delete'">Delete User</button>
```

#### Session Management
- Automatic session timeout on inactivity
- Cross-tab logout synchronization
- Session invalidation on logout
- Concurrent session limits (configurable backend)

### HTTP Security

#### Security Headers (nginx.conf)
- `X-Frame-Options: SAMEORIGIN` - Prevent clickjacking
- `X-Content-Type-Options: nosniff` - Prevent MIME sniffing
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin` - Control referrer info
- `Permissions-Policy` - Disable unnecessary browser features
- `Content-Security-Policy` - Restrict resource loading

#### CORS Configuration
Backend must be configured to:
- Allow specific origins (not `*`)
- Support credentials for cookie-based auth
- Specify allowed methods and headers

**Example backend (Express.js)**:
```javascript
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Input Validation

#### Zod Schema Validation
All forms use Zod schemas for validation:

```typescript
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[0-9]/, 'Password must contain a number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain a special character');
```

#### Angular Sanitization
- All user input automatically sanitized by Angular
- HTML content sanitized using `DomSanitizer`
- URL validation for dynamic routes

### Data Protection

#### Sensitive Data Handling
- ✅ No credentials in source code
- ✅ Environment variables for configuration
- ✅ `.env` files in `.gitignore`
- ✅ Tokens not stored in localStorage by default
- ✅ Password fields with proper input types

#### What NOT to Commit
- API keys or secrets
- Database credentials
- Private keys
- `.env` files
- `app-config.json` with production values
- User data or PII

### Frontend Security

#### XSS Protection
- Angular's built-in sanitization
- Content Security Policy headers
- No `innerHTML` without sanitization
- Validated user input

#### CSRF Protection
- Backend should implement CSRF tokens
- SameSite cookie attribute
- Token validation on state-changing requests

#### Dependency Security
- Regular `npm audit` checks (in CI/CD)
- Automated dependency updates (Dependabot recommended)
- Lock file committed (`package-lock.json`)

### Configuration Security

#### Runtime Configuration
Configuration loaded from `/assets/config/app-config.json`:

```json
{
  "apiUrl": "https://api.yourdomain.com",
  "appName": "Your App",
  "sessionTimeout": 1800000
}
```

**Security Considerations**:
- ✅ No secrets in config file
- ✅ Config file can be replaced at deployment
- ✅ Different config per environment
- ❌ Don't commit production configs

#### Environment Variables (Docker)
Use environment variables for sensitive configuration:

```yaml
environment:
  - API_URL=https://api.yourdomain.com
  - SESSION_TIMEOUT=1800000
```

### Deployment Security

#### Docker Security
- Multi-stage build (smaller attack surface)
- Non-root user (TODO: add to Dockerfile)
- Health checks configured
- Security scanning recommended

**Recommended**:
```dockerfile
# Add non-root user
RUN addgroup -g 1001 -S nginx && \
    adduser -u 1001 -S nginx -G nginx
USER nginx
```

#### HTTPS/TLS
- Always use HTTPS in production
- Configure reverse proxy (nginx, CloudFlare, etc.)
- Use strong TLS versions (1.2+)
- Disable weak ciphers

**Example nginx TLS config**:
```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers HIGH:!aNULL:!MD5;
ssl_prefer_server_ciphers on;
```

### Monitoring & Logging

#### What to Log
- Authentication attempts (success/failure)
- Authorization failures
- API errors
- Security-relevant events

#### What NOT to Log
- Passwords
- Access tokens
- Personal information
- Credit card numbers

#### Error Handling
- Generic error messages to users
- Detailed errors only in server logs
- No stack traces in production responses

### Security Best Practices

#### Development
1. **Keep dependencies updated**
   ```bash
   npm audit
   npm update
   ```

2. **Use strict TypeScript**
   - Already configured in `tsconfig.json`

3. **Enable all linters**
   ```bash
   npm run lint
   ```

4. **Review code for security issues**
   - Check for hardcoded secrets
   - Validate all user input
   - Use parameterized queries (backend)

#### Deployment
1. **Use environment variables** - For secrets
2. **Enable security headers** - In nginx.conf
3. **Set up HTTPS** - Always
4. **Implement rate limiting** - Backend
5. **Regular backups** - Database and configs
6. **Monitor logs** - For suspicious activity

#### Password Requirements
Backend should enforce:
- Minimum 8 characters
- Mix of upper/lowercase letters
- At least one number
- At least one special character
- Password history (prevent reuse)
- Account lockout after failed attempts

### Known Limitations

#### Client-Side Security
- Client-side validation can be bypassed
- Always validate on the server
- Don't rely on route guards for security
- Backend must enforce authorization

#### Token Storage
- `localStorage`: Vulnerable to XSS
- `sessionStorage`: Tab-scoped, moderate security
- `memory`: Most secure, lost on refresh

**Recommendation**: Use `memory` storage with refresh tokens in HTTP-only cookies.

### Security Checklist

Before deploying to production:

- [ ] All dependencies updated (`npm update`)
- [ ] Security audit passed (`npm audit`)
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] CSP policy configured
- [ ] CORS properly configured
- [ ] No secrets in source code
- [ ] Environment variables used for config
- [ ] Error messages don't leak info
- [ ] Logging configured (no sensitive data)
- [ ] Rate limiting enabled (backend)
- [ ] CSRF protection enabled (backend)
- [ ] Password requirements enforced (backend)
- [ ] Account lockout configured (backend)
- [ ] Regular backups configured
- [ ] Monitoring/alerting set up

### Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Angular Security Guide](https://angular.dev/best-practices/security)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)

## Contact

For security-related questions or concerns:
- Email: [your-security-email@example.com]
- Private message on GitHub (if email not available)

---

Thank you for helping keep Labyrinth Nexus secure! 🔒
