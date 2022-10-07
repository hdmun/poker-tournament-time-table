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
import { vxm } from '~/store'

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
    this.blindTemplates = vxm.blindTemplate.templates
    this.structure = vxm.blindTemplate.templateStructures
    vxm.blindTemplate.getBlindTemplates()
  }

  async onDeleteTemplate(id: number) {
    if (id > 0) {
      await vxm.blindTemplate.deleteTemplateById(id)
      await vxm.blindTemplate.getBlindTemplates()
      vxm.blindTemplate.updateTemplateStructures([])
    }
  }

  async onRegister(dto: EditBlindStructureDto) {
    if (dto.id) {
      const requestDto: UpdateBlindStructureDto = {
        id: dto.id,
        name: dto.name,
        structures: dto.structures,
      }
      await vxm.blindTemplate.updateBlindStructure(requestDto)
    } else {
      const requestDto: RegisterBlindStructureDto = {
        name: dto.name,
        structures: dto.structures,
      }
      await vxm.blindTemplate.registerBlindStructure(requestDto)
    }

    await vxm.blindTemplate.getBlindTemplates()
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
