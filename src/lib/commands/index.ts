import { about } from './about';
import { cat } from './cat';
import { cls } from './cls';
import { contact } from './contact';
import { cowsay } from './cowsay';
import { cv } from './cv';
import { dog } from './dog';
import { experience } from './experience';
import { help } from './help';
import { lang } from './lang';
import { ls } from './ls';
import { music } from './music';
import { neofetch } from './neofetch';
import { skills } from './skills';
import type { CommandHandler } from './types';

export const commands: Record<string, CommandHandler> = {
	help,
	about,
	contact,
	cls,
	clear: cls,
	music,
	cat,
	cv,
	experience,
	exp: experience,
	skills,
	neofetch,
	fastfetch: neofetch,
	cowsay,
	dog,
	ls,
	lang
};
