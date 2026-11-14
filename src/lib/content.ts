import type { Language } from './localization';
import { replaceSpotify } from './tools';

import aboutEnRaw from './content/en/about.txt?raw';
import aboutEsRaw from './content/es/about.txt?raw';

export const translations = {
	es: {
		title: 'César Rentería — Ingeniero de software',
		description: aboutEsRaw.replace('{{spotify}}', 'Spotify').trim(),
		helpText: "Por favor escribe 'help' para ver los comandos disponibles.",
		dateLabel: (date: string) => `[${date}]`,
		nav: {
			about: 'Acerca de',
			experience: 'Experiencia',
			skills: 'Habilidades',
			contact: 'Contacto',
			music: 'Música',
			cv: 'CV'
		},
		about: replaceSpotify(aboutEsRaw),
		contact: {
			email: 'Correo: ',
			location: 'Ubicación: ',
			website: 'Sitio web: '
		},
		cmdNotFound: (cmd: string) =>
			`Comando desconocido: ${cmd}. Escribe "help" para ver los comandos disponibles.`,
		experience: {
			header: 'EXPERIENCIA (escribe "experience <n>" para detalle, "experience all" para todo)',
			notFound: (arg: string, n: number) => `Rol no encontrado: ${arg}. Usa 1-${n} o "all".`
		},
		skills: {
			usage: (categories: string[]) =>
				`Uso: skills [all|${categories.join('|')}].\nCategorías: ${categories.join(', ')}.\nPrueba "skills all" para ver todo.`,
			notFound: (arg: string, categories: string[]) =>
				`Categoría desconocida: ${arg}. Usa ${categories.join(', ')}.`
		},
		music: {
			stopped: 'Reproducción detenida.',
			unknownArg: (arg: string) => `Argumento "${arg}" desconocido.`,
			error: 'Ocurrió un error.',
			blocked: 'El navegador bloqueó la reproducción. Inténtalo de nuevo.',
			nowPlaying: 'Ahora escuchando: ',
			performedBy: ' | Interpretado por ',
			creditTo: ' | Crédito para ',
			stopHint: '. Escribe music --stop para detener la reproducción.'
		},
		language: {
			usage: 'Uso: lang es|en.',
			changed: 'Idioma cambiado a español.'
		},
		ls: 'Aquí no puedes hacer eso, tontis.',
		cvDownloaded: 'Descargado.'
	},
	en: {
		title: 'César Rentería — Software Engineer',
		description: aboutEnRaw.replace('{{spotify}}', 'Spotify').trim(),
		helpText: "Please type 'help' to see available commands.",
		dateLabel: (date: string) => `[${date}]`,
		nav: {
			about: 'About',
			experience: 'Experience',
			skills: 'Skills',
			contact: 'Contact',
			music: 'Music',
			cv: 'CV'
		},
		about: replaceSpotify(aboutEnRaw),
		contact: {
			email: 'Email: ',
			location: 'Location: ',
			website: 'Website: '
		},
		cmdNotFound: (cmd: string) => `Command not found: ${cmd}. Type "help" for available commands.`,
		experience: {
			header: 'EXPERIENCE (type "experience <n>" for details, "experience all" for everything)',
			notFound: (arg: string, n: number) => `Role not found: ${arg}. Use 1-${n} or "all".`
		},
		skills: {
			usage: (categories: string[]) =>
				`Usage: skills [all|${categories.join('|')}].\nCategories: ${categories.join(', ')}.\nTry "skills all" to see everything.`,
			notFound: (arg: string, categories: string[]) =>
				`Unknown category: ${arg}. Use ${categories.join(', ')}.`
		},
		music: {
			stopped: 'Playback stopped.',
			unknownArg: (arg: string) => `Unknown argument "${arg}".`,
			error: 'An unexpected error occurred.',
			blocked: 'The browser blocked playback. Please try again.',
			nowPlaying: 'Now playing: ',
			performedBy: ' | Performed by ',
			creditTo: ' | Credit to ',
			stopHint: '. Type music --stop to cease playback.'
		},
		language: {
			usage: 'Usage: lang es|en.',
			changed: 'Language switched to English.'
		},
		ls: "Can't do that here, silly.",
		cvDownloaded: 'Downloaded.'
	}
} satisfies Record<Language, unknown>;
