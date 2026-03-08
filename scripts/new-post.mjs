import fs from 'node:fs';
import path from 'node:path';

const rawTitle = process.argv.slice(2).join(' ').trim();

if (!rawTitle) {
	console.error('Usage: npm run new-post -- "Story Title"');
	process.exit(1);
}

const slug = rawTitle
	.toLowerCase()
	.normalize('NFKD')
	.replace(/[\u0300-\u036f]/g, '')
	.replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
	.replace(/^-+|-+$/g, '');

const postsDir = path.join(process.cwd(), 'src', 'content', 'blog');
const filePath = path.join(postsDir, `${slug}.md`);

if (fs.existsSync(filePath)) {
	console.error(`File already exists: ${filePath}`);
	process.exit(1);
}

const pubDate = new Date().toISOString().slice(0, 10);

const template = `---
title: ${rawTitle}
description: Summarize the story in one sentence
pubDate: ${pubDate}
draft: true
featured: false
premium: false
category: AI Briefs
tags:
  - ai
---

Start writing here.
`;

fs.writeFileSync(filePath, template, 'utf8');
console.log(`Created ${filePath}`);
