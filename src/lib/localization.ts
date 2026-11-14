import { translations } from './content';
import type { Language } from './content';

const supportedLanguages = ['es', 'en'] as const;

export const userLocale = navigator.language || 'es-MX';

export const baseLanguage: Language = supportedLanguages.includes(
	userLocale.split('-')[0] as Language
)
	? (userLocale.split('-')[0] as Language)
	: 'es';

export { translations };
export type { Language };
