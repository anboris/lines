<script>
	import Navbar from '$lib/components/Navbar.svelte';
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
