<template>
  <v-row class="ma-0 fill-height">
    <v-col :lg="12" class="pa-0" height="100%">
      <TournamentClock
        :data="clock"
        :show-variant.sync="showBlindTable"
        :current-step="clock.blindId"
        :blind-count="blindStructure.length"
        :starting="clock.started"
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
        :current-step="clock.blindId"
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
} from '~/components/tournaments/tournamentBlinds.vue'
import TournamentClock from '~/components/tournaments/tournamentClock.vue'
import { TournamentClockDto } from '~/dto/tournamentClockDto'
import {
  TournamentBlindDto,
  TournamentClockEventDto,
} from '~/dto/tournamentDto'
import { vxm } from '~/store'
import { BlindStructureModel } from '~/store/admin/tournament'

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
    tournamentId: -1,
    blindId: -1,
    started: false,
    playTime: '00:00:00',
    nextBreakRemainTime: '00:00',
    remainHours: '00',
    remainMinutes: '00',
    remainSeconds: '00',
    pause: true,
    level: 0,
    title: '로딩 중...',
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

  webSocket: WebSocket | null = null

  get tournamentId() {
    return this.clock.tournamentId
  }

  mounted() {
    const tournamentId = this.$route.query?.id as string
    if (tournamentId === null) {
      this.$router.go(-1)
      return
    }

    // this.loadTournaments(tournamentId)
    vxm.tournament
      .loadClock(Number(tournamentId))
      .then(() => {
        this.clock = vxm.tournament.clock
        this.blindStructure = vxm.tournament.blinds
        this.blindTable.updateMaxBlindLevel()
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
      })

    if (this.webSocket === null) {
      const url = new URL(`/ws/tournaments/events`, location.href)
      url.protocol = 'ws'
      this.webSocket = new WebSocket(url)
      this.webSocket.onmessage = this.onmessage
      this.webSocket.onopen = () => {
        this.webSocket?.send(JSON.stringify({ event: 'clock' }))
      }
    }
  }

  onmessage(ev: MessageEvent<string>) {
    const wsResponse = JSON.parse(
      ev.data
    ) as WsResponse<TournamentClockEventDto>

    if (wsResponse.event === `clock-${this.tournamentId}`) {
      vxm.tournament.updateClock(wsResponse.data)
    }
  }

  beforeDestroy() {
    if (this.webSocket !== null) {
      this.webSocket.close()
    }
  }

  async onBlindEdit(dto: BlindEditDto) {
    this.editBlindTable = dto.edit

    if (dto.request && this.clock.tournamentId > -1) {
      try {
        const updateBlinds = this.blindStructure.map<TournamentBlindDto>(
          (value) => value
        )
        await vxm.tournament.updateBlinds({
          id: this.clock.tournamentId,
          blinds: updateBlinds,
        })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      }
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
    try {
      await vxm.tournament.play(this.tournamentId)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }

  async onPause() {
    try {
      await vxm.tournament.pause(this.tournamentId)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }

  async onDownBlind() {
    try {
      await vxm.tournament.blindDown(this.tournamentId)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }

  async onUpBlind() {
    try {
      await vxm.tournament.blindUp(this.tournamentId)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }
}
</script>
