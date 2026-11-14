import { translations as t } from '../content';
import type { CommandHandler } from './types';

export const ls: CommandHandler = (_, lang) => t[lang].ls;
