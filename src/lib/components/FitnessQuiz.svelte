<script lang="ts">
  import { fade } from 'svelte/transition';
  import programCardsData from '$lib/programCards.json';

  type QuestionId = number;

  interface AnswerOption {
    text: string;
    next: QuestionId;
  }

  interface ChoiceNode {
    text: string;
    type: 'choice';
    options: AnswerOption[];
  }

  interface OutcomeNode {
    text: string;
    type: 'outcome';
  }

  type QuizNode = ChoiceNode | OutcomeNode;
  type QuizData = Record<QuestionId, QuizNode>;

  interface Program {
    id: string;
    title: string;
    description: string;
    details: string;
    image: string;
  }

  const programCards = programCardsData as Program[];

  // Some quiz outcome fragments use slightly different wording than the
  // canonical program titles in programCards.json. This maps the quiz's
  // wording to the exact title used in the program data.
  const programAliases: Record<string, string> = {
    'Комплексная тренировка базовый уровень': 'Базовый уровень',
    'Комплексная тренировка средний уровень': 'Средний уровень',
    'Комплексная тренировка продолжающие': 'Продолжающие',
    'Здоровая спина и осанка': 'Здоровая спина и осанка',
    МФР: 'МФР',
    'Растяжка у станка': 'Растяжка у станка',
    'Тренировка стоп': 'Тренировка стоп',
    'Гимнастические элементы': 'Акробатика'
  };

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const questionFadeIn = prefersReducedMotion ? 0 : 220;
  const questionFadeOut = prefersReducedMotion ? 0 : 120;

  const questions: QuizData = {
    1: {
      text: 'У Вас есть опыт тренировок?',
      type: 'choice',
      options: [
        { text: 'Да', next: 2 },
        { text: 'Нет', next: 33 }
      ]
    },
    2: {
      text: 'Был ли у Вас длительный перерыв (от месяца) в тренировках?',
      type: 'choice',
      options: [
        { text: 'Да', next: 3 },
        { text: 'Нет', next: 6 }
      ]
    },
    3: {
      text: 'Вас беспокоит боль в спине или суставах?',
      type: 'choice',
      options: [
        { text: 'Да', next: 4 },
        { text: 'Нет', next: 5 }
      ]
    },
    33: {
      text: 'Вас беспокоит боль в спине или суставах?',
      type: 'choice',
      options: [
        { text: 'Да', next: 11 },
        { text: 'Нет', next: 111 }
      ]
    },
    4: {
      text: 'Комплексная тренировка базовый уровень. Здоровая спина и осанка. МФР',
      type: 'outcome'
    },
    5: {
      text: 'Комплексная тренировка базовый уровень. Комплексная тренировка средний уровень.',
      type: 'outcome'
    },
    6: {
      text: 'Вам интересны оздоровительные тренировки?',
      type: 'choice',
      options: [
        { text: 'Да', next: 7 },
        { text: 'Нет', next: 8 }
      ]
    },
    7: {
      text: 'Комплексная тренировка базовый уровень. Комплексная тренировка средний уровень. Здоровая спина и осанка. МФР.',
      type: 'outcome'
    },
    8: {
      text: 'Вам интересны тренировки повышенного уровня сложности?',
      type: 'choice',
      options: [
        { text: 'Да', next: 9 },
        { text: 'Нет', next: 10 }
      ]
    },
    9: {
      text: 'Комплексная тренировка продолжающие. Растяжка у станка. Гимнастические элементы.',
      type: 'outcome'
    },
    10: {
      text: 'Комплексная тренировка средний уровень. Комплексная тренировка продолжающие. Растяжка у станка.',
      type: 'outcome'
    },
    11: {
      text: 'Вам хотелось бы научиться садиться на шпагат?',
      type: 'choice',
      options: [
        { text: 'Да', next: 12 },
        { text: 'Нет', next: 13 }
      ]
    },
    111: {
      text: 'Вам хотелось бы научиться садиться на шпагат?',
      type: 'choice',
      options: [
        { text: 'Да', next: 16 },
        { text: 'Нет', next: 17 }
      ]
    },
    12: {
      text: 'Комплексная тренировка базовый уровень.',
      type: 'outcome'
    },
    13: {
      text: 'Вам хотелось бы поработать над осанкой?',
      type: 'choice',
      options: [
        { text: 'Да', next: 14 },
        { text: 'Нет', next: 15 }
      ]
    },
    14: {
      text: 'Здоровая спина и осанка. МФР.',
      type: 'outcome'
    },
    15: {
      text: 'МФР.',
      type: 'outcome'
    },
    16: {
      text: 'Комплексная тренировка базовый уровень. Комплексная тренировка средний уровень.',
      type: 'outcome'
    },
    17: {
      text: 'Здоровая спина и осанка. Тренировка стоп. МФР',
      type: 'outcome'
    }
  };

  const START_ID: QuestionId = 1;

  // `history` still tracks visited ids (used by the branching logic).
  // `questionNumber` is the separate, purely sequential counter shown in
  // the "Вопрос N" label — it can't be derived from `currentId` since
  // branch node ids like 33/111 aren't meant to be displayed as numbers.
  let started = $state(false);
  let questionNumber = $state(0);
  let history = $state<QuestionId[]>([]);
  let currentId = $state<QuestionId>(START_ID);

  let currentNode = $derived(questions[currentId]);

  const labelPillClass =
    'mb-6 inline-flex items-center rounded-full bg-emerald-50 px-4 py-1 text-xs font-medium tracking-wide text-emerald-500 sm:text-sm';

  let outcomeItems = $derived(
    currentNode.type === 'outcome'
      ? currentNode.text
        .split('.')
        .map((part) => part.trim())
        .filter(Boolean)
      : []
  );

  // Resolve each outcome fragment (via the alias map, falling back to the
  // fragment itself) to its full Program record. Fragments that don't
  // resolve to a known program are silently dropped rather than shown.
  let recommendedPrograms = $derived(
    outcomeItems
      .map((item) => programAliases[item] ?? item)
      .map((title) => programCards.find((program) => program.title === title))
      .filter((program): program is Program => Boolean(program))
  );

  function start(event: MouseEvent) {
    (event.currentTarget as HTMLButtonElement).blur();

    started = true;
    questionNumber = 1;
    currentId = START_ID;
    history = [];
  }

  function selectOption(event: MouseEvent, next: QuestionId) {
    // Blur first so the answer button doesn't keep a lingering
    // focus/hover ring that visually jitters once the question changes.
    (event.currentTarget as HTMLButtonElement).blur();

    history.push(currentId);
    currentId = next;
    questionNumber += 1;
  }

  function reset(event: MouseEvent) {
    (event.currentTarget as HTMLButtonElement).blur();

    started = false;
    questionNumber = 0;
    currentId = START_ID;
    history = [];
  }

  let dialogEl: HTMLDialogElement;
  let selectedProgram = $state<Program | null>(null);

  function openProgram(program: Program, event: MouseEvent) {
    (event.currentTarget as HTMLButtonElement).blur();

    selectedProgram = program;
    dialogEl?.showModal();
  }

  function closeProgram() {
    dialogEl?.close();
  }

  // Fires for every way the dialog can close (close button, Escape,
  // backdrop click via closeProgram, or the native cancel event), so this
  // is the single place that clears the selected program.
  function handleDialogClose() {
    selectedProgram = null;
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === dialogEl) {
      closeProgram();
    }
  }
