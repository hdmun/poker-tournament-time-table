import { action, createModule, mutation } from 'vuex-class-component'
import {
  GetDealersResponse,
  RegisterDealerRequest,
  RegisterDealerResponse,
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

    const newDealer = response.data
    this.addDealer({
      id: newDealer.id,
      name: newDealer.name,
      tournament: '',
      dealingTime: '',
    })
  }
}
