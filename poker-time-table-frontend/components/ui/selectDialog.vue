<template>
  <v-dialog v-model="showDialog" persistent max-width="290">
    <v-card>
      <v-card-title class="text-h5"> {{ dialogTitle }} </v-card-title>
      <v-card-text> {{ dialogMessage }} </v-card-text>

      <v-card-text>
        <v-radio-group v-model="select" mandatory>
          <v-radio
            v-for="item in selectItems"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          ></v-radio>
        </v-radio-group>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="onClickCancel()"> 취소 </v-btn>
        <v-btn color="accent" @click="onClickConfirm()">
          {{ dialogConfirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Emit, Prop, PropSync, Vue } from 'nuxt-property-decorator'
import { PropType } from 'vue'

export interface SelectDialogItem {
  id: number
  label: string
}

@Component
export default class SelectDialog extends Vue {
  @PropSync('showSelectDialog', { type: Boolean, required: true })
  showDialog!: boolean

  @Prop({ type: String, required: true })
  dialogTitle!: string

  @Prop({ type: String, required: true })
  dialogMessage!: string

  @Prop({ type: String, default: '확인' })
  dialogConfirmText!: string

  @Prop({ type: Array as PropType<Array<SelectDialogItem>>, default: '확인' })
  selectItems!: SelectDialogItem[]

  select: number | null = null

  @Emit('select')
  onClickConfirm(): number | null {
    const select = this.select
    this.select = null
    return select
  }

  @Emit('cancel')
  onClickCancel() {
    this.showDialog = false
  }
}
</script>
