<template>
  <v-card class="pa-0 fill-height" :color="backColor" outlined tile>
    <v-card-title :class="`cell-text ${textColor}--text`">
      <template v-if="value !== null">{{ value }}</template
      >{{ valuePrefix }}
    </v-card-title>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class BlindsStructureTableCell extends Vue {
  @Prop({ type: Number })
  value!: number

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
  @extend .sub-copy;

  height: 100%;
  padding: 16px !important;
  justify-content: center !important;
}
</style>
