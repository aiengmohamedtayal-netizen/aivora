import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const messagesDir = path.join(__dirname, '../messages');
const enDir = path.join(messagesDir, 'en');
const arDir = path.join(messagesDir, 'ar');

if (!fs.existsSync(enDir)) fs.mkdirSync(enDir, { recursive: true });
if (!fs.existsSync(arDir)) fs.mkdirSync(arDir, { recursive: true });

const schema = {
  seoTitle: "",
  seoDescription: "",
  keywords: "",
  headline: "",
  subheadline: "",
  supportingText: "",
  bullets: [],
  cta: "",
  secondaryCta: "",
  statistics: [],
  imageAlt: ""
};

const files = [
  'common.json',
  'hero.json',
  'services.json',
  'process.json',
  'industries.json',
  'about.json',
  'contact.json',
  'faq.json',
  'footer.json'
];

files.forEach(file => {
  const enPath = path.join(enDir, file);
  const arPath = path.join(arDir, file);
  
  if (!fs.existsSync(enPath)) {
    fs.writeFileSync(enPath, JSON.stringify(schema, null, 2));
  }
  if (!fs.existsSync(arPath)) {
    fs.writeFileSync(arPath, JSON.stringify(schema, null, 2));
  }
});

console.log('Modular localization directories and files initialized.');
