<template>
  <v-card>
    <v-card-title>
      {{ tableTitle }}
      <v-spacer></v-spacer>

      <TableToolbarWithDatePicker @pickDate="onPickDate" />
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="dealers"
      :items-per-page="itemPerPage"
      hide-default-footer
      class="elevation-1"
      @page-count="pageCount = $event"
    />

    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'
import { PropType } from 'vue'
import TableToolbarWithDatePicker from '../ui/tableToolbarWithDatePicker.vue'
import { DealerPlayLogDto } from '~/dto/dealerDto'

interface TableHeader {
  text: string
  value: string
  sortable?: boolean
}

@Component({
  components: {
    TableToolbarWithDatePicker,
  },
})
export default class DealerPlayLogTable extends Vue {
  tableTitle = '딜러 플레이 기록'
  headers: TableHeader[] = [
    { text: '이름', value: 'name' },
    { text: '토너먼트', value: 'tournament' },
    { text: '시작 시간', value: 'sitInTime' },
    { text: '종료 시간', value: 'sitOutTime' },
    { text: '딜링 시간', value: 'dealingTime' },
  ]

  page = 1
  pageCount = 1
  itemPerPage = 10

  @Prop({ type: Array as PropType<Array<DealerPlayLogDto>>, required: true })
  dealers!: DealerPlayLogDto[]

  @Emit('pickDate')
  onPickDate(date: Date): Date {
    return date
  }
}
</script>
