export const SITE_TITLE = 'Stephen AI Dispatch';
export const SITE_DESCRIPTION = '一个面向中文读者的 AI 科技新闻站，追踪模型发布、产品动作、公司动态与真实落地信号。';
export const SITE_TAGLINE = '每天筛选最值得看的 AI 新闻，把噪音压缩成可读、可转发、可行动的情报。';
export const SITE_AUTHOR = 'Stephen';
export const SITE_LANG = 'zh-CN';

export const NAV_LINKS = [
	{ href: '/', label: '首页' },
	{ href: '/blog/', label: 'AI快讯' },
	{ href: '/vip/', label: '订阅计划' },
	{ href: '/about/', label: '编辑室' },
];

export const HOME_FEATURES = [
	{
		title: '每日快讯',
		description: '把每天的 AI 发布、融资、模型更新和平台动作整理成高密度新闻流。',
	},
	{
		title: '编辑筛选',
		description: '不追求机械搬运，而是筛选真正有价值的产品信号与产业影响。',
	},
	{
		title: '订阅读者',
		description: '站点已经接好登录与订阅入口，后续可以扩展成会员简报与专属栏目。',
	},
];

export const MEMBER_BENEFITS = [
	'每天收到一篇精编 AI 快讯或晨报',
	'获取模型、工具、融资与政策信号的专题整理',
	'为后续扩展成邮件订阅、会员专栏和资料库预留空间',
];

export const STARTER_STEPS = [
	'把 Supabase 登录和 GitHub Pages 保持在线，确保编辑后台可用。',
	'运行 `npm run new-post -- 文章标题` 创建新文章草稿。',
	'把每日 AI 新闻整理成一篇 Markdown 发布到 `src/content/blog/`。',
	'持续优化栏目、标签和订阅计划，让站点越来越像你的 AI 编辑品牌。',
];
