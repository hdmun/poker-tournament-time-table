<template>
  <v-card height="100%">
    <v-row justify="center">
      <v-col lg="2">
        <v-card-title class="justify-center">
          PLAY TIME
        </v-card-title>

        <v-card-title class="justify-center pt-0">
          {{ playTime }}
        </v-card-title>
      </v-col>

      <v-col lg="2">
        <v-card-title class="justify-center">
          NEXT BREAK
        </v-card-title>

        <v-card-title class="justify-center pt-0">
          {{ nextBreakTime }}
        </v-card-title>
      </v-col>
    </v-row>

    <v-row class="mt-0">
      <v-col>
        <v-card-title class="justify-center" style="font-size: 12em; line-height: 12rem;">
          {{ remainTime }}
        </v-card-title>
      </v-col>
    </v-row>

    <v-row justify="center" class="mb-6">
      <v-btn tile outlined class="ma-2">
        <v-icon>
          mdi-chevron-left
        </v-icon>
      </v-btn>
      <v-btn tile outlined class="ma-2">
        <v-icon v-if="playing">
          mdi-pause
        </v-icon>
        <v-icon v-else>
          mdi-play
        </v-icon>
      </v-btn>
      <v-btn tile outlined class="ma-2">
        <v-icon>
          mdi-chevron-right
        </v-icon>
      </v-btn>
    </v-row>

    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="text-h5 text-center">
          Level {{ level }}
        </v-list-item-title>
        <v-list-item-subtitle class="text-center">{{ title }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-card-text>
      <v-row justify="center">
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

  playTime: string = '03:27:04'
  nextBreakTime: string = '58:42'
  remainTime: string = '00:00'

  timer: number = 0

  smallBlind: number = 0
  bigBlind: number = 0
  nextSmallBlind: number = 0
  nextBigBlind: number = 0

  playing: boolean = false

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