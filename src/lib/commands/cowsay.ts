import type { CommandHandler } from './types';

export const cowsay: CommandHandler = (args) => {
	const message = args.join(' ').trim() || 'moo';
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
};
