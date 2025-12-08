#!/usr/bin/env node

/**
 * Setup script for Labyrinth Nexus
 * Helps initialize the project with custom configuration
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function exec(command) {
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`\n❌ Failed to execute: ${command}`);
    return false;
  }
}

async function setup() {
  console.log('\n🚀 Welcome to Labyrinth Nexus Setup!\n');
  console.log('This wizard will help you configure your application.\n');

  try {
    // Step 1: App Name
    console.log('📝 Step 1: Application Configuration\n');
    const appName = await question('App name (Labyrinth Nexus): ') || 'Labyrinth Nexus';

    // Step 2: API URL
    const apiUrl = await question('API URL (http://localhost:3000/api): ') || 'http://localhost:3000/api';

    // Step 3: Package Name
    const packageName = await question('Package name (labyrinth-nexus): ') || 'labyrinth-nexus';

    // Step 4: Session Configuration
    console.log('\n⏱️  Step 2: Session Configuration\n');
    const sessionTimeout = await question('Session timeout in minutes (30): ') || '30';
    const sessionTimeoutMs = parseInt(sessionTimeout) * 60 * 1000;

    const refreshBeforeExpiry = await question('Token refresh before expiry in minutes (2): ') || '2';
    const refreshBeforeExpiryMs = parseInt(refreshBeforeExpiry) * 60 * 1000;

    // Step 5: Create app-config.json
    console.log('\n📦 Creating configuration files...\n');

    const config = {
      apiUrl,
      appName,
      sessionTimeout: sessionTimeoutMs,
      inactivityTimeout: sessionTimeoutMs,
      refreshBeforeExpiry: refreshBeforeExpiryMs
    };

    const configPath = path.join(__dirname, '../src/assets/config/app-config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log('✅ Created: src/assets/config/app-config.json');

    // Step 6: Update package.json
    const packagePath = path.join(__dirname, '../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    packageJson.name = packageName;

    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Updated: package.json');

    // Step 7: Create .env file
    const envContent = `# API Configuration
API_URL=${apiUrl}

# Application Settings
APP_NAME=${appName}
SESSION_TIMEOUT=${sessionTimeoutMs}
INACTIVITY_TIMEOUT=${sessionTimeoutMs}
REFRESH_BEFORE_EXPIRY=${refreshBeforeExpiryMs}
`;

    const envPath = path.join(__dirname, '../.env');
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created: .env');

    // Step 8: Ask about installing dependencies
    console.log('\n📦 Step 3: Dependencies\n');
    const installDeps = await question('Install dependencies now? (Y/n): ');

    if (!installDeps || installDeps.toLowerCase() === 'y') {
      console.log('\n📥 Installing dependencies (this may take a few minutes)...\n');
      const installed = exec('npm install');

      if (installed) {
        console.log('\n✅ Dependencies installed successfully!');
      }
    }

    // Step 9: Ask about initializing git hooks
    const initHooks = await question('\nInitialize git hooks (husky)? (Y/n): ');

    if (!initHooks || initHooks.toLowerCase() === 'y') {
      console.log('\n🔧 Setting up git hooks...\n');
      const hooksInit = exec('npm run prepare');

      if (hooksInit) {
        console.log('\n✅ Git hooks initialized!');
      }
    }

    // Step 10: Summary
    console.log('\n\n🎉 Setup complete!\n');
    console.log('Configuration Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  App Name:          ${appName}`);
    console.log(`  Package Name:      ${packageName}`);
    console.log(`  API URL:           ${apiUrl}`);
    console.log(`  Session Timeout:   ${sessionTimeout} minutes`);
    console.log(`  Token Refresh:     ${refreshBeforeExpiry} minutes before expiry`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('Next steps:');
    console.log('  1. npm start              # Start development server');
    console.log('  2. npm test               # Run tests');
    console.log('  3. npm run build:prod     # Build for production');
    console.log('  4. npm run lint           # Check code quality\n');

    console.log('Documentation:');
    console.log('  • docs/ARCHITECTURE.md    # Architecture overview');
    console.log('  • docs/API-INTEGRATION.md # API integration guide');
    console.log('  • docs/DEPLOYMENT.md      # Deployment instructions');
    console.log('  • CONTRIBUTING.md         # Contribution guidelines');
    console.log('  • SECURITY.md             # Security information\n');

    console.log('Happy coding! 🚀\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run setup
setup().catch(console.error);
