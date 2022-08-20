<template>
  <v-card height="100%">
    <v-row justify="center">
      <v-col>
        <v-card-title class="justify-center">
          {{ data.title }}
        </v-card-title>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col lg="2">
        <v-card-title class="justify-center">
          PLAY TIME
        </v-card-title>

        <v-card-title class="justify-center pt-0" style="font-size: 3em; line-height: 3rem;">
          {{ data.playTime }}
        </v-card-title>
      </v-col>

      <v-col lg="2">
        <v-card-title class="justify-center">
          NEXT BREAK
        </v-card-title>

        <v-card-title class="justify-center pt-0" style="font-size: 3em; line-height: 3rem;">
          {{ data.nextBreakTime }}
        </v-card-title>
      </v-col>
    </v-row>

    <v-row class="mt-0">
      <v-col>
        <v-card-title class="justify-center" style="font-size: 12em; line-height: 12rem;">
          {{ data.remainTime }}
        </v-card-title>
      </v-col>
    </v-row>

    <v-row justify="center" class="mb-6">
      <v-btn tile outlined class="ma-2">
        <v-icon>
          mdi-chevron-left
        </v-icon>
      </v-btn>
      <v-btn tile outlined class="ma-2">
        <v-icon v-if="playing">
          mdi-pause
        </v-icon>
        <v-icon v-else>
          mdi-play
        </v-icon>
      </v-btn>
      <v-btn tile outlined class="ma-2">
        <v-icon>
          mdi-chevron-right
        </v-icon>
      </v-btn>
    </v-row>

    <v-row justify="center">
      <v-col cols="9">
        <v-row justify="center">
          <v-col cols="9" class="pa-0">
            <v-card outlined tile>
              <v-row class="align-center">
                <v-col>
                  <v-card-title class="justify-center" style="font-size: 2em; line-height: 2rem;">
                    Level {{ data.level }}
                  </v-card-title>
                </v-col>
                <v-col>
                  <v-card-text class="text-center pb-0">
                    BLINDS
                  </v-card-text>
                  <v-card-title class="justify-center" style="font-size: 2em; line-height: 2rem;">
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
              <v-card-title class="justify-center pt-0" style="font-size: 2em; line-height: 2rem;">
                {{ data.chipsInPlay }}
              </v-card-title>
            </v-card>
          </v-col>

          <v-col cols="3" class="pa-0">
            <v-card outlined tile>
              <v-card-title class="justify-center">PLAYER</v-card-title>
              <v-card-title class="justify-center pt-0" style="font-size: 2em; line-height: 2rem;">
                {{ data.player }} / {{ data.totalPlayer }}
              </v-card-title>
            </v-card>
          </v-col>

          <v-col cols="3" class="pa-0">
            <v-card outlined tile>
              <v-card-title class="justify-center">AVERAGE STACK</v-card-title>
              <v-card-title class="justify-center pt-0" style="font-size: 2em; line-height: 2rem;">
                {{ data.averageStack }}
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { TournamentClockDto } from '~/dto/tournamentClockDto'

@Component
export default class TournamentClock extends Vue {
  @Prop({ type: Object as () => TournamentClockDto, required: true })
  data!: TournamentClockDto

  playing: boolean = false

  created() { }

  mounted() { }

  beforeDestroy() { }
}
</script>