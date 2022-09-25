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

    <template v-if="editMode">
      <EditBlindsStructureTable
        :blind-structures="blindStructures"
        :blind-id="currentStep"
        @onBlindUp="onBlindUp"
        @onBlindDown="onBlindDown"
        @onBlindDelete="onBlindDelete"
      />
    </template>
    <template v-else>
      <BlindsStructureTable
        :blind-structures="blindStructures"
        :blind-id="currentStep"
      />
    </template>

    <!-- ADD BLIND -->
    <AddBlindsStructureTableRow
      v-if="editMode"
      ref="addBlindRow"
      :blind-level="lastBlind.level + 1"
      @onBlindAdd="onBlindAdd"
    />
  </v-card>
</template>

<script lang="ts">
import {
  Component,
  Emit,
  Prop,
  PropSync,
  Ref,
  Vue,
  Watch,
} from 'nuxt-property-decorator'
import { PropType } from 'vue'
import BlindsStructureTable from './blinds/structureTable.vue'
import EditBlindsStructureTable from './blinds/editStructureTable.vue'
import AddBlindsStructureTableRow from './blinds/addStructureTableRow.vue'
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

@Component({
  components: {
    AddBlindsStructureTableRow,
    BlindsStructureTable,
    EditBlindsStructureTable,
  },
})
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

  @Ref() addBlindRow!: AddBlindsStructureTableRow

  mounted() {}

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

  onBlindUp(blind: BlindStructureModel) {
    const index = this.blindStructures.indexOf(blind, 0)
    const upIndex = index - 1
    if (upIndex > -1) {
      const swap = this.blindStructures[upIndex]
      this.blindStructures[upIndex] = blind
      this.blindStructures[index] = swap

      this.updateBlindLevel()
    }
  }

  onBlindDown(blind: BlindStructureModel) {
    const index = this.blindStructures.indexOf(blind, 0)
    const downIndex = index + 1
    if (downIndex < this.blindStructures.length) {
      const swap = this.blindStructures[downIndex]
      this.blindStructures[downIndex] = blind
      this.blindStructures[index] = swap

      this.updateBlindLevel()
    }
  }

  onBlindDelete(blind: BlindStructureModel) {
    const index = this.blindStructures.indexOf(blind, 0)
    if (index > -1) {
      this.blindStructures.splice(index, 1)
      this.updateBlindLevel()
    }
  }

  onBlindAdd(addBlind: BlindStructureModel) {
    if (this.addBlindRow.isAddBreakTime) {
      // break time
      vxm.tournament.addBreakTime(addBlind.minute)
    } else {
      if (!this.lastBlind) {
        return
      }
      vxm.tournament.addBlind({
        level: this.lastBlind.level + 1,
        smallBlind: addBlind.smallBlind,
        bigBlind: addBlind.bigBlind,
        minute: addBlind.minute,
      })
    }
    // this.updateMaxBlindLevel()
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
    // this.updateMaxBlindLevel()
  }

  @Watch('blindStructures')
  updateMaxBlindLevel() {
    if (this.blindStructures.length > 0) {
      this.lastBlind = this.blindStructures.reduce((previous, current) => {
        return previous.level > current.level ? previous : current
      })

      this.addBlindRow?.update(this.lastBlind)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/variables.scss';

.blind-table-title {
  @extend .title-1-bold;

  justify-content: center !important;
}
</style>