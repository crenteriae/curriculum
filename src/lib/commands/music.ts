import { songs } from '../constants';
import { translations as t } from '../content';
import type { CommandHandler } from './types';

let audioElement: HTMLAudioElement | null = null;

export const music: CommandHandler = async (args, lang) => {
	const labels = t[lang].music;
	if (args.includes('--stop')) {
		audioElement?.pause();
		audioElement = null;
		return labels.stopped;
	}
	if (args.length > 0) return labels.unknownArg(args[0]);

	const urls = Object.keys(songs);
	if (urls.length === 0) return labels.error;
	const url = urls[Math.floor(Math.random() * urls.length)];
	const song = songs[url];

	audioElement?.pause();
	audioElement = new Audio(url);
	try {
		await audioElement.play();
	} catch {
		audioElement = null;
		return labels.blocked;
	}

	return [
		`${labels.nowPlaying}${song.title} | ${song.composer}`,
		song.performer ? `${labels.performedBy}${song.performer}` : '',
		...(song.credit ? [labels.creditTo, ...song.credit] : []),
		labels.stopHint
	];
};
