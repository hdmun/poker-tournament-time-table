<template>
  <v-flex class="ma-0 fill-height">
    <v-card class="ma-6 gray7">
      <v-card-title>
        토너먼트 기록 조회
        <v-spacer></v-spacer>

        <TableToolbarWithDatePicker @pickDate="onPickDate" />
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="tournaments"
        :page.sync="page"
        :items-per-page="itemPerPage"
        hide-default-footer
        class="elevation-1 gray7"
        @page-count="pageCount = $event"
      >
      </v-data-table>
    </v-card>
  </v-flex>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import TableToolbarWithDatePicker from '~/components/ui/tableToolbarWithDatePicker.vue'
import { vxm } from '~/store'
import { TournamentLogItem } from '~/store/admin/tournament'

interface TableHeader {
  text: string
  value: string
  sortable?: boolean
  align?: 'start' | 'center' | 'end'
}

@Component({
  components: {
    TableToolbarWithDatePicker,
  },
})
export default class TournamentLogPage extends Vue {
  headers: TableHeader[] = [
    { text: '시작 시간', value: 'start' },
    { text: '종료 시간', value: 'end' },
    { text: '토너먼트', value: 'name' },
    { text: '총 플레이 시간', value: 'playTime' },
  ]

  tournaments: TournamentLogItem[] = []

  page: number = 1
  pageCount: number = 1
  itemPerPage = 10

  mounted() {
    this.tournaments = vxm.tournament.logs
  }

  beforeDestroy() {
    vxm.tournament.updateLog([])
  }

  async onPickDate(date: Date) {
    // this.showDatePicker = false

    await vxm.tournament.loadTournamentLog({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    })
  }
}
</script>
