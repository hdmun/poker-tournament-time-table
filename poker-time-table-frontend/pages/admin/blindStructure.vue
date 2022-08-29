<template>
  <v-flex>
    <v-row class="pa-6">
      <v-col>
        <AdminRegisterBlindStructure
          :name.sync="metaName"
          :templates="blindTemplates"
          :editstructure.sync="structure"
          @register="onRegister"
        />
      </v-col>
      <v-col>
        <AdminBlindStructureTemplate :blindstructure.sync="structure" />
      </v-col>
    </v-row>
  </v-flex>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import AdminBlindStructureTemplate from '~/components/admin/blindStructureTemplate.vue'
import AdminRegisterBlindStructure from '~/components/admin/registerBlindStructure.vue'
import {
  BlindStructureDto,
  BlindStructureTemplateDto,
  RegisterBlindStructureDto,
} from '~/dto/blindStructureDto'

@Component({
  components: {
    AdminBlindStructureTemplate,
    AdminRegisterBlindStructure,
  },
})
export default class AdminBlindStructure extends Vue {
  metaName: string = ''
  blindTemplates: BlindStructureTemplateDto[] = []
  structure: BlindStructureDto[] = []

  mounted() {
    this.loadTemplates()
  }

  async loadTemplates() {
    const res = await this.$axios.get<BlindStructureTemplateDto[]>(
      `/api/tournaments/blind-structure-templates`
    )
    this.blindTemplates = res.data.sort((a, b) => {
      if (a.name < b.name) return -1
      if (a.name > b.name) return 1
      return 0
    })
  }

  async onRegister(dto: RegisterBlindStructureDto) {
    await this.$axios.post(`/api/tournaments/blind-structures-meta`, dto)
    this.loadTemplates()
  }
}
</script>
