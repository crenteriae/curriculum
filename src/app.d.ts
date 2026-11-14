// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Language } from '#lib/localization.ts';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			lang: Language;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
