<template>
  <v-flex class="fill-height gray8">
    <v-row class="pa-6">
      <v-col cols="12" sm="12" md="12" lg="12" xl="12">
        <TournamentTable
          :tournaments.sync="tournaments"
          @close="onClose"
          @delete="onDelete"
        />
      </v-col>
    </v-row>

    <ErrorDialog
      :show-dialog="showErrorDialog"
      :dialog-message="errorDialogMessage"
      @confirm="onConfirmErrorDialog"
    />
  </v-flex>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import TournamentTable from '~/components/tournaments/tournamentTable.vue'
import ErrorDialog from '~/components/ui/errorDialog.vue'
import { vxm } from '~/store'
import { TournamentItem } from '~/store/admin/tournament'
import { AxiosError } from '~/utils/api'

@Component({
  components: {
    ErrorDialog,
    TournamentTable,
  },
})
export default class IndexPage extends Vue {
  tournaments: TournamentItem[] = []

  showErrorDialog: boolean = false
  errorDialogMessage: string = ''

  async mounted() {
    this.tournaments = vxm.tournament.tournaments

    try {
      await vxm.tournament.loadTournaments()
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError !== null) {
        this.onError(axiosError)
      }
    }
  }

  async onClose(tournamentId: number) {
    if (tournamentId > 0) {
      try {
        await vxm.tournament.closeBy(tournamentId)
      } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError !== null) {
          this.onError(axiosError)
        }
      }
    }
  }

  async onDelete(tournamentId: number) {
    if (tournamentId > 0) {
      try {
        await vxm.tournament.deleteBy(tournamentId)
      } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError !== null) {
          this.onError(axiosError)
        }
      }
    }
  }

  onError(error: AxiosError) {
    // eslint-disable-next-line no-console
    console.error('AxiosError', error.toJSON())
    // eslint-disable-next-line no-console
    console.error(error.response)
    this.errorDialogMessage = error.response?.data.error
    this.showErrorDialog = true
  }

  onConfirmErrorDialog() {
    this.showErrorDialog = false
  }
}
</script>
