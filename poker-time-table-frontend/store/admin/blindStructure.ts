import { createModule, action, mutation } from 'vuex-class-component'
import {
  BlindStructureDto,
  BlindStructureTemplateDto,
  RegisterBlindStructureDto,
  UpdateBlindStructureDto,
} from '~/dto/blindStructureDto'
import { $axios } from '~/utils/api'

interface AdminBlindStructureState {
  templateStructures: BlindStructureDto[]
}

const VuexModule = createModule({
  namespaced: 'blindStructure',
  strict: true,
  target: 'nuxt',
})
export default class AdminBlindStructureStore
  extends VuexModule
  implements AdminBlindStructureState
{
  readonly templates: BlindStructureTemplateDto[] = []
  readonly templateStructures: BlindStructureDto[] = []

  @mutation updateTemplates(templates: BlindStructureTemplateDto[]) {
    this.templates.splice(0)
    this.templates.push(...templates)
  }

  @mutation updateTemplateStructures(templateStructures: BlindStructureDto[]) {
    this.templateStructures.splice(0)
    this.templateStructures.push(...templateStructures)
  }

  @action async getBlindTemplates() {
    const response = await $axios.get<BlindStructureTemplateDto[]>(
      `/api/blind-structures/templates`
    )
    if (response.status === 200) {
      this.updateTemplates(
        response.data.sort((a, b) => {
          if (a.name < b.name) return -1
          if (a.name > b.name) return 1
          return 0
        })
      )
    }
  }

  @action async getBlindTemplateById(id: number) {
    const response = await $axios.get<BlindStructureDto[]>(
      `/api/blind-structures/templates/${id}`
    )
    if (response.status === 200) {
      this.updateTemplateStructures(response.data)
    }
  }

  @action async registerBlindStructure(dto: RegisterBlindStructureDto) {
    await $axios.post<void>(`/api/blind-structures/meta`, dto)
  }

  @action async updateBlindStructure(dto: UpdateBlindStructureDto) {
    await $axios.put<void>(`/api/blind-structures/meta`, dto)
  }

  @action async deleteTemplateById(id: number) {
    await $axios.delete<void>(`/api/blind-structures/templates/${id}`)
  }
}
