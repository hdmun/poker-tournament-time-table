<template>
  <v-card class="pa-0 fill-height" :color="backColor" outlined tile>
    <v-card-title :class="`cell-text ${textColor}--text`">
      <template v-if="value !== null">
        {{ value | toComma }}
      </template>
      {{ valuePrefix }}
    </v-card-title>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class BlindsStructureTableCell extends Vue {
  @Prop([Number, String])
  value!: number | string

  @Prop({ type: String, default: '' })
  valuePrefix!: String

  @Prop({ type: String, default: 'primary' })
  textColor!: string

  @Prop({ type: String, default: 'gray5' })
  backColor!: string
}
</script>

<style lang="scss" scoped>
@import '~/assets/variables.scss';

.cell-text {
  @include media('lg-and-up') {
    @include title2-bold;
    padding: 8px !important;

    @include galaxy-tab-a8-landscape() {
      @include sub-copy-bold;
    }
  }

  @include media('md-only') {
    @include title2-bold;
    padding: 16px !important;
  }

  @include media('sm-and-down') {
    @include sub-copy-bold;

    @include galaxy-tab-a8-landscape() {
      font-size: 1.5rem !important;
      line-height: 1.5rem;
    }
    padding: 16px !important;
  }

  height: 100%;
  justify-content: center !important;
}
</style>
