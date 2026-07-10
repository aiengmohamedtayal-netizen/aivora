import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function findTsxFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  for (const file of files) {
    const filePath = join(dir, file);
    if (statSync(filePath).isDirectory()) {
      findTsxFiles(filePath, fileList);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = findTsxFiles('d:/Aivora/frontend/src');
let updatedComponents = [];

for (const file of files) {
  const content = readFileSync(file, 'utf8');
  let newContent = content;

  // Split into lines to evaluate font-display
  const lines = newContent.split('\n');
  let fileChanged = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    if (line.includes('font-light')) {
      line = line.replace(/\bfont-light\b/g, 'font-normal');
      fileChanged = true;
    }

    if (line.includes('font-semibold')) {
      line = line.replace(/\bfont-semibold\b/g, 'font-medium');
      fileChanged = true;
    }

    if (line.includes('font-bold') && !line.includes('font-display')) {
      line = line.replace(/\bfont-bold\b/g, 'font-medium');
      fileChanged = true;
    }

    lines[i] = line;
  }

  newContent = lines.join('\n');

  if (fileChanged) {
    writeFileSync(file, newContent, 'utf8');
    updatedComponents.push(file);
  }
}

console.log(`Typography audit complete. Updated ${updatedComponents.length} components.`);
console.log(updatedComponents.map(f => f.split('frontend\\\\src\\\\')[1] || f.split('frontend/src/')[1] || f).join('\n'));
