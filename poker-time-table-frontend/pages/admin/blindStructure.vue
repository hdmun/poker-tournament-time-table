<template>
  <v-flex>
    <v-row>
      <v-col>
        <AdminBlindStructureTemplate :blindstructure.sync="structure" />
      </v-col>

      <v-col>
        <AdminRegisterBlindStructure :editstructure.sync="structure" />
      </v-col>
    </v-row>
  </v-flex>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import AdminBlindStructureTemplate from '~/components/admin/blindStructureTemplate.vue'
import AdminRegisterBlindStructure from '~/components/admin/registerBlindStructure.vue'
import { BlindStructureDto } from '~/dto/blindStructureDto'

@Component({
  components: {
    AdminBlindStructureTemplate,
    AdminRegisterBlindStructure,
  },
})
export default class AdminBlindStructure extends Vue {
  structure: BlindStructureDto[] = []
}
</script>
