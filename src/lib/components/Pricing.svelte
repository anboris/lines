<script lang="ts">
  import { onMount } from "svelte";

  /* ============================================================
   * Typed pricing data
   * ============================================================ */

  type PerClass = number | "unlimited";

  interface PricingOption {
    label: string;
    value: number; // total price in ₽
    perClass: PerClass; // price per class, or "unlimited"
  }

  interface StaticPrice {
    amount: string;
    period: string;
    promo?: boolean;
  }

  interface PricingCard {
    id: string;
    badge: string;
    badgeVariant?: "popular" | "startup";
    featured?: boolean;
    trial?: boolean;
    name: string;
    nameTag?: string;
    desc: string;
    options?: PricingOption[]; // cards with a workout-count selector
    staticPrice?: StaticPrice; // cards with a fixed price (trial pane)
    priceKind?: "standard" | "split"; // "split" => price per person
    features: string[];
    button: string;
  }

  interface PricingTab {
    id: string;
    label: string;
    cards: PricingCard[];
  }

  const tabs: PricingTab[] = [
    {
      id: "single",
      label: "Разовые",
      cards: [
        {
          id: "trial",
          badge: "Первый визит",
          badgeVariant: "startup",
          trial: true,
          name: "Пробное занятие",
          desc: "Знакомство со студией, тренерами и направлениями",
          staticPrice: {
            amount: "800 ₽",
            period: "Бесплатно при покупке абонемента!",
            promo: true,
          },
          features: [
            "60–90 минут тренировки в зависимости от направления",
            "Индивидуальные рекомендации тренера",
          ],
          button: "Записаться",
        },
        {
          id: "week",
          badge: "Хит для новичков",
          badgeVariant: "popular",
          featured: true,
          trial: true,
          name: "Пробная неделя",
          desc: "Для тех, кто хочет познакомиться поближе",
          staticPrice: { amount: "3 000 ₽", period: "7 дней для знакомства" },
          features: [
            "Включает 3 групповых занятия по различным направлениям",
            "Действует 7 дней с момента активации",
          ],
          button: "Попробовать",
        },
        {
          id: "dropin",
          badge: "Без обязательств",
          trial: true,
          name: "Разовый визит",
          desc: "Для тех, чья жизнь спонтанна",
          staticPrice: { amount: "1 500 ₽", period: "Оплата за один визит" },
          features: [
            "Любое время: с 11:00 до 22:00",
            "1 200 ₽ в дневное время (до 17:00)",
          ],
          button: "Купить визит",
        },
      ],
    },
    {
      id: "group",
      label: "Групповые",
      cards: [
        {
          id: "day",
          badge: "Будни до 17:00",
          name: "Дневной",
          desc: "Для тех, кто тренируется утром и днем",
          options: [
            { label: "4 занятия (1 месяц)", value: 4400, perClass: 1100 },
            { label: "6 занятий (1 месяц)", value: 6000, perClass: 1000 },
            { label: "8 занятий (1 месяц)", value: 7200, perClass: 900 },
            { label: "12 занятий (1 месяц)", value: 9600, perClass: 800 },
          ],
          features: [
            "1.5 часа комплексаня тренировка",
            "1 час другие направления",
            "Пробная тренировка бесплатно при покупке абонемента в день занятия",
          ],
          button: "Выбрать",
        },
        {
          id: "complex",
          badge: "11:00 – 22:00",
          badgeVariant: "popular",
          featured: true,
          name: "Комплексный",
          desc: "Все направления и тренеры",
          options: [
            { label: "4 занятия (1 месяц)", value: 5200, perClass: 1300 },
            { label: "6 занятий (1 месяц)", value: 7200, perClass: 1200 },
            { label: "8 занятий (1 месяц)", value: 8800, perClass: 1100 },
            { label: "12 занятий (1 месяц)", value: 12000, perClass: 1000 },
            { label: "12 занятий (3 месяца)", value: 12000, perClass: 1000 },
            { label: "18 занятий (3 месяца)", value: 17000, perClass: 945 },
            { label: "24 занятия (3 месяца)", value: 22000, perClass: 917 },
            { label: "Безлимит (1 месяц)", value: 18000, perClass: "unlimited" },
            { label: "Безлимит (3 месяца)", value: 27000, perClass: "unlimited" },
          ],
          features: [
            "Полный доступ без ограничений",
            "1.5 часа комплексная тренировка",
            "1 час другие направления",
          ],
          button: "Выбрать",
        },
        {
          id: "student",
          badge: "11:00 – 19:00",
          name: "Студенческий",
          desc: "Скидки для студентов дневного отделения",
          options: [
            { label: "4 занятия (1 месяц)", value: 4420, perClass: 1105 },
            { label: "6 занятий (1 месяц)", value: 6120, perClass: 1020 },
            { label: "8 занятий (1 месяц)", value: 7480, perClass: 935 },
            { label: "12 занятий (1 месяц)", value: 10200, perClass: 850 },
            { label: "12 занятий (3 месяца)", value: 10200, perClass: 850 },
            { label: "18 занятий (3 месяца)", value: 14450, perClass: 803 },
            { label: "24 занятия (3 месяца)", value: 18700, perClass: 780 },
            { label: "Безлимит (1 месяц)", value: 15300, perClass: "unlimited" },
            { label: "Безлимит (3 месяца)", value: 22950, perClass: "unlimited" },
          ],
          features: [
            "Обязательно предъявление студенческого билета",
            "1.5 часа комплексная тренировка",
            "1 час другие направления",
          ],
          button: "Выбрать",
        },
      ],
    },
    {
      id: "individual",
      label: "Индивидуальные",
      cards: [
        {
          id: "private",
          badge: "Максимум внимания",
          featured: true,
          name: "Персонально",
          nameTag: "1-на-1",
          desc: "Индивидуальная программа для наилучшего результата",
          priceKind: "standard",
          options: [
            { label: "1 занятие (Разовое)", value: 2900, perClass: 2900 },
            { label: "4 занятия (Пакет)", value: 10400, perClass: 2600 },
            { label: "6 занятий (Пакет)", value: 15000, perClass: 2500 },
            { label: "8 занятий (Пакет)", value: 19200, perClass: 2400 },
          ],
          features: [
            "Продолжительность: 1 час",
            "Найдем идеальное время для вашей тренировки",
          ],
          button: "Записаться",
        },
        {
          id: "split",
          badge: "Для двоих",
          badgeVariant: "popular",
          name: "Сплит",
          nameTag: "2-на-1",
          desc: "Тренируйтесь в паре с подругой, партнёром или коллегой",
          priceKind: "split",
          options: [
            { label: "1 занятие (Разовое)", value: 3900, perClass: 1950 },
            { label: "4 занятия (Пакет)", value: 14400, perClass: 1800 },
            { label: "6 занятий (Пакет)", value: 21000, perClass: 1750 },
            { label: "8 занятий (Пакет)", value: 27200, perClass: 1700 },
          ],
          features: [
            "Продолжительность: 1 час",
            "Цена указана за двоих человек одновременно",
          ],
          button: "Записаться вдвоём",
        },
      ],
    },
  ];

  /* ============================================================
   * Reactive state (Svelte 5 runes)
   * ============================================================ */

  let activeTabId = $state<TabId>("single");

  // Selected option index per card (keyed by card id), defaults to 0
  let selections = $state<Record<string, number>>({});

  type TabId = (typeof tabs)[number]["id"];

  function selectTab(id: TabId) {
    activeTabId = id;
  }

  function selectedOption(card: PricingCard): PricingOption | undefined {
    return card.options?.[selections[card.id] ?? 0];
  }

  function formatTotal(opt: PricingOption): string {
    return opt.value.toLocaleString("ru-RU") + " ₽";
  }

  // Handles "Без лимита" and the split (per-person) edge cases
  function formatPerClass(opt: PricingOption, kind?: "standard" | "split"): string {
    if (opt.perClass === "unlimited") return "Безлимитные посещения";
    const v = opt.perClass.toLocaleString("ru-RU");
    return kind === "split" ? `${v} ₽ за человека` : `${v} ₽ / занятие`;
  }

  function scrollToContacts() {
    document.getElementById("contacts")?.scrollIntoView({ behavior: "smooth" });
  }

  // Optional: activate tab from URL hash (e.g. #group)
  onMount(() => {
    const hash = window.location.hash.replace("#", "") as TabId;
    if (tabs.some((t) => t.id === hash)) activeTabId = hash;
  });
