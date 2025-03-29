import { translations as t, baseLanguage } from './localization';
// place files you want to import through the `$lib` alias in this folder.

export enum Commands {
	Help = 'help',
	About = 'about',
	Contact = 'contact',
	Clear = 'cls',
	Music = 'music',
	Cat = 'cat'
}

type CommandHandler = (args: string[]) => string | Promise<string>;

const commands: Record<string, CommandHandler> = {
	help: () => Object.values(Commands).join('\n'),
	about: () => t[baseLanguage].about,
	contact: () =>
		'Email: <a href=mailto:crenteriaejr@gmail.com>crenteriaejr@gmail.com</a>\nLinkedIn: <a href="https://www.linkedin.com/in/césar-rentería-861848285/" target="_blank">https://www.linkedin.com/in/césar-rentería-861848285/</a>\nGitHub: <a href="https://github.com/crenteriae" target="_blank">https://github.com/crenteriae</a>',
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
\\\/  \\  | _\\
 \\   /_ || \\_
  \\____)|_) \\_)
`,
	music: async (args: string[]) => await t[baseLanguage].music(args),
	ls: () => "Can't do that here, silly."
};

export async function handleCommand(command: string): Promise<string> {
	const [cmd, ...args] = command.trim().split(/\s+/);
	if (cmd in commands) {
		return await commands[cmd](args);
	} else {
		return t[baseLanguage].cmdNotFound(cmd);
	}
}
