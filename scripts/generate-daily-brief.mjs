import fs from 'node:fs/promises';
import path from 'node:path';
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
	ignoreAttributes: false,
	attributeNamePrefix: '',
	cdataPropName: 'text',
	trimValues: true,
});

const POSTS_DIR = path.join(process.cwd(), 'src', 'content', 'blog');
const ASSETS_DIR = path.join(process.cwd(), 'src', 'assets', 'generated');
const FEED_LOOKBACK_HOURS = Number(process.env.FEED_LOOKBACK_HOURS ?? 240);

const FEEDS = {
	openai: {
		name: 'OpenAI News',
		url: 'https://openai.com/news/rss.xml',
		weight: 5,
	},
	deepmind: {
		name: 'Google DeepMind',
		url: 'https://deepmind.google/blog/rss.xml',
		weight: 5,
	},
	google: {
		name: 'Google Blog',
		url: 'https://blog.google/feed/',
		weight: 4,
	},
	microsoft: {
		name: 'Microsoft Blogs',
		url: 'https://blogs.microsoft.com/feed/',
		weight: 4,
	},
	nvidia: {
		name: 'NVIDIA Blog',
		url: 'https://blogs.nvidia.com/feed/',
		weight: 4,
	},
	aws: {
		name: 'AWS News Blog',
		url: 'https://aws.amazon.com/blogs/aws/feed/',
		weight: 4,
	},
	meta: {
		name: 'Meta News',
		url: 'https://about.fb.com/news/feed/',
		weight: 3,
	},
	bbcBusiness: {
		name: 'BBC Business',
		url: 'http://feeds.bbci.co.uk/news/business/rss.xml',
		weight: 4,
	},
	abcMoney: {
		name: 'ABC News Business',
		url: 'https://feeds.abcnews.com/abcnews/moneyheadlines',
		weight: 4,
	},
	abcPolitics: {
		name: 'ABC News Politics',
		url: 'https://feeds.abcnews.com/abcnews/politicsheadlines',
		weight: 5,
	},
	abcUs: {
		name: 'ABC News US',
		url: 'https://feeds.abcnews.com/abcnews/usheadlines',
		weight: 4,
	},
	xinhuaChina: {
		name: 'Xinhua China',
		url: 'http://www.xinhuanet.com/english/rss/chinarss.xml',
		weight: 4,
	},
	xinhuaBusiness: {
		name: 'Xinhua Business',
		url: 'http://www.xinhuanet.com/english/rss/businessrss.xml',
		weight: 4,
	},
	coindesk: {
		name: 'CoinDesk',
		url: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
		weight: 5,
	},
	kraken: {
		name: 'Kraken Blog',
		url: 'https://blog.kraken.com/feed',
		weight: 3,
	},
};

const CATEGORY_CONFIGS = [
	{
		slug: 'ai',
		category: 'AI',
		filePrefix: 'ai-brief',
		feeds: ['openai', 'deepmind', 'google', 'microsoft', 'nvidia', 'aws', 'meta'],
		keywords: ['ai', 'model', 'models', 'agent', 'agents', 'gpt', 'chatgpt', 'gemini', 'claude', 'llama', 'copilot', 'inference', 'trainium', 'gpu', 'robotics'],
		tags: ['ai', 'models', 'agents'],
	},
	{
		slug: 'international-finance',
		category: 'International Finance',
		filePrefix: 'international-finance-brief',
		feeds: ['bbcBusiness', 'abcMoney', 'xinhuaBusiness'],
		keywords: ['market', 'markets', 'finance', 'financial', 'stocks', 'bank', 'banking', 'economy', 'economic', 'trade', 'tariff', 'inflation', 'investment', 'fund', 'oil', 'currency'],
		tags: ['finance', 'markets', 'economy'],
	},
	{
		slug: 'us-politics',
		category: 'US Politics',
		filePrefix: 'us-politics-brief',
		feeds: ['abcPolitics', 'abcUs'],
		keywords: ['trump', 'biden', 'white house', 'congress', 'senate', 'house', 'court', 'election', 'campaign', 'republican', 'democrat', 'administration', 'federal'],
		tags: ['us-politics', 'washington', 'policy'],
	},
	{
		slug: 'china-finance-politics',
		category: 'China Finance & Politics',
		filePrefix: 'china-finance-politics-brief',
		feeds: ['xinhuaChina', 'xinhuaBusiness'],
		keywords: ['china', 'chinese', 'beijing', 'shanghai', 'yuan', 'renminbi', 'party', 'ministry', 'trade', 'tariff', 'economy', 'economic', 'bank', 'policy'],
		tags: ['china', 'finance', 'politics'],
	},
	{
		slug: 'crypto',
		category: 'Crypto',
		filePrefix: 'crypto-brief',
		feeds: ['coindesk', 'kraken'],
		keywords: ['bitcoin', 'btc', 'ethereum', 'eth', 'crypto', 'cryptocurrency', 'token', 'tokens', 'stablecoin', 'blockchain', 'defi', 'solana', 'sec'],
		tags: ['crypto', 'bitcoin', 'blockchain'],
	},
];

