<template>
  <main class="min-h-screen py-8 px-4 ctp-mocha  bg-gradient-to-b from-ctp-base to-ctp-crust">
    <div class="max-w-2xl mx-auto">
      <header class="text-center mb-8">
        <h1 class="text-5xl font-bold mb-2 text-ctp-pink from-ctp-pink to-ctp-mauve">Tanulókártyák</h1>
        <div class="flex justify-center gap-4 mb-4">
          <button
            v-for="set in flashcardSets"
            :key="set.meta.title"
            @click="selectFlashcardSet(set)"
            class="text-3xl hover:scale-110 transition-transform duration-200 relative group"
            :class="{ 'opacity-50': currentSet !== set }"
          >
            {{ set.meta.emoji }}
            <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-ctp-surface0 text-ctp-text text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {{ set.meta.description }}
            </div>
          </button>
        </div>
        <p class="text-ctp-subtext0">Kártya {{ currentIndex + 1 }} / {{ currentFlashcards.length }}</p>
      </header>

      <FlashcardItem
        v-if="currentCard"
        :key="currentCard.id"
        :card="currentCard"
        class="mb-8"
      />

      <div class="flex justify-center gap-4">
        <button
          @click="previousCard"
          class="px-4 py-2 rounded-lg bg-ctp-lavender hover:bg-ctp-mauve active:bg-ctp-mauve/75  transition-colors duration-200"
          :disabled="currentIndex === 0"
          :class="{ 'opacity-50 cursor-not-allowed': currentIndex === 0 }"
        >
          Previous
        </button>
        <button
          @click="nextCard"
          class="px-4 py-2 rounded-lg bg-ctp-lavender hover:bg-ctp-mauve active:bg-ctp-mauve/75  transition-colors duration-200"
          :disabled="currentIndex === currentFlashcards.length - 1"
          :class="{ 'opacity-50 cursor-not-allowed': currentIndex === currentFlashcards.length - 1 }"
        >
          Next
        </button>
      </div>

      <div class="mt-8 flex justify-center gap-2">
        <div
          v-for="(_, index) in currentFlashcards"
          :key="index"
          class="w-3 h-3 rounded-full"
          :class="index === currentIndex ? 'bg-blue' : 'bg-surface0'"
        ></div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import FlashcardItem from '../components/FlashcardItem.vue';
import flashcardsData1 from '../data/flashcards.json';
import flashcardsData2 from '../data/flashcards2.json';
import flashcardsData3 from '../data/flashcards3.json';


const flashcardSets = [flashcardsData1, flashcardsData2, flashcardsData3];
const currentSet = ref(flashcardsData1);
const currentIndex = ref(0);

const currentFlashcards = computed(() => currentSet.value.flashcards);
const currentCard = computed(() => currentFlashcards.value[currentIndex.value]);

const selectFlashcardSet = (set: typeof flashcardsData1) => {
  currentSet.value = set;
  currentIndex.value = 0;
};

const nextCard = () => {
  if (currentIndex.value < currentFlashcards.value.length - 1) {
    currentIndex.value++;
  }
};

const previousCard = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};
</script>
