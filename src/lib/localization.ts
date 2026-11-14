export type Language = 'es' | 'en';

const supportedLanguages: readonly Language[] = ['es', 'en'];
const fallbackLanguage: Language = 'es';

export function isLanguage(value: string): value is Language {
	return (supportedLanguages as readonly string[]).includes(value);
}

export function detectLanguage(acceptLanguage: string | null): Language {
	if (!acceptLanguage) return fallbackLanguage;

	const preferred = acceptLanguage
		.split(',')
		.map((entry) => {
			const [tag, ...params] = entry.trim().split(';');
			const q = params.find((p) => p.trim().startsWith('q='));
			return { base: tag.split('-')[0].toLowerCase(), q: q ? Number(q.split('=')[1]) : 1 };
		})
		.sort((a, b) => b.q - a.q);

	return (
		(preferred.find((p) => isLanguage(p.base))?.base as Language | undefined) ?? fallbackLanguage
	);
}
