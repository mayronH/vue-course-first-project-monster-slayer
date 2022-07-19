<script setup lang="ts">
const props = defineProps({
  state: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['start-game'])
</script>

<template>
  <div class="modal">
    <div class="modal-content">
      <header>
        <h2 v-if="props.state">Victory</h2>
        <h2 v-else>Game Over</h2>
      </header>
      <main>
        <button @click="emit('start-game')">Start New Game</button>
      </main>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  inset: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  background: rgba(0, 0, 0, 0.5);
}
.modal-content {
  position: relative;

  width: 480px;
  max-width: 90%;
  min-height: 10rem;

  border-radius: var(--border-radius);

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  background: var(--bg-lighter);

  color: var(--accent2);
}
</style>
