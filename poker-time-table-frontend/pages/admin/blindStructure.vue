<template>
  <v-row class="pa-6 fill-height">
    <v-col>
      <AdminRegisterBlindStructure
        ref="registerBlindStructure"
        :name.sync="metaName"
        :templates="blindTemplates"
        :editstructure.sync="structure"
        @delete="onDeleteTemplate"
        @register="onRegister"
      />
    </v-col>
    <v-col>
      <AdminBlindStructureTemplate
        :blindstructure.sync="structure"
        @delete="onDelete"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'nuxt-property-decorator'
import AdminBlindStructureTemplate from '~/components/admin/blindStructureTemplate.vue'
import AdminRegisterBlindStructure, {
  EditBlindStructureDto,
} from '~/components/admin/registerBlindStructure.vue'
import {
  BlindStructureDto,
  BlindStructureTemplateDto,
  RegisterBlindStructureDto,
  UpdateBlindStructureDto,
} from '~/dto/blindStructureDto'

@Component({
  components: {
    AdminBlindStructureTemplate,
    AdminRegisterBlindStructure,
  },
})
export default class AdminBlindStructure extends Vue {
  @Ref() registerBlindStructure!: AdminRegisterBlindStructure

  metaId: number | null = null
  metaName: string = ''
  blindTemplates: BlindStructureTemplateDto[] = []
  structure: BlindStructureDto[] = []

  mounted() {
    this.loadTemplates()
  }

  async loadTemplates() {
    const res = await this.$axios.get<BlindStructureTemplateDto[]>(
      `/api/blind-structures/templates`
    )
    this.blindTemplates = res.data.sort((a, b) => {
      if (a.name < b.name) return -1
      if (a.name > b.name) return 1
      return 0
    })
  }

  async onDeleteTemplate(id: number) {
    if (id > 0) {
      await this.$axios.delete(`/api/blind-structures/templates/${id}`)
      await this.loadTemplates()
      this.structure = []
    }
  }

  async onRegister(dto: EditBlindStructureDto) {
    if (dto.id) {
      await this.$axios.put(`/api/blind-structures/meta`, {
        id: dto.id,
        name: dto.name,
        structures: dto.structures,
      } as UpdateBlindStructureDto)
    } else {
      await this.$axios.post(`/api/blind-structures/meta`, {
        name: dto.name,
        structures: dto.structures,
      } as RegisterBlindStructureDto)
    }

    this.loadTemplates()
  }

  onDelete(blind: BlindStructureDto) {
    const deleteIndex = this.structure.indexOf(blind)
    this.structure.splice(deleteIndex, 1)

    let level = 1
    for (const blind of this.structure) {
      if (blind.level > 0) {
        blind.level = level
        level += 1
      }
    }

    this.registerBlindStructure.updateBlind()
  }
}
</script>
