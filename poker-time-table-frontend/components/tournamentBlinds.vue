<template>
  <v-card height="100%" outlined tile>
    <v-row justify="center">
      <v-col>
        <v-card-title class="justify-center"> BLINDS </v-card-title>
      </v-col>
    </v-row>

    <v-row justify="center" class="ma-0">
      <v-col class="pa-0">
        <v-card class="pa-0" color="accent" outlined tile>
          <v-card-title class="justify-center"> Lv. </v-card-title>
        </v-card>
      </v-col>

      <v-col class="pa-0">
        <v-card class="pa-0" color="accent" outlined tile>
          <v-card-title class="justify-center"> S.B </v-card-title>
        </v-card>
      </v-col>

      <v-col class="pa-0">
        <v-card class="pa-0" color="accent" outlined tile>
          <v-card-title class="justify-center"> B.B </v-card-title>
        </v-card>
      </v-col>

      <v-col class="pa-0">
        <v-card class="pa-0" color="accent" outlined tile>
          <v-card-title class="justify-center"> 시간 </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center" class="ma-0" v-for="blind in blindStructure" :key="blind.sn">
      <template v-if="blind.level > 0">
        <v-col class="pa-0">
          <v-card class="pa-0" :color="currentColorText(blind.sn)" outlined tile>
            <v-card-title class="justify-center"> {{ blind.level }} </v-card-title>
          </v-card>
        </v-col>
        <v-col class="pa-0">
          <v-card class="pa-0" :color="currentColorText(blind.sn)" outlined tile>
            <v-card-title class="justify-center"> {{ blind.smallBlind }} </v-card-title>
          </v-card>
        </v-col>
        <v-col class="pa-0">
          <v-card class="pa-0" :color="currentColorText(blind.sn)" outlined tile>
            <v-card-title class="justify-center"> {{ blind.bigBlind }} </v-card-title>
          </v-card>
        </v-col>
      </template>

      <template v-else>
        <v-col class="pa-0">
          <v-card class="pa-0" :color="currentColorText(blind.sn)" outlined tile>
            <v-card-title class="justify-center"> BREAK TIME </v-card-title>
          </v-card>
        </v-col>
      </template>

      <v-col class="pa-0">
        <v-card class="pa-0" :color="currentColorText(blind.sn)" outlined tile>
          <v-card-title class="justify-center"> {{ blind.minute }}분 </v-card-title>
        </v-card>
      </v-col>
    </v-row>

  </v-card>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'nuxt-property-decorator'
import { PropType } from 'vue';
import { BlindStructureDto } from '~/dto/blindStructureDto'

@Component
export default class TournamentBlinds extends Vue {
  // headers: string[] = ['Lv.', 'S.B', 'B.B', '시간']

  @PropSync('structure', { type: Array as PropType<Array<BlindStructureDto>> })
  blindStructure!: BlindStructureDto[]  // fixed length is 11

  @Prop({ type: Number, required: true })
  currentStep!: number

  currentColorText(sn: number) {
    return this.currentStep === sn ? 'primary' : ''
  }
}
</script>