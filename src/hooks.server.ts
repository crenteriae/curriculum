import type { Handle } from '@sveltejs/kit/hooks';
import { detectLanguage } from '#lib/localization.ts';

export const handle: Handle = async ({ event, resolve }) => {
	const lang = detectLanguage(event.request.headers.get('accept-language'));
	event.locals.lang = lang;

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', lang)
	});
};
