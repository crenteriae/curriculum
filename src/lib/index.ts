import { translations as t, baseLanguage } from './localization';
import type { Output, Segment } from './output';
// place files you want to import through the `#lib` alias in this folder.

export enum Commands {
	Help = 'help',
	About = 'about',
	Contact = 'contact',
	Clear = 'cls',
	Music = 'music',
	Cat = 'cat',
	Cv = 'cv'
}

type CommandHandler = (args: string[]) => Output | Promise<Output>;

const commands: Record<string, CommandHandler> = {
	help: () => Object.values(Commands).join('\n'),
	about: () => t[baseLanguage].about,
	contact: () => [
		'Email: ',
		{ href: 'mailto:crenteriaejr@gmail.com', label: 'crenteriaejr@gmail.com' },
		'\nLinkedIn: ',
		{
			href: 'https://www.linkedin.com/in/césar-rentería-861848285/',
			label: 'https://www.linkedin.com/in/césar-rentería-861848285/',
			newTab: true
		},
		'\nGitHub: ',
		{ href: 'https://github.com/crenteriae', label: 'https://github.com/crenteriae', newTab: true }
	],
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
