<template>
  <v-text-field
    v-model.number="model"
    :label="label"
    type="number"
    :min="0"
    :rules="rules"
    hide-spin-buttons
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
  @Prop({ type: String, required: true })
  label!: string

  @PropSync('value', { type: Number, required: true })
  model!: number

  @Prop({
    type: Array as PropType<Array<(String | Boolean)[]>>,
  })
  rules!: (true | String)[]

  onInput(value: string) {
    if (value === '') {
      this.model = 0
    }
  }
}
</script>
