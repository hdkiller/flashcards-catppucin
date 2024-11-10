<template>
  <div
    class="card min-h-[300px] mx-auto rounded-lg shadow-lg transition-colors duration-300 outline outline-ctp-pink relative"
    :class="{ 'bg-ctp-crust': !isFlipped, 'bg-ctp-mauve/50 text-ctp-text ': isFlipped }"
    @click="toggleCard"
  >
    <div
      class="card-content h-full flex items-center justify-center text-center p-6"
    >
      <div class="text-3xl markdown-content"
        :class="{ 'text-ctp-subtext0': !isFlipped, 'text-ctp-text': isFlipped }"
        v-html="currentContent"
      >
      </div>
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

<style scoped>
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}

.shake {
  animation: shake 0.5s;
}

:deep(.markdown-content) {
  /* Basic markdown styles */
  h1 { @apply text-4xl font-bold mb-4; }
  h2 { @apply text-3xl font-bold mb-3; }
  h3 { @apply text-2xl font-bold mb-2; }
  p { @apply mb-4; }
  ul, ol { @apply list-disc list-inside mb-4; }
  li { @apply mb-1; }
  code { @apply bg-ctp-surface0 px-1 rounded; }
  pre { @apply bg-ctp-surface0 p-4 rounded mb-4 overflow-x-auto; }
  blockquote { @apply border-l-4 border-ctp-overlay0 pl-4 italic; }
  a { @apply text-ctp-blue underline; }
  strong { @apply font-bold; }
  em { @apply italic; }
}
</style>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { marked } from 'marked';

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

    const currentContent = computed(() => {
      const content = isFlipped.value ? props.card.answer : props.card.question;
      return marked(content);
    });

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
      if (!isFlipped.value) {
        const cardElement = document.querySelector('.card-content') as HTMLElement;
        if (cardElement) {
          cardElement.classList.add('shake');
          setTimeout(() => {
            cardElement.classList.remove('shake');
          }, 500);
        }
        return;
      }
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
      rateCard,
      currentContent
    };
  }
});
</script>
