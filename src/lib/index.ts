import { translations as t, baseLanguage } from './localization';
// place files you want to import through the `$lib` alias in this folder.

export enum Commands {
	Help = 'help',
	About = 'about',
	Contact = 'contact',
	Clear = 'cls',
	Music = 'music'
}

type CommandHandler = (args: string[]) => string | Promise<string>;

const commands: Record<string, CommandHandler> = {
	help: () => Object.values(Commands).join('\n'),
	about: () => t[baseLanguage].about,
	contact: () =>
		'Email: <a href=mailto:crenteriaejr@gmail.com>crenteriaejr@gmail.com</a>\nLinkedIn: <a href="https://www.linkedin.com/in/césar-rentería-861848285/" target="_blank">https://www.linkedin.com/in/césar-rentería-861848285/</a>',
	cls: () => '', // Clears the screen
	music: async (args: string[]) => await t[baseLanguage].music(args)
};

export async function handleCommand(command: string): Promise<string> {
	const [cmd, ...args] = command.trim().split(/\s+/);
	if (cmd in commands) {
		return await commands[cmd](args);
	} else {
		return t[baseLanguage].cmdNotFound(cmd);
	}
}
