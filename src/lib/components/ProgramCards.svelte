<script lang="ts">
  interface Program {
    title: string;
    description: string;
    image: string;
    details: string;
  }

  let { programs }: { programs: Program[] } = $props();

  let flipped = $state<Record<number, boolean>>({});

  function toggleFlip(index: number) {
    flipped[index] = !flipped[index];
  }

  let track: HTMLDivElement;

  function scrollByCard(direction: 1 | -1) {
    if (!track) return;

    const card = track.querySelector<HTMLElement>('[data-card]');
    const gap = 16;
    const amount = card ? card.offsetWidth + gap : track.clientWidth;

    track.scrollBy({
      left: amount * direction,
      behavior: 'smooth'
    });
  }
</script>

<div class="mx-auto max-w-7xl">
  <div class="relative px-6">

    <!-- Centered heading -->
    <div class="text-center">
      <h2
        class="mx-auto max-w-4xl text-4xl leading-tight font-normal tracking-tight text-mist-900 sm:text-5xl lg:text-6xl"
      >
        Одно тело. Одна система. Разные способы движения.
      </h2>

      <p
        class="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-mist-700 sm:text-xl"
      >
        Независимо от выбранной практики, Вы работаете по единой методике,
        развивая подвижность, силу, координацию и осознанность через естественную
        биомеханику тела.
      </p>
    </div>

    <!-- Desktop controls -->
    <div class="absolute right-6 bottom-0 hidden gap-2 md:flex">
      <button
        type="button"
        aria-label="Прокрутить влево"
        onclick={() => scrollByCard(-1)}
        class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-md transition-transform hover:scale-105"
      >
        <svg
          viewBox="0 0 24 24"
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Прокрутить вправо"
        onclick={() => scrollByCard(1)}
        class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-md transition-transform hover:scale-105"
      >
        <svg
          viewBox="0 0 24 24"
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>

  </div>
</div>

<!-- Cards -->
<div class="mt-10">
  <div
    bind:this={track}
    class="no-scrollbar flex gap-4 overflow-x-auto px-6 py-4"
  >
    {#each programs as program, index (index)}
      {@const isFlipped = flipped[index] ?? false}

      <div
        data-card
        class="relative w-72 shrink-0 [perspective:1200px] sm:w-80"
        style="aspect-ratio: 9 / 16;"
      >
        <div
          class="relative h-full w-full transition-transform duration-[550ms] ease-in-out [transform-style:preserve-3d]"
          style={isFlipped ? 'transform: rotateY(180deg);' : ''}
        >
          <!-- Front -->
          <div
            class="absolute inset-0 shadow-md overflow-hidden rounded-2xl [backface-visibility:hidden]"
          >
            <img
              src={program.image}
              alt={program.title}
              class="absolute inset-0 h-full w-full object-cover"
            />

            <div
              class="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(156_168_171/0.0)_0%,transparent_30%,transparent_75%,rgb(156_168_171/0.0)_100%)]"
            ></div>

            <div class="absolute inset-x-0 top-0 p-4">
              <h3
                class="text-2xl leading-tight font-normal text-mist-900">{program.title}</h3>
            </div>

            <div class="absolute right-0 bottom-0 left-0 p-4 pr-16 text-white">
              <p class="text-base text-mist-900">
                {program.description}
              </p>
            </div>

            <button
              type="button"
              aria-label="Подробнее"
              onclick={() => toggleFlip(index)}
              class="absolute shadow-md right-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105"
            >
              <svg
                viewBox="0 0 24 24"
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>

          <!-- Back -->
          <div
            class="absolute inset-0 overflow-hidden rounded-2xl bg-[#4e936f] p-5 shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]"
          >
            <div class="flex h-full flex-col text-white">
              <h3 class="text-2xl leading-tight font-medium">
                {program.title}
              </h3>

              <p
                class="no-scrollbar mt-3 flex-1 overflow-y-auto text-base text-white/80"
              >
                {program.details}
              </p>
            </div>

            <button
              type="button"
              aria-label="Закрыть"
              onclick={() => toggleFlip(index)}
              class="absolute right-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-md transition-transform hover:scale-105"
            >
              <svg
                viewBox="0 0 24 24"
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .no-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
</style>
