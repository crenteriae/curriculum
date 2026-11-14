import { refreshAll } from '$app/navigation';
import { translations as t } from '../content';
import { isLanguage } from '../localization';
import type { CommandHandler } from './types';

export const lang: CommandHandler = async (args, currentLanguage) => {
	const target = args[0]?.toLowerCase();
	if (!target || !isLanguage(target)) return t[currentLanguage].language.usage;

	document.cookie = `lang=${target}; Path=/; Max-Age=31536000; SameSite=Lax`;
	await refreshAll();
	return t[target].language.changed;
};
