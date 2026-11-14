import { translations as t } from '../content';
import { downloadCv } from '../tools';
import type { CommandHandler } from './types';

export const cv: CommandHandler = (_, lang) => {
	downloadCv();
	return t[lang].cvDownloaded;
};
