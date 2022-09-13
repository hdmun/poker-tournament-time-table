<template>
  <v-card height="100%" outlined tile>
    <v-row align="center" justify="center">
      <v-col> </v-col>
      <v-col cols="6">
        <v-card-title class="justify-center"> BLINDS </v-card-title>
      </v-col>
      <v-col>
        <v-btn @click="onBlindEdit(!editMode)">
          <template v-if="editMode">
            <v-icon left color="success"> mdi-check </v-icon>
            DONE
          </template>
          <template v-else>
            <v-icon left> mdi-pencil </v-icon>
            Edit
          </template>
        </v-btn>
      </v-col>
      <v-col v-if="editMode" cols="2">
        <v-icon left @click="onBlindEditClose()"> mdi-close </v-icon>
      </v-col>
    </v-row>

    <v-row justify="center" class="ma-0">
      <v-col class="pa-0" :cols="editMode ? 2 : 3">
        <v-card class="pa-0" color="accent" outlined tile>
          <v-card-title class="justify-center"> Lv. </v-card-title>
        </v-card>
      </v-col>

      <v-col class="pa-0" :cols="editMode ? 2 : 3">
        <v-card class="pa-0" color="accent" outlined tile>
          <v-card-title class="justify-center"> S.B </v-card-title>
        </v-card>
      </v-col>

      <v-col class="pa-0" :cols="editMode ? 2 : 3">
        <v-card class="pa-0" color="accent" outlined tile>
          <v-card-title class="justify-center"> B.B </v-card-title>
        </v-card>
      </v-col>

      <v-col class="pa-0" :cols="editMode ? 2 : 3">
        <v-card class="pa-0" color="accent" outlined tile>
          <v-card-title class="justify-center"> 시간 </v-card-title>
        </v-card>
      </v-col>

      <v-col v-if="editMode" class="pa-0" :cols="editMode ? 4 : 0">
        <v-card class="pa-0" color="accent" outlined tile>
          <v-card-title class="justify-center"> 편집 </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-row
      v-for="(blind, index) in blindStructures"
      :key="index"
      justify="center"
      class="ma-0"
    >
      <template v-if="blind.level > 0">
        <v-col class="pa-0" :cols="editMode ? 2 : 3">
          <v-card class="pa-0" :color="currentColorText(index)" outlined tile>
            <v-card-title class="justify-center">
              {{ blind.level }}
            </v-card-title>
          </v-card>
        </v-col>

        <v-col class="pa-0" :cols="editMode ? 2 : 3">
          <v-card class="pa-0" :color="currentColorText(index)" outlined tile>
            <template v-if="editMode">
              <v-card-title class="pa-0 justify-center">
                <v-text-field
                  v-model="blind.smallBlind"
                  class="ma-0"
                  :full-width="false"
                  single-line
                  type="number"
                  hide-spin-buttons
                  reverse
                  style="font-size: 1em"
                />
              </v-card-title>
            </template>
            <template v-else>
              <v-card-title class="justify-center">
                {{ blind.smallBlind }}
              </v-card-title>
            </template>
          </v-card>
        </v-col>

        <v-col class="pa-0" :cols="editMode ? 2 : 3">
          <v-card class="pa-0" :color="currentColorText(index)" outlined tile>
            <template v-if="editMode">
              <v-card-title class="pa-0 justify-center">
                <v-text-field
                  v-model="blind.bigBlind"
                  class="ma-0"
                  single-line
                  type="number"
                  hide-spin-buttons
                  reverse
                  style="font-size: 1em"
                />
              </v-card-title>
            </template>
            <template v-else>
              <v-card-title class="justify-center">
                {{ blind.bigBlind }}
              </v-card-title>
            </template>
          </v-card>
        </v-col>
      </template>

      <template v-else>
        <v-col class="pa-0" :cols="editMode ? 6 : 9">
          <v-card class="pa-0" :color="currentColorText(index)" outlined tile>
            <v-card-title class="justify-center"> BREAK TIME </v-card-title>
          </v-card>
        </v-col>
      </template>

      <v-col class="pa-0" :cols="editMode ? 2 : 3">
        <v-card class="pa-0" :color="currentColorText(index)" outlined tile>
          <template v-if="editMode">
            <v-card-title class="pa-0 justify-center">
              <v-text-field
                v-model="blind.minute"
                class="ma-0"
                single-line
                type="number"
                hide-spin-buttons
                reverse
                style="font-size: 1em"
              />
            </v-card-title>
          </template>

          <template v-else>
            <v-card-title class="justify-center">
              {{ blind.minute }}분
            </v-card-title>
          </template>
        </v-card>
      </v-col>

      <v-col v-if="editMode" class="pa-0" :cols="editMode ? 4 : 0">
        <v-card class="pa-0 justify-center" outlined tile>
          <v-card-title class="pa-5 justify-center">
            <v-icon :disabled="index < 1" @click.stop="onClickUp(blind)">
              mdi-arrow-up
            </v-icon>
            <v-icon
              :disabled="blindStructures.length <= index + 1"
              @click.stop="onClickDown(blind)"
            >
              mdi-arrow-down
            </v-icon>
            <v-icon @click.stop="onClickDelete(blind)"> mdi-delete </v-icon>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <!-- ADD BLIND -->
    <v-row v-if="editMode" align="center" justify="center" class="ma-0">
      <v-col class="pa-0" :cols="editMode ? 2 : 3">
        <v-card class="pa-0" outlined tile>
          <v-card-title class="justify-center">
            {{ isAddBreak ? 'Break' : lastBlind?.level + 1 }}
          </v-card-title>
        </v-card>
      </v-col>

      <v-col class="pa-0" :cols="editMode ? 2 : 3">
        <v-card class="pa-0" outlined tile>
          <v-card-title class="pa-0 justify-center">
            <v-text-field
              v-model="addBlind.smallBlind"
              class="ma-0"
              :full-width="false"
              single-line
              type="number"
              hide-spin-buttons
              reverse
              style="font-size: 1em"
            />
          </v-card-title>
        </v-card>
      </v-col>

      <v-col class="pa-0" :cols="editMode ? 2 : 3">
        <v-card class="pa-0" outlined tile>
          <v-card-title class="pa-0 justify-center">
            <v-text-field
              v-model="addBlind.bigBlind"
              class="ma-0"
              single-line
              type="number"
              hide-spin-buttons
              reverse
              style="font-size: 1em"
            />
          </v-card-title>
        </v-card>
      </v-col>

      <v-col class="pa-0" :cols="editMode ? 2 : 3">
        <v-card class="pa-0" outlined tile>
          <v-card-title class="pa-0 justify-center">
            <v-text-field
              v-model="addBlind.minute"
              class="ma-0"
              single-line
              type="number"
              hide-spin-buttons
              reverse
              style="font-size: 1em"
            />
          </v-card-title>
        </v-card>
      </v-col>

      <v-col v-if="editMode" class="pa-0" :cols="editMode ? 4 : 0">
        <v-card class="pa-0 justify-center" outlined tile>
          <v-card-title class="pa-5 justify-center">
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on" @click.stop="onClickBreak()">
                  mdi-coffee-outline
                </v-icon>
              </template>
              <span>Break Time으로 세팅합니다.</span>
            </v-tooltip>

            <v-icon
              :disabled="addBlind.smallBlind === 0 || addBlind.bigBlind === 0"
              @click.stop="onClickAdd()"
            >
              mdi-plus
            </v-icon>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, PropSync, Vue } from 'nuxt-property-decorator'
