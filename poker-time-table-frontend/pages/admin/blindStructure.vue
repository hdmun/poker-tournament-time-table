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

    <ErrorDialog
      :show-dialog="showErrorDialog"
      :dialog-message="errorDialogMessage"
      @confirm="onConfirmErrorDialog"
    />
  </v-row>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'nuxt-property-decorator'
import AdminBlindStructureTemplate from '~/components/admin/blindStructureTemplate.vue'
import AdminRegisterBlindStructure, {
  EditBlindStructureDto,
} from '~/components/admin/registerBlindStructure.vue'
import ErrorDialog from '~/components/ui/errorDialog.vue'
import {
  BlindStructureDto,
  BlindStructureTemplateDto,
  RegisterBlindStructureDto,
  UpdateBlindStructureDto,
} from '~/dto/blindStructureDto'
import { vxm } from '~/store'
import { AxiosError } from '~/utils/api'

@Component({
  components: {
    AdminBlindStructureTemplate,
    AdminRegisterBlindStructure,
    ErrorDialog,
  },
})
export default class AdminBlindStructure extends Vue {
  @Ref() registerBlindStructure!: AdminRegisterBlindStructure

  metaId: number | null = null
  metaName: string = ''
  blindTemplates: BlindStructureTemplateDto[] = []
  structure: BlindStructureDto[] = []

  showErrorDialog: boolean = false
  errorDialogTitle: string = ''
  errorDialogMessage: string = ''

  mounted() {
    this.blindTemplates = vxm.blindTemplate.templates
    this.structure = vxm.blindTemplate.templateStructures
    vxm.blindTemplate.getBlindTemplates()
  }

  beforeDestroy() {
    vxm.blindTemplate.updateTemplateStructures([])
  }

  async onDeleteTemplate(id: number) {
    if (id > 0) {
      await vxm.blindTemplate.deleteTemplateById(id)
      await vxm.blindTemplate.getBlindTemplates()
      vxm.blindTemplate.updateTemplateStructures([])
    }
  }

  async onRegister(dto: EditBlindStructureDto) {
    try {
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
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError !== null) {
        // eslint-disable-next-line no-console
        console.error('AxiosError', axiosError.toJSON())
        // eslint-disable-next-line no-console
        console.error(axiosError.response)
        this.errorDialogMessage = axiosError.response?.data.error
        this.showErrorDialog = true
      }
    }
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

  onConfirmErrorDialog() {
    this.showErrorDialog = false
  }
}
</script>
