import { createModule, action } from 'vuex-class-component'
import { RegisterBlindStructureDto } from '~/dto/blindStructureDto'
import { $axios } from '~/utils/api'

interface AdminTournamentState {}

const VuexModule = createModule({
  namespaced: 'AdminTournament',
  strict: true,
  target: 'nuxt',
})
export default class AdminTournamentStore
  extends VuexModule
  implements AdminTournamentState
{
  @action async registerTournament(dto: RegisterBlindStructureDto) {
    await $axios.post('/tournaments', dto)
  }
}
