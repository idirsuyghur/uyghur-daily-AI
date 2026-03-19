const fs = require('fs');

const allow = process.env.ALLOW_PLACEHOLDER_DAILY_POST === 'true';

if (!allow) {
  console.error(
    'Refusing to generate placeholder daily post. Set ALLOW_PLACEHOLDER_DAILY_POST=true only for intentional testing.'
  );
  process.exit(1);
}

const path = require('path');
const categories = [
  'تېخنىكا',
  'سۈنئىي ئەقىل',
  'توردا پۇل تېپىش',
  'ساغلاملىق',
  'كىتابلار',
  'شەخسىي تەرەققىيات',
  'پروگرامما تۈزۈش',
  'ئىسلام بىلىملىرى',
  'رەقەملىك سودا',
  'ئۇيغۇر مەدەنىيىتى',
  'كانادادىكى تۇرمۇش',
  'شەرقىي تۈركىستان',
  'ئۇيغۇر تارىخى'
];
const d = new Date();
const date = d.toISOString().slice(0, 10);
const idxPath = 'data/index.json';
const idx = JSON.parse(fs.readFileSync(idxPath, 'utf8'));
const used = idx.posts.map(p => p.category);
const category = categories.find(c => !used.slice(-categories.length).includes(c)) || categories[d.getDate() % categories.length];
const slug = `post-${date}`;
const post = {
  title: `${date} كۈنىدىكى ${category} تېمىسىدىكى يېڭى ماقالە`,
  slug,
  date,
  category,
  tags: [category, 'ئۇيغۇرچە', 'AI', 'بىلىم', 'تېخنىكا'],
  description: `${category} ھەققىدە كۈندىلىك ئۇيغۇرچە ئەلا سۈپەتلىك ماقالە.`,
  featuredImagePrompt: `Minimalist illustration about ${category}`,
  contentHtml: '<h1>يېڭى ماقالە</h1><p>بۇ ئاپتوماتىك قۇرۇلغان باشلانغۇچ نۇسخا. بۇ script نى LLM API بىلەن باغلاپ 900–1200 سۆزلۈك تولۇق مەزمۇنغا كېڭەيتىڭ.</p>'
};
const file = `post-${date}.json`;
fs.writeFileSync(path.join('data/posts', file), JSON.stringify(post, null, 2));
idx.posts.unshift({ ...post, file });
fs.writeFileSync(idxPath, JSON.stringify(idx, null, 2));
console.log('generated', file);
