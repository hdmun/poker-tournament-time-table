<template>
  <v-flex class="ma-0 fill-height">
    <v-row class="ma-0 fill-height">
      <v-col height="100%">
        <DealerPlayTable
          :dealers="dealers"
          @addDelaer="onAddDealer"
          @dealerTableInOut="onDealerTableInOut"
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
import { RegisterDealerRequest } from '~/dto/dealerDto'
import { DealerPlayDto, DealerPlayLogDto } from '~/store/admin/dealer'
import { vxm } from '~/store'

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

  mounted() {
    this.dealers = vxm.dealer.dealers
    vxm.dealer.load()
  }

  onPickDate(_date: Date) {}

  async onAddDealer(name: string) {
    await vxm.dealer.register({
      name,
    } as RegisterDealerRequest)
  }

  async onDealerTableInOut(dto?: DealerPlayDto) {
    console.log(dto)

    if (dto) {
      const isOut = dto.tournament !== ''
      if (isOut) {
        await vxm.dealer.tableSitOut(dto.id)
      } else {
        await vxm.dealer.tableSitIn(dto.id)
      }
    }
  }
}
</script>
