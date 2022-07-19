<script setup lang="ts">
import { PropType } from 'vue'
import { GameLog } from '../types'

const props = defineProps({
  battleLog: {
    type: Array as PropType<Array<GameLog>>,
    required: true,
  },
})
</script>

<template>
  <h2>Battle Log</h2>
  <TransitionGroup name="log" tag="ul">
    <li v-for="(log, index) in props.battleLog" :key="index">
      <span>{{ log.actionBy }}</span>
      <span v-if="log.action == 'Normal Attack'" class="log--damage">
        attacks and deals
      </span>
      <span
        v-if="log.action == 'Critical Attack'"
        class="log--damage"
        :style="{ fontWeight: 900 }"
      >
        critical hit deals
      </span>
      <span v-if="log.action == 'Special Attack'" class="log--damage">
        use his special attack and deals
      </span>
      <span v-if="log.action == 'Healing'" class="log--heal">
        heals himself for
      </span>
      <span>{{ log.actionValue }}</span>
    </li>
  </TransitionGroup>
</template>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;

  color: var(--accent2);
}
li {
  margin: 0.5rem 0;
}
.log--damage {
  color: #f17575;
}
.log--heal {
  color: #7ff175;
}

.log-enter-from,
.log-leave-to {
  opacity: 0;
  transform: translate3D(0, -100px, 0);
}
.log-enter-active,
.log-leave-active {
  transition: all 0.2s ease-in;
}
</style>
