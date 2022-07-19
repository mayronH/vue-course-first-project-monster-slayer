<script setup lang="ts">
const props = defineProps({
  health: {
    type: Number,
    required: true,
  },
  entity: {
    type: String,
    required: true,
  },
  style: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <h2>{{ props.entity }} Health</h2>
  <div class="health-bar">
    <div class="health-bar-value" :style="props.style">
      {{ props.health }} / 100
    </div>
  </div>
</template>

<style scoped>
.health-bar {
  width: 100%;
  height: var(--medium-size-fluid);

  margin: 1rem 0;

  border-radius: var(--border-radius);

  background: var(--bg-dark);

  position: relative;
}
.health-bar-value {
  position: absolute;
  inset: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  color: var(--bg-lighter);
  font-weight: 600;

  background-color: var(--accent);

  border-radius: var(--border-radius);
}
</style>
