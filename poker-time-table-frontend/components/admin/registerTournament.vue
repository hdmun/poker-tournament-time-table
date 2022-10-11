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
          <v-col>
            <v-select
              v-model="selectTemplate"
              :items="blindTemplates"
              label="Blind Structure"
              prepend-icon="mdi-table"
              item-text="name"
              single-line
              return-object
              :rules="[(v) => !!v || '블라인드를 선택해주세요']"
              required
              @change="onChangeSelectTemplate()"
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
import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'
import { BlindStructureTemplateDto } from '~/dto/blindStructureDto'
import { TournamentRegisterRequest } from '~/dto/tournamentDto'

@Component
export default class RegisterTournament extends Vue {
  tournamentName: string = ''
  buyIn: number = 0

  @Prop({ type: Array<BlindStructureTemplateDto>, required: true })
  blindTemplates!: BlindStructureTemplateDto[]

  selectTemplate: BlindStructureTemplateDto | null = null

  get disabledEditButton() {
    if (this.selectTemplate === null) return true
    if (this.tournamentName.trim().length <= 0) return true
    return false
  }

  mounted() {}

  @Emit('selectBlind')
  onChangeSelectTemplate(): number {
    if (this.selectTemplate === null) {
      return 0
    }

    return this.selectTemplate.id
  }

  @Emit('register')
  onRegister(): TournamentRegisterRequest | null {
    if (!this.selectTemplate) {
      return null
    }

    return {
      title: this.tournamentName,
      buyIn: this.buyIn,
      blindStructureId: this.selectTemplate.id,
    }
  }
}
</script>
