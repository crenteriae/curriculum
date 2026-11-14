import { spotify } from './constants';
import type { Segment } from './output';

export function downloadCv() {
	const a = document.createElement('a');
	a.href = '/cv_en.pdf';
	a.download = 'curriculum_cesar_renteria.pdf';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

export function replaceSpotify(raw: string): Segment[] {
	const parts = raw.split('{{spotify}}');
	const segments: Segment[] = [];
	if (parts[0]) segments.push(parts[0]);
	segments.push(spotify);
	if (parts[1]) segments.push(parts[1]);
	return segments;
}

export function browserName(): string {
	if (typeof navigator === 'undefined') return 'Unknown';
	const ua = navigator.userAgent;
	if (ua.includes('Edg/')) return 'Edge';
	if (ua.includes('Chrome/')) return 'Chrome';
	if (ua.includes('Firefox/')) return 'Firefox';
	if (ua.includes('Safari/')) return 'Safari';
	return 'Unknown';
}
