import type { Link, Segment } from './output';

export const spotify: Link = {
	href: 'https://open.spotify.com/artist/0yLF2xizxuMyFictPKMdLr?si=a66L2CqpTH2g85-pX17JJQ',
	label: '[Spotify]',
	class: 'text-highlight',
	newTab: true
};

export const songs: Record<
	string,
	{ title: string; composer: string; performer?: string; credit?: Segment[] }
> = {
	'/static/music/IMSLP707203-PMLP2312-01_Op._9_no._1_B_flat_minor_5_31_.ogg': {
		title: 'Nocturnes, Op.9',
		composer: 'Chopin, Frédéric'
	},
	'/static/music/IMSLP803323-PMLP2598-LISZT.mp3': {
		title: 'Liebesträume No. 3, S.541',
		composer: 'Liszt, Franz',
		performer: 'Luis Kolodin'
	},
	'/static/music/Kimiko Ishizaka - J.S. Bach- -Open- Goldberg Variations, BWV 988 (Piano) - 01 Aria.ogg':
		{
			title: 'Goldberg Variations, BWV 988 (Piano) - 01 Aria',
			composer: 'J.S. Bach',
			performer: 'Kimiko Ishizaka',
			credit: [
				'"Open" Goldberg Variations (',
				{
					href: 'https://www.opengoldbergvariations.org',
					label: 'https://www.opengoldbergvariations.org',
					class: 'underline',
					newTab: true
				},
				')'
			]
		}
};

export const asciiLinuxPenguin = [
	'        .--.',
	'       |o_o |',
	'       |:_/ |',
	'      //   \\ \\',
	'     (|     | )',
	"    /'\\_   _/`\\",
	'    \\___)=(___/'
];
