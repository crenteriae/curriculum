import { asciiLinuxPenguin } from '../constants';
import type { Segment } from '../output';
import { browserName } from '../tools';
import type { CommandHandler } from './types';

const pageStart = typeof performance !== 'undefined' ? performance.now() : 0;

export const neofetch: CommandHandler = () => {
	const width = typeof window !== 'undefined' ? window.innerWidth : 0;
	const height = typeof window !== 'undefined' ? window.innerHeight : 0;
	const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 0 : 0;
	const memory =
		typeof navigator !== 'undefined' && 'deviceMemory' in navigator
			? `${(navigator as Navigator & { deviceMemory?: number }).deviceMemory} GB`
			: 'Unknown';
	const uptimeMs = typeof performance !== 'undefined' ? performance.now() - pageStart : 0;
	const uptimeMin = Math.floor(uptimeMs / 60000);
	const uptimeSec = Math.floor((uptimeMs % 60000) / 1000);
	const os = typeof navigator !== 'undefined' ? navigator.platform || 'Unknown' : 'Unknown';

	const info = [
		'cesar@cesarrenteria.dev',
		'---------------------',
		`OS: ${os}`,
		`Browser: ${browserName()}`,
		`Resolution: ${width}x${height}`,
		`CPU: ${cores} cores`,
		`Memory: ${memory}`,
		`Uptime: ${uptimeMin}m ${uptimeSec}s`,
		'Shell: cesar-term 1.0',
		'Theme: objectivelythebest'
	];

	const segments: Segment[] = [];
	const total = Math.max(asciiLinuxPenguin.length, info.length);
	for (let i = 0; i < total; i++) {
		const artPart = i < asciiLinuxPenguin.length ? asciiLinuxPenguin[i].padEnd(22) : ' '.repeat(22);
		const infoPart = i < info.length ? info[i] : '';
		segments.push({ text: artPart, class: 'text-primary' });
		if (i === 0) {
			segments.push({ text: infoPart + '\n', class: 'text-highlight' });
		} else if (i === 1) {
			segments.push({ text: infoPart + '\n', class: 'text-subtle' });
		} else {
			const colon = infoPart.indexOf(':');
			if (colon !== -1) {
				segments.push({ text: infoPart.slice(0, colon + 1), class: 'text-secondary' });
				segments.push({ text: infoPart.slice(colon + 1) + '\n', class: 'text-text' });
			} else {
				segments.push({ text: infoPart + '\n', class: 'text-text' });
			}
		}
	}
	return segments;
};
