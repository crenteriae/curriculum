<script lang="ts">
	import '../app.css';
	import { commandHelper } from '#lib/store.svelte.ts';
	import { translations as t } from '#lib/content.ts';

	let { children, data } = $props();

	const lang = $derived(t[data.lang]);
	const navItems = $derived([
		{ label: lang.nav.about, command: 'about' },
		{ label: lang.nav.contact, command: 'contact' },
		{ label: lang.nav.music, command: 'music' }
	]);
</script>

<svelte:head>
	<title>{lang.title}</title>
	<meta name="description" content={lang.description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://cesarrenteria.dev" />
	<meta property="og:title" content={lang.title} />
	<meta property="og:description" content={lang.description} />
	<meta property="og:locale" content={data.lang === 'es' ? 'es_MX' : 'en_US'} />
	<meta name="twitter:card" content="summary" />
	<link rel="canonical" href="https://cesarrenteria.dev" />
</svelte:head>

<div class="flex h-svh flex-col">
	<header class="header-nav flex w-full shrink-0 gap-4 p-4 pb-0 font-mono">
		{#each navItems as item (item.command)}
			<button
				class="text-text border-secondary border-4 border-solid p-2"
				onclick={() => {
					commandHelper.value = item.command;
				}}>{item.label}</button
			>
		{/each}
	</header>
	{@render children()}
</div>

<style>
	button {
		cursor: pointer;
	}
	.header-nav {
		overflow-x: overlay;
	}
	.header-nav::-webkit-scrollbar {
		display: none;
	}
</style>
