import { commands } from './commands';
import { translations as t } from './content';
import type { Language } from './localization';
import type { Segment } from './output';

export { Commands } from './commands/types';

export function parseCommand(command: string): { cmd: string; args: string[] } {
	const [cmd, ...args] = command.trim().split(/\s+/);
	return { cmd: cmd.toLowerCase(), args };
}

export async function handleCommand(command: string, lang: Language): Promise<Segment[]> {
	const { cmd, args } = parseCommand(command);
	const output = Object.hasOwn(commands, cmd)
		? await commands[cmd](args, lang)
		: t[lang].cmdNotFound(cmd);
	return typeof output === 'string' ? [output] : output;
}
