<template>
  <v-card class="gray7">
    <v-card-title>
      딜러 상태
      <v-spacer></v-spacer>

      <v-btn
        color="accent"
        dark
        class="ma-3"
        @click="showAddDealerDialog = true"
      >
        딜러 추가
      </v-btn>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="dealers"
      :items-per-page="10"
      hide-default-footer
      class="elevation-1 gray7"
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
      :dialog-title="dialogTitle"
      :dialog-message="dialogMessage"
      :dialog-confirm-text="'확인'"
      @confirm="onConfirmTableOut"
      @cancel="onCancelTableInOut"
    />

    <AddDelaerDialog
      :show-add-dialog.sync="showAddDealerDialog"
      @addDealer="onAddDelaer"
    />

    <SelectDialog
      :show-select-dialog.sync="showSelectDialog"
      :dialog-title="dialogTitle"
      :dialog-message="dialogMessage"
      :select-items="selectItems"
      @select="onConfirmTableIn"
    />
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'
import { PropType } from 'vue'
import ConfirmDialog from '../ui/confirmDialog.vue'
import TableToolbarWithDatePicker from '../ui/tableToolbarWithDatePicker.vue'
import SelectDialog, { SelectDialogItem } from '../ui/selectDialog.vue'
import AddDelaerDialog from './addDelaerDialog.vue'
import { DealerPlayDto } from '~/store/admin/dealer'
import { TournamentSitIn } from '~/store/admin/tournament'
import { UpdateDealerRequest } from '~/dto/dealerDto'
import { convertMsToTimeString } from '~/utils/time'

interface TableHeader {
  text: string
  value: string
  sortable?: boolean
}

@Component({
  components: {
    AddDelaerDialog,
    ConfirmDialog,
    SelectDialog,
    TableToolbarWithDatePicker,
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

  @Prop({ type: Array as PropType<Array<TournamentSitIn>>, required: true })
  tournamentsSitIn!: TournamentSitIn[]

  showAddDealerDialog: boolean = false
  selectDealer?: DealerPlayDto

  showConfirmDialog: boolean = false
  dialogTitle: string = ''
  dialogMessage: string = ''

  showSelectDialog: boolean = false

  timer: NodeJS.Timer | null = null

  mounted() {
    if (this.timer !== null) {
      clearInterval(this.timer)
      this.timer = null
    }

    this.timer = setInterval(this.updateDealingTime, 1000)
  }

  beforeDestroy() {
    if (this.timer !== null) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  get selectItems(): SelectDialogItem[] {
    return this.tournamentsSitIn.map<SelectDialogItem>((value) => {
      return {
        id: value.tournamentId,
        label: value.tournamentTitle,
      }
    })
  }

  @Emit('addDelaer')
  onAddDelaer(name: string) {
    this.showAddDealerDialog = false
    return name
  }

  @Emit('loadTournaments')
  onClickTableIn(dealer: DealerPlayDto) {
    this.selectDealer = dealer
    this.dialogTitle = `'${this.selectDealer.name}' 딜러`
    this.dialogMessage = `토너먼트를 선택해주세요`
    this.showSelectDialog = true
  }

  @Emit('dealerTableIn')
  onConfirmTableIn(tournamentId: number): UpdateDealerRequest | undefined {
    this.showSelectDialog = false
    if (this.selectDealer) {
      return {
        dealerId: this.selectDealer.id,
        tournamentId,
      }
    }
    return undefined
  }

  onClickTableOut(dealer: DealerPlayDto) {
    this.selectDealer = dealer
    this.dialogTitle = `'${this.selectDealer.name}' 딜러`
    this.dialogMessage = `아웃 하시겠습니까?`
    this.showConfirmDialog = true
  }

  @Emit('dealerTableOut')
  onConfirmTableOut(): DealerPlayDto | undefined {
    this.showConfirmDialog = false
    return this.selectDealer
  }

  onCancelTableInOut() {
    this.showConfirmDialog = false
  }

  updateDealingTime() {
    this.dealers?.forEach((dealer) => {
      if (dealer.sitInTime) {
        const dealingTimeMs =
          new Date().getTime() - new Date(dealer.sitInTime).getTime()
        dealer.dealingTime = convertMsToTimeString(dealingTimeMs)
      }
    })
  }
}
</script>
