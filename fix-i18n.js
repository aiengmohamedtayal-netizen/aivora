const fs = require('fs');
const path = require('path');

function walkSync(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') walkSync(filepath, callback);
    } else if (stats.isFile() && /\.(tsx|ts|js|jsx)$/.test(filepath)) {
      callback(filepath);
    }
  });
}

walkSync(path.join(process.cwd(), 'apps', 'admin'), (filepath) => {
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;
  
  // Replace Link from next-intl with next/link
  if (content.includes('@/i18n/routing')) {
    content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]@\/i18n\/routing['"]/g, (match, imports) => {
      const parts = imports.split(',').map(i => i.trim());
      const linkIndex = parts.indexOf('Link');
      let replacement = '';
      if (linkIndex !== -1) {
        replacement += 'import Link from "next/link"\n';
        parts.splice(linkIndex, 1);
      }
      if (parts.length > 0) {
        replacement += `import { ${parts.join(', ')} } from "next/navigation"`;
      }
      return replacement.trim();
    });
  }
  
  if (content !== original) fs.writeFileSync(filepath, content, 'utf8');
});
console.log('Fixed i18n imports in admin');
