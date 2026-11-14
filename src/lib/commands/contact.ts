import { translations as t } from '../content';
import type { CommandHandler } from './types';

export const contact: CommandHandler = (_, lang) => [
	{ text: t[lang].contact.email, class: 'text-secondary' },
	{ href: 'mailto:crenteriaejr@gmail.com', label: 'crenteriaejr@gmail.com' },
	{ text: '\n' + t[lang].contact.location, class: 'text-secondary' },
	'Mexicali, B.C.',
	{ text: '\nLinkedIn: ', class: 'text-secondary' },
	{
		href: 'https://www.linkedin.com/in/césar-rentería-861848285/',
		label: 'https://www.linkedin.com/in/césar-rentería-861848285/',
		newTab: true
	},
	{ text: '\nGitHub: ', class: 'text-secondary' },
	{ href: 'https://github.com/crenteriae', label: 'https://github.com/crenteriae', newTab: true },
	{ text: '\n' + t[lang].contact.website, class: 'text-secondary' },
	{ href: 'https://cesarrenteria.dev', label: 'https://cesarrenteria.dev', newTab: true }
];
