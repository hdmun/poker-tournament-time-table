<template>
  <v-flex>
    <v-row class="pa-6">
      <v-col lg="8">
        <TournamentTable ref="tournamentTable" />
      </v-col>
      <v-col lg="4">
        <AdminRegisterTournament @register="onRegister" />
      </v-col>
    </v-row>
  </v-flex>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'nuxt-property-decorator'
import TournamentTable from '~/components/tournaments/tournamentTable.vue'
import AdminRegisterTournament from '~/components/admin/registerTournament.vue'
import { RegisterTournamentDto } from '~/dto/tournamentDto'
import { vxm } from '~/store'

@Component({
  components: {
    AdminRegisterTournament,
    TournamentTable,
  },
})
export default class AdminTournament extends Vue {
  @Ref() tournamentTable!: TournamentTable

  async onRegister(dto: RegisterTournamentDto) {
    try {
      await vxm.tournament.registerBy(dto)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
    this.$router.go(0)
  }
}
</script>
