<template>
  <div class="flex flex-col items-center justify-center min-h-screen ctp-mocha bg-gradient-to-b from-ctp-base to-ctp-crust">
    <h1 class="text-6xl font-bold mb-8 text-ctp-pink">🎉 Szupcsi! 🎉</h1>
    <button
      @click="restartSession"
      class="px-6 py-3 bg-ctp-lavender text-ctp-base rounded-lg hover:bg-ctp-mauve transition-colors"
    >
      ❤️ Megint? ❤️
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const restartSession = () => {
  router.go(-1) // Go back to previous page instead of home | BUG: this has to be refactored | File: Coding | ID: 1730670887 |
}
</script>
