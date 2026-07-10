import fs from 'fs';
import path from 'path';

const packagesDir = path.join(process.cwd(), 'packages');

const packages = {
  'config': {
    dependencies: {},
    devDependencies: {}
  },
  'design-system': {
    dependencies: {
      "clsx": "^2.1.1",
      "tailwind-merge": "^3.3.1"
    },
    devDependencies: {
      "tailwindcss": "^4.1.11"
    }
  },
  'ui': {
    dependencies: {
      "@radix-ui/react-dialog": "^1.1.14",
      "@radix-ui/react-dropdown-menu": "^2.1.15",
      "@radix-ui/react-label": "^2.1.7",
      "@radix-ui/react-navigation-menu": "^1.2.13",
      "@radix-ui/react-popover": "^1.1.14",
      "@radix-ui/react-select": "^2.2.5",
      "@radix-ui/react-slot": "^1.2.3",
      "@radix-ui/react-toast": "^1.2.14",
      "@radix-ui/react-tooltip": "^1.2.7",
      "class-variance-authority": "^0.7.1",
      "lucide-react": "^0.525.0",
      "framer-motion": "^12.19.1",
      "react": "19.1.0",
      "react-dom": "19.1.0"
    },
    devDependencies: {
      "@types/react": "^19.1.8",
      "@types/react-dom": "^19.1.5"
    }
  },
  'lib': {
    dependencies: {
      "@supabase/ssr": "^0.6.1",
      "@supabase/supabase-js": "^2.49.10"
    },
    devDependencies: {}
  },
  'types': {
    dependencies: {},
    devDependencies: {}
  },
  'hooks': {
    dependencies: {
      "react": "19.1.0"
    },
    devDependencies: {}
  }
};

const tsconfigBase = {
  "compilerOptions": {
    "target": "es2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules"]
};

for (const [pkgName, config] of Object.entries(packages)) {
  const pkgDir = path.join(packagesDir, pkgName);
  const srcDir = path.join(pkgDir, 'src');
  
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir, { recursive: true });
  }

  // Create package.json
  const pkgJson = {
    name: `@aivora/${pkgName}`,
    version: "1.0.0",
    private: true,
    main: "./src/index.ts",
    types: "./src/index.ts",
    dependencies: config.dependencies,
    devDependencies: config.devDependencies
  };
  fs.writeFileSync(path.join(pkgDir, 'package.json'), JSON.stringify(pkgJson, null, 2));

  // Create tsconfig.json
  fs.writeFileSync(path.join(pkgDir, 'tsconfig.json'), JSON.stringify(tsconfigBase, null, 2));

  // Create empty index.ts if not exists
  const indexPath = path.join(srcDir, 'index.ts');
  if (!fs.existsSync(indexPath)) {
    fs.writeFileSync(indexPath, `export * from './';\n`);
  }
}

console.log('Packages scaffolded successfully!');
