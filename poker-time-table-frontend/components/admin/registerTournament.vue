<template>
  <v-card>
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="text-h5">
          신규 토너먼트
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-card-text>
      <v-form ref="form">
        <v-row>
          <v-col>
            <v-text-field v-model="tournamentName" counter="25" label="토너먼트 이름" prepend-icon="mdi-tournament" />
          </v-col>
        </v-row>
        <v-row>
          <v-col lg="6">
            <v-menu v-model="showDatePicker" :close-on-content-click="false" :nudge-right="40"
              transition="scale-transition" offset-y min-width="auto">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field v-model="startDate" label="Start Date" prepend-icon="mdi-calendar" readonly v-bind="attrs"
                  v-on="on"></v-text-field>
              </template>
              <v-date-picker v-model="startDate" @input="showDatePicker = false"></v-date-picker>
            </v-menu>
          </v-col>

          <v-col lg="6">
            <v-menu ref="menu" v-model="showTimePicker" :close-on-content-click="false" :nudge-right="40"
              :return-value.sync="startTime" transition="scale-transition" offset-y max-width="290px" min-width="290px">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field v-model="startTime" label="Start Time" prepend-icon="mdi-clock-time-four-outline" readonly
                  v-bind="attrs" v-on="on"></v-text-field>
              </template>
              <v-time-picker v-if="showTimePicker" v-model="startTime" full-width
                @click:minute="$refs.menu.save(startTime)">
              </v-time-picker>
            </v-menu>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field v-model="tournamentName" counter="25" label="Buy-in" prepend-icon="mdi-currency-usd" />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-select v-model="selectBlindStructure" :items="blindStructures" label="Blind Structure"
              prepend-icon="mdi-table" single-line :rules="[(v) => !!v || 'This field is required']" required>
            </v-select>
          </v-col>
        </v-row>

        <v-card-title>Prize Pool</v-card-title>

        <v-row>
          <v-col>
            <v-text-field v-for="(prize, index) in prizePool" :key="index" :value="prize" disabled
              prepend-icon="mdi-seal">
              <v-icon slot="append" color="red" @click="onClickRemovePrize(index)"> mdi-minus </v-icon>
            </v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field v-model="prize" v-bind:label="`${prizePool.length + 1} Rank Prize`"
              prepend-icon="mdi-pencil-outline">
              <v-btn text :disabled="prize === ''" slot="append" color="primary" @click="onClickAddPrize">
                <v-icon> mdi-plus </v-icon>
              </v-btn>
            </v-text-field>
          </v-col>
        </v-row>

        <v-btn class=" mr-4" color="primary" @click="onRegister">
          등록
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class RegisterTournament extends Vue {
  tournamentName: string = ''
  startDate: string = new Date().toISOString().substring(0, 10)
  startTime: string = new Date().toTimeString().substring(0, 5)
  buyIn: number = 0
  // maxEntry: number = 0
  selectBlindStructure: any = null

  blindStructures: any[] = []

  prizePool: string[] = []
  prize: string = ''

  showDatePicker: boolean = false
  showTimePicker: boolean = false

  onClickRemovePrize(index: number) {
    if (this.prizePool.length <= index) {
      return
    }

    this.prizePool.splice(index, 1)
  }

  onClickAddPrize() {
    this.prizePool.push(this.prize)
    this.prize = ''
  }

  onRegister() {

  }
}
</script>