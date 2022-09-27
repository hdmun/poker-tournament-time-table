<template>
  <v-flex class="fill-height gray8">
    <v-row class="pa-6">
      <v-col class="gray7">
        <AdminRegisterBlindStructure
          ref="registerBlindStructure"
          :name.sync="metaName"
          :templates="blindTemplates"
          :editstructure.sync="structure"
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
  </v-flex>
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
    this.structure = this.structure.map((value, index) => {
      return {
        level: index + 1,
        ante: value.ante,
        smallBlind: value.smallBlind,
        bigBlind: value.bigBlind,
        minute: value.minute,
      }
    })

    this.registerBlindStructure.updateBlind()
  }
}
</script>
