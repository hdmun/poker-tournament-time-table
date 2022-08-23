<template>
  <v-flex class="ma-0">
    <v-row class="ma-0">
      <v-col lg="3" class="pa-0">
        <TournamentBlinds :structure="blindStructure" :currentStep="level" />
      </v-col>
      <v-col lg="9" class="pa-0">
        <TournamentClock :data="clock" />
      </v-col>
    </v-row>
  </v-flex>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import TournamentBlinds from '~/components/tournamentBlinds.vue'
import TournamentClock from '~/components/tournamentClock.vue'

@Component({
  components: {
    TournamentBlinds,
    TournamentClock
  }
})
export default class IndexPage extends Vue {
  clock = {
    playTime: '03:27:04',
    nextBreakTime: '58:42',
    remainTime: '05:32',
    level: 2,
    title: '토너먼트 타이틀',
    smallBlind: 10,
    bigBlind: 20,
    chipsInPlay: 1800000,
    player: 8,
    totalPlayer: 19,
    averageStack: 105000
  }

  level = 2

  blindStructure = [
    { sn: 1, level: 1, smallBlind: 50, bigBlind: 100, minute: 40 },
    { sn: 2, level: 2, smallBlind: 100, bigBlind: 200, minute: 40 },
    { sn: 3, level: 3, smallBlind: 200, bigBlind: 400, minute: 40 },
    { sn: 4, level: -1, smallBlind: -1, bigBlind: -1, minute: 15 },
    { sn: 5, level: 4, smallBlind: 400, bigBlind: 800, minute: 40 },
    { sn: 6, level: 5, smallBlind: 500, bigBlind: 1000, minute: 40 },
    { sn: 7, level: 6, smallBlind: 600, bigBlind: 1200, minute: 40 },
    { sn: 8, level: -1, smallBlind: -1, bigBlind: -1, minute: 15 },
    { sn: 9, level: 7, smallBlind: 800, bigBlind: 1600, minute: 40 },
    { sn: 10, level: 8, smallBlind: 100, bigBlind: 2000, minute: 40 },
    { sn: 11, level: 9, smallBlind: 1200, bigBlind: 2400, minute: 40 },
    { sn: 12, level: -1, smallBlind: -1, bigBlind: -1, minute: 15 },
  ]
}
</script>
