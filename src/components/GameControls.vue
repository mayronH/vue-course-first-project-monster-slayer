<script setup lang="ts">
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '../stores/game'

const emit = defineEmits(['surrender'])

const gameStatus = useGameStore()

const { currentRound } = storeToRefs(gameStatus)

watch(currentRound, () => {
  // Special attack cooldown of 3 turns
  if (!gameStatus.canUseSpecial) {
    gameStatus.countRoundsForSpecial++
    if (gameStatus.countRoundsForSpecial === 3) {
      gameStatus.canUseSpecial = true
      gameStatus.countRoundsForSpecial = 0
    }
  }

  // Heal cooldown of 4 turns
  if (!gameStatus.canHeal) {
    gameStatus.countRoundsForHeal++
    if (gameStatus.countRoundsForHeal === 4) {
      gameStatus.canHeal = true
      gameStatus.countRoundsForHeal = 0
    }
  }
})
</script>

<template>
  <section class="container controls">
    <button @click="gameStatus.attackMonster">ATTACK</button>
    <button
      :disabled="!gameStatus.canUseSpecial"
      @click="gameStatus.specialAttackMonster"
    >
      SPECIAL ATTACK
    </button>
    <button :disabled="!gameStatus.canHeal" @click="gameStatus.healPlayer">
      HEAL
    </button>
    <button @click="emit('surrender')">SURRENDER</button>
  </section>
</template>

<style scoped>
.controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-content: center;
  gap: var(--small-size-fluid);
}

button:disabled {
  background-color: var(--accent2);
  color: var(--bg-dark);
  box-shadow: none;

  cursor: not-allowed;
}
</style>
