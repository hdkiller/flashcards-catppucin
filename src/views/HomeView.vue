<!-- Previous template code remains unchanged -->
<template>
  <main class="min-h-screen py-8 px-4 ctp-mocha bg-gradient-to-b from-ctp-base to-ctp-crust">
    <div class="max-w-2xl mx-auto">
      <header class="text-center mb-8">
        <h1 class="text-5xl font-bold mb-2 text-ctp-pink from-ctp-pink to-ctp-mauve">Tanulókártyák</h1>

        <!-- Class Selection -->
        <div v-if="!currentClass" class="mb-8">
          <h2 class="text-2xl mb-4 text-ctp-subtext0">Válassz tantárgyat</h2>
          <div class="flex justify-center gap-4 flex-wrap">
            <button
              v-for="classData in classes"
              :key="classData.classData.title"
              @click="selectClass(classData)"
              class="px-6 py-4 rounded-lg bg-ctp-surface0 hover:bg-ctp-surface1 transition-colors duration-200 group"
            >
              <span class="text-6xl block mb-2">{{ classData.classData.emoji }}</span>
              <span class="block text-ctp-text font-medium text-xl">{{ classData.classData.title }}</span>
              <span class="text-sm text-ctp-subtext0">{{ classData.classData.description }}</span>
            </button>
          </div>
        </div>

        <!-- Deck Selection and Navigation -->
        <template v-else>
          <div class="flex items-center justify-center gap-2 mb-4">

            <h2 class="text-2xl text-ctp-subtext0">
              {{ currentClass.classData.title }}
            </h2>
          </div>

          <p class="text-ctp-subtext0" v-if="currentDeck">
            Kártya {{ currentIndex + 1 }} / {{ currentFlashcards.length }}
          </p>

          <div v-if="!currentDeck" class="flex justify-center gap-4 mb-4">
            <button
              v-for="deck in currentClass.decks"
              :key="deck.meta.title"
              @click="selectDeck(deck)"
              class="text-3xl hover:scale-110 transition-transform duration-200 relative group"
            >
              {{ deck.meta.emoji }}
              <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-ctp-surface0 text-ctp-text text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {{ deck.meta.description }}
              </div>
            </button>
          </div>
        </template>
      </header>

      <!-- Flashcard Display with Transition -->
      <transition :name="transitionName" mode="out-in">
        <FlashcardItem
          v-if="currentCard"
          :key="currentCard.id"
          :card="currentCard"
          class="mb-8"
          @flip="handleFlip"
          @rate="handleRate"
        />
      </transition>

      <!-- Navigation Buttons -->
      <div v-if="currentDeck" class="flex justify-center gap-4">
        <button
          @click="previousCard"
          class="px-4 py-2 rounded-lg bg-ctp-lavender hover:bg-ctp-mauve active:bg-ctp-mauve/75 transition-colors duration-200"
          :disabled="currentIndex === 0"
          :class="{ 'opacity-50 cursor-not-allowed': currentIndex === 0 }"
        >
          Előző
        </button>
        <button
          @click="nextCard"
          class="px-4 py-2 rounded-lg bg-ctp-lavender hover:bg-ctp-mauve active:bg-ctp-mauve/75 transition-colors duration-200"
          :disabled="currentIndex === currentFlashcards.length - 1"
          :class="{ 'opacity-50 cursor-not-allowed': currentIndex === currentFlashcards.length - 1 }"
        >
          Következő
        </button>
      </div>

      <!-- Progress Dots -->
      <div v-if="currentDeck" class="mt-8 flex justify-center gap-2">
        <div
          v-for="(_, index) in currentFlashcards"
          :key="index"
          class="w-3 h-3 rounded-full"
          :class="index === currentIndex ? 'bg-ctp-blue' : 'bg-ctp-surface0'"
        ></div>
      </div>

      <div v-if="currentDeck || currentClass" class="flex justify-center mt-4 pt-4">
        <button
          @click="goBack"
          class="text-ctp-subtext0 hover:text-ctp-text"
        >
          ← Vissza
        </button>
      </div>

    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import FlashcardItem from '../components/FlashcardItem.vue';
import { loadClass, listClasses, type FlashcardDeck, type ClassData } from '../utils/classLoader';

interface LoadedClass {
  classData: ClassData;
  decks: FlashcardDeck[];
}

interface CardHistory {
  rating: number;
  lastReviewed: number;
}

const CARDS_PER_SESSION = 10; // Increased from 5 to 10
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const router = useRouter();
const route = useRoute();

const classes = ref<LoadedClass[]>([]);
const currentClass = ref<LoadedClass | null>(null);
const currentDeck = ref<FlashcardDeck | null>(null);
const currentIndex = ref(0);
const isNavigatingForward = ref(true);

const currentFlashcards = computed(() => currentDeck.value?.flashcards || []);
const currentCard = computed(() => currentFlashcards.value[currentIndex.value]);
const transitionName = computed(() => isNavigatingForward.value ? 'slide-forward' : 'slide-backward');

// Load class and deck based on route parameters
const loadFromRoute = async () => {
  const classTitle = route.params.classTitle as string;
  const deckTitle = route.params.deckTitle as string;

  if (classTitle && classes.value.length > 0) {
    const foundClass = classes.value.find(c => c.classData.title === classTitle);
    if (foundClass) {
      currentClass.value = foundClass;

      if (deckTitle) {
        const foundDeck = foundClass.decks.find(d => d.meta.title === deckTitle);
        if (foundDeck) {
          currentDeck.value = {
            ...foundDeck,
            flashcards: selectCardsForSession(foundDeck, classTitle)
          };
          currentIndex.value = 0;
        }
      } else {
        currentDeck.value = null;
      }
    }
  } else {
    currentClass.value = null;
    currentDeck.value = null;
  }
};

