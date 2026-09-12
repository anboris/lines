<script lang="ts">
  import {onMount} from 'svelte';

  interface Card {
    title: string;
    description: string;
    image?: string;
    cta?: string;
    href?: string;
  }

  let {cards}: { cards: Card[] } = $props();

  const gradients = [
    'bg-gradient-to-b from-[#ebe7df] to-[#dedad2]',
    'bg-gradient-to-b from-[#d8c5f0] to-[#cfbde6]',
    'bg-gradient-to-b from-[#bddcc6] to-[#b5d3be]'
  ];

  // ms of animation duration per pixel of travel — lower = faster marquee
  const MS_PER_PIXEL = 35;

  let track: HTMLDivElement;
  let animation: Animation | undefined;
  let resizeObserver: ResizeObserver | undefined;

  // Only state that's read in the template needs $state in runes mode.
  let isDragging = $state(false);

  let startX = 0;
  let startPosition = 0;
  let position = 0;
  let hasMoved = false;
  let pendingFrame: number | undefined;

  function getLoopWidth() {
    return track.scrollWidth / 2;
  }

  function wrapPosition(value: number) {
    const width = getLoopWidth();
    if (!width) return 0;
    value %= width;
    if (value > 0) value -= width;
    return value;
  }

  function applyPosition() {
    track.style.transform = `translate3d(${position}px, 0, 0)`;
  }

  function startAnimation() {
    if (!track) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    animation?.cancel();

    const distance = getLoopWidth();
    if (!distance) return;

    animation = track.animate(
      [
        {transform: `translate3d(${position}px, 0, 0)`},
        {transform: `translate3d(${position - distance}px, 0, 0)`}
      ],
      {
        duration: distance * MS_PER_PIXEL,
        iterations: Infinity,
        easing: 'linear'
      }
    );
  }

  // Fully removes the WAAPI animation (not just pauses it) so inline
  // `transform` writes during the drag actually paint. A *paused* WAAPI
  // animation still wins compositing over inline styles, which is what
  // was causing the jittery/unresponsive drag on touch.
  function stopAnimation() {
    if (!animation) return;

    const distance = getLoopWidth();
    const currentTime = animation.currentTime;

    if (typeof currentTime === 'number' && distance) {
      const duration = distance * MS_PER_PIXEL;
      const progress = (currentTime % duration) / duration;
      position = wrapPosition(position - distance * progress);
    }

    animation.cancel();
    animation = undefined;
    applyPosition();
  }

  function queuePosition(value: number) {
    position = wrapPosition(value);

    if (pendingFrame !== undefined) return;

    pendingFrame = requestAnimationFrame(() => {
      pendingFrame = undefined;
      applyPosition();
    });
  }

  function handlePointerDown(event: PointerEvent) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    isDragging = true;
    hasMoved = false;

    stopAnimation();

    startX = event.clientX;
    startPosition = position;

    track.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent) {
    if (!isDragging) return;

    const delta = event.clientX - startX;

    if (Math.abs(delta) > 5) {
      hasMoved = true;
    }

    queuePosition(startPosition + delta);
  }

  function handlePointerUp(event: PointerEvent) {
    if (!isDragging) return;

    isDragging = false;

    if (track.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }

    if (pendingFrame !== undefined) {
      cancelAnimationFrame(pendingFrame);
      pendingFrame = undefined;
      applyPosition();
    }

    startAnimation();
  }

  function handleClick(event: MouseEvent) {
    if (hasMoved) {
      event.preventDefault();
      event.stopPropagation();
    }

    hasMoved = false;
  }

  onMount(() => {
    startAnimation();

    resizeObserver = new ResizeObserver(() => {
      startAnimation();
    });

    resizeObserver.observe(track);

    return () => {
      if (pendingFrame !== undefined) cancelAnimationFrame(pendingFrame);
      animation?.cancel();
      resizeObserver?.disconnect();
    };
  });
</script>

<div class="overflow-hidden py-4">
  <div
    bind:this={track}
    class:cursor-grabbing={isDragging}
    class="flex w-max touch-pan-y cursor-grab gap-4 px-6 [will-change:transform] select-none"
    onpointerdown={handlePointerDown}
    onpointermove={handlePointerMove}
    onpointerup={handlePointerUp}
    onpointercancel={handlePointerUp}
    onclick={handleClick}
  >
    {#each [...cards, ...cards] as card, index (index)}
      {@const originalIndex = index % cards.length}
      {@const isPictureCard = originalIndex % 2 === 0}
      {@const gradientIndex = Math.floor(originalIndex / 2) % gradients.length}

      <article
        class="relative w-72 shrink-0 overflow-hidden rounded-2xl shadow-lg transition-transform sm:w-80"
        style="aspect-ratio: 9 / 16;"
      >
        {#if isPictureCard}
          <!-- Image card -->
          <img
            src={card.image}
            alt={card.title}
            draggable="false"
            class="absolute inset-0 h-full w-full object-cover"
          />

          <div
            class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

          <div class="absolute right-0 bottom-0 left-0 p-4 text-white">
            <h3 class="text-2xl leading-tight font-medium">{card.title}</h3>
            <p class="mt-1 text-base text-white/80">{card.description}</p>

            {#if card.cta}
              <a
                href={card.href ?? '#'}
                class="mt-5 inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-transform hover:scale-105"
              >
                {card.cta}
              </a>
            {/if}
          </div>
        {:else}
          <!-- Gradient card -->
          <div class="absolute inset-0 {gradients[gradientIndex]}"></div>

          <div
            class="relative flex h-full flex-col justify-between p-5 text-neutral">
            <div>
              <h3 class="text-2xl leading-tight font-medium">{card.title}</h3>
              <p class="mt-3">{card.description}</p>
            </div>

            {#if card.cta}
              <a
                href={card.href ?? '#'}
                class="inline-flex w-fit items-center rounded-full bg-white px-4 py-2 text-bases font-medium text-black transition-transform hover:scale-105"
              >
                {card.cta}
              </a>
            {/if}
          </div>
        {/if}
      </article>
    {/each}
  </div>
</div>
