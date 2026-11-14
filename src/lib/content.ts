import type { Output, Segment } from './output';
import { downloadCv, replaceSpotify } from './tools';

import aboutEnRaw from './content/en/about.txt?raw';
import aboutEsRaw from './content/es/about.txt?raw';
import experienceEnRaw from './content/en/experience.json?raw';
import experienceEsRaw from './content/es/experience.json?raw';
import skillsEnRaw from './content/en/skills.json?raw';
import skillsEsRaw from './content/es/skills.json?raw';
import { songs } from './constants';

const musicFiles = import.meta.glob('/static/music/*');
let audioElement: HTMLAudioElement | null = null;

export type Language = 'es' | 'en';

async function musicPicker() {
	const keys = Object.keys(musicFiles);
	if (keys.length === 0) return;

	const song = keys[Math.floor(Math.random() * keys.length)];
	return {
		...songs[song],
		url: song.replace('/static', '')
	};
}

const experienceEn = JSON.parse(experienceEnRaw) as {
	title: string;
	company: string;
	dates: string;
	loc: string;
	highlights: string[];
}[];
const experienceEs = JSON.parse(experienceEsRaw) as typeof experienceEn;
const skillsEn = JSON.parse(skillsEnRaw) as Record<string, { name: string; level: number }[]>;
const skillsEs = JSON.parse(skillsEsRaw) as typeof skillsEn;

const aboutEn = replaceSpotify(aboutEnRaw);
const aboutEs = replaceSpotify(aboutEsRaw);

function renderSkillCategory(name: string, items: { name: string; level: number }[]): Segment[] {
	const bars = (level: number) => '█'.repeat(level) + '░'.repeat(10 - level);
	const segments: Segment[] = [{ text: name.toUpperCase() + '\n', class: 'text-primary' }];
	for (const s of items) {
		segments.push({ text: s.name.padEnd(18) + ' ', class: 'text-secondary' });
		segments.push({ text: `${bars(s.level)} ${s.level}/10\n`, class: 'text-text' });
	}
	return segments;
}

function skillsInteractive(
	args: string[],
	groups: Record<string, { name: string; level: number }[]>,
	labels: { usage: string; notFound: string }
): Segment[] {
	const arg = (args[0] || '').toLowerCase();
	if (!arg) return [{ text: labels.usage + '\n', class: 'text-text' }];
	if (arg === 'all') {
		const segments: Segment[] = [];
		for (const [k, v] of Object.entries(groups)) {
			segments.push(...renderSkillCategory(k, v));
			segments.push({ text: '\n', class: 'text-text' });
		}
		return segments;
	}
	if (arg in groups) {
		return renderSkillCategory(arg, groups[arg]);
	}
	return [{ text: labels.notFound.replace('{arg}', arg) + '\n', class: 'text-text' }];
}

function experienceInteractive(
	args: string[],
	roles: typeof experienceEn,
	labels: { header: string; notFound: string }
): Segment[] {
	const arg = (args[0] || '').toLowerCase();
	if (!arg) {
		const segments: Segment[] = [{ text: labels.header + '\n', class: 'text-highlight' }];
		for (const [i, r] of roles.entries()) {
			segments.push({
				text: `${i + 1}. ${r.title} — ${r.company} (${r.dates})\n`,
				class: 'text-text'
			});
		}
		return segments;
	}
	if (arg === 'all') {
		const segments: Segment[] = [];
		for (const r of roles) {
			segments.push({
				text: `${r.title} — ${r.company} (${r.dates}, ${r.loc})\n`,
				class: 'text-highlight'
			});
			for (const h of r.highlights) {
				segments.push({ text: `  • ${h}\n`, class: 'text-text' });
			}
			segments.push({ text: '\n', class: 'text-text' });
		}
		return segments;
	}
	const idx = parseInt(arg, 10);
	const role = !isNaN(idx)
		? roles[idx - 1]
		: roles.find(
				(r) => r.company.toLowerCase().includes(arg) || r.title.toLowerCase().includes(arg)
			);
	if (!role) {
		return [
			{
				text: labels.notFound.replace('{arg}', arg).replace('{n}', String(roles.length)) + '\n',
				class: 'text-text'
			}
		];
	}
	const segments: Segment[] = [
		{
			text: `${role.title} — ${role.company} (${role.dates}, ${role.loc})\n`,
			class: 'text-highlight'
		}
	];
	for (const h of role.highlights) {
		segments.push({ text: `  • ${h}\n`, class: 'text-text' });
	}
	return segments;
}