import { PropType } from 'vue'
import { BlindStructureDto } from '~/dto/blindStructureDto'

export interface BlindStructureModel {
  level: number
  smallBlind: number
  bigBlind: number
  minute: number
}

export interface BlindEditDto {
  edit: boolean
  request: boolean
}

@Component
export default class TournamentBlinds extends Vue {
  // headers: string[] = ['Lv.', 'S.B', 'B.B', '시간']

  @PropSync('structure', { type: Array as PropType<Array<BlindStructureDto>> })
  blindStructures!: BlindStructureModel[] // fixed length is 11

  blindStructuresBackup: BlindStructureModel[] = []
  lastBlind?: BlindStructureModel

  @Prop({ type: Number, required: true })
  currentStep!: number

  @Prop({ type: Boolean, required: true })
  editMode!: boolean

  addBlind: BlindStructureModel = {
    level: -1,
    smallBlind: 0,
    bigBlind: 0,
    minute: 0,
  }

  mounted() {
    this.updateMaxBlindLevel()
  }

  currentColorText(index: number) {
    return this.currentStep === index && !this.editMode ? 'primary' : ''
  }

  @Emit('onBlindEdit')
  onBlindEdit(edit: boolean): BlindEditDto {
    let request = false
    if (edit) {
      this.blindStructuresBackup = Object.assign([], this.blindStructures)
    } else {
      request = !(
        this.blindStructures.length === this.blindStructuresBackup.length &&
        this.blindStructures.every((element, index) => {
          return element === this.blindStructuresBackup[index]
        })
      )

      this.blindStructuresBackup = []
    }

    return { edit, request }
  }