</script>

<div class="mx-auto flex w-full max-w-xl flex-col items-center px-6">
  <div class="relative min-h-[360px] w-full" aria-live="polite">
    {#key started ? currentId : 'intro'}
      <div in:fade={{ duration: questionFadeIn }} out:fade={{ duration: questionFadeOut }} class="absolute inset-0 flex w-full flex-col items-center text-center">
        {#if !started}
          <p class={labelPillClass}>Ваша программа</p>

          <h2 class="text-2xl leading-relaxed font-light text-gray-900 sm:text-3xl">
            Пройдите короткий тест и узнайте, какая тренировка подойдет Вам
          </h2>

          <button
            type="button"
            aria-label="Начать тест"
            onclick={start}
            class="mt-10 rounded-full bg-gray-900 px-10 py-3 text-base font-normal text-white transition-colors hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Начать
          </button>
        {:else if currentNode.type === 'choice'}
          <p class={labelPillClass}>
            Вопрос {questionNumber}
          </p>

          <h2 class="text-2xl leading-snug font-light text-gray-900 sm:text-3xl">
            {currentNode.text}
          </h2>

          <div class="mt-10 flex w-full flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            {#each currentNode.options as option}
              <button
                type="button"
                aria-label={`Ответить: ${option.text}`}
                onclick={(event) => selectOption(event, option.next)}
                class="w-full rounded-full border border-gray-300 px-10 py-3 text-base font-normal text-gray-800 transition-colors hover:border-gray-900 hover:bg-gray-900 hover:text-white focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:outline-none sm:w-40"
              >
                {option.text}
              </button>
            {/each}
          </div>
        {:else}
          <p class={labelPillClass}>Ваша программа</p>

          <h2 class="text-2xl leading-relaxed font-light text-gray-900 sm:text-3xl">
            Рекомендуемые тренировки
          </h2>

          <div class="mt-8 flex w-full flex-col gap-3">
            {#each recommendedPrograms as program (program.id)}
              <button
                type="button"
                aria-label={`Подробнее о программе «${program.title}»`}
                onclick={(event) => openProgram(program, event)}
                class="w-full rounded-full bg-gray-100 px-6 py-3 text-base font-normal text-gray-900 transition-colors hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                {program.title}
              </button>
            {/each}
          </div>

          <button
            type="button"
            aria-label="Начать заново"
            onclick={reset}
            class="mt-10 rounded-full bg-gray-900 px-10 py-3 text-base font-normal text-white transition-colors hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Начать заново
          </button>
        {/if}
      </div>
    {/key}
  </div>
</div>

<dialog
  bind:this={dialogEl}
  onclose={handleDialogClose}
  onclick={handleBackdropClick}
  aria-labelledby="program-dialog-title"
  class="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl border-0 bg-white p-0 text-left shadow-xl backdrop:bg-black/40"
>
  {#if selectedProgram}
    <div class="p-6">
      <img
        src={selectedProgram.image}
        alt={selectedProgram.title}
        class="mb-5 h-48 w-full rounded-2xl object-cover"
      />

      <h2 id="program-dialog-title" class="text-xl font-medium text-gray-900">
        {selectedProgram.title}
      </h2>

      <p class="mt-3 text-base text-gray-700">{selectedProgram.description}</p>

      <p class="mt-3 text-base text-gray-600">{selectedProgram.details}</p>

      <button
        type="button"
        aria-label="Закрыть окно программы"
        onclick={closeProgram}
        class="mt-6 w-full rounded-full bg-gray-900 px-6 py-3 text-base font-normal text-white transition-colors hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        Закрыть
      </button>
    </div>
  {/if}
</dialog>
