<template>
  <div
    class="card min-h-[300px] mx-auto rounded-lg shadow-lg transition-colors duration-300 outline outline-ctp-pink relative"
    :class="{ 'bg-ctp-crust': !isFlipped, 'bg-ctp-mauve/50 text-ctp-text ': isFlipped }"
    @click="toggleCard"
  >
    <div
      class="card-content h-full flex items-center justify-center text-center p-6"
    >
      <p class="text-4xl"
        :class="{ 'text-ctp-subtext0': !isFlipped, 'text-ctp-text': isFlipped }"
      >
        {{ isFlipped ? card.answer : card.question }}
      </p>
    </div>

    <!-- Rating buttons that appear when card is flipped -->
    <div
      v-if="isFlipped"
      class="absolute bottom-0 left-0 right-0 flex justify-center gap-4 p-4 bg-ctp-surface0 bg-opacity-90 rounded-b-lg"
      @click.stop
    >
      <button
        v-for="rating in ratings"
        :key="rating.value"
        @click="rateCard(rating.value)"
        class="text-2xl hover:transform hover:scale-125 transition-transform duration-200 cursor-pointer"
        :title="rating.label"
      >
        {{ rating.emoji }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, onUnmounted } from 'vue';

export default defineComponent({
  name: 'FlashcardItem',
  props: {
    card: {
      type: Object as () => {
        id: number;
        question: string;
        answer: string;
      },
      required: true
    }
  },
  emits: ['flip', 'rate'],
  setup(props, { emit }) {
    const isFlipped = ref(false);
    const ratings = [
      { emoji: '😕', value: 1, label: 'Hard' },
      { emoji: '🙂', value: 2, label: 'Okay' },
      { emoji: '😊', value: 3, label: 'Easy' },
      { emoji: '😎', value: 4, label: 'Nailed it' }
    ];

    watch(() => props.card, () => {
      isFlipped.value = false;
    }, { deep: true });

    const toggleCard = () => {
      isFlipped.value = !isFlipped.value;
      emit('flip', isFlipped.value);
    };

    const rateCard = (rating: number) => {
      emit('rate', { cardId: props.card.id, rating });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isFlipped.value) return;

      const key = event.key;
      if (['1', '2', '3', '4'].includes(key)) {
        event.preventDefault();
        const rating = parseInt(key);
        rateCard(rating);
      }
    };

    onMounted(() => {
      window.addEventListener('keydown', handleKeyDown);
    });

    onUnmounted(() => {
      window.removeEventListener('keydown', handleKeyDown);
    });

    return {
      isFlipped,
      toggleCard,
      ratings,
      rateCard
    };
  }
});
</script>
