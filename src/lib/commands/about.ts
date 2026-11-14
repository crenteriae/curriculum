import { translations as t } from '../content';
import type { CommandHandler } from './types';

export const about: CommandHandler = (_, lang) => t[lang].about;
