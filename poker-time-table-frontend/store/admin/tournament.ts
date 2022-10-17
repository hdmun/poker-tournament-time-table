import { createModule, action, mutation } from 'vuex-class-component'
import {
  createTournamentClockDto,
  TournamentClockDto,
} from '~/dto/tournamentClockDto'
import {
  TournamentRegisterRequest,
  TournamentBlindDto,
  TournamentClockEventDto,
  TournamentDetailDto,
  TournamentLogDto,
  GetSitInTournamentResponse,
} from '~/dto/tournamentDto'
import { $axios } from '~/utils/api'
import { convertMsToTimeString } from '~/utils/time'

export const eTournamentState = {
  Wait: '대기 중',
  Play: '진행 중',
} as const
// eslint-disable-next-line no-redeclare
export type eTournamentState =
  typeof eTournamentState[keyof typeof eTournamentState]

export interface TournamentItem {
  id: number
  start: string
  state: eTournamentState
  end: boolean
  name: string
  buyIn: string
}

export interface BlindStructureModel {
  level: number
  ante: number
  smallBlind: number
  bigBlind: number
  minute: number
}

export interface TournamentLogRequest {
  year: number
  month: number
  day: number
}

export interface TournamentLogItem {
  name: string
  start: string // toLocaleTimeString()
  end: string // toLocaleTimeString()
  playTime: string // 00:00:00
}

export interface TournamentSitIn {
  tournamentId: number
  tournamentTitle: string
}

export interface UpdateTournamentBlindDto {
  id: number
  blinds: TournamentBlindDto[]
}

interface AdminTournamentState {
  readonly tournaments: TournamentItem[]
  readonly blinds: BlindStructureModel[]
  readonly clock: TournamentClockDto
  readonly logs: TournamentLogItem[]
}

