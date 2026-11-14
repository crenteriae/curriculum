<script lang="ts">
	import { Commands, handleCommand } from '#lib';
	import { translations as t } from '#lib/content.ts';
	import { baseLanguage } from '#lib/localization.ts';
	import type { Segment } from '#lib/output.ts';
	import { commandHelper } from '#lib/store.ts';
	import { tick } from 'svelte';

	let lang = $state({ helpText: '', dateLabel: (date: string) => date });
	let isLoading = $state(true);
	let userInput = $state('');
	let inputContainer = $state<HTMLInputElement | null>(null);
	let outputHistory = $state<
		({ kind: 'input'; text: string } | { kind: 'output'; segments: Segment[] })[]
	>([]);
	let commandHistory = $state<string[]>([]);
	let currentHistoryIndex = $state(-1);
	let savedInput = $state('');

	$effect(() => {
		let cmd = $commandHelper;
		if (!cmd) return;
		let index = 0;

		userInput = '';

		const interval = setInterval(() => {
			if (index < cmd.length) {
				setInput(userInput + cmd.charAt(index));
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
			return;
		} else if (event.key === 'Enter') {
			event.preventDefault();

			if (userInput.trim() !== '') {
				const command = userInput.trim();
				outputHistory = [
					...outputHistory,
					{ kind: 'input', text: command },
					{ kind: 'output', segments: await handleCommand(command) }
				];
				await tick();
				inputContainer?.scrollIntoView({ behavior: 'smooth' });
				commandHistory = [...commandHistory, command];
				currentHistoryIndex = -1;
				savedInput = '';
			}

			if (userInput === Commands.Clear) {
				outputHistory = [];
			}
			setInput('');
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
			setInput(commandHistory[newIndex]);
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (currentHistoryIndex === -1) return;
			let newIndex = currentHistoryIndex + 1;
			if (newIndex >= commandHistory.length) {
				setInput(savedInput);
				savedInput = '';
				currentHistoryIndex = -1;
			} else {
				currentHistoryIndex = newIndex;
				setInput(commandHistory[newIndex]);
			}
		}
	};

	const setInput = (value: string, caret = value.length) => {
		userInput = value;
		if (inputContainer) {
			inputContainer.value = value;
			inputContainer.setSelectionRange(caret, caret);
		}
	};

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
					if (event.target === inputContainer) return;
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

				<div class="max-w-full" role="log" aria-live="polite" aria-atomic="false">
					{#each outputHistory as line, i (i)}
						{#if line.kind === 'input'}
							{#if i !== 0}
								<br />
							{/if}
							<p class="break-words whitespace-pre-wrap">$ {line.text}</p>
						{:else}
							<p class="break-words whitespace-pre-wrap">
								{#each line.segments as segment, j (j)}
									{#if typeof segment === 'string'}
										{segment}
									{:else if 'href' in segment}
										<a
											href={segment.href}
											rel="external"
											target={segment.newTab ? '_blank' : undefined}
											class={segment.class}>{segment.label}</a
										>
									{:else}
										<span class={segment.class}>{segment.text}</span>
									{/if}
								{/each}
							</p>
						{/if}
					{/each}
					{#if outputHistory.length !== 0}
						<br />
					{/if}
				</div>

				<div class="terminal-input inline-flex items-center pb-4">
					<span class="mr-[1ch]">$</span>
					<input
						type="text"
						aria-label="Terminal input"
						inputmode="text"
						enterkeyhint="send"
						autocapitalize="none"
						autocomplete="off"
						autocorrect="off"
						spellcheck="false"
						onkeydown={handleInput}
						oninput={(event) => {
							userInput = event.currentTarget.value;
						}}
						bind:this={inputContainer}
						style="width: {Math.max(1, userInput.length + 1)}ch; caret-color: currentColor;"
						class="font-inherit bg-transparent p-0 text-inherit focus:outline-none"
					/>
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
