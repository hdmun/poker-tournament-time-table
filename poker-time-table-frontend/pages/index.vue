<template>
  <v-container>
    <v-row class="mb-12">
      <v-col>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import TournamentTable from '~/components/tournamentTable.vue'
// import TournamentClock from '~/components/tournamentClock.vue'

@Component({
  components: {
    TournamentTable
  }
})
export default class IndexPage extends Vue {

}
</script>
