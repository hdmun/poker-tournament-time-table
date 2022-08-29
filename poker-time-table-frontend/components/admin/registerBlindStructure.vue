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
import { Component, Emit, Prop, PropSync, Vue } from 'nuxt-property-decorator'
import { PropType } from 'vue'

import {
  BlindStructureDto,
  BlindStructureTemplateDto,
  RegisterBlindStructureDto,
} from '~/dto/blindStructureDto'

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

  smallBlind: number = 5
  bigBlind: number = 10
  bigBlindInc: number = 10
  minute: number = 3

  async onChangeSelectTemplate() {
    if (this.selectTemplate === null) {
      this.templateName = ''
      this.editStructures = []
      return
    }

    if (this.selectTemplate.id > 0) {
      const res = await this.$axios.get<BlindStructureDto[]>(
        `/api/tournaments/blind-structure-templates/${this.selectTemplate.id}`
      )

      this.editStructures = res.data
    }

    this.templateName = this.selectTemplate.name
  }

  get level() {
    return this.editStructures?.length ?? 0
  }

  get bigBlindRule() {
    return [this.bigBlind % 2 === 0 || 'Invalid Big Blind']
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
    if (this.bigBlindInc < 0) {
      return
    }
    if (this.minute < 3) {
      return
    }

    this.bigBlind += this.bigBlindInc
    this.smallBlind = this.bigBlind / 2

    this.editStructures.push({
      level: this.editStructures.length + 1,
      smallBlind: this.smallBlind,
      bigBlind: this.bigBlind,
      minute: this.minute,
    })
  }

  @Emit('register')
  onClickEdit() {
    return {
      name: this.templateName,
      structures: this.editStructures,
    } as RegisterBlindStructureDto
  }
}
</script>
