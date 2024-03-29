<template>
  <v-flex class="ma-0 pa-0">
    <v-row class="ma-0 fill-height">
      <v-col :lg="12" class="pa-0" height="100%">
        <TournamentClock
          :data="clock"
          :show-variant.sync="showBlindTable"
          :current-step="clock.blindId"
          :blind-structures="blindStructure"
          :starting="clock.started"
          :edit-mode="editBlindTable"
          @onPlay="onPlay"
          @onPause="onPause"
          @onDownBlind="onDownBlind"
          @onUpBlind="onUpBlind"
          @onResetBlind="onResetBlind"
        />
      </v-col>

      <v-navigation-drawer
        v-if="landscapeMode"
        v-model="showBlindTable"
        :width="blindTableWidth"
        right
        app
        fixed
        :temporary="isTemporary"
      >
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
    <v-row v-if="!landscapeMode" cols="12" class="ma-4">
      <BlindsStructureTable
        :landscape-mode="landscapeMode"
        :blind-structures="blindStructure"
        :blind-id="clock.blindId"
      />
    </v-row>

    <ErrorDialog
      :show-dialog="showErrorDialog"
      :dialog-message="errorDialogMessage"
      @confirm="onConfirmErrorDialog"
    />
  </v-flex>
</template>

<script lang="ts">
import { Component, Ref, Vue, Watch } from 'nuxt-property-decorator'
import BlindsStructureTable from '~/components/tournaments/blinds/structureTable.vue'
import TournamentBlinds, {
  BlindEditDto,
} from '~/components/tournaments/tournamentBlinds.vue'
import TournamentClock from '~/components/tournaments/tournamentClock.vue'
import ErrorDialog from '~/components/ui/errorDialog.vue'
import {
  createTournamentClockDto,
  TournamentClockDto,
} from '~/dto/tournamentClockDto'
import {
  TournamentBlindDto,
  TournamentClockEventDto,
} from '~/dto/tournamentDto'
import { vxm } from '~/store'
import { BlindStructureModel } from '~/store/admin/tournament'
import { AxiosError } from '~/utils/api'

interface WsResponse<T> {
  event: string
  data: T
}

@Component({
  components: {
    BlindsStructureTable,
    ErrorDialog,
    TournamentBlinds,
    TournamentClock,
  },
})
export default class TournamentClockPage extends Vue {
  @Ref() blindTable!: TournamentBlinds

  clock: TournamentClockDto = createTournamentClockDto()
  playSound: boolean = false

  showBlindTable: boolean = false
  editBlindTable: boolean = false
  blindStructure: BlindStructureModel[] = []

  webSocket: WebSocket | null = null

  showErrorDialog: boolean = false
  errorDialogMessage: string = ''

  get tournamentId() {
    return this.clock.tournamentId
  }

  get landscapeMode(): boolean {
    const breakpoint = this.$vuetify.breakpoint
    return breakpoint.width > breakpoint.height
  }

  get blindTableWidth(): number {
    switch (this.$vuetify.breakpoint.name) {
      case 'xs':
        return 220
      case 'sm':
        return 400
      case 'md':
        return 500
      case 'lg':
      case 'xl': {
        const width = Number(this.$vuetify.breakpoint.width / 2.5)
        if (this.editBlindTable) {
          return width + 120
        }
        return width
      }
    }
  }

  get isTemporary(): boolean {
    switch (this.$vuetify.breakpoint.name) {
      case 'xl':
      case 'lg':
        return false
      default:
        return true
    }
  }

  mounted() {
    this.playSound = true

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
        this.blindTable?.updateMaxBlindLevel()
      })
      .catch((error) => {
        const axiosError = error as AxiosError
        if (axiosError !== null) {
          this.onError(axiosError)
        }
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

    window.addEventListener('resize', this.handleResize)
  }

  onmessage(ev: MessageEvent<string>) {
    const wsResponse = JSON.parse(
      ev.data
    ) as WsResponse<TournamentClockEventDto>

    if (wsResponse.event === `clock-${this.tournamentId}`) {
      if (this.clock.blindId > -1) {
        const remainHours = Number(wsResponse.data.reaminHours)
        const reaminMinutes = Number(wsResponse.data.reaminMinutes)
        const reaminSeconds = Number(wsResponse.data.reaminSeconds)
        if (
          remainHours === 0 &&
          reaminMinutes === 0 &&
          reaminSeconds < 10 &&
          this.playSound
        ) {
          new Audio('/blind-up.mp3').play()
          this.playSound = false
        }

        if (this.clock.blindId < wsResponse.data.blindId) {
          this.playSound = true
        }
      }
      vxm.tournament.updateClock(wsResponse.data)
    }
  }

  beforeDestroy() {
    if (this.webSocket !== null) {
      this.webSocket.close()
    }

    window.removeEventListener('resize', this.handleResize)
  }

  handleResize(_event: UIEvent) {
    this.blindTable?.updateMaxBlindLevel()
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
        const axiosError = error as AxiosError
        if (axiosError !== null) {
          this.onError(axiosError)
        }
      }
    }
  }

  @Watch('showBlindTable')
  onChangeShowBlindTable(val: boolean) {
    // 편집 중에 닫히면 close 처리
    if (this.editBlindTable && !val) {
      this.blindTable?.onBlindEditClose()
    }
  }

  onBlindEditClose() {
    this.editBlindTable = false
  }

  async onPlay() {
    try {
      await vxm.tournament.play(this.tournamentId)
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError !== null) {
        this.onError(axiosError)
      }
    }
  }

  async onPause() {
    try {
      await vxm.tournament.pause(this.tournamentId)
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError !== null) {
        this.onError(axiosError)
      }
    }
  }

  async onDownBlind() {
    try {
      await vxm.tournament.blindDown(this.tournamentId)
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError !== null) {
        this.onError(axiosError)
      }
    }
  }

  async onUpBlind() {
    try {
      await vxm.tournament.blindUp(this.tournamentId)
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError !== null) {
        this.onError(axiosError)
      }
    }
  }

  async onResetBlind() {
    try {
      await vxm.tournament.blindReset(this.tournamentId)
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError !== null) {
        this.onError(axiosError)
      }
    }
  }

  onError(error: AxiosError) {
    // eslint-disable-next-line no-console
    console.error('AxiosError', error.toJSON())
    // eslint-disable-next-line no-console
    console.error(error.response)
    this.errorDialogMessage = error.response?.data.error
    this.showErrorDialog = true
  }

  onConfirmErrorDialog() {
    this.showErrorDialog = false
  }
}
</script>
