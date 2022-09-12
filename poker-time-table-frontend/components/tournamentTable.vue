<template>
  <v-card>
    <v-data-table
      :headers="headers"
      :items="tournaments"
      :items-per-page="10"
      hide-default-footer
      class="elevation-1"
      @page-count="pageCount = $event"
    >
      <template #[`item.name`]="{ item }">
        <router-link
          :to="{ path: '/tournament-clock', query: { id: item.id } }"
        >
          {{ item.name }}
        </router-link>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { TournamentDetailDto } from '~/dto/tournamentDto'

interface TableHeader {
  text: string
  value: string
}

interface TournamentDto {
  id: number
  start: string
  name: string
  buyIn: string
  players: number
  prizePool: number
}

@Component
export default class TournamentTable extends Vue {
  headers: TableHeader[] = [
    { text: 'Start', value: 'start' },
    { text: 'Title', value: 'name' },
    { text: 'Buy-in', value: 'buyIn' },
    { text: 'Players', value: 'players' },
    { text: 'Prize', value: 'prizePool' },
  ]

  tournaments: TournamentDto[] = []

  page: number = 1
  pageCount: number = 1

  mounted() {
    this.loadTournaments()
  }

  async loadTournaments() {
    const res = await this.$axios.get<TournamentDetailDto[]>(`/api/tournaments`)
    this.tournaments = res.data
      .map<TournamentDto>((value) => {
        return {
          id: value.id,
          start: value.startDateTime
            ? new Date(value.startDateTime)
                .toISOString()
                .replace('T', ' ')
                .substring(0, 19)
            : '대기 중',
          name: value.title,
          buyIn: `${value.buyIn}`,
          players: -1,
          prizePool: -1,
        }
      })
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
  }
}
</script>
