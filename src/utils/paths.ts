export function withBase(path = '') {
	const base = import.meta.env.BASE_URL;
	const normalized = path.replace(/^\/+/, '');
	return normalized ? `${base}${normalized}` : base;
}
