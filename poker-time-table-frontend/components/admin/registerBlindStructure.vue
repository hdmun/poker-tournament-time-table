<template>
  <v-card class="gray7">
    <v-card-title>블라인드 템플릿 만들기</v-card-title>

    <v-card-text>
      <v-form ref="form" lazy-validation>
        <v-container>
          <v-row align="center">
            <v-col cols="8">
              <v-autocomplete
                v-model="selectTemplate"
                :items="templates"
                clearable
                dense
                filled
                hide-details
                item-text="name"
                return-object
                label="템플릿 리스트"
                @change="onChangeSelectTemplate()"
              />
            </v-col>

            <v-col cols="4">
              <v-btn
                text
                tile
                outlined
                class="pa-4"
                :disabled="selectTemplate === null"
                @click="onDeleteTemplate"
              >
                <v-icon left> mdi-delete </v-icon>
                DELETE
              </v-btn>
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
            <v-col cols="12" lg="4">
              <EditNumberField
                :value.sync="smallBlind"
                label="S.B"
                :rules="smallBlindRule"
              />
            </v-col>

            <v-col cols="12" lg="4">
              <EditNumberField
                :value.sync="bigBlind"
                label="B.B"
                :rules="bigBlindRule"
              />
            </v-col>

            <v-col cols="12" lg="4">
              <EditNumberField :value.sync="ante" label="ANTE" />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" lg="6">
              <EditNumberField
                :value.sync="bigBlindInc"
                label="블라인드 증가 값"
              />
            </v-col>
            <v-col cols="12" lg="6">
              <EditNumberField :value.sync="minute" label="Minute" />
            </v-col>
          </v-row>

          <v-card-title></v-card-title>

          <v-row justify="end">
            <v-btn
              text
              :disabled="disabledAddButton"
              class="mr-4"
              @click="onClickAddBreakTime"
            >
              브레이크 타임 추가
            </v-btn>

            <v-btn
              text
              :disabled="disabledAddButton"
              class="mr-4"
              @click="onClickPlus"
            >
              블라인드 추가
            </v-btn>

            <v-btn
              :disabled="disabledEditButton"
              color="accent"
              class="mr-4"
              @click="onClickEdit"
            >
              {{ selectTemplate ? `갱신` : `등록` }}
            </v-btn>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, PropSync, Vue } from 'nuxt-property-decorator'
import { PropType } from 'vue'

import EditNumberField from './editNumberField.vue'
import {
  BlindStructureDto,
  BlindStructureTemplateDto,
} from '~/dto/blindStructureDto'
import { vxm } from '~/store'

export interface EditBlindStructureDto {
  id?: number
  name: string
  structures: BlindStructureDto[]
}

@Component({
  components: {
    EditNumberField,
  },
})
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

  ante: number = 0
  smallBlind: number = 100
  bigBlind: number = 200
  bigBlindInc: number = 100
  minute: number = 10

  async onChangeSelectTemplate() {
    if (this.selectTemplate === null) {
      this.templateName = ''
      this.editStructures.splice(0)
      return
    }

    if (this.selectTemplate.id > 0) {
      await vxm.blindTemplate.getBlindTemplateById(this.selectTemplate.id)
    }

    this.templateName = this.selectTemplate.name
  }

  get blindCount() {
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
    if (this.blindCount < 10) return true
    if (!this.templateName) return true
    if (this.templateName.trim().length <= 0) return true
    return false
  }

  get maxLevel(): number {
    const maxLevel = Math.max(...this.editStructures.map((o) => o.level))
    return isFinite(maxLevel) && maxLevel > 0 ? maxLevel : 0
  }

  onClickAddBreakTime() {
    this.editStructures.push({
      id: this.blindCount,
      level: -1,
      ante: -1,
      smallBlind: -1,
      bigBlind: -1,
      minute: this.minute,
    })
  }

  onClickPlus() {
    if (this.disabledAddButton) {
      return
    }

    let smallBlind = this.smallBlind
    let bigBlind = this.bigBlind
    if (this.blindCount > 0) {
      bigBlind += this.bigBlindInc
      smallBlind = bigBlind / 2
    }

    this.editStructures.push({
      id: this.blindCount,
      level: this.maxLevel + 1,
      ante: this.ante,
      smallBlind,
      bigBlind,
      minute: this.minute,
    })

    this.smallBlind = smallBlind
    this.bigBlind = bigBlind
  }

  updateBlind() {
    let lastBlind: BlindStructureDto | undefined
    const maxLevel = this.maxLevel
    if (maxLevel > 0) {
      lastBlind = this.editStructures.find((value) => value.level === maxLevel)
    }

    this.ante = lastBlind?.ante ?? 0
    this.smallBlind = lastBlind?.smallBlind ?? 100
    this.bigBlind = lastBlind?.bigBlind ?? 200
  }

  @Emit('delete')
  onDeleteTemplate(): number {
    const templateId = this.selectTemplate?.id ?? 0
    this.templateName = ''
    this.selectTemplate = null
    return templateId
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
