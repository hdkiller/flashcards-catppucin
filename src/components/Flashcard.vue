<template>
  <div 
    class="card min-h-[200px] max-w-md mx-auto"
    :class="{ 'bg-blue-50': isFlipped }"
    @click="toggleCard"
  >
    <div class="h-full flex items-center justify-center text-center">
      <p class="text-lg">
        {{ isFlipped ? card.answer : card.question }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface FlashcardType {
  id: number;
  question: string;
  answer: string;
}

const props = defineProps<{
  card: FlashcardType;
}>();

const isFlipped = ref(false);

const toggleCard = () => {
  isFlipped.value = !isFlipped.value;
};
</script>
