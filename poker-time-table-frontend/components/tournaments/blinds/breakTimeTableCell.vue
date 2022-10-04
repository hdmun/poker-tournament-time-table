<template>
  <v-card class="pa-0 fill-height" :color="backColor" outlined tile>
    <v-card-title :class="`cell-text`"> BREAK TIME </v-card-title>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class BreakTimeTableCell extends Vue {
  @Prop({ type: String, default: 'gray5' })
  backColor!: string
}
</script>

<style lang="scss" scoped>
@import '~/assets/variables.scss';

.cell-text {
  @include media('lg-and-up') {
    @include title2-bold;
    padding: 16px !important;
  }

  @include media('md-only') {
    @include title2-bold;
    padding: 16px !important;
  }

  @include media('sm-and-down') {
    @include sub-copy-bold;
    padding: 8px !important;
  }

  @include accent1-color;
  height: 100%;
  justify-content: center !important;
}
</style>
