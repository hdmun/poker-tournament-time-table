<template>
  <v-flex class="ma-0">
    <v-row class="ma-0">
      <v-col lg="3" class="pa-0">
        <TournamentBlinds :structure="blindStructure" :current-step="level" />
      </v-col>
      <v-col lg="9" class="pa-0">
        <TournamentClock :data="clock" />
      </v-col>
    </v-row>
  </v-flex>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { PropType } from 'vue'
import TournamentBlinds from '~/components/tournamentBlinds.vue'
import TournamentClock from '~/components/tournamentClock.vue'
import { BlindStructureDto } from '~/dto/blindStructureDto'

@Component({
  components: {
    TournamentBlinds,
    TournamentClock,
  },
})
export default class TournamentClockPage extends Vue {
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
    averageStack: 105000,
  }

  level = 2

  @Prop({ type: Array as PropType<Array<BlindStructureDto>> })
  blindStructure!: BlindStructureDto[]
}
</script>
