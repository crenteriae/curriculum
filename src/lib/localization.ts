export const userLocale = navigator.language || 'es-MX';

const supportedLanguages = ['es', 'en'] as const;
export type Language = (typeof supportedLanguages)[number]; // "es" | "en"

export const baseLanguage: Language = supportedLanguages.includes(
	userLocale.split('-')[0] as Language
)
	? (userLocale.split('-')[0] as Language)
	: 'es'; // Default to "es" if not recognized

export const translations: Record<
	Language,
	{ helpText: string; dateLabel: (date: string) => string }
> = {
	es: {
		helpText: "Por favor escribe 'help' para ver los comandos disponibles.",
		dateLabel: (date: string) => `[${date}]`
	},
	en: {
		helpText: "Please type 'help' to see the available commands.",
		dateLabel: (date: string) => `[${date}]`
	}
} as const;
