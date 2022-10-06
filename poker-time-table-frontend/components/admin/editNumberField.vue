<template>
  <v-text-field
    v-model.number="model"
    type="number"
    class="centered-input"
    :label="label"
    :solo="solo"
    :single-line="solo"
    :min="0"
    :rules="rules"
    :background-color="backgroundColor"
    hide-spin-buttons
    hide-details
    required
    @input="onInput($event)"
    @focus="$event.target.select()"
  />
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'nuxt-property-decorator'
import { PropType } from 'vue'

@Component
export default class EditNumberField extends Vue {
  @Prop({ type: String })
  label!: string

  @PropSync('value', { type: Number, required: true })
  model!: number

  @Prop({
    type: Array as PropType<Array<(String | Boolean)[]>>,
  })
  rules!: (true | String)[]

  @Prop({ type: Boolean, default: false })
  solo!: boolean

  @Prop({ type: String })
  backgroundColor!: string

  onInput(value: string) {
    if (value === '') {
      this.model = 0
    }
  }
}
</script>

<style scoped>
.centered-input >>> input {
  text-align: center;
}
</style>
