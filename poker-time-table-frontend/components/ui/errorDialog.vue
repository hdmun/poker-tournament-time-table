<template>
  <v-dialog v-model="showDialog" persistent max-width="290">
    <v-card>
      <v-card-title class="text-h5 accent1"> {{ dialogTitle }} </v-card-title>

      <v-card-text class="mt-4"> {{ dialogMessage }} </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="accent-4" text @click="onClickConfirm()"> 확인 </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'

@Component({
  components: {},
})
export default class ErrorDialog extends Vue {
  @Prop({ type: Boolean, required: true })
  showDialog!: boolean

  @Prop({ type: String, default: '오류!!' })
  dialogTitle!: string

  @Prop({ type: String, required: true })
  dialogMessage!: string

  @Emit('confirm')
  onClickConfirm() {}
}
</script>
