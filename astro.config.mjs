// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

const repository = process.env.GITHUB_REPOSITORY ?? '';
const [owner = '', repo = ''] = repository.split('/');
const inferredSite = owner ? `https://${owner}.github.io` : 'https://example.com';
const inferredBase = repo && repo !== `${owner}.github.io` ? `/${repo}` : '/';

/**
 * @param {string} base
 */
function normalizeBase(base) {
	if (!base || base === '/') {
		return '/';
	}

	const withLeadingSlash = base.startsWith('/') ? base : `/${base}`;
	return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
}

const site = process.env.SITE_URL || inferredSite;
const base = normalizeBase(process.env.BASE_PATH || inferredBase);

export default defineConfig({
	site,
	base,
	output: 'static',
	integrations: [mdx(), sitemap()],
});
