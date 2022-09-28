<template>
  <v-row justify="center">
    <v-col cols="3" class="pa-0">
      <v-card class="fill-height" color="gray7" outlined tile>
        <v-card-title v-if="level > 0" class="blindlevel-value">
          Lv. {{ level }}
        </v-card-title>
        <v-card-title v-else class="breaktime-text"> Break Time </v-card-title>
      </v-card>
    </v-col>

    <v-col cols="3" class="pa-0">
      <v-card class="fill-height" color="gray7" outlined tile>
        <v-card-title class="pt-4 pb-2 ante-title"> Ante </v-card-title>
        <v-card-title class="info-value"> {{ ante }} </v-card-title>
      </v-card>
    </v-col>

    <v-col cols="3" class="pa-0">
      <v-card class="fill-height" color="gray7" outlined tile>
        <v-card-actions class="pb-0 justify-center">
          <v-btn
            text
            class="blindbtn-title"
            @click.stop="onToggleShowBlindTable"
          >
            <u>BLINDS</u> >
          </v-btn>
        </v-card-actions>

        <v-card-title class="info-value">
          {{ smallBlind }} / {{ bigBlind }}
        </v-card-title>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class BlindCards extends Vue {
  @Prop({ type: Boolean, required: true })
  showBlindTable!: boolean

  @Prop({ type: Number, required: true })
  level!: Number

  @Prop({ type: Number, required: true })
  ante!: Number

  @Prop({ type: Number, required: true })
  smallBlind!: Number

  @Prop({ type: Number, required: true })
  bigBlind!: Number

  @Emit('onToggleShowBlindTable')
  onToggleShowBlindTable() {
    return !this.showBlindTable
  }
}
</script>

<style scoped lang="scss">
@import '~/assets/variables.scss';

.blindlevel-value {
  @extend .title-1-bold;
  @extend .primary-color;

  justify-content: center;
  height: 100%;
}

.breaktime-text {
  @extend .title-1-bold;
  @extend .accent1-color;

  justify-content: center;
  height: 100%;
}

.ante-title {
  @extend .sub-copy-exbold;
  @extend .gray3-color;

  justify-content: center;
}

.blindbtn-title {
  @extend .sub-copy-exbold;
  @extend .primary-color;

  padding-top: 16px;
  justify-content: center;
}

$value-text-size: $title-1-size + 1rem;
.info-value {
  @extend .title-1-bold;
  @extend .gray1-color;

  font-size: $value-text-size !important;
  line-height: $value-text-size;
  justify-content: center;
}
</style>