export const translations: Record<
	Language,
	{
		helpText: string;
		dateLabel: (date: string) => string;
		about: Segment[];
		cmdNotFound: (cmd: string) => string;
		music: (args: string[]) => Output | Promise<Output>;
		experience: (args: string[]) => Output;
		skills: (args: string[]) => Output | Promise<Output>;
		ls: string;
		cv: () => string;
	}
> = {
	es: {
		helpText: "Por favor escribe 'help' para ver los comandos disponibles.",
		dateLabel: (date: string) => `[${date}]`,
		about: aboutEs,
		experience: (args: string[]) =>
			experienceInteractive(args, experienceEs, {
				header: 'EXPERIENCE (escribe "experience <n>" para detalle, "experience all" para todo)',
				notFound: 'Rol no encontrado: {arg}. Usa 1-{n} o "all".'
			}),
		skills: (args: string[]) =>
			skillsInteractive(args, skillsEs, {
				usage:
					'Uso: skills [all|languages|backend|frontend|cloud].\nCategorías: languages, backend, frontend, cloud.\nPrueba "skills all" para ver todo.',
				notFound: 'Categoría desconocida: {arg}. Usa languages, backend, frontend o cloud.'
			}),
		cmdNotFound: (cmd: string) =>
			`Comando desconocido: ${cmd}. Escribe "help" para ver los comandos disponibles.`,
		music: async (args: string[]) => {
			const song = await musicPicker();
			if (args.includes('--stop')) {
				audioElement?.pause();
				audioElement = null;
				return 'Reproducción detenida.';
			}
			if (args.length > 0) {
				return `Argumento "${args[0]}" desconocido.`;
			}

			if (!song) {
				return 'Ocurrió un error.';
			}
			if (audioElement) {
				audioElement.pause();
			}

			audioElement = new Audio(song.url);
			audioElement.play();

			return [
				`Ahora escuchando: ${song.title} | ${song.composer}`,
				song.performer ? ` | Intepretado por ${song.performer}` : '',
				...(song.credit ? [' | Crédito para ', ...song.credit] : []),
				'. Escribe music --stop para detener la reproducción.'
			];
		},
		ls: 'Aquí no puedes hacer eso, tontis.',
		cv: () => {
			downloadCv();
			return 'Descargado.';
		}
	},
	en: {
		helpText: "Please type 'help' to see available commands.",
		dateLabel: (date: string) => `[${date}]`,
		about: aboutEn,
		experience: (args: string[]) =>
			experienceInteractive(args, experienceEn, {
				header: 'EXPERIENCE (type "experience <n>" for details, "experience all" for everything)',
				notFound: 'Role not found: {arg}. Use 1-{n} or "all".'
			}),
		skills: (args: string[]) =>
			skillsInteractive(args, skillsEn, {
				usage:
					'Usage: skills [all|languages|backend|frontend|cloud].\nCategories: languages, backend, frontend, cloud.\nTry "skills all" to see everything.',
				notFound: 'Unknown category: {arg}. Use languages, backend, frontend, or cloud.'
			}),
		cmdNotFound: (cmd: string) => `Command not found: ${cmd}. Type "help" for available commands`,
		music: async (args: string[]) => {
			const song = await musicPicker();
			if (args.includes('--stop')) {
				audioElement?.pause();
				audioElement = null;
				return 'Playback stopped.';
			}
			if (args.length > 0) {
				return `Unknown argument "${args[0]}".`;
			}
			if (!song) {
				return 'An unexpected error occured.';
			}
			if (audioElement) {
				audioElement.pause();
			}

			audioElement = new Audio(song.url);
			audioElement.play();

			return [
				`Now playing: ${song.title} | ${song.composer}`,
				song.performer ? ` | Performed by ${song.performer}` : '',
				...(song.credit ? [' | Credit to ', ...song.credit] : []),
				'. Type music --stop to cease playback.'
			];
		},
		ls: "Can't do that here, silly.",
		cv: () => {
			downloadCv();

			return 'Downloaded.';
		}
	}
} as const;
