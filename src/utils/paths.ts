export function withBase(path = '') {
	const base = import.meta.env.BASE_URL;
	const normalized = path.replace(/^\/+/, '');
	return normalized ? `${base}${normalized}` : base;
}

export function stripBase(path = '') {
	const base = import.meta.env.BASE_URL;
	if (!path) return '/';
	if (base === '/') return path;

	const basePrefix = base.endsWith('/') ? base.slice(0, -1) : base;
	return path.startsWith(basePrefix) ? path.slice(basePrefix.length) || '/' : path;
}
