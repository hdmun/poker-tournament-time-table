<template>
  <v-text-field
    v-model.number="model"
    :label="label"
    type="number"
    :rules="rules"
    hide-spin-buttons
    required
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
}
</script>
