<template>
  <v-flex>
    <v-row>
      <v-col lg="8">
        <TournamentTable />
      </v-col>
      <v-col lg="4">
        <AdminRegisterTournament />
      </v-col>
    </v-row>
  </v-flex>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import TournamentTable from '~/components/tournamentTable.vue'
import AdminRegisterTournament from '~/components/admin/registerTournament.vue'

@Component({
  components: {
    AdminRegisterTournament,
    TournamentTable,
  },
})
export default class AdminTournament extends Vue {}
</script>
