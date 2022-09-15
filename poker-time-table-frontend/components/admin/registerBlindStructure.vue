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
                clearable
                dense
                filled
                item-text="name"
                return-object
                label="템플릿 리스트"
                @change="onChangeSelectTemplate()"
              >
              </v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="templateName"
                label="템플릿 이름"
                required
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" lg="6">
              <v-text-field
                v-model.number="smallBlind"
                label="Small Blind"
                :rules="smallBlindRule"
                type="number"
                hide-spin-buttons
                required
              />
            </v-col>
            <v-col cols="12" lg="6">
              <v-text-field
                v-model.number="bigBlind"
                label="Big Blind"
                :rules="bigBlindRule"
                type="number"
                hide-spin-buttons
                required
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" lg="12">
              <v-subheader>블라인드 증가 값</v-subheader>
              <v-slider
                v-model="bigBlindInc"
                step="100"
                min="100"
                max="10000000"
                class="align-center"
                track-color="grey"
                thumb-label
                hide-details
              >
                <template #append>
                  <v-text-field
                    v-model="bigBlindInc"
                    step="100"
                    min="100"
                    max="10000000"
                    class="mt-0 pt-0"
                    hide-details
                    single-line
                    type="number"
                    style="width: 150px"
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
                min="10"
                max="300"
                class="align-center"
                track-color="grey"
                thumb-label
                hide-details
              >
                <template #append>
                  <v-text-field
                    v-model="minute"
                    step="1"
                    min="10"
                    max="300"
                    class="mt-0 pt-0"
                    hide-details
                    single-line
                    type="number"
                    style="width: 150px"
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
                :disabled="disabledAddButton"
                class="mr-4"
                @click="onClickPlus"
              >
                <v-icon> mdi-plus-box </v-icon>
              </v-btn>

              <v-btn
                rounded
                :disabled="disabledEditButton"
                color="primary"
                class="mr-4"
                @click="onClickEdit"
              >
                {{ selectTemplate ? `갱신` : `등록` }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, PropSync, Vue } from 'nuxt-property-decorator'
import { PropType } from 'vue'

import {
  BlindStructureDto,
  BlindStructureTemplateDto,
} from '~/dto/blindStructureDto'

export interface EditBlindStructureDto {
  id?: number
  name: string
  structures: BlindStructureDto[]
}

@Component
export default class AdminRegisterBlindStructure extends Vue {
  @PropSync('name', { type: String })
  templateName!: string

  @PropSync('editstructure', {
    type: Array as PropType<Array<BlindStructureDto>>,
  })
  editStructures!: BlindStructureDto[]

  @Prop({ type: Array as PropType<Array<BlindStructureTemplateDto>> })
  templates!: BlindStructureTemplateDto[]

  selectTemplate: BlindStructureTemplateDto | null = null

  smallBlind: number = 0
  bigBlind: number = 0
  bigBlindInc: number = 100
  minute: number = 10

  async onChangeSelectTemplate() {
    if (this.selectTemplate === null) {
      this.templateName = ''
      this.editStructures = []
      return
    }

    if (this.selectTemplate.id > 0) {
      const res = await this.$axios.get<BlindStructureDto[]>(
        `/api/blind-structures/templates/${this.selectTemplate.id}`
      )

      this.editStructures = res.data
    }

    this.templateName = this.selectTemplate.name
  }

  get level() {
    return this.editStructures?.length ?? 0
  }

  get smallBlindRule() {
    return [this.bigBlind >= this.smallBlind || '스몰 블라인드 값이 더 큽니다.']
  }

  get bigBlindRule() {
    return [this.bigBlind % 2 === 0 || '빅 블라인드는 짝수여야 합니다.']
  }

  get disabledAddButton() {
    return (
      this.bigBlind <= 0 ||
      this.smallBlind <= 0 ||
      this.minute <= 0 ||
      this.bigBlindInc <= 0
    )
  }

  get disabledEditButton() {
    if (this.level < 10) return true
    return !(this.templateName?.length > 0)
  }

  onClickMinus() {
    if (this.level > 0) {
      this.editStructures.pop()
    }
  }

  onClickPlus() {
    if (this.disabledAddButton) {
      return
    }

    let smallBlind = this.smallBlind
    let bigBlind = this.bigBlind
    if (this.editStructures.length > 0) {
      bigBlind += this.bigBlindInc
      smallBlind = bigBlind / 2
    }

    this.editStructures.push({
      level: this.editStructures.length + 1,
      smallBlind,
      bigBlind,
      minute: this.minute,
    })

    this.smallBlind = smallBlind
    this.bigBlind = bigBlind
  }

  @Emit('register')
  onClickEdit() {
    return {
      id: this.selectTemplate?.id,
      name: this.templateName,
      structures: this.editStructures,
    } as EditBlindStructureDto
  }
}
</script>
