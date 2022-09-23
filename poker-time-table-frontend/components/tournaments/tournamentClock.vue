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
      <v-col lg="3">
        <v-card-title class="justify-center">
          <div class="ma-0 sub-copy primary--text">PLAY TIME</div>
        </v-card-title>

        <v-card-title class="pt-0 justify-center title-1 primary--text">
          {{ data.playTime }}
        </v-card-title>
      </v-col>

      <v-col lg="3">
        <v-card-title class="justify-center">
          <div class="sub-copy gray2--text">NEXT BREAK</div>
        </v-card-title>

        <v-card-title class="pt-0 justify-center title-1 gray2--text">
          {{ data.nextBreakTime }}
        </v-card-title>
      </v-col>
    </v-row>

    <v-row class="mt-0" justify="center">
      <v-col class="pa-0">
        <v-card-title class="pa-0 justify-center">
          <div class="head-1">
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
      <v-col cols="6" sm="10" md="8" lg="6">
        <v-row justify="center">
          <v-col cols="3" class="pa-0">
            <v-card class="fill-height" color="gray7" outlined tile>
              <v-card-title v-if="data.level > 0" class="blind-level-info">
                Lv. {{ data.level }}
              </v-card-title>
              <v-card-title v-else class="break-time-info">
                Break Time
              </v-card-title>
            </v-card>
          </v-col>

          <v-col cols="3" class="pa-0">
            <v-card class="fill-height" color="gray7" outlined tile>
              <v-card-title class="pt-3 pb-0 ante-title"> Ante </v-card-title>
              <v-card-title class="play-info-value">
                {{ data.smallBlind }}
              </v-card-title>
            </v-card>
          </v-col>

          <v-col cols="3" class="pa-0">
            <v-card class="fill-height" color="gray7" outlined tile>
              <v-card-actions class="pb-0 justify-center">
                <v-btn text class="blind-title" @click="showMiniVariant = true">
                  <u>BLINDS</u> >
                </v-btn>
              </v-card-actions>

              <v-card-title class="play-info-value">
                {{ data.smallBlind }} / {{ data.bigBlind }}
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>

        <v-row justify="center">
          <v-col cols="3" class="pa-0">
            <v-card class="fill-height" color="gray7" outlined tile>
              <v-card-title class="play-info-title">CHIPS IN PLAY</v-card-title>
              <v-card-title class="pt-0 play-info-value">
                <template v-if="data.chipsInPlay > 0">
                  {{ data.chipsInPlay }}
                </template>
                <template v-else>-</template>
              </v-card-title>
            </v-card>
          </v-col>

          <v-col cols="3" class="pa-0">
            <v-card class="fill-height" color="gray7" outlined tile>
              <v-card-title class="play-info-title">PLAYER</v-card-title>
              <v-card-title class="pt-0 play-info-value">
                <template v-if="data.totalPlayer > 0">
                  {{ data.player }} / {{ data.totalPlayer }}
                </template>
                <template v-else>-</template>
              </v-card-title>
            </v-card>
          </v-col>

          <v-col cols="3" class="pa-0">
            <v-card class="fill-height" color="gray7" outlined tile>
              <v-card-title class="play-info-title">AVERAGE STACK</v-card-title>
              <v-card-title class="pt-0 play-info-value">
                <template v-if="data.averageStack > 0">
                  {{ data.averageStack }}
                </template>
                <template v-else>-</template>
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, PropSync, Vue } from 'nuxt-property-decorator'
import { TournamentClockDto } from '~/dto/tournamentClockDto'

@Component
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
}
</script>

<style scoped lang="scss">
@import '~/assets/variables.scss';

.blind-level-info {
  @extend .title-2-exbold;
  @extend .primary-color;

  justify-content: center;
  height: 100%;
}

.break-time-info {
  @extend .sub-copy-exbold;
  @extend .accent1-color;

  justify-content: center;
  height: 100%;
}

.ante-title {
  @extend .small-copy-1-exbold;
  @extend .gray3-color;

  justify-content: center;
}

.blind-title {
  @extend .small-copy-1-exbold;
  @extend .primary-color;

  padding-top: 16px;
  justify-content: center;
}

.play-info-title {
  @extend .small-copy-2;
  @extend .gray3-color;

  justify-content: center;
}

.play-info-value {
  @extend .sub-copy-exbold;
  @extend .gray1-color;

  justify-content: center;
}
</style>
