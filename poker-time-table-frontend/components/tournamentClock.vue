<template>
  <v-card class="fill-height" outlined tile>
    <v-row>
      <v-col cols="1">
        <v-btn
          class="ma-3"
          fab
          :disabled="editMode"
          @click="showMiniVariant = !showMiniVariant"
        >
          <v-icon>
            mdi-{{ `chevron-${showMiniVariant ? 'left' : 'right'}` }}
          </v-icon>
        </v-btn>
      </v-col>
      <v-col justify="center">
        <v-card-title
          class="justify-center text-h3"
          style="font-size: 5em"
          wrap
        >
          {{ data.title }}
        </v-card-title>
      </v-col>
      <v-col cols="1"></v-col>
    </v-row>

    <v-row justify="center">
      <v-col lg="3">
        <v-card-title class="justify-center"> PLAY TIME </v-card-title>

        <v-card-title
          class="justify-center pt-0"
          style="font-size: 3em; line-height: 3rem"
        >
          {{ data.playTime }}
        </v-card-title>
      </v-col>

      <v-col lg="3">
        <v-card-title class="justify-center"> NEXT BREAK </v-card-title>

        <v-card-title
          class="justify-center pt-0"
          style="font-size: 3em; line-height: 3rem"
        >
          {{ data.nextBreakTime }}
        </v-card-title>
      </v-col>
    </v-row>

    <v-row class="mt-0">
      <v-col>
        <v-card-title
          class="justify-center"
          style="font-size: 12em; line-height: 12rem"
        >
          {{ data.remainTime }}
        </v-card-title>
      </v-col>
    </v-row>

    <v-row justify="center" class="mb-6">
      <v-btn
        tile
        outlined
        class="ma-2"
        :disabled="currentStep < 1 || !starting"
        @click="onDownBlind()"
      >
        <v-icon> mdi-chevron-left </v-icon>
      </v-btn>

      <v-btn
        tile
        outlined
        class="ma-2"
        @click="data.pause ? onPlay() : onPause()"
      >
        <v-icon v-if="data.pause"> mdi-play </v-icon>
        <v-icon v-else> mdi-pause </v-icon>
      </v-btn>

      <v-btn
        tile
        outlined
        class="ma-2"
        :disabled="blindCount <= currentStep || !starting"
        @click="onUpBlind()"
      >
        <v-icon> mdi-chevron-right </v-icon>
      </v-btn>
    </v-row>

    <v-row justify="center">
      <v-col cols="9">
        <v-row justify="center">
          <v-col cols="9" class="pa-0">
            <v-card outlined tile>
              <v-row class="align-center">
                <v-col>
                  <v-card-title
                    class="justify-center"
                    style="font-size: 2em; line-height: 2rem"
                  >
                    <template v-if="data.level > 0">
                      Level {{ data.level }}
                    </template>
                    <template v-else>BREAK TIME</template>
                  </v-card-title>
                </v-col>
                <v-col>
                  <v-card-text class="text-center pb-0"> BLINDS </v-card-text>
                  <v-card-title
                    class="justify-center"
                    style="font-size: 2em; line-height: 2rem"
                  >
                    {{ data.smallBlind }} / {{ data.bigBlind }}
                  </v-card-title>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <v-row justify="center">
          <v-col cols="3" class="pa-0">
            <v-card outlined tile>
              <v-card-title class="justify-center">CHIPS IN PLAY</v-card-title>
              <v-card-title
                class="justify-center pt-0"
                style="font-size: 2em; line-height: 2rem"
              >
                <template v-if="data.chipsInPlay > 0">
                  {{ data.chipsInPlay }}
                </template>
                <template v-else>-</template>
              </v-card-title>
            </v-card>
          </v-col>

          <v-col cols="3" class="pa-0">
            <v-card outlined tile>
              <v-card-title class="justify-center">PLAYER</v-card-title>
              <v-card-title
                class="justify-center pt-0"
                style="font-size: 2em; line-height: 2rem"
              >
                <template v-if="data.totalPlayer > 0">
                  {{ data.player }} / {{ data.totalPlayer }}
                </template>
                <template v-else>-</template>
              </v-card-title>
            </v-card>
          </v-col>

          <v-col cols="3" class="pa-0">
            <v-card outlined tile>
              <v-card-title class="justify-center">AVERAGE STACK</v-card-title>
              <v-card-title
                class="justify-center pt-0"
                style="font-size: 2em; line-height: 2rem"
              >
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

  @Prop({ type: Boolean })
  pause!: boolean

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
