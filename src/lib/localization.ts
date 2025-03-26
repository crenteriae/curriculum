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
	{
		helpText: string;
		dateLabel: (date: string) => string;
		about: string;
		cmdNotFound: (cmd: string) => string;
		music: (args: string[]) => string;
	}
> = {
	es: {
		helpText: "Por favor escribe 'help' para ver los comandos disponibles.",
		dateLabel: (date: string) => `[${date}]`,
		about: 'Soy un ingeniero de software.',
		cmdNotFound: (cmd: string) =>
			`Comando desconocido: ${cmd}. Escribe "help" para ver los comandos disponibles.`,
		music: (args: string[]) => {
			let song = '';
			return `Ahora escuchando: ${song}. Escribe music --stop para detener la reproducción.`;
		}
	},
	en: {
		helpText: "Please type 'help' to see available commands.",
		dateLabel: (date: string) => `[${date}]`,
		about: "I'm a software engineer passionate about complex systems.",
		cmdNotFound: (cmd: string) => `Command not found: ${cmd}. Type "help" for available commands`,
		music: (args: string[]) => {
			let song = '';
			return `Now playing: ${song}. Type music --stop to cease playback.`;
		}
	}
} as const;
