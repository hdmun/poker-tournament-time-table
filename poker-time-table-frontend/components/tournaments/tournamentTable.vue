<template>
  <v-card>
    <v-data-table
      :headers="headers"
      :items="tournaments"
      :page.sync="page"
      :items-per-page="itemPerPage"
      hide-default-footer
      class="elevation-1 gray7"
      @page-count="pageCount = $event"
    >
      <template #[`item.name`]="{ item }">
        <router-link
          :to="{ path: '/tournament-clock', query: { id: item.id } }"
        >
          {{ item.name }}
        </router-link>
      </template>

      <template #[`item.action`]="{ item }">
        <v-icon
          :disabled="item.start === '대기 중'"
          @click="onClickClose(item)"
        >
          mdi-close
        </v-icon>
        <v-icon @click="onClickDelete(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
    <div class="text-center pt-2 gray7">
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </div>

    <v-dialog v-model="showDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5"> {{ dialogTitle }} </v-card-title>
        <v-card-text> {{ dialogAskText }} </v-card-text>
        <v-card-text> 토너먼트 리스트에서 사라집니다. </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="onClickDialogCancel()"> 취소 </v-btn>
          <v-btn color="green accent-1" text @click="onClickDialogOK()">
            확인
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { vxm } from '~/store'
import { TournamentItem } from '~/store/admin/tournament'

interface TableHeader {
  text: string
  value: string
  sortable?: boolean
}

@Component
export default class TournamentTable extends Vue {
  headers: TableHeader[] = [
    { text: 'Start', value: 'start' },
    { text: 'Title', value: 'name' },
    { text: 'Buy-in', value: 'buyIn' },
    { text: 'Action', value: 'action', sortable: false },
  ]

  tournaments: TournamentItem[] = []

  page: number = 1
  pageCount: number = 1

  get itemPerPage(): number {
    return 20
  }

  closeDialog: boolean = false
  deleteDialog: boolean = false
  deleteTournment: TournamentItem | null = null

  get showDialog(): boolean {
    return this.closeDialog || this.deleteDialog
  }

  get dialogTitle(): string {
    if (this.closeDialog) {
      return '토너먼트 종료'
    }
    if (this.deleteDialog) {
      return '토너먼트 삭제'
    }
    return ''
  }

  get dialogAskText(): string {
    if (this.closeDialog) {
      return `'${this.deleteTournment?.name}' 종료합니다.`
    }
    return `'${this.deleteTournment?.name}' 삭제합니다.`
  }

  mounted() {
    vxm.tournament.loadTournaments().then(() => {
      this.tournaments = vxm.tournament.tournaments
    })
  }

  onClickClose(item: TournamentItem) {
    this.closeDialog = true
    this.deleteTournment = item
  }

  onClickDelete(item: TournamentItem) {
    this.deleteDialog = true
    this.deleteTournment = item
  }

  onClickDialogCancel() {
    this.closeDialog = false
    this.deleteDialog = false
    this.deleteTournment = null
  }

  onClickDialogOK() {
    if (this.closeDialog) {
      this.onClickCloseTournament()
    }
    if (this.deleteDialog) {
      this.onClickDeleteTournament()
    }
  }

  async onClickCloseTournament() {
    if (!this.deleteTournment) {
      this.closeDialog = false
      return
    }

    try {
      await vxm.tournament.closeBy(this.deleteTournment.id)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }

    this.closeDialog = false
  }

  async onClickDeleteTournament() {
    if (!this.deleteTournment) {
      this.deleteDialog = false
      return
    }

    try {
      await vxm.tournament.deleteBy(this.deleteTournment.id)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }

    this.deleteDialog = false
  }
}
</script>
