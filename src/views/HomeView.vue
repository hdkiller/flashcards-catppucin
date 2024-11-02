<template>
  <main class="min-h-screen bg-gray-100 py-8 px-4">
    <div class="max-w-2xl mx-auto">
      <header class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Flashcards</h1>
        <p class="text-gray-600">Card {{ currentIndex + 1 }} of {{ flashcards.length }}</p>
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
          class="btn"
          :disabled="currentIndex === 0"
          :class="{ 'opacity-50 cursor-not-allowed': currentIndex === 0 }"
        >
          Previous
        </button>
        <button
          @click="nextCard"
          class="btn"
          :disabled="currentIndex === flashcards.length - 1"
          :class="{ 'opacity-50 cursor-not-allowed': currentIndex === flashcards.length - 1 }"
        >
          Next
        </button>
      </div>

      <div class="mt-8 flex justify-center gap-2">
        <div
          v-for="(_, index) in flashcards"
          :key="index"
          class="w-3 h-3 rounded-full"
          :class="index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'"
        ></div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import FlashcardItem from '../components/FlashcardItem.vue';
import flashcardsData from '../data/flashcards.json';

const flashcards = flashcardsData.flashcards;
const currentIndex = ref(0);

const currentCard = computed(() => flashcards[currentIndex.value]);

const nextCard = () => {
  if (currentIndex.value < flashcards.length - 1) {
    currentIndex.value++;
  }
};

const previousCard = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};
</script>
