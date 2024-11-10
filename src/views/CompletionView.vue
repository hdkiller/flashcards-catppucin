<template>
  <div class="flex flex-col items-center justify-center min-h-screen ctp-mocha bg-gradient-to-b from-ctp-base to-ctp-crust">
    <h1 class="text-6xl font-bold mb-8 text-ctp-pink">🎉 Szupcsi! 🎉</h1>
    <div class="flex gap-4">
      <button
        @click="goToClass"
        class="px-6 py-3 bg-ctp-lavender text-ctp-base rounded-lg hover:bg-ctp-mauve transition-colors"
      >
        ← Vissza a tantárgyhoz
      </button>
      <button
        @click="restartDeck"
        class="px-6 py-3 bg-ctp-lavender text-ctp-base rounded-lg hover:bg-ctp-mauve transition-colors"
      >
        ❤️ Megint? ❤️
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const restartDeck = () => {
  // Get the current route parameters
  const classTitle = route.params.classTitle || route.query.classTitle
  const deckTitle = route.params.deckTitle || route.query.deckTitle

  if (classTitle && deckTitle) {
    router.push({
      name: 'deck',
      params: {
        classTitle: classTitle.toString(),
        deckTitle: deckTitle.toString()
      }
    })
  } else {
    // Fallback to home if parameters are missing
    router.push({ name: 'home' })
  }
}

const goToClass = () => {
  // Get the class title from route parameters or query
  const classTitle = route.params.classTitle || route.query.classTitle

  if (classTitle) {
    router.push({
      name: 'class',
      params: { classTitle: classTitle.toString() }
    })
  } else {
    // Fallback to home if class title is missing
    router.push({ name: 'home' })
  }
}
</script>