const CATEGORY_SCORES = new Map([
	['company', 4],
	['product', 4],
	['research', 4],
	['publication', 3],
	['global affairs', 3],
	['security', 3],
	['safety', 3],
	['api', 1],
]);

const DISPLAY_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
	month: 'long',
	day: 'numeric',
	year: 'numeric',
});

function getLocalDateString(date = new Date()) {
	const year = date.getFullYear();
	const month = `${date.getMonth() + 1}`.padStart(2, '0');
	const day = `${date.getDate()}`.padStart(2, '0');
	return `${year}-${month}-${day}`;
}

function getPublishDate() {
	return process.env.BRIEF_DATE ?? getLocalDateString(new Date());
}

function getYesterdayWindow(publishDate) {
	const publishStart = new Date(`${publishDate}T00:00:00`);
	const windowEnd = publishStart;
	const windowStart = new Date(publishStart);
	windowStart.setDate(windowStart.getDate() - 1);
	return { windowStart, windowEnd };
}

function toArray(value) {
	if (!value) return [];
	return Array.isArray(value) ? value : [value];
}

function decodeHtml(text) {
	return text
		.replace(/<!\[CDATA\[|\]\]>/g, '')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/\s+/g, ' ')
		.trim();
}

function trimSentence(text, maxLength = 220) {
	if (!text) return '';
	if (text.length <= maxLength) return text;
	const shortened = text.slice(0, maxLength).replace(/\s+\S*$/, '');
	return `${shortened}.`;
}

function wrapSvgText(text, width = 24) {
	const words = text.split(/\s+/);
	const lines = [];
	let current = '';

	for (const word of words) {
		const proposal = current ? `${current} ${word}` : word;
		if (proposal.length > width && current) {
			lines.push(current);
			current = word;
		} else {
			current = proposal;
		}
	}

	if (current) lines.push(current);
	return lines.slice(0, 3);
}

function yamlString(value) {
	return JSON.stringify(value);
}

function scoreText(text, keywords) {
	const haystack = text.toLowerCase();
	let score = 0;

	for (const keyword of keywords) {
		if (haystack.includes(keyword.toLowerCase())) {
			score += keyword.length > 6 ? 3 : 2;
		}
	}

	return score;
}

function parseItem(rawItem, feedKey) {
	const feed = FEEDS[feedKey];
	const title = decodeHtml(rawItem.title?.text ?? rawItem.title ?? '');
	const description = decodeHtml(rawItem.description?.text ?? rawItem.description ?? rawItem.summary?.text ?? rawItem.summary ?? '');
	const link = rawItem.link?.href ?? rawItem.link?.text ?? rawItem.link ?? rawItem.guid?.text ?? rawItem.guid ?? '';
	const pubDate = new Date(rawItem.pubDate ?? rawItem.published ?? rawItem.updated ?? '');
	const categories = toArray(rawItem.category).map((entry) => decodeHtml(entry?.text ?? entry ?? ''));

	if (!title || !link || Number.isNaN(pubDate.valueOf())) {
		return null;
	}

	return {
		title,
		description,
		link,
		pubDate,
		categories,
		source: feed.name,
		feedKey,
		baseWeight: feed.weight,
	};
}

async function fetchFeed(feedKey) {
	const response = await fetch(FEEDS[feedKey].url, {
		headers: {
			'user-agent': 'SignalLayerBot/1.0 (+https://huangstephen3.github.io/blog/)',
		},
	});

	if (!response.ok) {
		throw new Error(`${feedKey} returned ${response.status}`);
	}

	const xml = await response.text();
	const parsed = parser.parse(xml);
	const channel = parsed?.rss?.channel ?? parsed?.feed;
	const items = toArray(channel?.item ?? channel?.entry);

	return items
		.map((item) => parseItem(item, feedKey))
		.filter(Boolean)
		.filter((item) => (Date.now() - item.pubDate.valueOf()) / (1000 * 60 * 60) <= FEED_LOOKBACK_HOURS);
}

