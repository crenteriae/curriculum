import experienceEnRaw from '../content/en/experience.json?raw';
import experienceEsRaw from '../content/es/experience.json?raw';
import { translations as t } from '../content';
import type { Language } from '../localization';
import type { Segment } from '../output';
import type { CommandHandler } from './types';

type Role = {
	title: string;
	company: string;
	dates: string;
	loc: string;
	highlights: string[];
};

const experienceByLanguage: Record<Language, Role[]> = {
	en: JSON.parse(experienceEnRaw),
	es: JSON.parse(experienceEsRaw)
};

function renderRole(role: Role): Segment[] {
	return [
		{
			text: `${role.title} — ${role.company} (${role.dates}, ${role.loc})\n`,
			class: 'text-highlight'
		},
		...role.highlights.map((highlight) => `  • ${highlight}\n`)
	];
}

export const experience: CommandHandler = (args, lang) => {
	const roles = experienceByLanguage[lang];
	const labels = t[lang].experience;
	const arg = (args[0] || '').toLowerCase();
	if (!arg) {
		return [
			{ text: labels.header + '\n', class: 'text-highlight' },
			...roles.map(
				(role, index) => `${index + 1}. ${role.title} — ${role.company} (${role.dates})\n`
			)
		];
	}
	if (arg === 'all') {
		return roles.flatMap((role) => [...renderRole(role), '\n']);
	}
	const index = parseInt(arg, 10);
	const role = !isNaN(index)
		? roles[index - 1]
		: roles.find(
				(role) => role.company.toLowerCase().includes(arg) || role.title.toLowerCase().includes(arg)
			);
	if (!role) return labels.notFound(arg, roles.length) + '\n';
	return renderRole(role);
};
