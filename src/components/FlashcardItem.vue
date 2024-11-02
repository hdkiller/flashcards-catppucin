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
import { ref, watch } from 'vue';

interface FlashcardType {
  id: number;
  question: string;
  answer: string;
}

const props = defineProps<{
  card: FlashcardType;
}>();

const isFlipped = ref(false);

// Watch for changes to the card prop and reset isFlipped state
watch(() => props.card, () => {
  isFlipped.value = false;
}, { deep: true });

const toggleCard = () => {
  isFlipped.value = !isFlipped.value;
};
</script>
