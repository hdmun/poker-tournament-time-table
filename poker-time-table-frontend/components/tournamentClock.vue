<template>
  <v-container>
    <v-card>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title class="text-h5 text-center">
            Level {{ level }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-center">{{ title }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-card-text>
        <v-row align="center">
          <v-col class="text-h2 text-center">
            {{ remainTime }}
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col class="text-h4 text-center">
            {{ smallBlind }} / {{ bigBlind }}
          </v-col>
        </v-row>
      </v-card-text>

      <v-list-item>
        <v-list-item-title class="text-center">
          Next Blind: {{ nextSmallBlind }} / {{ nextBigBlind }}
        </v-list-item-title>
      </v-list-item>

    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

interface TournamentClockDto {
  level: number
  title: string
  remainTime: string
  smallBlind: number
  bigBlind: number
  nextSmallBlind: number
  nextBigBlind: number
}

import dummyData from '~/data/tournamentClockDto'

@Component
export default class TournamentClock extends Vue {
  level: number = 1
  title: string = ''
  remainTime: string = '00:00'

  timer: number = 0

  smallBlind: number = 0
  bigBlind: number = 0
  nextSmallBlind: number = 0
  nextBigBlind: number = 0

  created() { }

  mounted() {
    this.timer = this.startTimer()
  }

  beforeDestroy() {
    window.clearInterval(this.timer)
  }

  startTimer() {
    return window.setInterval(() => {
      const data: TournamentClockDto = dummyData
      this.level = data.level
      this.title = data.title
      this.remainTime = data.remainTime
      this.smallBlind = data.smallBlind
      this.bigBlind = data.bigBlind
      this.nextSmallBlind = data.nextSmallBlind
      this.nextBigBlind = data.nextBigBlind
    }, 500)
  }
}
</script>