// Watch for route changes
watch(() => route.params, async () => {
  await loadFromRoute();
}, { immediate: true });

// Load available classes on mount
onMounted(async () => {
  try {
    const availableClasses = await listClasses();
    const loadedClasses = await Promise.all(
      availableClasses.map(classDir => loadClass(classDir))
    );
    classes.value = loadedClasses;
    await loadFromRoute();
  } catch (error) {
    console.error('Error loading classes:', error);
  }
});

const getStorageKey = (classTitle: string, deckTitle: string) =>
  `${classTitle}-${deckTitle}-history`;

const loadCardHistory = (storageKey: string): Record<number, CardHistory> => {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || '{}');
  } catch {
    return {};
  }
};

// Fisher-Yates shuffle algorithm
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Calculate card priority based on spaced repetition algorithm
const calculateCardPriority = (cardHistory: CardHistory | undefined): number => {
  if (!cardHistory) return Infinity; // Highest priority for new cards

  const { rating, lastReviewed } = cardHistory;
  const daysSinceReview = (Date.now() - lastReviewed) / MILLISECONDS_PER_DAY;

  // Calculate interval based on rating (1-5)
  // Lower ratings = shorter intervals
  const interval = Math.pow(2, rating - 1); // 1 day, 2 days, 4 days, 8 days, 16 days

  // Priority increases as we get closer to or pass the due date
  return (daysSinceReview / interval);
};

const selectCardsForSession = (deck: FlashcardDeck, classTitle: string): typeof deck.flashcards => {
  const storageKey = getStorageKey(classTitle, deck.meta.title);
  const cardHistory = loadCardHistory(storageKey);

  // Calculate priority for each card
  const cardsWithPriority = deck.flashcards.map(card => ({
    card,
    priority: calculateCardPriority(cardHistory[card.id])
  }));

  // Group cards by similar priority (rounded to 1 decimal place)
  const priorityGroups: { [key: string]: typeof deck.flashcards } = {};
  cardsWithPriority.forEach(({ card, priority }) => {
    const roundedPriority = Math.round(priority * 10) / 10;
    if (!priorityGroups[roundedPriority]) {
      priorityGroups[roundedPriority] = [];
    }
    priorityGroups[roundedPriority].push(card);
  });

  // Shuffle each priority group and combine them
  const sortedAndShuffledCards = Object.entries(priorityGroups)
    .sort(([priority1], [priority2]) => Number(priority2) - Number(priority1)) // Sort by priority (highest first)
    .flatMap(([, cards]) => shuffleArray(cards));

  // Take the first CARDS_PER_SESSION cards
  return sortedAndShuffledCards.slice(0, CARDS_PER_SESSION);
};

const selectClass = (classData: LoadedClass) => {
  router.push({
    name: 'class',
    params: { classTitle: classData.classData.title }
  });
};

const selectDeck = (deck: FlashcardDeck) => {
  if (!currentClass.value) return;

  router.push({
    name: 'deck',
    params: {
      classTitle: currentClass.value.classData.title,
      deckTitle: deck.meta.title
    }
  });
};

const goBack = () => {
  router.push({ name: 'home' });
};

const nextCard = () => {
  if (currentIndex.value < currentFlashcards.value.length - 1) {
    isNavigatingForward.value = true;
    currentIndex.value++;
  } else if (currentClass.value && currentDeck.value) {
    router.push({
      name: 'completion',
      params: {
        classTitle: currentClass.value.classData.title,
        deckTitle: currentDeck.value.meta.title
      }
    });
  }
};

const previousCard = () => {
  if (currentIndex.value > 0) {
    isNavigatingForward.value = false;
    currentIndex.value--;
  }
};

const handleKeyPress = (event: KeyboardEvent) => {
  if (!currentDeck.value) return;

  switch (event.key) {
    case ' ':
    case 'Spacebar':
      event.preventDefault();
      const cardElement = document.querySelector('.card-content') as HTMLElement;
      if (cardElement) {
        cardElement.click();
      }
      break;
    case 'ArrowLeft':
    case 'Backspace':
      event.preventDefault();
      previousCard();
      break;
    case 'Enter':
    case 'ArrowRight':
      event.preventDefault();
      nextCard();
      break;
    case 'Escape':
      event.preventDefault();
      goBack();
      break;
  }
};

const handleFlip = () => {
  // This function can be used to handle any additional logic when a card is flipped
  // For now it's just a placeholder for future functionality
};

const handleRate = ({ cardId, rating }: { cardId: number, rating: number }) => {
  // Store the rating and timestamp in localStorage
  if (currentClass.value && currentDeck.value) {
    const storageKey = getStorageKey(
      currentClass.value.classData.title,
      currentDeck.value.meta.title
    );
    const storedHistory = loadCardHistory(storageKey);
    storedHistory[cardId] = {
      rating,
      lastReviewed: Date.now()
    };
    localStorage.setItem(storageKey, JSON.stringify(storedHistory));
  }

  // Advance to the next card
  nextCard();
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
});
</script>

<style scoped>
/* Forward transition */
.slide-forward-enter-active,
.slide-forward-leave-active,
.slide-backward-enter-active,
.slide-backward-leave-active {
  transition: all 0.5s ease;
}

.slide-forward-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.slide-forward-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Backward transition */
.slide-backward-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.slide-backward-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

/* Common styles for both directions */
.slide-forward-enter-to,
.slide-forward-leave-from,
.slide-backward-enter-to,
.slide-backward-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
