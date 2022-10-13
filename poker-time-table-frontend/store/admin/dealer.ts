import { createModule } from 'vuex-class-component'

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
}
