<template>
  <v-card>
    <v-data-table
      :headers="headers"
      :items="syncedTournaments"
      :page.sync="page"
      :items-per-page="itemPerPage"
      hide-default-footer
      class="elevation-1 gray7"
      @page-count="pageCount = $event"
    >
      <template #[`item.name`]="{ item }">
        <router-link
          :to="{ path: '/tournament-clock', query: { id: item.id } }"
          style="text-decoration: none; color: inherit"
        >
          {{ item.name }}
        </router-link>
      </template>

      <template #[`item.state`]="{ item }">
        <v-chip small :color="getStateColor(item.state)" dark>
          {{ item.state }}
        </v-chip>
      </template>

      <template #[`item.close`]="{ item }">
        <v-btn
          rounded
          class="accent"
          :disabled="disabledCloseBtn(item.state)"
          @click="onClickClose(item)"
        >
          종료
        </v-btn>
      </template>

      <template #[`item.delete`]="{ item }">
        <v-btn rounded class="gray5" @click="onClickDelete(item)"> 삭제 </v-btn>
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
import { Component, Emit, PropSync, Vue } from 'nuxt-property-decorator'
import { PropType } from 'vue'
import { eTournamentState, TournamentItem } from '~/store/admin/tournament'

interface TableHeader {
  text: string
  value: string
  sortable?: boolean
  align?: 'start' | 'center' | 'end'
}

@Component
export default class TournamentTable extends Vue {
  headers: TableHeader[] = [
    { text: '시작 시간', value: 'start', align: 'center' },
    { text: '상태', value: 'state', align: 'center' },
    { text: '토너먼트', value: 'name' },
    { text: '종료', value: 'close', sortable: false, align: 'center' },
    { text: '삭제', value: 'delete', sortable: false, align: 'center' },
  ]

  @PropSync('tournaments', {
    type: Array as PropType<Array<TournamentItem>>,
    required: true,
  })
  syncedTournaments!: TournamentItem[]

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

  disabledCloseBtn(state: eTournamentState): boolean {
    return state !== eTournamentState.Play
  }

  getStateColor(state: eTournamentState): string {
    switch (state) {
      case eTournamentState.Play:
        return 'green'
      default:
        return 'gray5'
    }
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

  @Emit('close')
  onClickCloseTournament(): number {
    this.closeDialog = false

    if (!this.deleteTournment) {
      return 0
    }

    return this.deleteTournment.id
  }

  @Emit('delete')
  onClickDeleteTournament(): number {
    this.deleteDialog = false

    if (!this.deleteTournment) {
      return 0
    }
    return this.deleteTournment.id
  }
}
</script>
