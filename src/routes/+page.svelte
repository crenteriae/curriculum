<script lang="ts">
	import { translations as t, baseLanguage } from '$lib/localization';

	let lang = $state({ helpText: '', dateLabel: (date: string) => date });
	let isLoading = $state(true);
	let userInput = $state('');
	let showCursor = $state(true);

	setTimeout(() => {
		lang = t[baseLanguage];
		isLoading = false;
	}, 0);
</script>

{#if !isLoading}
	<div class="text-text p-4 font-mono">
		<main class="border-primary border-4 border-solid p-4">
			<p>
				César Rentería {lang.dateLabel(new Date().toLocaleDateString(baseLanguage))}
			</p>
			<p>{lang.helpText}</p>
			<br />

			<section>
				$
				<span class="blinking-cursor m-0" class:invisible={!showCursor}>_</span>
			</section>
		</main>
	</div>
{/if}

<style>
	.blinking-cursor {
		animation: blink 1s step-end infinite;
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
</style>
