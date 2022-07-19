<script setup lang="ts">
import HealthBar from './components/HealthBar.vue'
import BattleLog from './components/BattleLog.vue'
import { computed, ref, watch } from 'vue'
import { GameLog } from './types'
import ResultModal from './components/ResultModal.vue'

const monsterHealth = ref(100)
const playerHealth = ref(100)

const criticalHit = ref(false)
const playerCritical = ref(false)
const monsterCritical = ref(false)

const currentRound = ref(0)
const canUseSpecial = ref(true)
const countRoundsForSpecial = ref(0)
const canHeal = ref(true)
const countRoundsForHeal = ref(0)

const onGame = ref(true)
const isWon = ref(false)

const battleLog = ref<Array<GameLog>>([])

const monsterHealthBarStyle = computed(() => {
  return {
    width: monsterHealth.value + '%',
    backgroundColor: playerCritical.value ? '#f17575' : 'var(--accent)',
  }
})
const playerHealthBarStyle = computed(() => {
  return {
    width: playerHealth.value + '%',
    backgroundColor: monsterCritical.value ? '#f17575' : 'var(--accent)',
  }
})

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
watch(currentRound, () => {
  // Special attack cooldown of 3 turns
  if (!canUseSpecial.value) {
    countRoundsForSpecial.value++
    if (countRoundsForSpecial.value === 3) {
      canUseSpecial.value = true
      countRoundsForSpecial.value = 0
    }
  }

  // Heal cooldown of 4 turns
  if (!canHeal.value) {
    countRoundsForHeal.value++
    if (countRoundsForHeal.value === 4) {
      canHeal.value = true
      countRoundsForHeal.value = 0
    }
  }
})

function calculateDamage(min: number, max: number, chance: number) {
  // random number between a min and max value
  let attackValue = Math.floor(Math.random() * (max - min)) + min
  const critical = Math.random()

  criticalHit.value = false
  if (critical >= chance) {
    criticalHit.value = true
    attackValue += attackValue * 0.5
  }
  return attackValue
}
function attackMonster() {
  currentRound.value++
  const damageDealt = calculateDamage(5, 15, 0.75)
  monsterHealth.value -= damageDealt

  if (criticalHit.value) {
    playerCritical.value = true
    addLogMessage('Player', 'Critical Attack', damageDealt)
  } else {
    playerCritical.value = false
    addLogMessage('Player', 'Normal Attack', damageDealt)
  }

  attackPlayer()
}
function attackPlayer() {
  const damageDealt = calculateDamage(10, 20, 0.85)
  playerHealth.value -= damageDealt

  if (criticalHit.value) {
    monsterCritical.value = true
    addLogMessage('Monster', 'Critical Attack', damageDealt)
  } else {
    monsterCritical.value = false
    addLogMessage('Monster', 'Normal Attack', damageDealt)
  }
}
function specialAttackMonster() {
  currentRound.value++
  canUseSpecial.value = false

  // no critical
  const damageDealt = calculateDamage(15, 30, 2)
  monsterHealth.value -= damageDealt
  playerCritical.value = false

  addLogMessage('Player', 'Special Attack', damageDealt)

  attackPlayer()
}
function healPlayer() {
  currentRound.value++
  canHeal.value = false

  let healValue = Math.floor(Math.random() * (25 - 10)) + 10

  if (playerHealth.value + healValue > 100) {
    playerHealth.value = 100
    healValue = 0
  }
  playerHealth.value += healValue

  addLogMessage('Player', 'Healing', healValue)

  attackPlayer()
}

function endGame(victory: boolean) {
  onGame.value = false
  isWon.value = victory
}
function startGame() {
  onGame.value = true

  // Reset Game
  monsterHealth.value = 100
  playerHealth.value = 100

  canUseSpecial.value = true
  countRoundsForSpecial.value = 0
  canHeal.value = true
  countRoundsForHeal.value = 0
  playerCritical.value = false
  monsterCritical.value = false

  battleLog.value = []
}

function addLogMessage(actionBy: string, action: string, actionValue: number) {
  battleLog.value.unshift({
    actionBy: actionBy,
    action: action,
    actionValue: actionValue,
  })
}
</script>

<template>
  <section class="container">
    <HealthBar
      entity="Monster"
      :health="monsterHealth"
      :style="monsterHealthBarStyle"
    />
    <HealthBar
      entity="Player"
      :health="playerHealth"
      :style="playerHealthBarStyle"
    />
  </section>

  <section v-if="onGame" class="container controls">
    <button @click="attackMonster">ATTACK</button>
    <button :disabled="!canUseSpecial" @click="specialAttackMonster">
      SPECIAL ATTACK
    </button>
    <button :disabled="!canHeal" @click="healPlayer">HEAL</button>
    <button @click="endGame(false)">SURRENDER</button>
  </section>

  <ResultModal v-else :state="isWon" @start-game="startGame" />

  <section class="container">
    <BattleLog :battle-log="battleLog" />
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

.controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-content: center;
  gap: var(--small-size-fluid);
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

button:disabled {
  background-color: var(--accent2);
  color: var(--bg-dark);
  box-shadow: none;

  cursor: not-allowed;
}
</style>
