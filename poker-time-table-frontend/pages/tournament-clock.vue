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
        <TournamentClock :data="clock" :show-variant.sync="showBlindTable" />
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
import { TournamentDetailDto } from '~/dto/tournamentDto'

function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0')
}

function convertMsToTime(milliseconds: number) {
  // https://bobbyhadz.com/blog/typescript-calculate-time-between-dates
  let seconds = Math.floor(milliseconds / 1000)
  let minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  seconds = seconds % 60
  minutes = minutes % 60

  // 👇️ If you want to roll hours over, e.g. 00 to 24
  // 👇️ uncomment the line below
  // uncommenting next line gets you `00:00:00` instead of `24:00:00`
  // or `12:15:31` instead of `36:15:31`, etc.
  // 👇️ (roll hours over)
  // hours = hours % 24;
  if (hours === 0) {
    return `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`
  }

  return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
    seconds
  )}`
}

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

  currentIdx = 0
  startDateTime: Date = new Date()

  refreshTimer?: number

  mounted() {
    const tournamentId = this.$route.query?.id as string
    if (tournamentId === null) {
      this.$router.go(-1)
      return
    }

    this.loadTournaments(tournamentId)

    this.refreshTimer = window.setInterval(() => {
      this.updateClock()
    }, 500)
  }

  beforeDestroy() {
    if (this.refreshTimer !== undefined) {
      window.clearInterval(this.refreshTimer)
    }
  }

  async loadTournaments(tournamentId: string) {
    const res = await this.$axios.get<TournamentDetailDto>(
      `/api/tournaments/${tournamentId}`
    )

    const tournamentDetail = res.data

    this.startDateTime = new Date(tournamentDetail.startDateTime)
    const nowDate = new Date()
    if (nowDate < this.startDateTime) {
      // 아직 시작 안함
      return
    }

    this.clock.title = tournamentDetail.title

    this.blindStructure = []
    const blindStructures = res.data.structures.map<BlindStructureModel>(
      (value) => {
        return {
          level: value.level,
          smallBlind: value.smallBlind,
          bigBlind: value.bigBlind,
          minute: value.minute,
          accumMinutes: 0,
        }
      }
    )

    let accumulateTime = 0
    for (const blind of blindStructures) {
      accumulateTime += blind.minute
      blind.accumMinutes = accumulateTime
      this.blindStructure.push(blind)

      const addBreakTime = blind.level % tournamentDetail.breakTimeTerm
      if (addBreakTime === 0) {
        accumulateTime += tournamentDetail.breakTime
        this.blindStructure.push({
          level: -1,
          smallBlind: -1,
          bigBlind: -1,
          minute: tournamentDetail.breakTime,
          accumMinutes: accumulateTime,
        })
      }
    }
  }

  updateClock() {
    const nowDate = new Date()
    const playTimeMs = nowDate.getTime() - this.startDateTime.getTime()
    const playTimeMinutes = Math.floor(playTimeMs / 1000 / 60)

    this.currentIdx = this.blindStructure.findIndex((value) => {
      if (playTimeMinutes < value.accumMinutes) {
        return true
      }
      return false
    })

    if (this.currentIdx < 0) {
      return
    }

    this.clock.playTime = convertMsToTime(playTimeMs)

    const nextBreak = this.blindStructure.find((value, index) => {
      if (index <= this.currentIdx) {
        return false
      }
      return value.level < 0
    })
    if (nextBreak) {
      const nextBreakTime = new Date(
        this.startDateTime.getTime() + nextBreak.accumMinutes * 60 * 1000
      )
      this.clock.nextBreakTime = convertMsToTime(
        nextBreakTime.getTime() - nowDate.getTime()
      )
    } else {
      this.clock.nextBreakTime = '--:--'
    }

    const currentBlind = this.blindStructure[this.currentIdx]
    const remainDate = new Date(
      this.startDateTime.getTime() + currentBlind.accumMinutes * 60 * 1000
    )
    this.clock.remainTime = convertMsToTime(
      remainDate.getTime() - nowDate.getTime()
    )

    if (currentBlind.level > 0) {
      this.clock.level = currentBlind.level
      this.clock.smallBlind = currentBlind.smallBlind
      this.clock.bigBlind = currentBlind.bigBlind
    } else {
      const nextBlind = this.blindStructure[this.currentIdx + 1]
      this.clock.level = nextBlind.level
      this.clock.smallBlind = nextBlind.smallBlind
      this.clock.bigBlind = nextBlind.bigBlind
    }

    this.clock.chipsInPlay = 1800000
    this.clock.player = 8
    this.clock.totalPlayer = 19
    this.clock.averageStack = 105000
  }
}
</script>
