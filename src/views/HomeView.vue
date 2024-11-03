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
              <span class="text-3xl block mb-2">{{ classData.classData.emoji }}</span>
              <span class="block text-ctp-text font-medium">{{ classData.classData.title }}</span>
              <span class="text-sm text-ctp-subtext0">{{ classData.classData.description }}</span>
            </button>
          </div>
        </div>

        <!-- Deck Selection and Navigation -->
        <template v-else>
          <div class="flex items-center justify-center gap-2 mb-4">
            <button
              @click="currentClass = null"
              class="text-ctp-subtext0 hover:text-ctp-text"
            >
              ← Vissza
            </button>
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
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import FlashcardItem from '../components/FlashcardItem.vue';
import { loadClass, listClasses, type FlashcardDeck, type ClassData } from '../utils/classLoader';

interface LoadedClass {
  classData: ClassData;
  decks: FlashcardDeck[];
}

const classes = ref<LoadedClass[]>([]);
const currentClass = ref<LoadedClass | null>(null);
const currentDeck = ref<FlashcardDeck | null>(null);
const currentIndex = ref(0);
const isNavigatingForward = ref(true);

const currentFlashcards = computed(() => currentDeck.value?.flashcards || []);
const currentCard = computed(() => currentFlashcards.value[currentIndex.value]);
const transitionName = computed(() => isNavigatingForward.value ? 'slide-forward' : 'slide-backward');

// Load available classes on mount
onMounted(async () => {
  try {
    const availableClasses = await listClasses();
    const loadedClasses = await Promise.all(
      availableClasses.map(classDir => loadClass(classDir))
    );
    classes.value = loadedClasses;
  } catch (error) {
    console.error('Error loading classes:', error);
  }
});

const selectClass = (classData: LoadedClass) => {
  currentClass.value = classData;
  currentDeck.value = null;
  currentIndex.value = 0;
};

const selectDeck = (deck: FlashcardDeck) => {
  currentDeck.value = deck;
  currentIndex.value = 0;
};

const nextCard = () => {
  if (currentIndex.value < currentFlashcards.value.length - 1) {
    isNavigatingForward.value = true;
    currentIndex.value++;
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
    case 'Enter':
      event.preventDefault();
      const cardElement = document.querySelector('.card-content') as HTMLElement;
      if (cardElement) {
        cardElement.click();
      }
      break;
    case 'ArrowLeft':
      event.preventDefault();
      previousCard();
      break;
    case 'ArrowRight':
      event.preventDefault();
      nextCard();
      break;
  }
};

const handleFlip = () => {
  // This function can be used to handle any additional logic when a card is flipped
  // For now it's just a placeholder for future functionality
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
