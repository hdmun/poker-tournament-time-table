<template>
  <v-row class="ma-0 fill-height">
    <v-col :lg="12" class="pa-0" height="100%">
      <TournamentClock
        :data="clock"
        :show-variant.sync="showBlindTable"
        :current-step="currentIdx"
        :blind-count="blindStructure.length"
        :starting="started"
        :edit-mode="editBlindTable"
        @onPlay="onPlay"
        @onPause="onPause"
        @onDownBlind="onDownBlind"
        @onUpBlind="onUpBlind"
      />
    </v-col>

    <v-navigation-drawer v-model="showBlindTable" right temporary fixed>
      <TournamentBlinds
        ref="blindTable"
        :structure.sync="blindStructure"
        :current-step="currentIdx"
        :edit-mode="editBlindTable"
        @onBlindEdit="onBlindEdit"
        @onBlindEditClose="onBlindEditClose"
      />
    </v-navigation-drawer>
  </v-row>
</template>

<script lang="ts">
import { Component, Ref, Vue, Watch } from 'nuxt-property-decorator'
import TournamentBlinds, {
  BlindEditDto,
  BlindStructureModel,
} from '~/components/tournaments/tournamentBlinds.vue'
import TournamentClock from '~/components/tournaments/tournamentClock.vue'
import { TournamentClockDto } from '~/dto/tournamentClockDto'
import {
  TournamentBlindDto,
  TournamentClockEventDto,
  TournamentDetailDto,
} from '~/dto/tournamentDto'

interface WsResponse<T> {
  event: string
  data: T
}
@Component({
  components: {
    TournamentBlinds,
    TournamentClock,
  },
})
export default class TournamentClockPage extends Vue {
  @Ref()
  blindTable!: TournamentBlinds

  clock: TournamentClockDto = {
    playTime: '00:00:00',
    nextBreakTime: '00:00',
    remainHours: '00',
    remainMinutes: '00',
    remainSeconds: '00',
    pause: true,
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
  editBlindTable: boolean = false
  blindStructure: BlindStructureModel[] = []

  currentIdx = -1
  tournamentId = -1
  started: boolean = false

  webSocket: WebSocket | null = null

  mounted() {
    const tournamentId = this.$route.query?.id as string
    if (tournamentId === null) {
      this.$router.go(-1)
      return
    }

    this.loadTournaments(tournamentId)

    const url = new URL(`/ws/tournaments/events`, location.href)
    url.protocol = 'ws'
    this.webSocket = new WebSocket(url)
    this.webSocket.onmessage = this.onmessage
    this.webSocket.onopen = () => {
      this.webSocket?.send(
        JSON.stringify({ event: 'clock', data: Number(tournamentId) })
      )
    }
  }

  onmessage(ev: MessageEvent<string>) {
    const wsResponse = JSON.parse(
      ev.data
    ) as WsResponse<TournamentClockEventDto>
    this.updateClock(wsResponse.data)
  }

  beforeDestroy() {
    if (this.webSocket !== null) {
      this.webSocket.close()
    }
  }

  async loadTournaments(tournamentId: string) {
    const res = await this.$axios.get<TournamentDetailDto>(
      `/api/tournaments/${tournamentId}`
    )

    const tournamentDetail = res.data
    this.tournamentId = tournamentDetail.id
    this.started = tournamentDetail.startDateTime !== null
    this.clock.title = tournamentDetail.title

    this.blindStructure.splice(0)
    this.blindStructure.push(
      ...res.data.structures.map<BlindStructureModel>((value) => {
        return {
          level: value.level,
          smallBlind: value.smallBlind,
          bigBlind: value.bigBlind,
          minute: value.minute,
        }
      })
    )

    this.blindTable.updateMaxBlindLevel()
  }

  updateClock(dto: TournamentClockEventDto) {
    this.currentIdx = dto.index
    this.started = dto.started
    this.clock.playTime = dto.playTime
    this.clock.nextBreakTime = dto.nextBreakRemainTime
    this.clock.remainHours = dto.reaminHours
    this.clock.remainMinutes = dto.reaminMinutes
    this.clock.remainSeconds = dto.reaminSeconds
    this.clock.pause = dto.pause
    this.clock.level = dto.level > 0 ? dto.level : 0
    this.clock.smallBlind = dto.smallBlind
    this.clock.bigBlind = dto.bigBlind

    this.clock.chipsInPlay = 0
    this.clock.player = 0
    this.clock.totalPlayer = 0
    this.clock.averageStack = 0
  }

  async onBlindEdit(dto: BlindEditDto) {
    this.editBlindTable = dto.edit

    if (dto.request) {
      const updateBlinds = this.blindStructure.map<TournamentBlindDto>(
        (value) => value
      )
      const res = await this.$axios.put<BlindStructureModel[]>(
        `/api/tournaments/${this.tournamentId}/blinds`,
        updateBlinds
      )
      this.blindStructure = res.data.map<BlindStructureModel>((value) => {
        return {
          level: value.level,
          smallBlind: value.smallBlind,
          bigBlind: value.bigBlind,
          minute: value.minute,
        }
      })
    }
  }

  @Watch('showBlindTable')
  onChangeShowBlindTable(val: boolean) {
    // 편집 중에 닫히면 close 처리
    if (this.editBlindTable && !val) {
      this.blindTable.onBlindEditClose()
    }
  }

  onBlindEditClose() {
    this.editBlindTable = false
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
