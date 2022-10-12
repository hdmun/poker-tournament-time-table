<template>
  <v-card>
    <v-card-title>
      딜러 상태
      <v-spacer></v-spacer>

      <v-btn color="accent" dark class="ma-3" @click="addDealerDialog = true">
        딜러 추가
      </v-btn>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="dealers"
      :items-per-page="10"
      hide-default-footer
      class="elevation-1"
      @page-count="pageCount = $event"
    >
      <template #[`item.action`]="{ item }">
        <v-btn
          v-if="item.tournament !== ''"
          color="accent"
          @click="onClickTableOut(item)"
        >
          아웃
        </v-btn>

        <v-btn v-else color="gray5" @click="onClickTableIn(item)"> 투입 </v-btn>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </div>

    <ConfirmDialog
      :show-dialog="showConfirmDialog"
      :dialog-title="confirmDialogTitle"
      :dialog-message="confirmDialogMessage"
      :dialog-confirm-text="'확인'"
      @confirm="onConfirmTableInOut"
      @cancel="onCancelTableInOut"
    />

    <AddDelaerDialog
      :show-dialog.sync="addDealerDialog"
      @addDealer="onAddDelaer"
    />
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'
import { PropType } from 'vue'
import ConfirmDialog from '../ui/confirmDialog.vue'
import TableToolbarWithDatePicker from '../ui/tableToolbarWithDatePicker.vue'
import AddDealerdialog from './addDelaerDialog.vue'
import { DealerPlayDto } from '~/dto/dealerDto'

interface TableHeader {
  text: string
  value: string
  sortable?: boolean
}

@Component({
  components: {
    AddDealerdialog,
    TableToolbarWithDatePicker,
    ConfirmDialog,
  },
})
export default class DealerPlayTable extends Vue {
  headers: TableHeader[] = [
    { text: '이름', value: 'name' },
    { text: '토너먼트', value: 'tournament' },
    { text: '딜링 시간', value: 'dealingTime' },
    { text: '변경', value: 'action', sortable: false },
  ]

  page = 1
  pageCount = 1

  @Prop({ type: Array as PropType<Array<DealerPlayDto>>, required: true })
  dealers!: DealerPlayDto[]

  addDealerDialog: boolean = false
  selectDealer?: DealerPlayDto

  showConfirmDialog: boolean = false
  confirmDialogTitle: string = ''
  confirmDialogMessage: string = ''

  mounted() {}

  @Emit('addDelaer')
  onAddDelaer(name: string) {
    this.addDealerDialog = false
    return name
  }

  onClickTableIn(dealer: DealerPlayDto) {
    this.selectDealer = dealer
    this.confirmDialogTitle = `'${this.selectDealer.name}' 딜러`
    this.confirmDialogMessage = `투입 하시겠습니까?`
    this.showConfirmDialog = true

    return dealer.id
  }

  onClickTableOut(dealer: DealerPlayDto) {
    this.selectDealer = dealer
    this.confirmDialogTitle = `'${this.selectDealer.name}' 딜러`
    this.confirmDialogMessage = `아웃 하시겠습니까?`
    this.showConfirmDialog = true
  }

  @Emit('dealerTableInOut')
  onConfirmTableInOut(): DealerPlayDto | undefined {
    this.showConfirmDialog = false
    return this.selectDealer
  }

  onCancelTableInOut(): number {
    this.showConfirmDialog = false
    return this.selectDealer?.id ?? 0
  }
}
</script>
