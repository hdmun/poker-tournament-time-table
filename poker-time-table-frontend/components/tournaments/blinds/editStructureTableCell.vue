<template>
  <v-card class="pa-0 fill-height" :color="backColor" outlined tile>
    <v-card-title class="pa-0 fill-height">
      <v-text-field
        v-model="value"
        class="cell-text"
        single-line
        type="number"
        hide-spin-buttons
        hide-details
        reverse
      />
    </v-card-title>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'nuxt-property-decorator'

@Component
export default class EditBlindsStructureTableCell extends Vue {
  @PropSync('editValue', { type: Number, required: true })
  value!: number

  @Prop({ type: String, default: 'gray5' })
  backColor!: string
}
</script>

<style lang="scss" scoped>
@import '~/assets/variables.scss';

.cell-text {
  @extend .title-2-exbold;

  padding: 16px !important;
  justify-content: center !important;
}
</style>
