<template>
  <v-flex class="ma-0 fill-height">
    <v-row class="ma-0 fill-height">
      <v-col v-if="showBlindTable" lg="3" class="pa-0">
        <TournamentBlinds
          :structure="blindStructure"
          :current-step="currentIdx"
        />
      </v-col>
      <v-col :lg="showBlindTable ? 9 : 12" class="pa-0" height="100%">
        <TournamentClock
          :data="clock"
          :show-variant.sync="showBlindTable"
          :current-step="currentIdx"
          :starting="startDateTime !== null"
          :blind-count="blindStructure.length"
          @onPlay="onPlay"
          @onPause="onPause"
          @onDownBlind="onDownBlind"
          @onUpBlind="onUpBlind"
        />
      </v-col>
    </v-row>
  </v-flex>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import TournamentBlinds, {
  BlindStructureModel,
} from '~/components/tournamentBlinds.vue'
import TournamentClock from '~/components/tournamentClock.vue'
import { TournamentClockDto } from '~/dto/tournamentClockDto'
import {
  TournamentClockEventDto,
  TournamentDetailDto,
} from '~/dto/tournamentDto'

@Component({
  components: {
    TournamentBlinds,
    TournamentClock,
  },
})
export default class TournamentClockPage extends Vue {
  clock: TournamentClockDto = {
    playTime: '00:00:00',
    nextBreakTime: '00:00',
    remainTime: '00:00',
    pause: false,
    level: 0,
    title: '토너먼트 타이틀',
    smallBlind: 0,
    bigBlind: 0,
    chipsInPlay: 0,
    player: 0,
    totalPlayer: 0,
    averageStack: 0,
  }

  showBlindTable: boolean = false
  blindStructure: BlindStructureModel[] = []

  currentIdx = -1
  tournamentId = -1
  startDateTime: Date | null = null

  eventSource: EventSource | null = null

  mounted() {
    const tournamentId = this.$route.query?.id as string
    if (tournamentId === null) {
      this.$router.go(-1)
      return
    }

    this.loadTournaments(tournamentId)

    this.eventSource = new EventSource(`/api/tournaments/clock/${tournamentId}`)
    this.eventSource.onmessage = (ev: MessageEvent) => {
      this.updateClock(JSON.parse(ev.data) as TournamentClockEventDto)
    }
  }

  beforeDestroy() {
    if (this.eventSource !== null) {
      this.eventSource.close()
    }
  }

  async loadTournaments(tournamentId: string) {
    const res = await this.$axios.get<TournamentDetailDto>(
      `/api/tournaments/${tournamentId}`
    )

    const tournamentDetail = res.data

    this.tournamentId = tournamentDetail.id
    if (!tournamentDetail.startDateTime) {
      return
    }

    this.startDateTime = new Date(tournamentDetail.startDateTime)
    this.clock.title = tournamentDetail.title

    this.blindStructure = []
    let accumulateTime = 0
    this.blindStructure = res.data.structures.map<BlindStructureModel>(
      (value) => {
        accumulateTime += value.minute
        return {
          level: value.level,
          smallBlind: value.smallBlind,
          bigBlind: value.bigBlind,
          minute: value.minute,
          accumMinutes: accumulateTime,
        }
      }
    )
  }

  updateClock(dto: TournamentClockEventDto) {
    this.currentIdx = dto.index
    this.clock.playTime = dto.playTime
    this.clock.nextBreakTime = dto.nextBreakRemainTime
    this.clock.remainTime = dto.remainTime
    this.clock.pause = dto.pause
    this.clock.level = dto.level > 0 ? dto.level : 0
    this.clock.smallBlind = dto.smallBlind
    this.clock.bigBlind = dto.bigBlind

    this.clock.chipsInPlay = 0
    this.clock.player = 0
    this.clock.totalPlayer = 0
    this.clock.averageStack = 0
  }

  async onPlay() {
    await this.$axios.put(`/api/tournaments/${this.tournamentId}/play`)
  }

  async onPause() {
    await this.$axios.put(`/api/tournaments/${this.tournamentId}/pause`)
  }

  async onDownBlind() {
    await this.$axios.put(`/api/tournaments/${this.tournamentId}/blind/down`)
  }

  async onUpBlind() {
    await this.$axios.put(`/api/tournaments/${this.tournamentId}/blind/up`)
  }
}
</script>
