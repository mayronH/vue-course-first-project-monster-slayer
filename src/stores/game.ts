import { defineStore } from 'pinia'
import { GameLog } from '../types'

export const useGameStore = defineStore('game', {
  state: () => ({
    monsterHealth: 100,
    playerHealth: 100,

    criticalHit: false,
    playerCritical: false,
    monsterCritical: false,

    currentRound: 0,
    canUseSpecial: true,
    countRoundsForSpecial: 0,
    canHeal: true,
    countRoundsForHeal: 0,
    battleLog: [] as Array<GameLog>,
  }),
  actions: {
    calculateDamage(min: number, max: number, chance: number) {
      // random number between a min and max value
      let attackValue = Math.floor(Math.random() * (max - min)) + min
      const critical = Math.random()

      this.criticalHit = false
      if (critical >= chance) {
        this.criticalHit = true
        attackValue += attackValue * 0.5
      }
      return attackValue
    },
    attackMonster() {
      this.currentRound++
      const damageDealt = this.calculateDamage(5, 15, 0.75)
      this.monsterHealth -= damageDealt

      if (this.criticalHit) {
        this.playerCritical = true
        this.addLogMessage('Player', 'Critical Attack', damageDealt)
      } else {
        this.playerCritical = false
        this.addLogMessage('Player', 'Normal Attack', damageDealt)
      }

      this.attackPlayer()
    },
    attackPlayer() {
      const damageDealt = this.calculateDamage(10, 20, 0.85)
      this.playerHealth -= damageDealt

      if (this.criticalHit) {
        this.monsterCritical = true
        this.addLogMessage('Monster', 'Critical Attack', damageDealt)
      } else {
        this.monsterCritical = false
        this.addLogMessage('Monster', 'Normal Attack', damageDealt)
      }
    },
    specialAttackMonster() {
      this.currentRound++
      this.canUseSpecial = false

      // no critical
      const damageDealt = this.calculateDamage(15, 30, 2)
      this.monsterHealth -= damageDealt
      this.playerCritical = false

      this.addLogMessage('Player', 'Special Attack', damageDealt)

      this.attackPlayer()
    },
    healPlayer() {
      this.currentRound++
      this.canHeal = false

      let healValue = Math.floor(Math.random() * (25 - 10)) + 10

      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100
        healValue = 0
      }
      this.playerHealth += healValue

      this.addLogMessage('Player', 'Healing', healValue)

      this.attackPlayer()
    },
    addLogMessage(actionBy: string, action: string, actionValue: number) {
      this.battleLog.unshift({
        actionBy: actionBy,
        action: action,
        actionValue: actionValue,
      })
    },
  },
})