const VuexModule = createModule({
  namespaced: 'AdminTournament',
  strict: true,
  target: 'nuxt',
})
export default class AdminTournamentStore
  extends VuexModule
  implements AdminTournamentState
{
  readonly tournaments: TournamentItem[] = []
  readonly blinds: BlindStructureModel[] = []

  readonly clock: TournamentClockDto = createTournamentClockDto()

  readonly logs: TournamentLogItem[] = []

  readonly tournamentsSitIn: TournamentSitIn[] = []

  @mutation update(tournaments: TournamentItem[]) {
    this.tournaments.splice(0)
    this.tournaments.push(...tournaments)
  }

  @mutation removeBy(tournamentId: number) {
    const index = this.tournaments.findIndex(
      (value) => value.id === tournamentId
    )
    if (index > -1) {
      this.tournaments.splice(index, 1)
    }
  }

  @mutation updateClock(dto: TournamentClockEventDto) {
    this.clock.blindId = dto.blindId
    this.clock.started = dto.started
    this.clock.playTime = dto.playTime
    this.clock.nextBreakRemainTime = dto.nextBreakRemainTime
    this.clock.lateRegReaminTime = dto.lateRegReaminTime
    this.clock.remainHours = dto.reaminHours
    this.clock.remainMinutes = dto.reaminMinutes
    this.clock.remainSeconds = dto.reaminSeconds
    this.clock.pause = dto.pause
    this.clock.level = dto.level > 0 ? dto.level : 0
    this.clock.ante = dto.ante > 0 ? dto.ante : 0
    this.clock.smallBlind = dto.smallBlind
    this.clock.bigBlind = dto.bigBlind

    this.clock.chipsInPlay = '-'
    this.clock.player = '-'
    this.clock.averageStack = '-'
  }

  @mutation addBlind(blind: BlindStructureModel) {
    this.blinds.push(blind)
  }

  @mutation addBreakTime(minute: number) {
    this.blinds.push({
      level: -1,
      ante: 0,
      smallBlind: -1,
      bigBlind: -1,
      minute,
    })
  }

  @mutation setBlinds(blinds: BlindStructureModel[]) {
    this.blinds.splice(0)
    this.blinds.push(...blinds)
  }

  @mutation updateLog(logs: TournamentLogItem[]) {
    this.logs.splice(0)
    this.logs.push(...logs)
  }

  @mutation setSitIn(tournamentsSitIn: TournamentSitIn[]) {
    this.tournamentsSitIn.splice(0)
    this.tournamentsSitIn.push(...tournamentsSitIn)
  }

  @action async loadTournaments() {
    const response = await $axios.get<TournamentDetailDto[]>(`/api/tournaments`)
    if (response.status === 200) {
      const tournaments = response.data
        .map<TournamentItem>((value: TournamentDetailDto): TournamentItem => {
          return mapToTournamentItem(value)
        })
        .filter((value) => !value.end)
        .sort(
          (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
        )

      this.update(tournaments)
    }
  }

  @action async loadClock(tournamentId: number) {
    const response = await $axios.get<TournamentDetailDto>(
      `/api/tournaments/${tournamentId}`
    )

    const tournamentDetail = response.data
    this.clock.tournamentId = tournamentDetail.id
    this.clock.started = tournamentDetail.startDateTime !== null
    this.clock.title = tournamentDetail.title
    this.clock.blindId = tournamentDetail.blindId
    this.clock.pause = tournamentDetail.startDateTime === null

    const blinds = tournamentDetail.structures.map<BlindStructureModel>(
      (value) => {
        return {
          level: value.level,
          ante: value.ante,
          smallBlind: value.smallBlind,
          bigBlind: value.bigBlind,
          minute: value.minute,
        }
      }
    )

    if (!this.clock.started) {
      this.clock.playTime = '--:--'
      this.clock.nextBreakRemainTime = '--:--'
      this.clock.lateRegReaminTime = '--:--'
      this.clock.blindId = 0

      const firstBlind = blinds[0]
      this.clock.level = firstBlind.level
      this.clock.smallBlind = firstBlind.smallBlind
      this.clock.bigBlind = firstBlind.bigBlind
      this.clock.ante = firstBlind.ante
    }

    this.setBlinds(blinds)
  }

  @action async loadTournamentLog(dto: TournamentLogRequest) {
    const response = await $axios.get<TournamentLogDto[]>(
      `/api/tournaments/${dto.year}/${dto.month}/${dto.day}`
    )

    if (response.status === 200) {
      const tournamentsLog = response.data.map<TournamentLogItem>(
        (dto: TournamentLogDto): TournamentLogItem => {
          const start = new Date(dto.startDateTime)
          const end = new Date(dto.endDateTime)

          return {
            name: dto.title,
            start: start.toLocaleTimeString(),
            end: end.toLocaleTimeString(),
            playTime: convertMsToTimeString(end.getTime() - start.getTime()),
          }
        }
      )
      this.updateLog(tournamentsLog)
    }
  }

  @action async loadNoneDealer() {
    const response = await $axios.get<GetSitInTournamentResponse[]>(
      `/api/tournaments/non-dealers`
    )
    this.setSitIn(
      response.data.map<TournamentSitIn>((tournaments) => {
        return {
          tournamentId: tournaments.id,
          tournamentTitle: tournaments.title,
        }
      })
    )
  }

  @action async registerBy(dto: TournamentRegisterRequest) {
    const response = await $axios.post(`/api/tournaments`, dto)
    // eslint-disable-next-line no-console
    console.log('registerBy', response.status, response.data)
  }

  @action async deleteBy(tournamentId: number) {
    const response = await $axios.delete(`/api/tournaments/${tournamentId}`)
    // eslint-disable-next-line no-console
    console.log('deleteBy', response.status, response.data)

    this.removeBy(tournamentId)
  }

  @action async closeBy(tournamentId: number) {
    const response = await $axios.put(`/api/tournaments/${tournamentId}`)
    // eslint-disable-next-line no-console
    console.log('closeBy', response.status, response.data)

    this.removeBy(tournamentId)
  }

  @action async updateBlinds(updateBlindDto: UpdateTournamentBlindDto) {
    const response = await $axios.put<BlindStructureModel[]>(
      `/api/tournaments/${updateBlindDto.id}/blinds`,
      updateBlindDto.blinds
    )
    response.data.map<BlindStructureModel>((value) => {
      return {
        level: value.level,
        ante: value.ante,
        smallBlind: value.smallBlind,
        bigBlind: value.bigBlind,
        minute: value.minute,
      }
    })
  }

  @action async play(tournamentId: number) {
    const response = await $axios.put<TournamentClockEventDto>(
      `/api/tournaments/${tournamentId}/play`
    )

    this.updateClock(response.data)
  }

  @action async pause(tournamentId: number) {
    const response = await $axios.put<TournamentClockEventDto>(
      `/api/tournaments/${tournamentId}/pause`
    )

    this.updateClock(response.data)
  }

  @action async blindDown(tournamentId: number) {
    const response = await $axios.put(
      `/api/tournaments/${tournamentId}/blind/down`
    )

    this.updateClock(response.data)
  }

  @action async blindUp(tournamentId: number) {
    const response = await $axios.put(
      `/api/tournaments/${tournamentId}/blind/up`
    )

    this.updateClock(response.data)
  }

  @action async blindReset(tournamentId: number) {
    const response = await $axios.put(
      `/api/tournaments/${tournamentId}/blind/reset`
    )

    this.updateClock(response.data)
  }
}

function mapToTournamentItem(dto: TournamentDetailDto): TournamentItem {
  let startDateTime: string = ''
  let tournamentState: eTournamentState = eTournamentState.Wait
  if (dto.startDateTime) {
    startDateTime = new Date(dto.startDateTime)
      .toISOString()
      .replace('T', ' ')
      .substring(0, 19)

    tournamentState = eTournamentState.Play
  }
  return {
    id: dto.id,
    start: startDateTime,
    state: tournamentState,
    end: dto.endDateTime !== null,
    name: dto.title,
    buyIn: `${dto.buyIn}`,
  }
}
