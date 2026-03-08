export const LOCALES = [
	{ code: 'en', label: 'English', lang: 'en-US' },
	{ code: 'zh-cn', label: '简体中文', lang: 'zh-CN' },
	{ code: 'zh-tw', label: '繁體中文', lang: 'zh-TW' },
	{ code: 'fr', label: 'Français', lang: 'fr-FR' },
	{ code: 'ja', label: '日本語', lang: 'ja-JP' },
	{ code: 'es', label: 'Español', lang: 'es-ES' },
] as const;

export type LocaleCode = (typeof LOCALES)[number]['code'];

export const DEFAULT_LOCALE: LocaleCode = 'en';

const localeMap = new Map(LOCALES.map((locale) => [locale.code, locale]));

export function isLocale(value: string): value is LocaleCode {
	return localeMap.has(value as LocaleCode);
}

export function getLocale(code: string) {
	return localeMap.get(code as LocaleCode) ?? localeMap.get(DEFAULT_LOCALE)!;
}

export function localePath(locale: string, path = '') {
	const normalized = path.replace(/^\/+/, '');
	if (!normalized) {
		return locale === DEFAULT_LOCALE ? '/' : `/${locale}/`;
	}
	return locale === DEFAULT_LOCALE ? `/${normalized}` : `/${locale}/${normalized}`;
}

export function switchLocalePath(pathname: string, targetLocale: string) {
	const clean = pathname.replace(/\/+/g, '/');
	const parts = clean.split('/').filter(Boolean);
	const hasLocale = parts[0] && isLocale(parts[0]);
	const remainderParts = hasLocale ? parts.slice(1) : parts;

	if (remainderParts.length === 0) {
		return localePath(targetLocale);
	}

	// Only localized home and blog routes exist; fall back to locale home elsewhere.
	if (remainderParts[0] !== 'blog') {
		return localePath(targetLocale);
	}

	const remainder = remainderParts.join('/');
	return localePath(targetLocale, clean.endsWith('/') ? `${remainder}/` : remainder);
}

