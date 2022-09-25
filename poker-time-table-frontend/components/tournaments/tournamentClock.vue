<template>
  <v-card class="fill-height" color="gray8" outlined tile>
    <v-row class="mt-8">
      <v-col justify="center">
        <v-card-title class="justify-center title-2-exbold" wrap>
          {{ data.title }}
        </v-card-title>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="6">
        <v-card-title class="justify-center">
          <div class="ma-0 playtime-text">PLAY TIME</div>
        </v-card-title>

        <v-card-title class="pt-0 playtime-value">
          {{ data.playTime }}
        </v-card-title>
      </v-col>

      <v-col cols="6">
        <v-card-title class="justify-center">
          <div class="nextbreak-text">NEXT BREAK</div>
        </v-card-title>

        <v-card-title class="pt-0 nextbreak-value">
          {{ data.nextBreakRemainTime }}
        </v-card-title>
      </v-col>
    </v-row>

    <v-row class="mt-0" justify="center">
      <v-col class="pa-0">
        <v-card-title class="pa-0 justify-center">
          <div class="remaintime-value">
            <template v-if="data.remainHours !== '00'">
              {{ data.remainHours }} :
            </template>
            {{ data.remainMinutes }} : {{ data.remainSeconds }}
          </div>
        </v-card-title>
      </v-col>
    </v-row>

    <v-row justify="center" align="center" class="mb-6">
      <v-btn
        small
        fab
        outlined
        color="gray6"
        :disabled="currentStep < 1 || !starting"
        @click="onDownBlind()"
      >
        <v-icon x-large color="white"> mdi-chevron-left </v-icon>
      </v-btn>

      <v-btn
        x-large
        fab
        outlined
        class="ma-6"
        color="gray6"
        @click="data.pause ? onPlay() : onPause()"
      >
        <v-icon v-if="data.pause" x-large color="primary"> mdi-play </v-icon>
        <v-icon v-else x-large color="primary"> mdi-pause </v-icon>
      </v-btn>

      <v-btn
        small
        fab
        outlined
        color="gray6"
        :disabled="blindCount <= currentStep || !starting"
        @click="onUpBlind()"
      >
        <v-icon x-large color="white"> mdi-chevron-right </v-icon>
      </v-btn>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" sm="12" md="12" lg="12" xl="12">
        <TournamentClockBlindCards
          :show-blind-table="showMiniVariant"
          :level="data.level"
          :ante="0"
          :small-blind="data.smallBlind"
          :big-blind="data.bigBlind"
          @onToggleShowBlindTable="onToggleShowBlindTable"
        />

        <v-row v-if="false" justify="center">
          <v-col cols="3" class="pa-0">
            <TournamentClockSubInfoCard
              :title="'CHIPS IN PLAY'"
              :value="data.chipsInPlay"
            />
          </v-col>

          <v-col cols="3" class="pa-0">
            <TournamentClockSubInfoCard
              :title="'PLAYER'"
              :value="data.player"
            />
          </v-col>

          <v-col cols="3" class="pa-0">
            <TournamentClockSubInfoCard
              :title="'AVERAGE STACK'"
              :value="data.averageStack"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, PropSync, Vue } from 'nuxt-property-decorator'
import TournamentClockBlindCards from './clock/blindCard.vue'
import TournamentClockSubInfoCard from './clock/subInfoCard.vue'
import { TournamentClockDto } from '~/dto/tournamentClockDto'

@Component({
  components: {
    TournamentClockBlindCards,
    TournamentClockSubInfoCard,
  },
})
export default class TournamentClock extends Vue {
  @PropSync('showVariant', { type: Boolean, required: true })
  showMiniVariant!: Boolean

  @Prop({ type: Object as () => TournamentClockDto, required: true })
  data!: TournamentClockDto

  @Prop({ type: Number })
  currentStep!: number

  @Prop({ type: Number })
  blindCount!: number

  @Prop({ type: Boolean })
  starting!: boolean

  @Prop({ type: Boolean, required: true })
  editMode!: boolean

  created() {}

  mounted() {}

  beforeDestroy() {}

  @Emit('onPlay')
  onPlay() {}

  @Emit('onPause')
  onPause() {}

  @Emit('onDownBlind')
  onDownBlind() {}

  @Emit('onUpBlind')
  onUpBlind() {}

  onToggleShowBlindTable(toggle: boolean) {
    this.showMiniVariant = toggle
  }
}
</script>

<style scoped lang="scss">
@import '~/assets/variables.scss';

.playtime-text {
  @extend .sub-copy;
  @extend .primary-color;
}

$top-text-size: $title-1-size + 1rem;
.playtime-value {
  @extend .title-1;
  @extend .primary-color;

  font-size: $top-text-size !important;
  line-height: $top-text-size;
  justify-content: center;
}

.nextbreak-text {
  @extend .sub-copy;
  @extend .gray2-color;
}

.nextbreak-value {
  @extend .title-1;
  @extend .gray2-color;

  font-size: $top-text-size !important;
  line-height: $top-text-size;
  justify-content: center;
}

$remaintime-size: $head-1-size + 5rem;
.remaintime-value {
  @extend .head-1-bold;
  font-size: $remaintime-size !important;
  line-height: $remaintime-size;
}
</style>
