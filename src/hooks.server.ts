import type { Handle } from '@sveltejs/kit/hooks';
import { detectLanguage, isLanguage } from '#lib/localization.ts';

export const handle: Handle = async ({ event, resolve }) => {
	const savedLanguage = event.cookies.get('lang') ?? '';
	const lang = isLanguage(savedLanguage)
		? savedLanguage
		: detectLanguage(event.request.headers.get('accept-language'));
	event.locals.lang = lang;

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', lang)
	});
};
