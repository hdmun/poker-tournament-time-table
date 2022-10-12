<template>
  <v-dialog v-model="showDialog" persistent max-width="290">
    <v-card>
      <v-card-title class="text-h5"> {{ dialogTitle }} </v-card-title>
      <v-card-text> {{ dialogMessage }} </v-card-text>
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
import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'

@Component({
  components: {},
})
export default class ConfirmDialog extends Vue {
  @Prop({ type: Boolean, required: true })
  showDialog!: boolean

  @Prop({ type: String, required: true })
  dialogTitle!: string

  @Prop({ type: String, required: true })
  dialogMessage!: string

  @Prop({ type: String, required: true })
  dialogConfirmText!: string

  @Emit('confirm')
  onClickConfirm() {}

  @Emit('cancel')
  onClickCancel() {}
}
</script>
