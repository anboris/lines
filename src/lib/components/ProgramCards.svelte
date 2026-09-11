<script lang="ts">
  interface Program {
    title: string;
    description: string;
    image: string;
    details: string;
  }

  let {programs}: { programs: Program[] } = $props();

  // Independent flip state per card, keyed by index.
  let flipped = $state<Record<number, boolean>>({});

  function toggleFlip(index: number) {
    flipped[index] = !flipped[index];
  }

  let track: HTMLDivElement;

  function scrollByCard(direction: 1 | -1) {
    if (!track) return;

    const card = track.querySelector<HTMLElement>('[data-card]');
    const gap = 16; // matches gap-4
    const amount = card ? card.offsetWidth + gap : track.clientWidth;

    track.scrollBy({left: amount * direction, behavior: 'smooth'});
  }
</script>

<div class="relative">
  <div bind:this={track}
       class="no-scrollbar flex gap-4 overflow-x-auto px-6 py-4">
    {#each programs as program, index (index)}
      {@const isFlipped = flipped[index] ?? false}

      <div
        data-card
        class="relative w-72 shrink-0 sm:w-80 [perspective:1200px]"
        style="aspect-ratio: 9 / 16;"
      >
        <div
          class="relative h-full w-full transition-transform duration-[550ms] ease-in-out [transform-style:preserve-3d]"
          style={isFlipped ? 'transform: rotateY(180deg);' : ''}
        >
          <!-- Front -->
          <div
            class="absolute inset-0 overflow-hidden rounded-2xl shadow-lg [backface-visibility:hidden]"
          >
            <img
              src={program.image}
              alt={program.title}
              class="absolute inset-0 h-full w-full object-cover"
            />

            <div
              class="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(42_33_44/0.25)_0%,transparent_30%,transparent_75%,rgb(42_33_44/0.40)_100%)]"
            ></div>

            <div class="absolute inset-x-0 top-0 p-4">
              <h3
                class="text-2xl leading-tight font-medium text-mauve-50">{program.title}</h3>
            </div>

            <div class="absolute right-0 bottom-0 left-0 p-4 pr-16 text-white">
              <p class="text-base text-white/80">{program.description}</p>
            </div>

            <button
              type="button"
              aria-label="Подробнее"
              onclick={() => toggleFlip(index)}
              class="absolute right-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-md transition-transform hover:scale-105"
            >
              <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none"
                   stroke="currentColor" stroke-width="2"
                   stroke-linecap="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </button>
          </div>

          <!-- Back -->
          <div
            class="absolute inset-0 overflow-hidden rounded-2xl bg-mauve-800 p-5 shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]"
          >
            <div class="flex h-full flex-col text-white">
              <h3
                class="text-2xl leading-tight font-medium">{program.title}</h3>
              <p
                class="no-scrollbar mt-3 flex-1 overflow-y-auto text-base text-white/80">{program.details}</p>
            </div>

            <button
              type="button"
              aria-label="Закрыть"
              onclick={() => toggleFlip(index)}
              class="absolute right-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-md transition-transform hover:scale-105"
            >
              <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none"
                   stroke="currentColor" stroke-width="2"
                   stroke-linecap="round">
                <path d="M6 6l12 12M18 6L6 18"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <div class="hidden justify-end gap-2 px-6 pb-2 md:flex">
    <button
      type="button"
      aria-label="Прокрутить влево"
      onclick={() => scrollByCard(-1)}
      class="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow-md transition-transform hover:scale-105"
    >
      <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>

    <button
      type="button"
      aria-label="Прокрутить вправо"
      onclick={() => scrollByCard(1)}
      class="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow-md transition-transform hover:scale-105"
    >
      <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </button>
  </div>
</div>

<style>
  .no-scrollbar {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* legacy Edge */
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none; /* Chrome, Safari */
  }
</style>
