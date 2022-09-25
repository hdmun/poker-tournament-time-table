<template>
  <v-card height="100%" outlined tile>
    <v-row justify="center" align="center" class="secondary4">
      <v-col cols="1">
        <v-btn class="ma-2 pa-1" outlined @click="onBlindEdit(!editMode)">
          <template v-if="editMode"> DONE </template>
          <template v-else> Edit </template>
        </v-btn>
      </v-col>

      <v-col class="secondary4">
        <v-card-title class="pa-2 blind-table-title"> BLINDS </v-card-title>
      </v-col>

      <v-col v-if="editMode" cols="1" class="secondary4">
        <v-icon large left @click="onBlindEditClose()"> mdi-close </v-icon>
      </v-col>
    </v-row>

    <v-row justify="center" class="ma-0">
      <v-col
        v-for="header in headers"
        :key="header"
        class="pa-0"
        :cols="editMode ? 2 : 3"
      >
        <v-card class="pa-0" color="gray6" outlined tile>
          <v-card-title class="pa-2 blind-table-header-text">
            {{ header }}
          </v-card-title>
        </v-card>
      </v-col>

      <v-col v-if="editMode" class="pa-0" :cols="editMode ? 4 : 0">
        <v-card class="pa-0" color="gray6" outlined tile>
          <v-card-title class="pa-2 blind-table-header-text">
            편집
          </v-card-title>
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
        <v-col class="pa-0 gray4-border" :cols="editMode ? 2 : 3">
          <v-card
            class="pa-0"
            :color="currentColorBackground(index)"
            outlined
            tile
          >
            <v-card-title
              :class="`blind-table-data-text ${currentColorText(index)}--text`"
            >
              {{ blind.level }}
            </v-card-title>
          </v-card>
        </v-col>

        <v-col class="pa-0 gray4-border" :cols="editMode ? 2 : 3">
          <v-card
            class="pa-0"
            :color="currentColorBackground(index)"
            outlined
            tile
          >
            <template v-if="editMode">
              <v-card-title class="pa-0">
                <v-text-field
                  v-model="blind.smallBlind"
                  class="pt-2 pb-1 ma-0 blind-table-data-edit-text"
                  single-line
                  type="number"
                  hide-spin-buttons
                  hide-details
                  reverse
                />
              </v-card-title>
            </template>
            <template v-else>
              <v-card-title
                :class="`blind-table-data-text ${currentColorText(
                  index
                )}--text`"
              >
                {{ blind.smallBlind }}
              </v-card-title>
            </template>
          </v-card>
        </v-col>

        <v-col class="pa-0" :cols="editMode ? 2 : 3">
          <v-card
            class="pa-0"
            :color="currentColorBackground(index)"
            outlined
            tile
          >
            <template v-if="editMode">
              <v-card-title class="pa-0">
                <v-text-field
                  v-model="blind.bigBlind"
                  class="pt-2 pb-1 ma-0 blind-table-data-edit-text"
                  single-line
                  type="number"
                  hide-spin-buttons
                  hide-details
                  reverse
                />
              </v-card-title>
            </template>
            <template v-else>
              <v-card-title
                :class="`blind-table-data-text ${currentColorText(
                  index
                )}--text`"
              >
                {{ blind.bigBlind }}
              </v-card-title>
            </template>
          </v-card>
        </v-col>
      </template>

      <template v-else>
        <v-col class="pa-0" :cols="editMode ? 6 : 9">
          <v-card
            class="pa-0"
            :color="currentColorBackground(index)"
            outlined
            tile
          >
            <v-card-title class="pa-2 blind-table-break-time">
              BREAK TIME
            </v-card-title>
          </v-card>
        </v-col>
      </template>

      <v-col class="pa-0 gray4-border" :cols="editMode ? 2 : 3">
        <v-card
          class="pa-0"
          :color="currentColorBackground(index)"
          outlined
          tile
        >
          <template v-if="editMode">
            <v-card-title class="pa-0">
              <v-text-field
                v-model="blind.minute"
                class="pt-2 pb-1 ma-0 blind-table-data-edit-text"
                single-line
                type="number"
                hide-spin-buttons
                hide-details
                reverse
              />
            </v-card-title>
          </template>
          <template v-else>
            <v-card-title
              :class="`blind-table-data-text ${currentColorText(index)}--text`"
            >
              {{ blind.minute }}분
            </v-card-title>
          </template>
        </v-card>
      </v-col>

      <v-col v-if="editMode" class="pa-0" :cols="editMode ? 4 : 0">
        <v-card class="pa-0 justify-center" outlined tile>
          <v-card-title class="pa-0 justify-center">
            <v-icon small :disabled="index < 1" @click.stop="onClickUp(blind)">
              mdi-arrow-up
            </v-icon>
            <v-icon
              small
              :disabled="blindStructures.length <= index + 1"
              @click.stop="onClickDown(blind)"
            >
              mdi-arrow-down
            </v-icon>
            <v-icon small @click.stop="onClickDelete(blind)">
              mdi-delete
            </v-icon>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <!-- ADD BLIND -->
    <v-row v-if="editMode" align="center" justify="center" class="ma-0">
      <v-col class="pa-0 gray4-border" :cols="editMode ? 2 : 3">
        <v-card class="pa-0" outlined tile>
          <v-card-title class="blind-table-data-text">
            {{ isAddBreak ? 'Break' : lastBlind?.level + 1 }}
          </v-card-title>
        </v-card>
      </v-col>

      <v-col class="pa-0 gray4-border" :cols="editMode ? 2 : 3">
        <v-card class="pa-0" outlined tile>
          <v-card-title class="pa-0">
            <v-text-field
              v-model="addBlind.smallBlind"
              class="pt-2 pb-1 ma-0 blind-table-data-edit-text"
              single-line
              type="number"
              hide-spin-buttons
              hide-details
              reverse
            />
          </v-card-title>
        </v-card>
      </v-col>

      <v-col class="pa-0 gray4-border" :cols="editMode ? 2 : 3">
        <v-card class="pa-0" outlined tile>
          <v-card-title class="pa-0 justify-center">
            <v-text-field
              v-model="addBlind.bigBlind"
              class="pt-2 pb-1 ma-0 blind-table-data-edit-text"
              single-line
              type="number"
              hide-spin-buttons
              hide-details
              reverse
            />
          </v-card-title>
        </v-card>
      </v-col>

      <v-col class="pa-0 gray4-border" :cols="editMode ? 2 : 3">
        <v-card class="pa-0" outlined tile>
          <v-card-title class="pa-0 justify-center">
            <v-text-field
              v-model="addBlind.minute"
              class="pt-2 pb-1 ma-0 blind-table-data-edit-text"
              single-line
              type="number"
              hide-spin-buttons
              hide-details
              reverse
            />
          </v-card-title>
        </v-card>
      </v-col>

      <v-col
        v-if="editMode"
        class="pa-0"
        color="gray4"
        :cols="editMode ? 4 : 0"
      >
        <v-card class="pa-0 justify-center" outlined tile>
          <v-card-title class="pa-0 justify-center">
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-icon
                  small
                  v-bind="attrs"
                  v-on="on"
                  @click.stop="onClickBreak()"
                >
                  mdi-coffee-outline
                </v-icon>
              </template>
              <span>Break Time으로 세팅합니다.</span>
            </v-tooltip>

            <v-icon
              small
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
import { vxm } from '~/store'
import { BlindStructureModel } from '~/store/admin/tournament'

function isEqual(a: BlindStructureModel, b: BlindStructureModel) {
  return (
    a.level === b.level &&
    a.smallBlind === b.smallBlind &&
    a.bigBlind === b.bigBlind &&
    a.minute === b.minute
  )
}

export interface BlindEditDto {
  edit: boolean
  request: boolean
}

@Component
export default class TournamentBlinds extends Vue {
  headers: string[] = ['LV', 'S.B', 'B.B', 'TIME']

  @PropSync('structure', {
    type: Array as PropType<Array<BlindStructureDto>>,
    required: true,
  })
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
    if (this.blindStructures.length > 0) {
      this.updateMaxBlindLevel()
    }
  }

  currentColorText(index: number) {
    return this.currentStep === index && !this.editMode ? 'white' : 'primary'
  }

  currentColorBackground(index: number) {
    return this.currentStep === index && !this.editMode ? 'primary' : 'gray5'
  }

  @Emit('onBlindEdit')
  onBlindEdit(edit: boolean): BlindEditDto {
    let request = false
    if (edit) {
      this.blindStructuresBackup = this.copyBlindStructure()
    } else {
      request =
        this.blindStructures.length !== this.blindStructuresBackup.length ||
        !this.blindStructures.every((element, index) => {
          return isEqual(element, this.blindStructuresBackup[index])
        })
      this.blindStructuresBackup = []
    }

    return { edit, request }
  }

  @Emit('onBlindEditClose')
  onBlindEditClose() {
    const swap = this.blindStructures
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
      vxm.tournament.addBreakTime(this.addBlind.minute)
    } else {
      if (!this.lastBlind) {
        return
      }
      vxm.tournament.addBlind({
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

  copyBlindStructure() {
    return Object.assign(
      [],
      this.blindStructures.map((value) => {
        return Object.assign({}, value)
      })
    )
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
    if (this.blindStructures.length > 0) {
      this.lastBlind = this.blindStructures.reduce((previous, current) => {
        return previous.level > current.level ? previous : current
      })

      this.addBlind.level = this.lastBlind.level
      this.addBlind.smallBlind = this.lastBlind.smallBlind
      this.addBlind.bigBlind = this.lastBlind.bigBlind
      this.addBlind.minute = this.lastBlind.minute
    }
  }

  get isAddBreak() {
    return this.addBlind.smallBlind < 0 || this.addBlind.bigBlind < 0
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/variables.scss';

.blind-table-title {
  @extend .title-1-bold;

  justify-content: center !important;
}

.blind-table-header-text {
  @extend .small-copy-2-exbold;
  @extend .secondary4-color;

  justify-content: center !important;
}

.blind-table-data-text {
  @extend .sub-copy;

  padding: 16px !important;
  justify-content: center !important;
}

.blind-table-break-time {
  @extend .blind-table-data-text;
  @extend .accent1-color;
}

.blind-table-data-edit-text {
  @extend .sub-copy;

  justify-content: center !important;
}
</style>
