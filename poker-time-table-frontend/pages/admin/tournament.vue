<template>
  <v-flex>
    <v-row class="pa-6">
      <v-col lg="4">
        <AdminRegisterTournament
          :blind-templates="blindTemplates"
          :late-reg-blind-id="selectLateRegBlind?.id ?? null"
          @selectBlind="onSelectBlind"
          @register="onRegister"
        />

        <v-alert dense type="info" class="mt-4 gray6">
          <template v-for="message in alertMessage">
            {{ message }} <br />
          </template>
        </v-alert>

        <v-card class="mt-4 gray7">
          <v-card-title> 블라인드 스트럭쳐</v-card-title>

          <v-simple-table dense class="gray7">
            <template #default>
              <thead>
                <tr>
                  <th class="text-left">ID</th>
                  <th class="text-left">Level</th>
                  <th class="text-left">S.B</th>
                  <th class="text-left">B.B</th>
                  <th class="text-left">Ante</th>
                  <th class="text-left">Minute</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in templateStructures"
                  :key="item.id"
                  @click="onClickBlind(item)"
                >
                  <template v-if="item.level > 0">
                    <td>{{ item.id }}</td>
                    <td>{{ item.level }}</td>
                    <td>{{ item.smallBlind }}</td>
                    <td>{{ item.bigBlind }}</td>
                    <td>{{ item.ante }}</td>
                    <td>{{ item.minute }}</td>
                  </template>

                  <template v-else>
                    <td>{{ item.id }}</td>
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
        <TournamentTable
          :tournaments.sync="tournaments"
          @close="onClose"
          @delete="onDelete"
        />
      </v-col>
    </v-row>

    <ErrorDialog
      :show-dialog="showErrorDialog"
      :dialog-message="errorDialogMessage"
      @confirm="onConfirmErrorDialog"
    />
  </v-flex>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import TournamentTable from '~/components/tournaments/tournamentTable.vue'
import AdminRegisterTournament from '~/components/admin/registerTournament.vue'
import { TournamentRegisterRequest } from '~/dto/tournamentDto'
import { vxm } from '~/store'
import {
  BlindStructureDto,
  BlindStructureTemplateDto,
} from '~/dto/blindStructureDto'
import { AxiosError } from '~/utils/api'
import ErrorDialog from '~/components/ui/errorDialog.vue'
import { TournamentItem } from '~/store/admin/tournament'

@Component({
  components: {
    AdminRegisterTournament,
    ErrorDialog,
    TournamentTable,
  },
})
export default class AdminTournament extends Vue {
  tournaments: TournamentItem[] = []
  blindTemplates: BlindStructureTemplateDto[] = []
  templateStructures: BlindStructureDto[] = []

  selectLateRegBlind: BlindStructureDto | null = null

  showErrorDialog: boolean = false
  errorDialogMessage: string = ''

  get alertMessage(): string[] {
    if (this.templateStructures.length <= 0) {
      return ['블라인드 템플릿을 선택해주세요.']
    }

    if (this.selectLateRegBlind === null) {
      return [
        '아래 블라인드 스트럭쳐에서',
        '`Late Reg` 마감 기준을 선택해주세요.',
        '선택한 블라인드가 끝나는 시점이 Late Reg 마감 시간입니다.',
      ]
    }

    const blindId = this.selectLateRegBlind.id
    return [
      `${blindId}번 블라인드를 선택했습니다.`,
      `${blindId}번 블라인드가 종료되면 Late Reg가 마감됩니다.`,
    ]
  }

  async mounted() {
    this.tournaments = vxm.tournament.tournaments
    this.blindTemplates = vxm.blindTemplate.templates
    this.templateStructures = vxm.blindTemplate.templateStructures

    this.loadTournaments()

    try {
      await vxm.blindTemplate.getBlindTemplates()
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError !== null) {
        this.onError(axiosError)
      }
    }
  }

  beforeDestroy() {
    vxm.blindTemplate.updateTemplateStructures([])
  }

  async loadTournaments() {
    try {
      await vxm.tournament.loadTournaments()
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError !== null) {
        this.onError(axiosError)
      }
    }
  }

  async onSelectBlind(templateId: number) {
    if (templateId <= 0) {
      vxm.blindTemplate.updateTemplateStructures([])
      return
    }

    try {
      await vxm.blindTemplate.getBlindTemplateById(templateId)
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError !== null) {
        this.onError(axiosError)
      }
    }
  }

  async onRegister(dto: TournamentRegisterRequest) {
    try {
      await vxm.tournament.registerBy(dto)
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError !== null) {
        this.onError(axiosError)
      }
    }

    this.loadTournaments()
  }

  async onClose(tournamentId: number) {
    if (tournamentId > 0) {
      try {
        await vxm.tournament.closeBy(tournamentId)
      } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError !== null) {
          this.onError(axiosError)
        }
      }
    }
  }

  async onDelete(tournamentId: number) {
    if (tournamentId > 0) {
      try {
        await vxm.tournament.deleteBy(tournamentId)
      } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError !== null) {
          this.onError(axiosError)
        }
      }
    }
  }

  onError(error: AxiosError) {
    // eslint-disable-next-line no-console
    console.error('AxiosError', error.toJSON())
    // eslint-disable-next-line no-console
    console.error(error.response)
    this.errorDialogMessage = error.response?.data.error
    this.showErrorDialog = true
  }

  onClickBlind(dto: BlindStructureDto): void {
    this.selectLateRegBlind = dto
  }

  onConfirmErrorDialog() {
    this.showErrorDialog = false
  }
}
</script>
