<script lang="ts">
	import { Commands, handleCommand } from '$lib';
	import { translations as t, baseLanguage } from '$lib/localization';
	import { commandHelper } from '$lib/store';
	import { tick } from 'svelte';

	let lang = $state({ helpText: '', dateLabel: (date: string) => date });
	let isLoading = $state(true);
	let userInput = $state('');
	let showCursor = $state(true);
	let inputContainer = $state<HTMLElement | null>(null);
	let outputHistory = $state<string[]>([]);
	let commandHistory = $state<string[]>([]);
	let currentHistoryIndex = $state(-1);
	let savedInput = $state('');

	$effect(() => {
		let cmd = $commandHelper;
		let index = 0;

		userInput = '';

		const interval = setInterval(() => {
			if (index < cmd.length) {
				userInput += cmd.charAt(index);
				index++;
			} else {
				clearInterval(interval);
				handleInput(new KeyboardEvent('keydown', { key: 'Enter' }));
				inputContainer?.focus();
			}
		}, 50);

		return () => clearInterval(interval);
	});
	const handleInput = async (event: KeyboardEvent) => {
		if (event.key === 'Backspace') {
			event.preventDefault();
			userInput = userInput.slice(0, -1);
		} else if (event.key === 'Enter') {
			event.preventDefault();

			if (userInput.trim() !== '') {
				const command = userInput.trim();
				outputHistory = [...outputHistory, `$ ${command}`, await handleCommand(command)];
				await tick();
				inputContainer?.scrollIntoView({ behavior: 'smooth' });
				commandHistory = [...commandHistory, command];
				currentHistoryIndex = -1;
				savedInput = '';
			}

			if (userInput === Commands.Clear) {
				outputHistory.length = 0;
			}
			userInput = '';
			commandHelper.set('');
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			if (commandHistory.length === 0) return;
			let newIndex;
			if (currentHistoryIndex === -1) {
				savedInput = userInput;
				newIndex = commandHistory.length - 1;
			} else {
				newIndex = Math.max(currentHistoryIndex - 1, 0);
			}
			currentHistoryIndex = newIndex;
			userInput = commandHistory[newIndex];
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (currentHistoryIndex === -1) return;
			let newIndex = currentHistoryIndex + 1;
			if (newIndex >= commandHistory.length) {
				userInput = savedInput;
				savedInput = '';
				currentHistoryIndex = -1;
			} else {
				currentHistoryIndex = newIndex;
				userInput = commandHistory[newIndex];
			}
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
		<main
			class="border-primary [&::-webkit-scrollbar-thumb]:bg-subtle h-[calc(100svh-6rem)] overflow-x-clip overflow-y-auto border-4 border-solid
			p-4
  	      	[&::-webkit-scrollbar]:w-[1ch]
            [&::-webkit-scrollbar-track]:bg-none"
		>
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
				class="flex h-full w-full flex-col items-start"
			>
				<p>
					César Rentería {lang.dateLabel(new Date().toLocaleDateString(baseLanguage))}
				</p>
				<p>{lang.helpText}</p>
				<br />

				<div class="max-w-full">
					{#each outputHistory as line, i}
						{#if line.charAt(0) == '$' && i !== 0}
							<br />
						{/if}
						<p class="break-words whitespace-pre-wrap">{@html line}</p>
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
						class="inline-flex items-center pb-4 focus:outline-none"
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