const messages = {
	en: {
		mini: 'Independent AI Signal Desk',
		nav: { home: 'Home', briefs: 'Briefs', membership: 'Membership', about: 'About' },
		readerHub: 'Reader Hub',
		login: 'Log In',
		signedIn: 'Signed In',
		footerCopy:
			'An independent AI newsroom tracking model launches, platform shifts, infrastructure bets, and the signals shaping the next computing cycle.',
		footerBriefs: 'Briefs',
		archiveEyebrow: 'News Archive',
		archiveTitle: 'Multi-language Brief Archive',
		archiveDescription: 'Daily category briefings and editorial posts, filtered to the current language.',
		featuredBrief: 'Featured Brief',
		todaySignal: "Today's signal feed",
		browseBriefs: 'Browse all briefs',
		publishedCount: 'Published',
		tracksCount: 'Tracks',
		premiumCount: 'Premium',
		dailySignalFeed: 'Daily Signal Feed',
		searchPlaceholder: 'Search models, companies, products, or topics',
		subscriberPreview: 'Subscriber Preview',
		readersClubLabel: 'Readers Club',
		readersClub: 'Turn the site into a real reader product',
		readersClubCopy:
			'The login layer is already live. From here, it can grow into email briefings, premium notes, saved reads, and a proper subscriber experience.',
		enterReaderHub: 'Enter reader hub',
		editorialSpineLabel: 'Editorial Spine',
		editorialSpine: 'Editorial spine',
		subscriptionLabel: 'Subscription',
		memberBenefits: 'What members get',
		coverageLabel: 'Coverage',
		coverageMap: 'Coverage map',
		signalTagsLabel: 'Signal Tags',
		recurringTopics: 'Recurring topics',
		signalNotes: 'Signal Notes',
		signalNoteItems: [
			'Each brief is written as an editor-led summary, not a scraped headline dump.',
			'Localized versions are generated automatically from the same source set each morning.',
			'Reader login uses Magic Link, so the subscriber layer can stay lightweight.',
		],
		updated: 'Updated',
	},
	'zh-cn': {
		mini: '独立 AI 信号编辑台',
		nav: { home: '首页', briefs: '快讯', membership: '会员', about: '关于' },
		readerHub: '读者中心',
		login: '登录',
		signedIn: '已登录',
		footerCopy: '一个独立运营的 AI 新闻站，追踪模型发布、平台变化、基础设施投入以及影响下一轮计算浪潮的关键信号。',
		footerBriefs: '快讯',
		archiveEyebrow: '新闻归档',
		archiveTitle: '多语言简报归档',
		archiveDescription: '按照当前语言筛选的每日分类简报与编辑文章。',
		featuredBrief: '重点简报',
		todaySignal: '今日情报流',
		browseBriefs: '查看全部简报',
		publishedCount: '已发布',
		tracksCount: '栏目',
		premiumCount: '会员',
		dailySignalFeed: '每日情报流',
		searchPlaceholder: '搜索模型、公司、产品或主题',
		subscriberPreview: '会员预告',
		readersClubLabel: '读者中心',
		readersClub: '把网站变成真正的读者产品',
		readersClubCopy: '登录层已经接好，后续可以自然扩展到邮件简报、会员笔记、收藏夹和订阅体系。',
		enterReaderHub: '进入读者中心',
		editorialSpineLabel: '编辑主轴',
		editorialSpine: '编辑主轴',
		subscriptionLabel: '订阅',
		memberBenefits: '订阅读者将获得',
		coverageLabel: '覆盖范围',
		coverageMap: '栏目地图',
		signalTagsLabel: '信号标签',
		recurringTopics: '高频主题',
		signalNotes: '编辑注',
		signalNoteItems: [
			'每篇简报都以编辑整理为核心，而不是简单抓取标题。',
			'多语言版本会在每天早上自动从同一批新闻源生成。',
			'读者登录使用 Magic Link，会员层可以保持轻量。',
		],
		updated: '更新于',
	},
	'zh-tw': {
		mini: '獨立 AI 訊號編輯台',
		nav: { home: '首頁', briefs: '快訊', membership: '會員', about: '關於' },
		readerHub: '讀者中心',
		login: '登入',
		signedIn: '已登入',
		footerCopy: '一個獨立運營的 AI 新聞站，追蹤模型發佈、平台變化、基礎設施投入，以及影響下一輪運算浪潮的關鍵訊號。',
		footerBriefs: '快訊',
		archiveEyebrow: '新聞歸檔',
		archiveTitle: '多語簡報歸檔',
		archiveDescription: '依照目前語言篩選的每日分類簡報與編輯文章。',
		featuredBrief: '重點簡報',
		todaySignal: '今日情報流',
		browseBriefs: '查看全部簡報',
		publishedCount: '已發布',
		tracksCount: '欄目',
		premiumCount: '會員',
		dailySignalFeed: '每日情報流',
		searchPlaceholder: '搜尋模型、公司、產品或主題',
		subscriberPreview: '會員預告',
		readersClubLabel: '讀者中心',
		readersClub: '把網站做成真正的讀者產品',
		readersClubCopy: '登入層已經接好，後續可以自然擴展成郵件簡報、會員筆記、收藏清單與訂閱體系。',
		enterReaderHub: '進入讀者中心',
		editorialSpineLabel: '編輯主軸',
		editorialSpine: '編輯主軸',
		subscriptionLabel: '訂閱',
		memberBenefits: '訂閱讀者可獲得',
		coverageLabel: '覆蓋範圍',
		coverageMap: '欄目地圖',
		signalTagsLabel: '訊號標籤',
		recurringTopics: '高頻主題',
		signalNotes: '編輯註',
		signalNoteItems: [
			'每篇簡報都以編輯整理為核心，而不是單純搬運標題。',
			'多語版本會在每天早上自動從同一批新聞源生成。',
			'讀者登入採用 Magic Link，會員層可以保持輕量。',
		],
		updated: '更新於',
	},
	fr: {
		mini: "Rédaction indépendante des signaux IA",
		nav: { home: 'Accueil', briefs: 'Briefs', membership: 'Abonnement', about: 'À propos' },
		readerHub: 'Espace lecteur',
		login: 'Connexion',
		signedIn: 'Connecté',
		footerCopy:
			'Une rédaction indépendante consacrée à l’IA, qui suit les lancements de modèles, les mouvements de plateformes, les paris sur l’infrastructure et les signaux qui façonnent la prochaine vague informatique.',
		footerBriefs: 'Briefs',
		archiveEyebrow: 'Archive',
		archiveTitle: 'Archive multilingue',
		archiveDescription: 'Briefs quotidiens par catégorie et articles éditoriaux filtrés selon la langue active.',
		featuredBrief: 'Brief principal',
		todaySignal: 'Le flux du jour',
		browseBriefs: 'Voir tous les briefs',
		publishedCount: 'Publiés',
		tracksCount: 'Rubriques',
		premiumCount: 'Premium',
		dailySignalFeed: 'Flux quotidien',
		searchPlaceholder: 'Rechercher des modèles, entreprises, produits ou sujets',
		subscriberPreview: 'Aperçu abonnés',
		readersClubLabel: 'Club lecteurs',
		readersClub: 'Transformer le site en vrai produit lecteur',
		readersClubCopy:
			'La couche de connexion est déjà en place. Elle peut ensuite évoluer vers des briefings email, des notes premium, des lectures sauvegardées et un vrai produit d’abonnement.',
		enterReaderHub: 'Ouvrir l’espace lecteur',
		editorialSpineLabel: 'Colonne éditoriale',
		editorialSpine: 'Colonne éditoriale',
		subscriptionLabel: 'Abonnement',
		memberBenefits: 'Ce que les abonnés obtiennent',
		coverageLabel: 'Couverture',
		coverageMap: 'Carte de couverture',
		signalTagsLabel: 'Tags signal',
		recurringTopics: 'Thèmes récurrents',
		signalNotes: 'Notes éditoriales',
		signalNoteItems: [
			'Chaque brief est rédigé comme une synthèse éditoriale, pas comme une simple reprise de titres.',
			'Les versions multilingues sont générées automatiquement chaque matin à partir des mêmes sources.',
			'La connexion lecteur reste légère grâce au Magic Link.',
		],
		updated: 'Mis à jour',
	},
	ja: {
		mini: '独立系AIシグナル編集室',
		nav: { home: 'ホーム', briefs: 'ブリーフ', membership: 'メンバー', about: '概要' },
		readerHub: '読者ハブ',
		login: 'ログイン',
		signedIn: 'ログイン済み',
		footerCopy:
			'モデル公開、プラットフォーム変化、インフラ投資、そして次の計算波を形づくるシグナルを追う独立系AIニュースルームです。',
		footerBriefs: 'ブリーフ',
		archiveEyebrow: 'ニュースアーカイブ',
		archiveTitle: '多言語ブリーフアーカイブ',
		archiveDescription: '現在の言語で絞り込まれた日次カテゴリー別ブリーフと編集記事。',
		featuredBrief: '注目ブリーフ',
		todaySignal: '今日のシグナル',
		browseBriefs: 'すべてのブリーフを見る',
		publishedCount: '公開本数',
		tracksCount: 'カテゴリ',
		premiumCount: '会員',
		dailySignalFeed: 'デイリーシグナル',
		searchPlaceholder: 'モデル、企業、製品、トピックを検索',
		subscriberPreview: '会員向け予告',
		readersClubLabel: '読者クラブ',
		readersClub: 'サイトを本物の読者プロダクトへ',
		readersClubCopy:
			'ログイン層はすでに接続済みです。ここからメール速報、会員ノート、保存リスト、購読体験へ広げられます。',
		enterReaderHub: '読者ハブへ',
		editorialSpineLabel: '編集の軸',
		editorialSpine: '編集の軸',
		subscriptionLabel: '購読',
		memberBenefits: '会員が得られるもの',
		coverageLabel: 'カバレッジ',
		coverageMap: 'カバレッジマップ',
		signalTagsLabel: 'シグナルタグ',
		recurringTopics: '頻出テーマ',
		signalNotes: '編集メモ',
		signalNoteItems: [
			'各ブリーフは単なる見出し収集ではなく、編集整理を前提に作られています。',
			'多言語版は毎朝、同じニュースソースから自動生成されます。',
			'読者ログインは Magic Link なので会員層を軽量に保てます。',
		],
		updated: '更新',
	},
	es: {
		mini: 'Mesa independiente de señales de IA',
		nav: { home: 'Inicio', briefs: 'Briefs', membership: 'Membresía', about: 'Acerca de' },
		readerHub: 'Centro de lectores',
		login: 'Iniciar sesión',
		signedIn: 'Conectado',
		footerCopy:
			'Una sala de redacción independiente sobre IA que sigue lanzamientos de modelos, movimientos de plataforma, apuestas de infraestructura y las señales que moldean la próxima ola de computación.',
		footerBriefs: 'Briefs',
		archiveEyebrow: 'Archivo',
		archiveTitle: 'Archivo multilingüe',
		archiveDescription: 'Briefs diarios por categoría y artículos editoriales filtrados por el idioma actual.',
		featuredBrief: 'Brief destacado',
		todaySignal: 'La señal del día',
		browseBriefs: 'Ver todos los briefs',
		publishedCount: 'Publicados',
		tracksCount: 'Secciones',
		premiumCount: 'Premium',
		dailySignalFeed: 'Señal diaria',
		searchPlaceholder: 'Buscar modelos, empresas, productos o temas',
		subscriberPreview: 'Avance para miembros',
		readersClubLabel: 'Club de lectores',
		readersClub: 'Convierte el sitio en un verdadero producto para lectores',
		readersClubCopy:
			'La capa de acceso ya está activa. Desde aquí puede crecer hacia emails diarios, notas premium, lecturas guardadas y una experiencia real de suscripción.',
		enterReaderHub: 'Entrar al centro de lectores',
		editorialSpineLabel: 'Columna editorial',
		editorialSpine: 'Eje editorial',
		subscriptionLabel: 'Membresía',
		memberBenefits: 'Lo que reciben los miembros',
		coverageLabel: 'Cobertura',
		coverageMap: 'Mapa de cobertura',
		signalTagsLabel: 'Etiquetas señal',
		recurringTopics: 'Temas recurrentes',
		signalNotes: 'Notas editoriales',
		signalNoteItems: [
			'Cada brief se redacta como un resumen editorial, no como un volcado de titulares.',
			'Las versiones multilingües se generan automáticamente cada mañana a partir del mismo conjunto de fuentes.',
			'El acceso de lectores usa Magic Link para mantener ligera la capa de membresía.',
		],
		updated: 'Actualizado',
	},
} as const;

export function getMessages(locale: string) {
	return messages[(isLocale(locale) ? locale : DEFAULT_LOCALE) as keyof typeof messages] ?? messages.en;
}
