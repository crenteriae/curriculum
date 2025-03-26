<script lang="ts">
	import { Commands, handleCommand } from '$lib';
	import { translations as t, baseLanguage } from '$lib/localization';

	let lang = $state({ helpText: '', dateLabel: (date: string) => date });
	let isLoading = $state(true);
	let userInput = $state('');
	let showCursor = $state(true);
	let inputContainer = $state<HTMLElement | null>(null);
	let outputHistory = $state<string[]>([]); // Store command results

	const handleInput = (event: KeyboardEvent) => {
		if (event.key === 'Backspace') {
			event.preventDefault();
			userInput = userInput.slice(0, -1);
		} else if (event.key === 'Enter') {
			event.preventDefault();
			if (userInput.trim() !== '') {
				outputHistory = [...outputHistory, `$ ${userInput}`, handleCommand(userInput)];
			}
			if (userInput === Commands.Clear) {
				outputHistory.length = 0;
			}
			userInput = '';
		} else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
			userInput += event.key;
		}
	};

	const handleFocus = () => (showCursor = true);
	const handleBlur = () => (showCursor = false);

	$effect(() => {
		if (!isLoading && inputContainer) {
			inputContainer.focus();
		}
	});

	setTimeout(() => {
		lang = t[baseLanguage];
		isLoading = false;
	}, 0);
</script>

{#if !isLoading}
	<div class="text-text p-4 font-mono">
		<main class="border-primary h-[calc(100svh-2rem)] border-4 border-solid p-4">
			<div
				role="button"
				tabindex="0"
				aria-label="Terminal window"
				onclick={() => inputContainer?.focus()}
				onkeydown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						event.preventDefault();
						inputContainer?.focus();
					}
				}}
				class="flex w-full flex-col items-start h-full"
			>
				<p>
					César Rentería {lang.dateLabel(new Date().toLocaleDateString(baseLanguage))}
				</p>
				<p>{lang.helpText}</p>
				<br />

				<div>
					{#each outputHistory as line, i}
						{#if line.charAt(0) == '$' && i !== 0}
							<br />
						{/if}
						<p class="whitespace-pre">{@html line}</p>
					{/each}
					{#if outputHistory.length !== 0}
						<br />
					{/if}
				</div>

				<div class="terminal-input contents">
					<div
						role="textbox"
						tabindex="0"
						aria-label="Terminal input"
						onkeydown={handleInput}
						onfocus={handleFocus}
						onblur={handleBlur}
						bind:this={inputContainer}
						class="inline-flex cursor-text items-center focus:outline-none"
					>
						<span class="mr-[1ch]">$</span>
						<span class="input-content whitespace-pre">
							{userInput}
							<span class="blinking-cursor -ml-[1ch]" class:invisible={!showCursor}>_</span>
						</span>
					</div>
				</div>
			</div>
		</main>
	</div>
{/if}

<style>
	.blinking-cursor {
		animation: blink 1s step-end infinite;
		display: inline-block;
		width: 1ch;
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}

	.terminal-input {
		min-width: 20ch;
	}
	.input-content {
		min-width: 1ch;
	}
</style>
