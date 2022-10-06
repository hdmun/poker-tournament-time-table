<template>
  <v-card class="fill-height" color="gray8" outlined tile>
    <v-row class="mt-xl-8">
      <v-col justify="center">
        <v-card-title class="tournament-title" wrap>
          {{ data.title }}
        </v-card-title>
      </v-col>
    </v-row>

    <v-row class="mt-md-0" justify="center">
      <v-col class="pa-md-0" cols="6">
        <v-card-title class="justify-center">
          <div class="ma-0 playtime-text">PLAY TIME</div>
        </v-card-title>

        <v-card-title class="pt-0 playtime-value">
          {{ data.playTime }}
        </v-card-title>
      </v-col>

      <v-col class="pa-md-0" cols="6">
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
              {{ data.remainHours }}:{{ data.remainMinutes }}:{{
                data.remainSeconds
              }}
            </template>
            <template v-else>
              {{ data.remainMinutes }} : {{ data.remainSeconds }}
            </template>
          </div>
        </v-card-title>
      </v-col>
    </v-row>

    <v-row class="mt-lg-0 mb-xl-6" justify="center" align="center">
      <v-btn
        large
        fab
        outlined
        color="gray6"
        :disabled="disabledBlindDown"
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
        :disabled="closedTournament"
        @click="data.pause ? onPlay() : onPause()"
      >
        <v-icon v-if="data.pause" x-large color="primary"> mdi-play </v-icon>
        <v-icon v-else x-large color="accent1"> mdi-pause </v-icon>
      </v-btn>

      <v-btn
        large
        fab
        outlined
        color="gray6"
        :disabled="disabledBlindUp"
        @click="onUpBlind()"
      >
        <v-icon x-large color="white"> mdi-chevron-right </v-icon>
      </v-btn>
    </v-row>

    <v-row class="mt-lg-0" justify="center">
      <v-col class="pa-lg-0" cols="12" sm="12" md="12" lg="12" xl="12">
        <TournamentClockBlindCards
          :show-blind-table="showMiniVariant"
          :level="data.level"
          :ante="data.ante"
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

    <v-snackbar
      :value="disabledBlindUp"
      :timeout="-1"
      absolute
      top
      tile
      color="ma-12 red accent-2"
    >
      <div class="snackbar-text">{{ snackbarMessage }}</div>
    </v-snackbar>
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

  @Prop({ type: Number, default: 0 })
  currentStep!: number

  @Prop({ type: Number, default: 0 })
  blindCount!: number

  @Prop({ type: Boolean, default: true })
  starting!: boolean

  @Prop({ type: Boolean, required: true })
  editMode!: boolean

  waitRender: boolean = true

  get snackbarMessage(): string {
    if (this.closedTournament) {
      return '종료된 토너먼트 입니다.'
    }
    if (!this.starting) {
      return '시작 대기 중...'
    }

    return '로딩 중...'
  }

  get closedTournament(): boolean {
    return this.blindCount <= this.currentStep
  }

  get disabledBlindUp(): boolean {
    if (this.waitRender) {
      return false
    }
    return this.blindCount <= this.currentStep || !this.starting
  }

  get disabledBlindDown(): boolean {
    return this.currentStep < 1 || !this.starting
  }

  updated() {
    this.waitRender = false
  }

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

.tournament-title {
  justify-content: center;
  @include title2-bold;
}

.playtime-text {
  @include sub-copy;
  @include primary-color;
}

.nextbreak-text {
  @include sub-copy;
  @include gray2-color;
}

$top-text-size: $title-1-size + 1rem;
.playtime-value {
  @include media('lg-and-up') {
    font-size: $top-text-size !important;
    line-height: $top-text-size;

    @include galaxy-tab-a8-landscape() {
      @include title2-bold;
    }
  }

  @include media('md-only') {
    @include title1-bold;
  }

  @include media('sm-and-down') {
    @include title2-bold;
  }

  @include primary-color;
  justify-content: center;
}

.nextbreak-value {
  @include media('lg-and-up') {
    font-size: $top-text-size !important;
    line-height: $top-text-size;

    @include galaxy-tab-a8-landscape() {
      @include title2-bold;
    }
  }

  @include media('md-only') {
    @include title1-bold;
  }

  @include media('sm-and-down') {
    @include title2-bold;
  }

  @include gray2-color;
  justify-content: center;
}

$remaintime-xl-size: $head-1-size + 5rem;
.remaintime-value {
  @include media('lg-and-up') {
    @include head1-bold;
    font-size: $remaintime-xl-size !important;
    line-height: $remaintime-xl-size;

    @include galaxy-tab-a8-landscape() {
      @include head1-bold;
    }
  }

  @include media('md-only') {
    @include head1-bold;
    font-size: $remaintime-xl-size !important;
    line-height: $remaintime-xl-size;
  }

  @include media('sm-and-down') {
    @include head2-bold;

    @include galaxy-tab-a8-portrait() {
      @include head2-bold;
      font-size: 10rem !important;
      line-height: 10rem;
    }
  }
}

.snackbar-text {
  @include title1-bold;
  margin: 1rem !important;
}
</style>
