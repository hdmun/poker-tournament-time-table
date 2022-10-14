<template>
  <v-row class="ma-2" justify="center">
    <v-col sm="6" md="9" :lg="lgCol" xl="3" class="pa-0">
      <v-card class="fill-height" color="gray7" outlined tile>
        <v-card-title v-if="level > 0" class="blindlevel-value">
          Lv. {{ level }}
        </v-card-title>
        <v-card-title v-else class="breaktime-text"> Break Time </v-card-title>
      </v-card>
    </v-col>

    <v-col sm="12" md="9" :lg="lgCol" xl="3" class="pa-0">
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

    <v-col sm="6" md="9" :lg="lgCol" xl="3" class="pa-0">
      <v-card class="fill-height" color="gray7" outlined tile>
        <v-card-title class="pt-4 pb-2 ante-title"> Ante </v-card-title>
        <v-card-title class="info-value"> {{ ante }} </v-card-title>
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

  get isGalaxyTabA8(): boolean {
    const width = this.$vuetify.breakpoint.width
    const height = this.$vuetify.breakpoint.height
    if (width > height) {
      return width === 1291
    }
    return width === 723
  }

  get lgCol(): number {
    if (this.isGalaxyTabA8) {
      return 4
    }
    return 3
  }

  get isAddNewLine(): boolean {
    switch (this.$vuetify.breakpoint.name) {
      case 'xs':
      case 'sm':
      case 'md':
        return false
      // return this.isAddNewLineTablet
      default:
        return this.isAddNewLineLarge
    }
  }

  get isAddNewLineTablet(): boolean {
    return this.smallBlind >= 100000
  }

  get isAddNewLineLarge(): boolean {
    if (this.isGalaxyTabA8) {
      return this.bigBlind >= 1000
    }

    if (this.showBlindTable) {
      if (this.smallBlind < 10000) {
        return true
      }
    }
    return this.smallBlind >= 100000
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

  @include media('md-and-up') {
    @include galaxy-tab-a8-landscape() {
      @include title2-bold;
    }
  }

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
  @include media('md-and-up') {
    @include title1-bold;
    font-size: $value-text-size !important;
    line-height: $value-text-size;

    @include galaxy-tab-a8-landscape() {
      @include title1-bold;
    }
  }

  @include media('sm-and-down') {
    @include title2-bold;

    @include galaxy-tab-a8-portrait() {
      @include title1-bold;
    }
  }

  @include gray1-color;
  justify-content: center;
}
</style>
