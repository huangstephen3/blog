export const SITE_TITLE = 'Freedidi 风格资源博客';
export const SITE_DESCRIPTION = '一个尽可能免费、外网可访问、支持无密码登录的个人资源博客。';
export const SITE_TAGLINE = '资源整理、经验文章、会员入口和自动部署，一次搭好。';
export const SITE_AUTHOR = 'Stephen';
export const SITE_LANG = 'zh-CN';

export const NAV_LINKS = [
	{ href: '/', label: '首页' },
	{ href: '/blog/', label: '免费资源' },
	{ href: '/vip/', label: '会员专区' },
	{ href: '/about/', label: '关于本站' },
];

export const HOME_FEATURES = [
	{
		title: '资源站形态',
		description: '首页是双栏布局，文章卡片、分类、标签和侧边栏都偏向资源站的阅读方式。',
	},
	{
		title: '无密码登录',
		description: '通过 Supabase Magic Link 登录，不在 GitHub Pages 上直接收集密码。',
	},
	{
		title: '自动发布',
		description: '每次推送到 GitHub 的 main 分支后，站点会自动构建并发布到外网。',
	},
];

export const MEMBER_BENEFITS = [
	'查看会员导航页和专属推荐',
	'为后续接入私密资源、收藏夹和下载记录留好位置',
	'可以继续扩展成付费会员、投稿、评论和通知系统',
];

export const STARTER_STEPS = [
	'修改 `src/consts.ts` 里的站点标题和描述。',
	'在 Supabase 创建项目并填入 `.env` 环境变量。',
	'运行 `npm run dev` 本地预览站点。',
	'推送到 GitHub，让 Actions 自动部署到外网。',
];
