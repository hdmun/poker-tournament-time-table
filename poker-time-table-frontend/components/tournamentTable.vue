<template>
  <v-card>
    <v-data-table :headers="headers" :items="tournaments" :items-per-page="10" hide-default-footer class="elevation-1"
      @page-count="pageCount = $event">
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

interface TableHeader {
  text: string
  value: string
}

interface TournamentDto {
  start: string
  name: string
  buyIn: string
  players: number
  prizePool: number
}

import dummyData from '~/data/tournamentTableDto'

@Component
export default class TournamentTable extends Vue {
  headers: TableHeader[] = [
    { text: 'Start', value: 'start' },
    { text: 'Title', value: 'name' },
    { text: 'Buy-in', value: 'buyIn' },
    { text: 'Players', value: 'players' },
    { text: 'Prize', value: 'prizePool' },
  ]
  tournaments: TournamentDto[] = dummyData

  page: number = 1
  pageCount: number = 1
}
</script>