<template>
  <v-container>
    <v-row>
      <v-col>
        <AdminRegisterBlindStructure />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import AdminRegisterBlindStructure from '~/components/admin/registerBlindStructure.vue'

@Component({
  components: {
    AdminRegisterBlindStructure
  }
})
export default class AdminBlindStructure extends Vue {

}
</script>