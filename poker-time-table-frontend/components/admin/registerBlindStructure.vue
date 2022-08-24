<template>
  <v-card>
    <v-card-title>블라인드 템플릿 만들기</v-card-title>

    <v-card-text>
      <v-form ref="form" lazy-validation>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="selectTemplate"
                :items="templates"
                dense
                filled
                label="불러오기"
              >
              </v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="templateName"
                label="템플릿 이름"
                clearable
                required
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" lg="6">
              <v-text-field v-model="smallBlind" label="Small Blind" required />
            </v-col>
            <v-col cols="12" lg="6">
              <v-text-field
                v-model="bigBlind"
                :rules="bigBlindRule"
                label="Big Blind"
                required
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" lg="12">
              <v-subheader>B.B UP</v-subheader>
              <v-slider
                v-model="bigBlindInc"
                step="10"
                min="10"
                max="1000"
                class="align-center"
                track-color="grey"
                thumb-label
                hide-details
              >
                <template #append>
                  <v-text-field
                    v-model="bigBlindInc"
                    step="10"
                    min="10"
                    max="1000"
                    class="mt-0 pt-0"
                    hide-details
                    single-line
                    type="number"
                    style="width: 60px"
                  ></v-text-field>
                </template>
              </v-slider>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" lg="12">
              <v-subheader>Minute</v-subheader>
              <v-slider
                v-model="minute"
                step="1"
                min="3"
                max="30"
                class="align-center"
                track-color="grey"
                thumb-label
                hide-details
              >
                <template #append>
                  <v-text-field
                    v-model="minute"
                    step="1"
                    min="3"
                    max="30"
                    class="mt-0 pt-0"
                    hide-details
                    single-line
                    type="number"
                    style="width: 60px"
                  ></v-text-field>
                </template>
              </v-slider>
            </v-col>
          </v-row>

          <v-card-title></v-card-title>

          <v-row>
            <v-col cols="12" lg="12">
              <v-btn
                text
                :disabled="level <= 0"
                class="mr-4"
                @click="onClickMinus"
              >
                <v-icon> mdi-minus-box </v-icon>
              </v-btn>

              <v-btn
                text
                :disabled="bigBlindInc < 10"
                class="mr-4"
                @click="onClickPlus"
              >
                <v-icon> mdi-plus-box </v-icon>
              </v-btn>

              <v-btn
                rounded
                :disabled="disabledEditButton"
                color="success"
                class="mr-4"
                @click="onClickEdit"
              >
                <v-icon> mdi-pencil </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from 'nuxt-property-decorator'
import { PropType } from 'vue'

import { BlindStructureDto } from '~/dto/blindStructureDto'

@Component
export default class AdminRegisterBlindStructure extends Vue {
  // 백앤드 연동할 때 데이터 @PropSync 로 뺄 수 있는 애들은 다 빼버리자
  templateName: string = ''

  smallBlind: number = 5
  bigBlind: number = 10
  bigBlindInc: number = 10
  minute: number = 3

  @PropSync('editstructure', {
    type: Array as PropType<Array<BlindStructureDto>>,
  })
  editStructures!: BlindStructureDto[]

  templates: string[] = []
  selectTemplate: string = ''

  get level() {
    return this.editStructures.length
  }

  get bigBlindRule() {
    return [this.bigBlind % 2 === 0 || 'Invalid Big Blind']
  }

  get disabledEditButton() {
    return this.level < 10 || this.templateName !== ''
  }

  onClickMinus() {
    if (this.level > 0) {
      this.editStructures.pop()
    }
  }

  onClickPlus() {
    if (this.bigBlindInc < 0) {
      return
    }
    if (this.minute < 3) {
      return
    }

    this.bigBlind += this.bigBlindInc
    this.smallBlind = this.bigBlind / 2

    this.editStructures.push({
      sn: this.editStructures.length + 1,
      level: this.editStructures.length + 1,
      smallBlind: this.smallBlind,
      bigBlind: this.bigBlind,
      minute: this.minute,
    })
  }

  onClickEdit() {
    if (this.level > 0) {
      // todo
    }
  }
}
</script>
