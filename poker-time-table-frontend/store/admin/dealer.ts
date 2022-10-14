import { action, createModule, mutation } from 'vuex-class-component'
import {
  DealerDto,
  GetDealerLogResponse,
  GetDealersResponse,
  RegisterDealerRequest,
  RegisterDealerResponse,
  UpdateDealerRequest,
  UpdateDealerResponse,
} from '~/dto/dealerDto'
import { $axios } from '~/utils/api'
import { convertMsToTimeString } from '~/utils/time'

export interface DealerPlayDto {
  id: number
  name: string
  tournament: string
  dealingTime: string
}

export interface DealerPlayLogDto {
  name: string
  tournament: string
  sitInTime: string
  sitOutTime: string
  dealingTime: string
}

interface AdminDealerState {
  readonly dealers: DealerPlayDto[]
}

const VuexModule = createModule({
  namespaced: 'dealer',
  strict: true,
  target: 'nuxt',
})
export default class AdminDealerStore
  extends VuexModule
  implements AdminDealerState
{
  readonly dealers: DealerPlayDto[] = []
  readonly playLogs: DealerPlayLogDto[] = []

  @mutation setDealers(dealers: DealerPlayDto[]) {
    this.dealers.splice(0)
    this.dealers.push(...dealers)
  }

  @mutation addDealer(dealer: DealerPlayDto) {
    this.dealers.push(dealer)
  }

  @mutation updateDealer(dealer: DealerPlayDto) {
    const findDealer = this.dealers.find((value) => value.id === dealer.id)
    if (findDealer) {
      findDealer.tournament = dealer.tournament
      findDealer.dealingTime = dealer.dealingTime
    }
  }

  @mutation setPlayLogs(logs: DealerPlayLogDto[]) {
    this.playLogs.splice(0)
    this.playLogs.push(...logs)
  }

  @action async load() {
    const response = await $axios.get<GetDealersResponse>(`/api/dealers`)
    const dealers = response.data.dealers.map<DealerPlayDto>((dealer) => {
      return mapToPlayDtoFromDealerDto(dealer)
    })

    this.setDealers(dealers)
  }

  @action async loadLogs(date: Date) {
    const response = await $axios.get<GetDealerLogResponse[]>(
      `/api/dealers/logs/${date.getFullYear()}/${
        date.getMonth() + 1
      }/${date.getDate()}`
    )

    // eslint-disable-next-line no-console
    console.log('loadLogs', response.status, response.data)

    const playLogs = response.data.map<DealerPlayLogDto>((value) => {
      return mapToPlayLogDtoFromResponse(value)
    })

    this.setPlayLogs(playLogs)
  }

  @action async register(dto: RegisterDealerRequest) {
    const response = await $axios.post<RegisterDealerResponse>(
      `/api/dealers`,
      dto
    )

    // eslint-disable-next-line no-console
    console.log('register', response.status, response.data)

    if (response.status === 201) {
      const newDealer = response.data
      const playDto = mapToDealerPlayDto(newDealer.id, newDealer.name)
      this.addDealer(playDto)
    }
  }

  @action async update(dto: UpdateDealerRequest) {
    const response = await $axios.put<UpdateDealerResponse>(
      `/api/dealers/${dto.dealerId}`,
      dto
    )

    // eslint-disable-next-line no-console
    console.log('update', response.status, response.data)

    const playDto = mapToPlayDtoFromUpdateResponse(response.data)
    this.updateDealer(playDto)
  }
}

function mapToPlayDtoFromDealerDto(dto: DealerDto): DealerPlayDto {
  return mapToDealerPlayDto(dto.id, dto.name, dto.tournament, dto.sitInTime)
}

function mapToPlayDtoFromUpdateResponse(
  dto: UpdateDealerResponse
): DealerPlayDto {
  return mapToDealerPlayDto(
    dto.dealerId,
    dto.dealerName,
    dto.tournamentTitle,
    dto.sitInTime
  )
}

function mapToDealerPlayDto(
  id: number,
  name: string,
  tournament?: string,
  sitInTime?: string
): DealerPlayDto {
  let dealingTimeStr = '-'
  if (sitInTime) {
    const dealingTimeMs = new Date().getTime() - new Date(sitInTime).getTime()
    dealingTimeStr = convertMsToTimeString(dealingTimeMs)
  }

  return {
    id,
    name,
    tournament: tournament ?? '',
    dealingTime: dealingTimeStr,
  }
}

function mapToPlayLogDtoFromResponse(
  dto: GetDealerLogResponse
): DealerPlayLogDto {
  return {
    name: dto.dealerName,
    tournament: dto.tournamentTitle,
    sitInTime: new Date(dto.sitInTime).toLocaleTimeString(),
    sitOutTime: new Date(dto.sitOutTime).toLocaleTimeString(),
    dealingTime: convertMsToTimeString(dto.playSeconds * 1000),
  }
}
