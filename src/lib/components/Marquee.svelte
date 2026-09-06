<script lang="ts">
	interface Card {
		title: string;
		description: string;
		image?: string; // optional image URL for picture cards
	}

	let { cards }: { cards: Card[] } = $props();

	// Preset gradients for picture cards without images
	const gradients = [
		'bg-gradient-to-b from-purple-500 to-pink-500',
		'bg-gradient-to-b from-blue-500 to-teal-400',
		'bg-gradient-to-b from-orange-400 to-rose-500',
		'bg-gradient-to-b from-emerald-400 to-cyan-500'
	];
</script>

<div class="flex gap-4 overflow-x-auto px-6 py-4">
	{#each cards as card, index (card.title)}
		{@const isPictureCard = index % 2 === 0}

		<div
			class="relative w-72 shrink-0 overflow-hidden rounded-2xl shadow-lg transition-transform hover:scale-[1.02] active:scale-95 sm:w-80"
			style="aspect-ratio: 9 / 16;"
		>
			{#if isPictureCard}
				<!-- Picture card: image or gradient background -->
				{#if card.image}
					<img
						src={card.image}
						alt={card.title}
						class="absolute inset-0 h-full w-full object-cover"
					/>
				{:else}
					<div class="absolute inset-0 {gradients[index % gradients.length]}"></div>
				{/if}

				<!-- Overlay for text legibility -->
				<div
					class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
				></div>

				<!-- Text at bottom -->
				<div class="absolute right-0 bottom-0 left-0 p-4 text-white">
					<h3 class="text-lg leading-tight font-semibold">{card.title}</h3>
					<p class="mt-1 text-sm text-white/80">{card.description}</p>
				</div>
			{:else}
				<!-- Text card: white background, dark text -->
				<div class="flex h-full flex-col justify-between bg-white p-5">
					<div>
						<h3 class="text-xl font-bold text-gray-900">{card.title}</h3>
						<p class="mt-3 text-base text-gray-700">{card.description}</p>
					</div>
					<!-- Optional decorative element, like a small icon or line -->
					<div class="mt-4 border-t border-gray-200 pt-4 text-sm text-gray-500">Читать далее</div>
				</div>
			{/if}
		</div>
	{/each}
</div>
