const musicFiles = import.meta.glob('/static/music/*');
const songs: Record<
	string,
	{ title: string; composer: string; performer?: string; credit?: string }
> = {
	'/static/music/IMSLP707203-PMLP2312-01_Op._9_no._1_B_flat_minor_5_31_.ogg': {
		title: 'Nocturnes, Op.9',
		composer: 'Chopin, Frédéric'
	},
	'/static/music/IMSLP803323-PMLP2598-LISZT.mp3': {
		title: 'Liebesträume No. 3, S.541',
		composer: 'Liszt, Franz',
		performer: 'Luis Kolodin'
	},
	'/static/music/Kimiko Ishizaka - J.S. Bach- -Open- Goldberg Variations, BWV 988 (Piano) - 01 Aria.ogg':
		{
			title: 'Goldberg Variations, BWV 988 (Piano) - 01 Aria',
			composer: 'J.S. Bach',
			performer: 'Kimiko Ishizaka',
			credit:
				'"Open" Goldberg Variations (<a href="https://www.opengoldbergvariations.org" target="_blank">https://www.opengoldbergvariations.org</a>)'
		}
};

let audioElement: HTMLAudioElement | null = null;

export const userLocale = navigator.language || 'es-MX';

const supportedLanguages = ['es', 'en'] as const;
export type Language = (typeof supportedLanguages)[number]; // "es" | "en"

export const baseLanguage: Language = supportedLanguages.includes(
	userLocale.split('-')[0] as Language
)
	? (userLocale.split('-')[0] as Language)
	: 'es'; // Default to "es" if not recognized

async function musicPicker() {
	const keys = Object.keys(musicFiles);
	if (keys.length === 0) return;

	console.log(keys);

	const song = keys[Math.floor(Math.random() * keys.length)];
	return {
		...songs[song],
		url: song.replace('/static', '')
	};
}

export const translations: Record<
	Language,
	{
		helpText: string;
		dateLabel: (date: string) => string;
		about: string;
		cmdNotFound: (cmd: string) => string;
		music: (args: string[]) => string | Promise<string>;
	}
> = {
	es: {
		helpText: "Por favor escribe 'help' para ver los comandos disponibles.",
		dateLabel: (date: string) => `[${date}]`,
		about: 'Soy un ingeniero de software.',
		cmdNotFound: (cmd: string) =>
			`Comando desconocido: ${cmd}. Escribe "help" para ver los comandos disponibles.`,
		music: async (args: string[]) => {
			let song = await musicPicker();
			if (args.includes('--stop')) {
				audioElement?.pause();
				audioElement = null;
				return 'Reproducción detenida.';
			}
			if (args.length > 0) {
				return `Argumento "${args[0]}" desconocido`;
			}

			if (!song) {
				return 'Ocurrió un error.';
			}
			if (audioElement) {
				audioElement.pause();
			}

			audioElement = new Audio(song.url);
			audioElement.play();

			return `Ahora escuchando: ${song.title} | ${song.composer}. Escribe music --stop para detener la reproducción.`;
		}
	},
	en: {
		helpText: "Please type 'help' to see available commands.",
		dateLabel: (date: string) => `[${date}]`,
		about: "I'm a software engineer passionate about complex systems.",
		cmdNotFound: (cmd: string) => `Command not found: ${cmd}. Type "help" for available commands`,
		music: async (args: string[]) => {
			let song = await musicPicker();
			if (args.includes('--stop')) {
				audioElement?.pause();
				audioElement = null;
				return 'Playback stopped.';
			}
			if (args.length > 0) {
				return `Unknown argument "${args[0]}"`;
			}
			if (!song) {
				return 'An unexpected error occured.';
			}
			if (audioElement) {
				audioElement.pause();
			}

			audioElement = new Audio(song.url);
			audioElement.play();

			return `Now playing: ${song.title} | ${song.composer}${song.performer ? ` | Performed by ${song.performer}` : ''}${song.credit ? ` | Credit to ${song.credit}` : ''}. Type music --stop to cease playback.`;
		}
	}
} as const;
