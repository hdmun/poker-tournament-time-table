<template>
  <v-card class="gray7">
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="text-h5"> 신규 토너먼트 </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-card-text>
      <v-form ref="form">
        <v-row>
          <v-col>
            <v-text-field
              v-model="tournamentName"
              counter="25"
              label="토너먼트 이름"
              prepend-icon="mdi-tournament"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col lg="6">
            <v-text-field
              v-model="breakTime"
              label="Break Time"
              prepend-icon="mdi-coffee-outline"
            />
          </v-col>
          <v-col lg="6"
            ><v-text-field
              v-model="breakTimeTerm"
              label="Break Time 간격(level)"
              prepend-icon="mdi-currency-usd"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field
              v-model="buyIn"
              counter="25"
              label="Buy-in"
              prepend-icon="mdi-currency-usd"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-select
              v-model="selectBlindTemplate"
              :items="blindTemplates"
              label="Blind Structure"
              prepend-icon="mdi-table"
              item-text="name"
              single-line
              return-object
              :rules="[(v) => !!v || 'This field is required']"
              required
            >
            </v-select>
          </v-col>
        </v-row>

        <v-btn
          class="mr-4"
          color="primary"
          :disabled="disabledEditButton"
          @click="onRegister"
        >
          등록
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'nuxt-property-decorator'
import { BlindStructureTemplateDto } from '~/dto/blindStructureDto'
import { RegisterTournamentDto } from '~/dto/tournamentDto'

@Component
export default class RegisterTournament extends Vue {
  tournamentName: string = ''
  buyIn: number = 0

  blindTemplates: BlindStructureTemplateDto[] = []
  selectBlindTemplate: BlindStructureTemplateDto | null = null

  breakTime: number = 20
  breakTimeTerm: number = 3

  get disabledEditButton() {
    if (this.selectBlindTemplate === null) return true
    if (this.tournamentName.trim().length <= 0) return true
    return false
  }

  mounted() {
    this.loadTemplates()
  }

  async loadTemplates() {
    const res = await this.$axios.get<BlindStructureTemplateDto[]>(
      `/api/blind-structures/templates`
    )
    this.blindTemplates = res.data.sort((a, b) => {
      if (a.name < b.name) return -1
      if (a.name > b.name) return 1
      return 0
    })
  }

  @Emit('register')
  onRegister(): RegisterTournamentDto | null {
    if (!this.selectBlindTemplate) {
      return null
    }

    return {
      title: this.tournamentName,
      buyIn: this.buyIn,
      blindStructureId: this.selectBlindTemplate.id,
      breakTime: this.breakTime,
      breakTimeTerm: this.breakTimeTerm,
    }
  }
}
</script>
