<template>
  <v-card>
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
            <v-menu
              v-model="showDatePicker"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="startDate"
                  label="Start Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="startDate"
                @input="showDatePicker = false"
              ></v-date-picker>
            </v-menu>
          </v-col>

          <v-col lg="6">
            <v-menu
              ref="menu"
              v-model="showTimePicker"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="startTime"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="startTime"
                  label="Start Time"
                  prepend-icon="mdi-clock-time-four-outline"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="showTimePicker"
                v-model="startTime"
                full-width
                @click:minute="$refs.menu.save(startTime)"
              >
              </v-time-picker>
            </v-menu>
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

        <v-card-title>Prize Pool</v-card-title>

        <v-row>
          <v-col>
            <v-text-field
              v-for="(prize, index) in prizePool"
              :key="index"
              :value="prize"
              disabled
              prepend-icon="mdi-seal"
            >
              <v-icon
                slot="append"
                color="red"
                @click="onClickRemovePrize(index)"
              >
                mdi-minus
              </v-icon>
            </v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field
              v-model="prize"
              :label="`${prizePool.length + 1} Rank Prize`"
              prepend-icon="mdi-pencil-outline"
              type="number"
            >
              <v-btn
                slot="append"
                text
                :disabled="prize === ''"
                color="primary"
                @click="onClickAddPrize"
              >
                <v-icon> mdi-plus </v-icon>
              </v-btn>
            </v-text-field>
          </v-col>
        </v-row>

        <v-btn class="mr-4" color="primary" @click="onRegister"> 등록 </v-btn>
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
  startDate: string = new Date().toISOString().substring(0, 10)
  startTime: string = new Date().toTimeString().substring(0, 5)
  buyIn: number = 0

  blindTemplates: BlindStructureTemplateDto[] = []
  selectBlindTemplate: BlindStructureTemplateDto | null = null

  breakTime: number = 20
  breakTimeTerm: number = 3

  prizePool: number[] = []
  prize: number = 0

  showDatePicker: boolean = false
  showTimePicker: boolean = false

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

  onClickRemovePrize(index: number) {
    if (this.prizePool.length <= index) {
      return
    }

    this.prizePool.splice(index, 1)
  }

  onClickAddPrize() {
    if (this.prize > 0) {
      this.prizePool.push(this.prize)
      this.prize = 0
    }
  }

  @Emit('register')
  onRegister(): RegisterTournamentDto | null {
    if (!this.selectBlindTemplate) {
      return null
    }
    return {
      title: this.tournamentName,
      startDateTime: new Date(`${this.startDate} ${this.startTime}`),
      buyIn: this.buyIn,
      blindStructureId: this.selectBlindTemplate.id,
      breakTime: this.breakTime,
      breakTimeTerm: this.breakTimeTerm,
    }
  }
}
</script>
