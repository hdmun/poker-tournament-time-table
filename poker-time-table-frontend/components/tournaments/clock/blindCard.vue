<template>
  <v-row class="ma-2" justify="center">
    <v-col sm="12" md="9" lg="3" xl="3" class="pa-0">
      <v-card class="fill-height" color="gray7" outlined tile>
        <v-card-title v-if="level > 0" class="blindlevel-value">
          Lv. {{ level }}
        </v-card-title>
        <v-card-title v-else class="pr-0 breaktime-text">
          Break Time
        </v-card-title>
      </v-card>
    </v-col>

    <v-col sm="12" md="9" lg="9" xl="9" class="pa-0">
      <v-card class="fill-height" color="gray7" outlined tile>
        <v-row class="ma-0">
          <v-spacer />

          <v-col class="pa-0">
            <v-card-title class="pt-3 pb-2 ante-title">
              S.B / B.B (Ante)
            </v-card-title>
          </v-col>

          <v-col class="pa-0">
            <v-card-actions class="pa-0 pt-1 justify-center">
              <v-btn
                text
                class="blindbtn-title"
                @click.stop="onToggleShowBlindTable"
              >
                <u>BLINDS</u> >
              </v-btn>
            </v-card-actions>
          </v-col>
        </v-row>

        <template v-if="isTwoLineBlind">
          <v-card-title class="info-value pb-0">
            {{ smallBlind | toComma }} / {{ bigBlind | toComma }}
          </v-card-title>
          <v-card-title class="info-value pt-0">
            ({{ ante | toComma }})
          </v-card-title>
        </template>
        <template v-else>
          <v-card-title class="info-value">
            {{ smallBlind | toComma }} / {{ bigBlind | toComma }} ({{
              ante | toComma
            }})
          </v-card-title>
        </template>
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

  get isPortrait(): boolean {
    return this.$vuetify.breakpoint.width < this.$vuetify.breakpoint.height
  }

  get isLandscape(): boolean {
    return !this.isPortrait
  }

  get isGalaxyTabA8(): boolean {
    const width = this.$vuetify.breakpoint.width
    const height = this.$vuetify.breakpoint.height
    if (width > height) {
      return width === 1291
    }
    return width === 723
  }

  get isTwoLineBlind(): boolean {
    if (this.isPortrait && this.isGalaxyTabA8) {
      return true
    }

    if (this.isAddNewLine) {
      return true
    }

    return false
  }

  get isAddNewLine(): boolean {
    switch (this.$vuetify.breakpoint.name) {
      case 'xs': // < 600px
      case 'sm': // 600px > < 960px
      case 'md': // 960px > < 1264px
        return true
      case 'lg': // 1264px > < 1904px
      case 'xl': // > 1904px
      default:
        return this.isAddNewLineLarge
    }
  }

  get isAddNewLineTablet(): boolean {
    return this.smallBlind >= 100000
  }

  get isAddNewLineLarge(): boolean {
    if (this.isGalaxyTabA8) {
      if (this.showBlindTable) {
        if (this.ante >= 100000) {
          return true
        }
      }
      return false
    }

    if (this.ante <= 0) {
      return false
    }

    if (this.showBlindTable) {
      if (this.smallBlind >= 10000) {
        return false
      }
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

$value-text-size: $title-1-size + 0.5rem;
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
