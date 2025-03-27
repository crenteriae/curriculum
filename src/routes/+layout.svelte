<script lang="ts">
	import '../app.css';
	import { commandHelper } from '$lib/store';

	let { children } = $props();
</script>

<header class="header-nav flex w-full gap-4 p-4 pb-0 font-mono">
	<button
		class="text-text border-secondary border-4 border-solid p-2"
		onclick={() => {
			commandHelper.set('about');
		}}>About</button
	>
	<button
		class="text-text border-secondary border-4 border-solid p-2"
		onclick={() => {
			commandHelper.set('contact');
		}}>Contact</button
	>
	<button
		class="text-text border-secondary border-4 border-solid p-2"
		onclick={() => {
			commandHelper.set('music');
		}}>Music</button
	>
</header>
{@render children()}

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
