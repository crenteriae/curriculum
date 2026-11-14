<script lang="ts">
	import { commandCompletions, handleCommand, parseCommand } from '#lib';
	import { translations as t } from '#lib/content.ts';
	import type { Segment } from '#lib/output.ts';
	import { commandHelper } from '#lib/store.svelte.ts';
	import { tick } from 'svelte';

	let { data } = $props();

	const lang = $derived(t[data.lang]);
	let today = $state('');
	let userInput = $state('');
	let caret = $state(0);
	let inputContainer = $state<HTMLInputElement | null>(null);
	let outputHistory = $state<
		({ kind: 'input'; text: string } | { kind: 'output'; segments: Segment[] })[]
	>([]);
	let commandHistory = $state<string[]>([]);
	let currentHistoryIndex = $state(-1);
	let savedInput = $state('');
	let completions = $state<string[]>([]);
	let completionIndex = $state(0);

	$effect(() => {
		let cmd = commandHelper.value;
		if (!cmd) return;
		let index = 0;

		userInput = '';

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			setInput(cmd);
			handleInput(new KeyboardEvent('keydown', { key: 'Enter' }));
			inputContainer?.focus();
			return;
		}

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
		const key = event.key.toLowerCase();
		if (event.key !== 'Tab') completions = [];
		if (event.ctrlKey && key === 'l') {
			event.preventDefault();
			outputHistory = [];
			return;
		}
		if (event.ctrlKey && key === 'c') {
			event.preventDefault();
			commandHelper.value = '';
			setInput('');
			currentHistoryIndex = -1;
			savedInput = '';
			return;
		}
		if (event.key === 'Tab') {
			event.preventDefault();
			if (completions.length === 0) {
				completions = commandCompletions(userInput);
				completionIndex = 0;
			} else {
				completionIndex = (completionIndex + 1) % completions.length;
			}
			if (completions.length > 0) setInput(completions[completionIndex]);
			return;
		}
		if (event.key === 'Backspace') {
			requestAnimationFrame(syncCaret);
			return;
		} else if (event.key === 'Enter') {
			event.preventDefault();

			if (userInput.trim() !== '') {
				const command = userInput.trim();
				if (['cls', 'clear'].includes(parseCommand(command).cmd)) {
					outputHistory = [];
				} else {
					outputHistory = [
						...outputHistory,
						{ kind: 'input', text: command },
						{ kind: 'output', segments: await handleCommand(command, data.lang) }
					];
					await tick();
					inputContainer?.scrollIntoView({
						behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
							? 'auto'
							: 'smooth'
					});
				}
				commandHistory = [...commandHistory, command];
				currentHistoryIndex = -1;
				savedInput = '';
			}

			setInput('');
			commandHelper.value = '';
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
		requestAnimationFrame(syncCaret);
	};

	const setInput = (value: string, caretPos = value.length) => {
		userInput = value;
		caret = caretPos;
		if (inputContainer) {
			inputContainer.value = value;
			inputContainer.setSelectionRange(caretPos, caretPos);
		}
	};

	const syncCaret = () => {
		if (inputContainer) caret = inputContainer.selectionStart ?? userInput.length;
	};

	$effect(() => {
		today = new Date().toLocaleDateString(data.lang);
		inputContainer?.focus();
	});
</script>

<div class="text-text flex min-h-0 flex-1 flex-col p-4 font-mono">
	<main
		class="border-primary [&::-webkit-scrollbar-thumb]:bg-subtle min-h-0 flex-1 overflow-x-clip overflow-y-auto border-4 border-solid p-4
		[&::-webkit-scrollbar]:w-[1ch]
		[&::-webkit-scrollbar-track]:bg-none"
	>
		<!-- Click-to-focus is a convenience; keyboard users can use the labelled input directly. -->
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<div onclick={() => inputContainer?.focus()} class="flex h-full w-full flex-col items-start">
			<p>
				César Rentería {today ? lang.dateLabel(today) : ''}
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
				<div class="relative">
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
							syncCaret();
						}}
						onkeyup={syncCaret}
						onclick={syncCaret}
						onfocus={syncCaret}
						bind:this={inputContainer}
						style="width: {Math.max(1, userInput.length + 1)}ch; caret-color: transparent;"
						class="font-inherit bg-transparent p-0 text-transparent focus:outline-none"
					/>
					<span
						class="text-text pointer-events-none absolute top-0 left-0 whitespace-pre"
						aria-hidden="true"
					>
						{userInput}
					</span>
					<span
						class="blinking-cursor text-text pointer-events-none absolute top-0"
						style="left: {caret}ch;"
						aria-hidden="true">_</span
					>
				</div>
			</div>
		</div>
	</main>
</div>

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

	@media (prefers-reduced-motion: reduce) {
		.blinking-cursor {
			animation: none;
		}
	}
</style>
