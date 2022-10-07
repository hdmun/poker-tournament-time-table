<template>
  <v-flex>
    <v-row class="pa-6">
      <v-col lg="4">
        <AdminRegisterTournament @register="onRegister" />

        <v-card class="mt-4 gray7">
          <v-card-title> 블라인드 스트럭쳐</v-card-title>

          <v-simple-table dense class="gray7">
            <template #default>
              <thead>
                <tr>
                  <th class="text-left">Level</th>
                  <th class="text-left">S.B</th>
                  <th class="text-left">B.B</th>
                  <th class="text-left">Ante</th>
                  <th class="text-left">Minute</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in templateStructures" :key="item.name">
                  <template v-if="item.level > 0">
                    <td>{{ item.level }}</td>
                    <td>{{ item.smallBlind }}</td>
                    <td>{{ item.bigBlind }}</td>
                    <td>{{ item.ante }}</td>
                    <td>{{ item.minute }}</td>
                  </template>

                  <template v-else>
                    <td class="text-center" colspan="5">
                      Break Time <strong>{{ item.minute }}</strong> Minute
                    </td>
                  </template>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>

      <v-col lg="8">
        <TournamentTable ref="tournamentTable" />
      </v-col>
    </v-row>
  </v-flex>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'nuxt-property-decorator'
import TournamentTable from '~/components/tournaments/tournamentTable.vue'
import AdminRegisterTournament from '~/components/admin/registerTournament.vue'
import { TournamentRegisterRequest } from '~/dto/tournamentDto'
import { vxm } from '~/store'
import { BlindStructureDto } from '~/dto/blindStructureDto'

@Component({
  components: {
    AdminRegisterTournament,
    TournamentTable,
  },
})
export default class AdminTournament extends Vue {
  @Ref() tournamentTable!: TournamentTable
  templateStructures: BlindStructureDto[] = []

  mounted() {
    this.templateStructures = vxm.blindTemplate.templateStructures
  }

  beforeDestroy() {
    vxm.blindTemplate.updateTemplateStructures([])
  }

  async onRegister(dto: TournamentRegisterRequest) {
    try {
      await vxm.tournament.registerBy(dto)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
    this.tournamentTable.loadTournaments()
  }
}
</script>