function dedupeItems(items) {
	const seen = new Set();
	return items.filter((item) => {
		const key = `${item.title.toLowerCase()}::${item.link}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}

function categoryScore(item, config, windowStart, windowEnd) {
	const text = `${item.title} ${item.description} ${item.categories.join(' ')}`.toLowerCase();
	const keywordScore = scoreText(text, config.keywords);
	const categoryBonus = item.categories.reduce(
		(total, category) => total + (CATEGORY_SCORES.get(category.toLowerCase()) ?? 0),
		0,
	);

	if (keywordScore === 0 && categoryBonus === 0) {
		return Number.NEGATIVE_INFINITY;
	}

	let penalty = 0;
	if (/^how\b/i.test(item.title)) penalty += 3;
	if (/weekly roundup/i.test(item.title)) penalty += 4;
	if (/customer|case study/i.test(item.title)) penalty += 2;
	if (/video|podcast/i.test(item.title)) penalty += 2;
	if (/available for trading|asset listings/i.test(item.title)) penalty += 6;
	if (/recall|rearview camera|down payment|blackout/i.test(item.title)) penalty += 6;

	const inWindow = item.pubDate >= windowStart && item.pubDate < windowEnd;
	const freshness = inWindow ? 2 : 0;

	return item.baseWeight + keywordScore + categoryBonus + freshness - penalty;
}

function selectCategoryItems(items, config, windowStart, windowEnd) {
	const scored = items
		.filter((item) => config.feeds.includes(item.feedKey))
		.map((item) => ({ ...item, score: categoryScore(item, config, windowStart, windowEnd) }))
		.filter((item) => item.score >= 6)
		.sort((a, b) => b.score - a.score || b.pubDate.valueOf() - a.pubDate.valueOf());

	const inWindow = scored.filter((item) => item.pubDate >= windowStart && item.pubDate < windowEnd);
	if (inWindow.length > 0) {
		return inWindow.slice(0, 4);
	}

	return scored.slice(0, 3);
}

function importanceLine(category, item) {
	const text = `${item.title} ${item.description}`.toLowerCase();

	if (category === 'AI') {
		return text.includes('agent')
			? 'This matters because the market is moving from model demos toward workflow automation and agent products.'
			: 'This matters because frontier model and platform updates change the pace of product development across the AI stack.';
	}

	if (category === 'International Finance') {
		return 'This matters because shifts in markets, policy, and capital flows tend to ripple quickly across equities, currencies, and risk appetite.';
	}

	if (category === 'US Politics') {
		return 'This matters because federal policy moves shape regulation, trade, fiscal decisions, and the business environment well beyond Washington.';
	}

	if (category === 'China Finance & Politics') {
		return 'This matters because Beijing policy, domestic growth signals, and trade posture affect supply chains, regional markets, and global capital expectations.';
	}

	return 'This matters because crypto markets move on regulation, exchange behavior, token flows, and platform credibility at the same time.';
}

function buildDescription(category, items, dateLabel) {
	if (items.length === 0) {
		return `${category} Brief for ${dateLabel}, with no high-signal items found in the previous-day window from the configured feeds.`;
	}

	return trimSentence(
		`${category} Brief covering ${items
			.slice(0, 2)
			.map((item) => item.title)
			.join('; ')}.`,
		155,
	);
}

function buildCoverSvg({ category, dateLabel, sources }) {
	const titleLines = wrapSvgText(`${category} Brief`, 18);
	const sourceLines = wrapSvgText(sources.join(' · '), 42);

	return `<svg width="1600" height="900" viewBox="0 0 1600 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1600" height="900" fill="#06101A"/>
  <rect x="56" y="56" width="1488" height="788" rx="32" fill="#0C1726" stroke="#24354A"/>
  <path d="M56 252H1544" stroke="#21354C" stroke-width="2"/>
  <circle cx="128" cy="154" r="10" fill="#8EF7FF"/>
  <circle cx="164" cy="154" r="10" fill="#37E5CB"/>
  <circle cx="200" cy="154" r="10" fill="#818CF8"/>
  <text x="112" y="360" fill="#8EF7FF" font-family="Arial, sans-serif" font-size="24" letter-spacing="6">DAILY CATEGORY BRIEF</text>
  ${titleLines
		.map(
			(line, index) =>
				`<text x="112" y="${448 + index * 92}" fill="#ECF7FF" font-family="Arial, sans-serif" font-size="84" font-weight="700">${line}</text>`,
		)
		.join('')}
  <text x="112" y="694" fill="#94AFC5" font-family="Arial, sans-serif" font-size="32">${dateLabel}</text>
  <rect x="972" y="154" width="436" height="548" rx="28" fill="#101F32" stroke="#31465E"/>
  <text x="1024" y="240" fill="#37E5CB" font-family="Arial, sans-serif" font-size="24" letter-spacing="4">SOURCES</text>
  ${sourceLines
		.map(
			(line, index) =>
				`<text x="1024" y="${330 + index * 56}" fill="#ECF7FF" font-family="Arial, sans-serif" font-size="34">${line}</text>`,
		)
		.join('')}
  <path d="M1024 560H1356" stroke="#2A3E57" stroke-width="18" stroke-linecap="round"/>
  <path d="M1024 616H1300" stroke="#2A3E57" stroke-width="18" stroke-linecap="round"/>
  <path d="M1024 672H1248" stroke="#2A3E57" stroke-width="18" stroke-linecap="round"/>
</svg>
`;
}

function buildPostMarkdown(config, items, publishDate, dateLabel, assetFileName) {
	const title = `${config.category} Brief: ${dateLabel}`;
	const description = buildDescription(config.category, items, dateLabel);

	const sections =
		items.length === 0
			? `No high-signal items surfaced in the configured previous-day window for this category. The automation checked the public feeds assigned to ${config.category} and found nothing worth promoting above threshold.\n`
			: items
					.map(
						(item, index) => `## ${index + 1}. ${item.title}

**Source:** [${item.source}](${item.link})  
**Published:** ${DISPLAY_DATE_FORMATTER.format(item.pubDate)}

${trimSentence(item.description || item.title, 260)}

**Why it matters:** ${importanceLine(config.category, item)}
`,
					)
					.join('\n');

	return `---
title: ${yamlString(title)}
description: ${yamlString(description)}
pubDate: ${publishDate}
draft: false
featured: ${config.slug === 'ai' ? 'true' : 'false'}
premium: false
category: ${yamlString(config.category)}
tags:
${['daily-brief', ...config.tags].map((tag) => `  - ${tag}`).join('\n')}
heroImage: ${yamlString(`../../assets/generated/${assetFileName}`)}
---

This category brief is generated automatically at 8 AM from public RSS feeds, summarizing the most important items published during the previous day.

## Window covered

- Publish date: ${dateLabel}
- Summary window: the previous local calendar day

${sections}
`;
}

async function resetFeaturedFlags() {
	const files = await fs.readdir(POSTS_DIR);
	await Promise.all(
		files
			.filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
			.map(async (file) => {
				const filePath = path.join(POSTS_DIR, file);
				const content = await fs.readFile(filePath, 'utf8');
				const nextContent = content.replace(/^featured:\s*true$/m, 'featured: false');
				if (nextContent !== content) {
					await fs.writeFile(filePath, nextContent, 'utf8');
				}
			}),
	);
}

async function removeLegacyCombinedBrief(publishDate) {
	const legacyPost = path.join(POSTS_DIR, `daily-ai-brief-${publishDate}.md`);
	const legacyAsset = path.join(ASSETS_DIR, `daily-ai-brief-${publishDate}.svg`);

	await fs.rm(legacyPost, { force: true });
	await fs.rm(legacyAsset, { force: true });
}

async function main() {
	const publishDate = getPublishDate();
	const { windowStart, windowEnd } = getYesterdayWindow(publishDate);
	const dateLabel = DISPLAY_DATE_FORMATTER.format(new Date(`${publishDate}T08:00:00`));

	await fs.mkdir(ASSETS_DIR, { recursive: true });
	await removeLegacyCombinedBrief(publishDate);

	const feedKeys = Array.from(new Set(CATEGORY_CONFIGS.flatMap((config) => config.feeds)));
	const settled = await Promise.allSettled(feedKeys.map((feedKey) => fetchFeed(feedKey)));
	const feedItems = settled.flatMap((result) => (result.status === 'fulfilled' ? result.value : []));
	const dedupedItems = dedupeItems(feedItems);

	await resetFeaturedFlags();

	for (const config of CATEGORY_CONFIGS) {
		const items = selectCategoryItems(dedupedItems, config, windowStart, windowEnd);
		const sources = Array.from(new Set(items.map((item) => item.source))).slice(0, 4);
		const assetFileName = `${config.filePrefix}-${publishDate}.svg`;
		const postFileName = `${config.filePrefix}-${publishDate}.md`;
		const coverSvg = buildCoverSvg({
			category: config.category,
			dateLabel,
			sources: sources.length > 0 ? sources : config.feeds.map((feedKey) => FEEDS[feedKey].name).slice(0, 2),
		});
		const markdown = buildPostMarkdown(config, items, publishDate, dateLabel, assetFileName);

		await fs.writeFile(path.join(ASSETS_DIR, assetFileName), coverSvg, 'utf8');
		await fs.writeFile(path.join(POSTS_DIR, postFileName), markdown, 'utf8');
	}

	console.log(`Generated category briefs for ${publishDate}`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
