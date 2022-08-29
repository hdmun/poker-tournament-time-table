import { createModule, action } from 'vuex-class-component'
import { RegisterBlindStructureDto } from '~/dto/blindStructureDto'
import { $axios } from '~/utils/api'

interface AdminBlindStructureState {}

const VuexModule = createModule({
  namespaced: 'Tournament',
  strict: true,
  target: 'nuxt',
})
export default class AdminBlindStructureStore
  extends VuexModule
  implements AdminBlindStructureState
{
  @action async registerBlindStructure(dto: RegisterBlindStructureDto) {
    await $axios.post('/tournaments/blind-structures-meta', dto)
  }
}
