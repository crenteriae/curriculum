import type { Language } from '../localization';
import type { Output } from '../output';

export type CommandHandler = (args: string[], lang: Language) => Output | Promise<Output>;

export enum Commands {
	Help = 'help',
	About = 'about',
	Contact = 'contact',
	Clear = 'cls',
	Music = 'music',
	Cat = 'cat',
	Cv = 'cv',
	Experience = 'experience',
	Skills = 'skills',
	Neofetch = 'neofetch',
	Cowsay = 'cowsay'
}
