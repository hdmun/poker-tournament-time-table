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
          <template v-if="isAddNewLine">
            {{ smallBlind }} / <br />{{ bigBlind }}
          </template>
          <template v-else> {{ smallBlind }} / {{ bigBlind }} </template>
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

  get isAddNewLine(): boolean {
    if (this.showBlindTable) {
      if (this.smallBlind < 10000) {
        return true
      }
    }

    if (this.smallBlind >= 100000) {
      return true
    }
    return false
  }

  @Emit('onToggleShowBlindTable')
  onToggleShowBlindTable() {
    return !this.showBlindTable
  }
}
</script>

<style scoped lang="scss">
@import '~/assets/variables.scss';

.blindlevel-value {
  @include title1-bold;
  @include primary-color;

  justify-content: center;
  height: 100%;
}

.breaktime-text {
  @include title1-bold;
  @include accent1-color;

  justify-content: center;
  height: 100%;
}

.ante-title {
  @include sub-copy-bold;
  @include gray3-color;

  justify-content: center;
}

.blindbtn-title {
  @include sub-copy-bold;
  @include primary-color;

  padding-top: 16px;
  justify-content: center;
}

$value-text-size: $title-1-size + 1rem;
.info-value {
  @include media('lg-and-up') {
    @include title1-bold;
    font-size: $value-text-size !important;
    line-height: $value-text-size;
  }

  @include media('md-and-down') {
    @include title2-bold;
  }

  @include gray1-color;
  justify-content: center;
}
</style>
