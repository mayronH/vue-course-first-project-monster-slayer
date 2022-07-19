<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useGameStore } from './stores/game'

import HealthBar from './components/HealthBar.vue'
import BattleLog from './components/BattleLog.vue'
import ResultModal from './components/ResultModal.vue'
import GameControls from './components/GameControls.vue'

const onGame = ref(true)
const isWon = ref(false)

const gameStatus = useGameStore()

const monsterHealthBarStyle = computed(() => {
  return {
    width: gameStatus.monsterHealth + '%',
    backgroundColor: gameStatus.playerCritical ? '#f17575' : 'var(--accent)',
  }
})
const playerHealthBarStyle = computed(() => {
  return {
    width: gameStatus.playerHealth + '%',
    backgroundColor: gameStatus.monsterCritical ? '#f17575' : 'var(--accent)',
  }
})

const { monsterHealth, playerHealth } = storeToRefs(gameStatus)

watch(monsterHealth, () => {
  if (monsterHealth.value <= 0) {
    monsterHealth.value = 0
    endGame(true)
  }
})
watch(playerHealth, () => {
  if (playerHealth.value <= 0) {
    playerHealth.value = 0
    endGame(false)
  }
})

function endGame(victory: boolean) {
  onGame.value = false
  isWon.value = victory
}
function startGame() {
  onGame.value = true

  // Reset Game
  gameStatus.monsterHealth = 100
  gameStatus.playerHealth = 100

  gameStatus.canUseSpecial = true
  gameStatus.countRoundsForSpecial = 0
  gameStatus.canHeal = true
  gameStatus.countRoundsForHeal = 0
  gameStatus.playerCritical = false
  gameStatus.monsterCritical = false

  gameStatus.battleLog = []
}
</script>

<template>
  <section class="container">
    <HealthBar
      entity="Monster"
      :health="gameStatus.monsterHealth"
      :style="monsterHealthBarStyle"
    />
    <HealthBar
      entity="Player"
      :health="gameStatus.playerHealth"
      :style="playerHealthBarStyle"
    />
  </section>

  <GameControls v-if="onGame" class="container" @surrender="endGame(false)" />

  <ResultModal v-else :state="isWon" @start-game="startGame" />

  <section class="container">
    <BattleLog :battle-log="gameStatus.battleLog" />
  </section>
</template>

<style>
section {
  width: 90%;
  max-width: 40rem;

  margin: auto;
}
.container {
  text-align: center;

  padding: 0.5rem;
  margin: 1rem auto;

  background-color: var(--bg-lighter);

  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
}

button {
  color: var(--bg-dark);

  background-color: var(--accent);

  border: none;
  border-radius: var(--border-radius);

  padding: 1rem 2rem;
  width: 100%;
  height: 100%;

  cursor: pointer;

  box-shadow: var(--box-shadow);
}
button:is(:hover, :active) {
  background-color: var(--bg-dark);
  color: var(--accent);
  box-shadow: var(--box-shadow);
}
</style>
