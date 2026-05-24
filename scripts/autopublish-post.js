#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const indexPath = path.join(repoRoot, 'data', 'index.json');
const postsDir = path.join(repoRoot, 'data', 'posts');

function getArg(name, fallback = undefined) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  return process.env[name.toUpperCase()] ?? fallback;
}

function fail(msg) {
  console.error(`❌ ${msg}`);
  process.exit(1);
}

function run(cmd, args) {
  const r = spawnSync(cmd, args, { cwd: repoRoot, stdio: 'inherit' });
  if (r.status !== 0) fail(`Command failed: ${cmd} ${args.join(' ')}`);
}

function runAllowFail(cmd, args, warningMessage) {
  const r = spawnSync(cmd, args, { cwd: repoRoot, stdio: 'inherit' });
  if (r.status !== 0) {
    console.warn(`⚠️ ${warningMessage || `Command failed (continuing): ${cmd} ${args.join(' ')}`}`);
    return false;
  }
  return true;
}

function slugify(input) {
  const s = (input || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return s;
}

const now = new Date();
const date = getArg('date', now.toISOString().slice(0, 10));
const title = getArg('title');
const category = getArg('category', 'تېخنىكا');
const description = getArg('description', `${category} ھەققىدە يېڭى ماقالە.`);
const tagsRaw = getArg('tags', `${category},ئۇيغۇرچە,AI`);
const contentFile = getArg('content-file');
const contentHtmlArg = getArg('content-html');
const featuredImage = getArg('featured-image', 'assets/img/default-cover.svg');
const featuredImagePrompt = getArg('featured-image-prompt');
const providedSlug = getArg('slug');

if (!title) fail('Missing required --title');

let contentHtml = contentHtmlArg;
if (!contentHtml && contentFile) {
  const contentPath = path.isAbsolute(contentFile)
    ? contentFile
    : path.join(process.cwd(), contentFile);
  if (!fs.existsSync(contentPath)) fail(`content file not found: ${contentPath}`);
  contentHtml = fs.readFileSync(contentPath, 'utf8');
}
if (!contentHtml) {
  contentHtml = `<h1>${title}</h1><p>بۇ يازما ئاپتوماتىك قۇرۇلدى. كېيىن تولۇقلايمىز.</p>`;
}

if (!fs.existsSync(indexPath)) fail(`index missing: ${indexPath}`);
if (!fs.existsSync(postsDir)) fail(`posts dir missing: ${postsDir}`);

const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
if (!index.posts || !Array.isArray(index.posts)) fail('data/index.json format invalid: posts[] missing');

const baseSlug = providedSlug || slugify(title) || `post-${date}-${Date.now().toString().slice(-5)}`;
let slug = baseSlug;
let n = 2;
const existing = new Set(index.posts.map(p => p.slug));
while (existing.has(slug)) {
  slug = `${baseSlug}-${n++}`;
}

const file = `post-${slug}.json`;
const post = {
  title,
  slug,
  date,
  category,
  tags: tagsRaw.split(',').map(s => s.trim()).filter(Boolean),
  description,
  featuredImage,
  contentHtml,
  file
};
if (featuredImagePrompt) post.featuredImagePrompt = featuredImagePrompt;

fs.writeFileSync(path.join(postsDir, file), JSON.stringify(post, null, 2) + '\n');
index.posts.unshift({ ...post });
fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n');

const staticGenerator = path.join(repoRoot, 'scripts', 'generate-static-post-pages.js');
if (fs.existsSync(staticGenerator)) {
  run('node', [path.relative(repoRoot, staticGenerator)]);
}

const gitAddArgs = [
  'add',
  path.relative(repoRoot, indexPath),
  path.relative(repoRoot, path.join(postsDir, file)),
  'p'
];
const featuredImagePath = path.join(repoRoot, featuredImage);
if (featuredImage && !/^https?:\/\//i.test(featuredImage) && fs.existsSync(featuredImagePath)) {
  gitAddArgs.push(path.relative(repoRoot, featuredImagePath));
}
if (fs.existsSync(staticGenerator)) {
  gitAddArgs.push(path.relative(repoRoot, staticGenerator));
}
run('git', gitAddArgs);
run('git', ['commit', '-m', `post: ${title}`]);
runAllowFail('git', ['push', 'origin', 'HEAD'], 'git push failed (continuing). If this environment has no network/DNS, push from a normal terminal.');

console.log('✅ Published:', slug);
console.log('📄 File:', file);
