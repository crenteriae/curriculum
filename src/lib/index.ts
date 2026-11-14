import { asciiLinuxPenguin } from './constants';
import { translations as t } from './content';
import { baseLanguage } from './localization';
import type { Output, Segment } from './output';
import { browserName } from './tools';
// place files you want to import through the `#lib` alias in this folder.

export enum Commands {
	Help = 'help',
	About = 'about',
	Contact = 'contact',
	Clear = 'cls',
	Music = 'music',
	Cat = 'cat',
	Cv = 'cv',
	Experience = 'experience',
	Skills = 'skills',
	Neofetch = 'neofetch',
	Cowsay = 'cowsay'
}

type CommandHandler = (args: string[]) => Output | Promise<Output>;

const pageStart = typeof performance !== 'undefined' ? performance.now() : 0;

function neofetch(): Segment[] {
	const width = typeof window !== 'undefined' ? window.innerWidth : 0;
	const height = typeof window !== 'undefined' ? window.innerHeight : 0;
	const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 0 : 0;
	const memory =
		typeof navigator !== 'undefined' && 'deviceMemory' in navigator
			? `${(navigator as Navigator & { deviceMemory?: number }).deviceMemory} GB`
			: 'Unknown';
	const uptimeMs = typeof performance !== 'undefined' ? performance.now() - pageStart : 0;
	const uptimeMin = Math.floor(uptimeMs / 60000);
	const uptimeSec = Math.floor((uptimeMs % 60000) / 1000);
	const os = typeof navigator !== 'undefined' ? navigator.platform || 'Unknown' : 'Unknown';

	const info = [
		'cesar@cesarrenteria.dev',
		'---------------------',
		`OS: ${os}`,
		`Browser: ${browserName()}`,
		`Resolution: ${width}x${height}`,
		`CPU: ${cores} cores`,
		`Memory: ${memory}`,
		`Uptime: ${uptimeMin}m ${uptimeSec}s`,
		'Shell: cesar-term 1.0',
		'Theme: objectivelythebest'
	];

	const segments: Segment[] = [];
	const total = Math.max(asciiLinuxPenguin.length, info.length);
	for (let i = 0; i < total; i++) {
		const artPart = i < asciiLinuxPenguin.length ? asciiLinuxPenguin[i].padEnd(22) : ' '.repeat(22);
		const infoPart = i < info.length ? info[i] : '';
		segments.push({ text: artPart, class: 'text-primary' });
		if (i === 0) {
			segments.push({ text: infoPart + '\n', class: 'text-highlight' });
		} else if (i === 1) {
			segments.push({ text: infoPart + '\n', class: 'text-subtle' });
		} else {
			const colon = infoPart.indexOf(':');
			if (colon !== -1) {
				segments.push({ text: infoPart.slice(0, colon + 1), class: 'text-secondary' });
				segments.push({ text: infoPart.slice(colon + 1) + '\n', class: 'text-text' });
			} else {
				segments.push({ text: infoPart + '\n', class: 'text-text' });
			}
		}
	}
	return segments;
}

function cowsay(text: string): string {
	const message = text.trim() || 'moo';
	return [
		' ' + '_'.repeat(message.length + 2),
		`< ${message} >`,
		' ' + '-'.repeat(message.length + 2),
		'        \\   ^__^',
		'         \\  (oo)\\_______',
		'            (__)\\       )\\/\\',
		'                ||----w |',
		'                ||     ||'
	].join('\n');
}

const commands: Record<string, CommandHandler> = {
	help: () => Object.values(Commands).join('\n'),
	about: () => t[baseLanguage].about,
	contact: () => [
		'Email: ',
		{ href: 'mailto:crenteriaejr@gmail.com', label: 'crenteriaejr@gmail.com' },
		'\nPhone: ',
		{ href: 'tel:+526861475332', label: '+52 686 147 5332' },
		'\nLocation: Mexicali, B.C.',
		'\nLinkedIn: ',
		{
			href: 'https://www.linkedin.com/in/césar-rentería-861848285/',
			label: 'https://www.linkedin.com/in/césar-rentería-861848285/',
			newTab: true
		},
		'\nGitHub: ',
		{ href: 'https://github.com/crenteriae', label: 'https://github.com/crenteriae', newTab: true },
		'\nWebsite: ',
		{ href: 'https://cesarrenteria.dev', label: 'https://cesarrenteria.dev', newTab: true }
	],
	experience: (args: string[]) => t[baseLanguage].experience(args),
	exp: (args: string[]) => t[baseLanguage].experience(args),
	skills: async (args: string[]) => await t[baseLanguage].skills(args),
	neofetch: () => neofetch(),
	fastfetch: () => neofetch(),
	cowsay: (args: string[]) => cowsay(args.join(' ')),
	cls: () => '',
	cat: () =>
		` .       .
 |\\_---_/|
/   o_o   \\
|    U    |
\\  ._I_.  /
 \`-_____-'`,
	dog: () =>
		`         __
        /  \\
       / ..|\\
      (_\\  |_)
      /  \\@'
     /     \\
 _  /  \`   |
\\/  \\  | _\\
 \\   /_ || \\_
  \\____)|_) \\_)
`,
	music: async (args: string[]) => await t[baseLanguage].music(args),
	ls: () => t[baseLanguage].ls,
	cv: () => t[baseLanguage].cv()
};

export async function handleCommand(command: string): Promise<Segment[]> {
	const [cmd, ...args] = command.trim().split(/\s+/);
	const output = cmd in commands ? await commands[cmd](args) : t[baseLanguage].cmdNotFound(cmd);
	return typeof output === 'string' ? [output] : output;
}
