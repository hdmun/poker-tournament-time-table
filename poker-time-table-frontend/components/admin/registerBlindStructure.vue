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
            <v-col cols="12" lg="4">
              <EditNumberField
                :value="smallBlind"
                label="S.B"
                :rules="smallBlindRule"
              />
            </v-col>

            <v-col cols="12" lg="4">
              <EditNumberField
                :value="bigBlind"
                label="B.B"
                :rules="bigBlindRule"
              />
            </v-col>

            <v-col cols="12" lg="4">
              <EditNumberField :value="ante" label="ANTE" />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" lg="6">
              <EditNumberField :value="bigBlindInc" label="블라인드 증가 값" />
            </v-col>
            <v-col cols="12" lg="6">
              <EditNumberField :value="minute" label="Minute" />
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

import EditNumberField from './editNumberField.vue'
import {
  BlindStructureDto,
  BlindStructureTemplateDto,
} from '~/dto/blindStructureDto'

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
      ante: this.ante,
      smallBlind,
      bigBlind,
      minute: this.minute,
    })

    this.smallBlind = smallBlind
    this.bigBlind = bigBlind
  }

  updateBlind() {
    const blindCount = this.editStructures.length
    if (blindCount > 0) {
      const lastBlind = this.editStructures[blindCount - 1]
      this.ante = lastBlind.ante
      this.smallBlind = lastBlind.smallBlind
      this.bigBlind = lastBlind.bigBlind
    } else {
      this.ante = 0
      this.smallBlind = 100
      this.bigBlind = 200
    }
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
