<template>
  <v-card class="pa-0 fill-height" :color="backColor" outlined tile>
    <v-card-title class="pa-0 fill-height">
      <v-text-field
        v-model.number="value"
        class="cell-text"
        single-line
        type="number"
        :min="0"
        hide-spin-buttons
        hide-details
        reverse
        @input="onInput($event)"
        @focus="$event.target.select()"
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

  onInput(value: string) {
    if (value === '') {
      this.value = 0
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/variables.scss';

.cell-text {
  @include title2-bold;

  padding: 8px !important;
  justify-content: center !important;

  @include galaxy-tab-a8-landscape() {
    @include sub-copy-bold;
    padding: 8px !important;
  }
}
</style>
