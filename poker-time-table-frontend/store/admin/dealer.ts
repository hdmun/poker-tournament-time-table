import { action, createModule, mutation } from 'vuex-class-component'
import {
  GetDealersResponse,
  RegisterDealerRequest,
  RegisterDealerResponse,
  UpdateDealerRequest,
  UpdateDealerResponse,
} from '~/dto/dealerDto'
import { $axios } from '~/utils/api'

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

  @action async load() {
    const response = await $axios.get<GetDealersResponse>(`/api/dealers`)
    const dealers = response.data.dealers.map<DealerPlayDto>((dealer) => {
      let dealingTimeStr = '-'
      if (dealer.sitInTime) {
        const dealingTime =
          new Date().getTime() - new Date(dealer.sitInTime).getTime()
        dealingTimeStr = dealingTime.toLocaleString()
      }

      return {
        id: dealer.id,
        name: dealer.name,
        tournament: dealer.tournament ?? '',
        dealingTime: dealingTimeStr,
      }
    })

    this.setDealers(dealers)
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
    const dealingTime = new Date().getTime() - new Date(sitInTime).getTime()
    dealingTimeStr = dealingTime.toLocaleString()
  }

  return {
    id,
    name,
    tournament: tournament ?? '',
    dealingTime: dealingTimeStr,
  }
}
