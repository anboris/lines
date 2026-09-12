<script>
  import Navbar from '$lib/components/Navbar.svelte';
  import Marquee from '$lib/components/Marquee.svelte';
  import marqueeCards from '$lib/marqueeCards.json';
  import ProgramCards from "$lib/components/ProgramCards.svelte";
  import programCards from "$lib/programCards.json";
  import FitnessQuiz from '$lib/components/FitnessQuiz.svelte';
  import Pricing from "$lib/components/Pricing.svelte";
</script>

<Navbar/>

<section class="h-screen w-full">
  <div
    class="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-black/50 via-black/20 to-transparent"
  ></div>
  <img src="/hero.webp" alt="" class="h-full w-full object-cover object-top"/>
</section>

<section class="mx-auto px-6 py-20 text-center bg-[#F9F9EF]">
  <p
    class="text-2xl leading-relaxed font-light text-gray-800 md:text-3xl lg:text-4xl">
    Пространство, где движение становится осознанным, а тело начинает работать
    как единая
    взаимосвязанная система.
  </p>
</section>

<section class="bg-gradient-to-t from-[#F9F9EF] to-[#F9F9EF]">
  <Marquee cards={marqueeCards}/>
</section>

<section class="bg-[#F9F9EF] px-6 py-20 sm:py-16 lg:py-20">
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

<section
  class="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-[#F9F9EF] to-[#e1ebe3]">
  <ProgramCards programs={programCards}/>
</section>

<section class="mx-auto max-w-7xl px-6 py-20 bg-gradient-to-t from-[#F9F9EF] to-[#e1ebe3]">
  <Pricing/>
</section>
