<template>
  <div
    class="card2  min-h-[300px]  mx-auto rounded-lg shadow-lg transition-colors duration-300 outline outline-ctp-pink"
    :class="{ 'bg-ctp-crust': !isFlipped, 'bg-ctp-mauve/50 text-ctp-text ': isFlipped }"
    @click="toggleCard"
  >
    <div class="h-full flex items-center justify-center text-center p-6 ">
      <p class="text-4xl"
        :class="{ 'text-ctp-subtext0': !isFlipped, 'text-ctp-text': isFlipped }"
      >
        {{ isFlipped ? card.answer : card.question }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

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
  setup(props) {
    const isFlipped = ref(false);

    watch(() => props.card, () => {
      isFlipped.value = false;
    }, { deep: true });

    const toggleCard = () => {
      isFlipped.value = !isFlipped.value;
    };

    return {
      isFlipped,
      toggleCard
    };
  }
});
</script>
