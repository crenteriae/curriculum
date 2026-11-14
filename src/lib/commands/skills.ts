import skillsRaw from '../content/skills.json?raw';
import { translations as t } from '../content';
import type { Segment } from '../output';
import type { CommandHandler } from './types';

type Skill = { name: string; level: number };

const skillGroups = JSON.parse(skillsRaw) as Record<string, Skill[]>;
const skillCategories = Object.keys(skillGroups);

function renderSkillCategory(name: string, items: Skill[]): Segment[] {
	const bars = (level: number) => '█'.repeat(level) + '░'.repeat(10 - level);
	const segments: Segment[] = [{ text: name.toUpperCase() + '\n', class: 'text-primary' }];
	for (const skill of items) {
		segments.push({ text: skill.name.padEnd(18) + ' ', class: 'text-secondary' });
		segments.push({ text: `${bars(skill.level)} ${skill.level}/10\n`, class: 'text-text' });
	}
	return segments;
}

export const skills: CommandHandler = (args, lang) => {
	const labels = t[lang].skills;
	const arg = (args[0] || '').toLowerCase();
	if (!arg) return labels.usage(skillCategories) + '\n';
	if (arg === 'all') {
		const segments: Segment[] = [];
		for (const [name, items] of Object.entries(skillGroups)) {
			segments.push(...renderSkillCategory(name, items));
			segments.push('\n');
		}
		return segments;
	}
	if (Object.hasOwn(skillGroups, arg)) {
		return renderSkillCategory(arg, skillGroups[arg]);
	}
	return labels.notFound(arg, skillCategories) + '\n';
};
