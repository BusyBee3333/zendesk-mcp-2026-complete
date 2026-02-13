import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync, statSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const appsDir = join(rootDir, 'src/ui/react-app');
const outDir = join(rootDir, 'dist/apps');

async function buildApp(appName) {
  console.log(`Building ${appName}...`);
  
  await build({
    root: join(appsDir, appName),
    plugins: [react()],
    build: {
      outDir: join(outDir, appName),
      emptyOutDir: true,
      rollupOptions: {
        input: join(appsDir, appName, 'index.html'),
      },
    },
  });
  
  console.log(`✓ Built ${appName}`);
}

async function main() {
  try {
    const apps = readdirSync(appsDir).filter(name => {
      const path = join(appsDir, name);
      return statSync(path).isDirectory();
    });
    
    console.log(`Found ${apps.length} apps to build`);
    
    for (const app of apps) {
      await buildApp(app);
    }
    
    console.log(`\n✓ Successfully built all ${apps.length} apps`);
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

main();
