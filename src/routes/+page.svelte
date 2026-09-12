<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Marquee from '$lib/components/Marquee.svelte';
	import marqueeCards from '$lib/marqueeCards.json';
  import ProgramCards from "$lib/components/ProgramCards.svelte";
  import programCards from "$lib/programCards.json";
	import FitnessQuiz from '$lib/components/FitnessQuiz.svelte';
  import Pricing from "$lib/components/Pricing.svelte";
</script>

<Navbar />

<section class="h-screen w-full">
	<div
		class="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-black/50 via-black/20 to-transparent"
	></div>
	<img src="/hero.webp" alt="" class="h-full w-full object-cover object-top" />
</section>

<section class="mx-auto max-w-3xl px-6 py-20 text-center">
	<p class="text-2xl leading-relaxed font-light text-gray-800 md:text-3xl lg:text-4xl">
		Пространство, где движение становится осознанным, а тело начинает работать как единая
		взаимосвязанная система.
	</p>
</section>

<section>
	<Marquee cards={marqueeCards} />
</section>

<section class="bg-gray-50 px-6 py-20 my-20 sm:py-16 lg:py-20">
  <div class="mx-auto max-w-3xl">
    <video
      src="/video.mp4"
      autoplay
      muted
      loop
      playsinline
      poster="/img/video-placeholder.jpg"
      class="block aspect-video w-full rounded-2xl object-cover shadow-lg"
    >
      Your browser does not support the video tag.
    </video>
  </div>
</section>

<section class="py-16 sm:py-20 lg:py-24">
  <div class="mx-auto max-w-7xl">
    <div class="px-6 text-center">
      <span
        class="inline-flex items-center rounded-full bg-mauve-800/10 px-4 py-1.5 text-sm font-medium text-mauve-800"
      >
        Программы
      </span>

      <h2
        class="mx-auto mt-5 max-w-4xl text-4xl leading-tight font-medium tracking-tight text-gray-950 sm:text-5xl lg:text-6xl"
      >
        Одно тело. Одна система. Разные способы движения.
      </h2>

      <p
        class="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-gray-600 sm:text-xl"
      >
        Независимо от выбранной практики, Вы работаете по единой методике,
        развивая подвижность, силу, координацию и осознанность через естественную
        биомеханику тела.
      </p>
    </div>

    <div class="mt-10 sm:mt-12">
      <ProgramCards programs={programCards} />
    </div>
  </div>
</section>

<section>
	<FitnessQuiz/>
</section>

<section class="mx-auto max-w-7xl px-6 py-20 bg-gray-100">
  <Pricing/>
</section>
