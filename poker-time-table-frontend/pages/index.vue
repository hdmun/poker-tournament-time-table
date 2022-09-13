<template>
  <v-flex>
    <v-row class="pa-6">
      <v-col cols="12" sm="12" md="6" lg="6" xl="6">
        <TournamentTable ref="tournamentTable" />
      </v-col>
      <v-col lg="9" class="pa-0"> </v-col>
    </v-row>
  </v-flex>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'nuxt-property-decorator'
import TournamentTable from '~/components/tournamentTable.vue'

@Component({
  components: {
    TournamentTable,
  },
})
export default class IndexPage extends Vue {
  @Ref() tournamentTable!: TournamentTable
}
</script>
