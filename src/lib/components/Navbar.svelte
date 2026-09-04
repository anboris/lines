<script lang="ts">
	import { onMount } from 'svelte';
	import Menu from '@lucide/svelte/icons/menu';
	import X from '@lucide/svelte/icons/x';
	import navItems from '$lib/navItems.json';

	let isVisible = $state(true);
	let lastScrollY = $state(0);
	let isMobileMenuOpen = $state(false);
	let isMobile = $state(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);

	let isMenuButtonVisible = $derived(isMobile || !isVisible);

	const handleScroll = () => {
		if (isMobileMenuOpen) {
			isVisible = true;
			lastScrollY = window.scrollY;
			return;
		}

		if (window.scrollY > lastScrollY && window.scrollY > 80) {
			isVisible = false;
		} else {
			isVisible = true;
		}
		lastScrollY = window.scrollY;
	};

	const showNav = () => {
		isVisible = true;
		lastScrollY = window.scrollY;
	};

	const handleMenuButtonClick = () => {
		if (isMobile) {
			isMobileMenuOpen = !isMobileMenuOpen;
			if (isMobileMenuOpen) {
				isVisible = true;
				lastScrollY = window.scrollY;
			}
		} else {
			showNav();
		}
	};

	const closeMobileMenu = () => {
		isMobileMenuOpen = false;
	};

	onMount(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });

		const handleResize = () => {
			isMobile = window.innerWidth < 1024;
			if (!isMobile) {
				isMobileMenuOpen = false;
			}
		};

		handleResize();
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleResize);
		};
	});
	$effect(() => {
		if (isMobileMenuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	});
</script>

<header
	class="fixed top-0 right-0 left-0 z-20 m-3 flex h-19 items-center gap-3 rounded-xl bg-white/90 px-6 text-black shadow-lg transition-all duration-500 ease-in-out"
	class:-translate-y-[calc(100%+0.75rem)]={!isVisible}
	class:rounded-b-none={isMobileMenuOpen}
>
	<a href="/" aria-label="Homepage" class="shrink-0">
		<img src="/logo.svg" alt="Logo" class="h-5 w-auto" />
	</a>

	<nav aria-label="Main navigation" class="hidden lg:block">
		<ul class="mx-8 flex gap-8">
			{#each navItems as item}
				<li><a href={item.href} class="font-medium hover:underline">{item.label}</a></li>
			{/each}
		</ul>
	</nav>

	<!-- Mobile Menu Dropdown -->
	<div
		class="absolute top-full -right-3 -left-3 mx-3 overflow-hidden rounded-b-xl bg-white/90 text-black shadow-lg transition-all duration-500 ease-in-out {isMobileMenuOpen
			? 'pointer-events-auto max-h-[500px] opacity-100'
			: 'pointer-events-none max-h-0 opacity-0'}"
	>
		<div class="flex flex-col gap-2 px-6 pt-4 pb-6">
			{#each navItems as item}
				<a
					href={item.href}
					onclick={closeMobileMenu}
					class="block rounded-lg px-4 py-3 text-lg font-medium transition-colors hover:bg-black/5"
				>
					{item.label}
				</a>
			{/each}
			<div class="mt-4 border-t border-gray-200 pt-4">
				<a
					href="#"
					onclick={closeMobileMenu}
					class="block w-full rounded-full bg-teal-700 px-6 py-3 text-center
          font-medium text-white transition-colors hover:bg-emerald-900"
				>
					Записаться
				</a>
			</div>
		</div>
	</div>
</header>

<!-- Fixed buttons container -->
<div class="fixed top-7 right-9 z-20 h-10">
	<a
		href="#"
		class="absolute top-0 hidden rounded-full bg-emerald-700 px-6 py-2.5
    text-white transition-all duration-300 ease-in-out hover:scale-110
    hover:bg-emerald-900 active:scale-95 lg:block"
		style:right={isVisible ? '0px' : '52px'}
	>
		Записаться
	</a>

	<button
		onclick={handleMenuButtonClick}
		aria-label={isMobile && isMobileMenuOpen ? 'Close menu' : 'Open menu'}
		class="absolute top-0 right-0 rounded-full bg-white p-2.5 text-black
    shadow-sm transition-all duration-300 ease-in-out hover:scale-110
    active:scale-95"
		class:opacity-0={!isMenuButtonVisible}
		class:scale-75={!isMenuButtonVisible}
		class:pointer-events-none={!isMenuButtonVisible}
		class:opacity-100={isMenuButtonVisible}
		class:scale-100={isMenuButtonVisible}
		class:pointer-events-auto={isMenuButtonVisible}
	>
		{#if isMobile && isMobileMenuOpen}
			<X class="size-6" />
		{:else}
			<Menu class="size-6" />
		{/if}
	</button>
</div>
