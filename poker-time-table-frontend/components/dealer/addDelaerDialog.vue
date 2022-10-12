<template>
  <v-dialog v-model="showDialog" max-width="300px">
    <v-card>
      <v-card-title>
        <span class="text-h5">딜러 추가</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="dealerName"
                label="딜러 이름"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="showDialog = false">
          취소
        </v-btn>
        <v-btn
          color="blue darken-1"
          :disabled="dealerName.length <= 0 || dealerName.trim() === ''"
          text
          @click="onClickAddDelaer"
        >
          등록
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Emit, PropSync, Vue } from 'nuxt-property-decorator'

@Component({
  components: {},
})
export default class AddDealerdialog extends Vue {
  @PropSync('showDialog', { type: Boolean, required: true })
  showDialog!: boolean

  dealerName: string = ''

  @Emit('addDealer')
  onClickAddDelaer(_event: PointerEvent) {
    return this.dealerName
  }
}
</script>