</script>

<section class="pricing" id="pricing">
  <div class="pricing__tabs" role="tablist">
    {#each tabs as tab (tab.id)}
      <button
        class="pricing-tab"
        class:active={activeTabId === tab.id}
        role="tab"
        aria-selected={activeTabId === tab.id}
        onclick={() => selectTab(tab.id)}
      >
        {tab.label}
      </button>
    {/each}
  </div>

  <!-- PANES (conditional rendering instead of CSS display toggling) -->
  <div class="pricing__panes">
    {#each tabs as tab (tab.id)}
      {#if activeTabId === tab.id}
        <div class="pricing-pane active" role="tabpanel">
          <div
            class="pricing__grid"
            class:pricing__grid--private={tab.id === "individual"}
          >
            {#each tab.cards as card (card.id)}
              <div
                class="pricing__card"
                class:pricing__card--featured={card.featured}
                class:pricing__card--trial={card.trial}
              >
                <span
                  class="pricing__card-badge"
                  class:pricing__card-badge--popular={card.badgeVariant === "popular"}
                  class:pricing__card-badge--startup={card.badgeVariant === "startup"}
                >
                  {card.badge}
                </span>
                <div class="pricing__card-name">
                  {card.name}
                  {#if card.nameTag}
                    <span class="pricing__small-tag">{card.nameTag}</span>
                  {/if}
                </div>
                <div class="pricing__card-desc">{card.desc}</div>

                {#if card.options}
                  {@const opt = selectedOption(card)}
                  <div class="pricing__workout-selector">
                    <label for="{card.id}-sessions">Количество тренировок:</label>
                    <select
                      id="{card.id}-sessions"
                      bind:value={selections[card.id]}
                    >
                      {#each card.options as option, i (i)}
                        <option value={i}>{option.label}</option>
                      {/each}
                    </select>
                  </div>

                  {#if opt}
                    <div class="pricing__display">
                      <div class="pricing__display-amount">{formatTotal(opt)}</div>
                      <div class="pricing__display-period">
                        {formatPerClass(opt, card.priceKind)}
                      </div>
                    </div>
                  {/if}
                {:else if card.staticPrice}
                  <div class="pricing__display">
                    <div class="pricing__display-amount">{card.staticPrice.amount}</div>
                    <div
                      class="pricing__display-period"
                      class:pricing__display-period--promo={card.staticPrice.promo}
                    >
                      {card.staticPrice.period}
                    </div>
                  </div>
                {/if}

                <ul class="pricing__features">
                  {#each card.features as feature (feature)}
                    <li>{feature}</li>
                  {/each}
                </ul>

                <button
                  class="pricing__btn"
                  class:pricing__btn--primary={card.featured || card.id === "trial"}
                  onclick={scrollToContacts}
                >
                  {card.button}
                </button>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    {/each}
  </div>
</section>

<style>
  /* PRICING */
  .pricing {
  }

  .pricing__header {
    text-align: center;
  }

  .pricing__tabs {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-block-end: 48px;
    flex-wrap: wrap;
    background: rgba(255, 255, 255, 0.6);
    padding: 6px;
    border-radius: 100px;
    max-inline-size: fit-content;
    margin-inline: auto;
    backdrop-filter: blur(12px);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  }

  /* JS-dependent - keep as .pricing-tab */
  .pricing-tab {
    padding: 12px 28px;
    border: 0;
    border-radius: 100px;
    font-size: 15px;
    font-weight: 500;
    font-family: inherit;
    color: #6e6e73;
    background: 0 0;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
    letter-spacing: -0.01em;
  }

  .pricing-tab:hover {
    color: #1d1d1f;
    background: rgba(0, 0, 0, 0.04);
  }

  .pricing-tab.active {
    background: #1d1d1f;
    color: #fff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }

  .pricing-tab.active:hover {
    background: #1d1d1f;
  }

  .pricing__panes {
    position: relative;
  }

  /* JS-dependent - keep as .pricing-pane */
  .pricing-pane {
    display: none;
    animation: paneFade 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    margin-block-end: calc(3 * var(--card-gap));
  }

  .pricing-pane.active {
    display: block;
  }

  @keyframes paneFade {
    0% {
      opacity: 0;
      transform: translateY(8px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .pricing__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 24px;
    padding-inline: 20px;
  }

  .pricing__grid--private {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    max-width: 800px;
    margin-inline: auto;
  }

  .pricing__card {
    background: #fff;
    border-radius: 24px;
    padding: 32px 28px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.5);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }

  .pricing__card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
  }

  .pricing__card--featured {
    background: #1d1d1f;
    color: #fff;
    border-color: #1d1d1f;
  }

  .pricing__card--featured .pricing__display-amount,
  .pricing__card--featured .pricing__card-desc,
  .pricing__card--featured .pricing__card-name {
    color: #fff;
  }

  .pricing__card-badge {
    display: inline-block;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: 4px 14px;
    border-radius: 100px;
    background: rgba(0, 0, 0, 0.05);
    color: #6e6e73;
    margin-bottom: 12px;
    align-self: flex-start;
  }

  .pricing__card-badge--popular {
    background: #1d1d1f;
    color: #fff;
  }

  .pricing__card--featured
  .pricing__card-badge:not(.pricing__card-badge--popular) {
    background: rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.7);
  }

  .pricing__card--featured .pricing__card-badge--popular {
    background: #fff;
    color: #1d1d1f;
  }

  .pricing__card-badge--startup {
    background: #e8f0fe;
    color: #1a5c9e;
  }

  .pricing__card--featured .pricing__card-badge--startup {
    background: rgba(232, 240, 254, 0.2);
    color: #8ab4f8;
  }

  .pricing__card-name {
    font-size: 20px;
    font-weight: 600;
    margin-block-end: 6px;
    color: #1d1d1f;
  }

  .pricing__card-desc {
    font-size: 14px;
    color: #6e6e73;
    line-height: 1.5;
    margin-block-end: 20px;
  }

  .pricing__small-tag {
    font-size: 14px;
    font-weight: 400;
    color: #6e6e73;
    background: rgba(0, 0, 0, 0.05);
    padding: 2px 10px;
    border-radius: 100px;
    margin-left: 6px;
  }

  .pricing__card--featured .pricing__small-tag {
    color: rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.1);
  }

  .pricing__workout-selector {
    margin-block: 12px 8px;
    width: 100%;
  }

  .pricing__workout-selector label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #6e6e73;
    margin-bottom: 6px;
  }

  .pricing__workout-selector select {
    width: 100%;
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    background: #f5f5f7;
    font-size: 14px;
    font-family: inherit;
    font-weight: 450;
    color: #1d1d1f;
    cursor: pointer;
    transition: all 0.2s ease;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236e6e73' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding: 10px 40px 10px 16px;
  }

  .pricing__workout-selector select:hover {
    border-color: rgba(0, 0, 0, 0.15);
    background-color: #efeff1;
  }

  .pricing__workout-selector select:focus {
    outline: 0;
    border-color: #1d1d1f;
    box-shadow: 0 0 0 3px rgba(29, 29, 31, 0.08);
  }

  .pricing__card--featured .pricing__workout-selector select {
    background-color: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
    color: #fff;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23ffffff' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  }

  .pricing__card--featured .pricing__workout-selector label {
    color: rgba(255, 255, 255, 0.6);
  }

  .pricing__display {
    margin-block: 8px 4px;
  }

  .pricing__display-amount {
    font-size: 42px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: #1d1d1f;
    line-height: 1.1;
  }

  .pricing__display-period {
    font-size: 14px;
    color: #6e6e73;
  }

  .pricing__display-period--promo {
    color: #1a7a3a;
    font-weight: 500;
  }

  .pricing__card--featured .pricing__display-amount {
    color: #fff;
  }

  .pricing__card--featured .pricing__display-period {
    color: rgba(255, 255, 255, 0.6);
  }

  .pricing__card--featured .pricing__display-period--promo {
    color: #66d98b;
  }

  .pricing__card--trial .pricing__display-amount {
    font-size: 38px;
  }

  .pricing__features {
    list-style: none;
    margin-block: 12px 20px;
    flex: 1;
    padding: 0;
  }

  .pricing__features li {
    padding-block: 5px;
    font-size: 14px;
    color: #6e6e73;
    display: flex;
    line-height: 1.3;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  }

  .pricing__features li:last-child {
    border-bottom: none;
  }

  .pricing__features li::before {
    content: "✓";
    color: #34c759;
    font-weight: 600;
    font-size: 14px;
  }

  .pricing__card--featured .pricing__features li {
    color: rgba(255, 255, 255, 0.8);
  }

  .pricing__card--featured .pricing__features li::before {
    color: #34c759;
  }

  .pricing__btn {
    padding: 14px 24px;
    border-radius: 100px;
    border: 0;
    background: #f5f5f7;
    color: #1d1d1f;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;
    width: 100%;
  }

  .pricing__btn:hover {
    background: #e5e5ea;
    transform: scale(1.02);
  }

  .pricing__btn--primary {
    background: #1d1d1f;
    color: #fff;
  }

  .pricing__btn--primary:hover {
    background: #333;
    transform: scale(1.02);
  }

  .pricing__card--featured .pricing__btn {
    background: #fff;
    color: #1d1d1f;
  }

  .pricing__card--featured .pricing__btn:hover {
    background: rgba(255, 255, 255, 0.9);
  }

  .pricing__card--featured .pricing__btn--primary {
    background: #fff;
    color: #1d1d1f;
  }

  .pricing__card--featured .pricing__btn--primary:hover {
    background: rgba(255, 255, 255, 0.9);
  }

  /* Sub-tabs (for individual pane if needed) */
  .pricing__sub-tabs {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-block-end: 32px;
    background: rgba(255, 255, 255, 0.4);
    padding: 4px;
    border-radius: 100px;
    max-inline-size: fit-content;
    margin-inline: auto;
  }

  /* JS-dependent - keep as .sub-tab */
  .sub-tab {
    padding: 8px 24px;
    border: 0;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 500;
    font-family: inherit;
    color: #6e6e73;
    background: 0 0;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
  }

  .sub-tab:hover {
    color: #1d1d1f;
    background: rgba(0, 0, 0, 0.04);
  }

  .sub-tab.active {
    color: #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .sub-tab.active,
  .sub-tab.active:hover {
    background: #1d1d1f;
  }

  .pricing__sub-panes {
    position: relative;
  }

  /* JS-dependent - keep as .sub-pane */
  .sub-pane {
    display: none;
    animation: paneFade 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .sub-pane.active {
    display: block;
  }

  @media (max-width: 640px) {
    .pricing__tabs {
      border-radius: 16px;
      padding: 4px;
      gap: 4px;
      flex-wrap: nowrap;
      overflow-x: auto;
      width: 100%;
      justify-content: flex-start;
    }

    .pricing-tab {
      padding: 10px 18px;
      font-size: 13px;
      white-space: nowrap;
    }

    .pricing__grid {
      grid-template-columns: 1fr;
      padding-inline: 12px;
    }

    .pricing__grid--private {
      grid-template-columns: 1fr;
    }

    .pricing__card {
      padding: 24px 20px;
    }

    .pricing__display-amount {
      font-size: 34px;
    }

    .pricing__card--trial .pricing__display-amount {
      font-size: 32px;
    }

    .pricing__workout-selector select {
      font-size: 13px;
      padding: 8px 40px 8px 14px;
    }

    .pricing__card-badge {
      font-size: 10px;
      padding: 3px 12px;
    }

    .pricing__sub-tabs {
      border-radius: 16px;
      padding: 4px;
      flex-wrap: nowrap;
      overflow-x: auto;
      width: 100%;
      justify-content: flex-start;
    }

    .sub-tab {
      padding: 8px 16px;
      font-size: 13px;
      white-space: nowrap;
    }
  }
</style>
