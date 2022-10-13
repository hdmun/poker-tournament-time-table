<template>
  <v-flex class="ma-0 fill-height">
    <v-row class="ma-0 fill-height">
      <v-col height="100%">
        <DealerPlayTable
          :dealers="dealers"
          :tournaments-sit-in="tournamentsSitIn"
          @addDelaer="onAddDealer"
          @dealerTableIn="onDealerTableIn"
          @dealerTableOut="onDealerTableOut"
          @loadTournaments="onLoadTournaments"
        />
      </v-col>

      <v-col height="100%">
        <DealerPlayLogTable :dealers="dealerLogs" @pickDate="onPickDate" />
      </v-col>
    </v-row>
  </v-flex>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component, Vue } from 'nuxt-property-decorator'
import DealerPlayTable from '~/components/dealer/dealerPlayTable.vue'
import DealerPlayLogTable from '~/components/dealer/dealerPlayLogTable.vue'
import { RegisterDealerRequest, UpdateDealerRequest } from '~/dto/dealerDto'
import { vxm } from '~/store'
import { DealerPlayDto, DealerPlayLogDto } from '~/store/admin/dealer'
import { TournamentSitIn } from '~/store/admin/tournament'

@Component({
  components: {
    DealerPlayTable,
    DealerPlayLogTable,
  },
  asyncData(_ctx: Context) {
    return {}
  },
})
export default class DealersPage extends Vue {
  dealers: DealerPlayDto[] = []
  dealerLogs: DealerPlayLogDto[] = []
  tournamentsSitIn: TournamentSitIn[] = []

  mounted() {
    this.dealers = vxm.dealer.dealers
    this.tournamentsSitIn = vxm.tournament.tournamentsSitIn
    vxm.dealer.load()
  }

  onPickDate(_date: Date) {}

  async onAddDealer(name: string) {
    await vxm.dealer.register({
      name,
    } as RegisterDealerRequest)
  }

  async onDealerTableIn(dto?: UpdateDealerRequest) {
    if (dto) {
      await vxm.dealer.update(dto)
    }
  }

  async onDealerTableOut(dealerId: number) {
    await vxm.dealer.update({ dealerId, tournamentId: 0 })
  }

  async onLoadTournaments() {
    await vxm.tournament.loadNoneDealer()
  }
}
</script>
