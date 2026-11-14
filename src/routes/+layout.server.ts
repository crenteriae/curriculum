import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals, setHeaders }) => {
	setHeaders({ vary: 'Accept-Language' });
	return { lang: locals.lang };
};