  @Emit('onBlindEditClose')
  onBlindEditClose() {
    const swap = Object.assign([], this.blindStructures)
    this.blindStructures = this.blindStructuresBackup
    this.blindStructuresBackup = swap
  }

  onClickUp(blind: BlindStructureModel) {
    const index = this.blindStructures.indexOf(blind, 0)
    const upIndex = index - 1
    if (upIndex > -1) {
      const swap = this.blindStructures[upIndex]
      this.blindStructures[upIndex] = blind
      this.blindStructures[index] = swap

      this.updateBlindLevel()
    }
  }

  onClickDown(blind: BlindStructureModel) {
    const index = this.blindStructures.indexOf(blind, 0)
    const downIndex = index + 1
    if (downIndex < this.blindStructures.length) {
      const swap = this.blindStructures[downIndex]
      this.blindStructures[downIndex] = blind
      this.blindStructures[index] = swap

      this.updateBlindLevel()
    }
  }

  onClickDelete(blind: BlindStructureModel) {
    const index = this.blindStructures.indexOf(blind, 0)
    if (index > -1) {
      this.blindStructures.splice(index, 1)
      this.updateBlindLevel()
    }
  }

  onClickAdd() {
    if (this.isAddBreak) {
      // break time
      this.blindStructures.push({
        level: -1,
        smallBlind: -1,
        bigBlind: -1,
        minute: this.addBlind.minute,
      })
    } else {
      if (!this.lastBlind) {
        return
      }

      this.blindStructures.push({
        level: this.lastBlind.level + 1,
        smallBlind: this.addBlind.smallBlind,
        bigBlind: this.addBlind.bigBlind,
        minute: this.addBlind.minute,
      })
    }

    this.updateMaxBlindLevel()
  }

  onClickBreak() {
    this.addBlind.smallBlind = -1
    this.addBlind.bigBlind = -1
  }

  updateBlindLevel() {
    this.blindStructures.reduce<number>((level, blind, _index, _array) => {
      if (blind.level > 0) {
        blind.level = level
        return level + 1
      }
      return level // break time
    }, 1)

    this.blindStructures = [...this.blindStructures]
    this.updateMaxBlindLevel()
  }

  updateMaxBlindLevel() {
    this.lastBlind = this.blindStructures.reduce((previous, current) => {
      return previous.level > current.level ? previous : current
    })

    this.addBlind.level = this.lastBlind.level
    this.addBlind.smallBlind = this.lastBlind.smallBlind
    this.addBlind.bigBlind = this.lastBlind.bigBlind
    this.addBlind.minute = this.lastBlind.minute
  }

  get isAddBreak() {
    return this.addBlind.smallBlind < 0 || this.addBlind.bigBlind < 0
  }
}
</script>

<style lang="css" scoped>
.icons {
  vertical-align: middle;
}
</style>
