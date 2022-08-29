<template>
  <v-flex>
    <v-row class="pa-6">
      <v-col>
        <AdminRegisterBlindStructure
          :name.sync="metaName"
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
  structure: BlindStructureDto[] = []

  onRegister(dto: RegisterBlindStructureDto) {
    console.log(`AdminBlindStructure.onRegister`)

    this.$axios.post(`/api/tournaments/blind-structures-meta`, dto)
  }
}
</script>
