<template>
  <v-row class="ma-0 pa-0">
    <v-row justify="center" class="ma-0">
      <v-col
        v-for="(header, index) in headers"
        :key="index"
        class="pa-0"
        :cols="headerCols(header)"
      >
        <v-card class="pa-0 fill-height" color="gray6" outlined tile>
          <v-card-title class="pa-2 header-text">
            {{ header }}
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <draggable v-model="blindStructures" draggable=".item" @change="onChanged">
      <v-row
        v-for="(blind, index) in blindStructures"
        :key="index"
        justify="center"
        class="ma-0 item"
      >
        <template v-if="blind.level > 0">
          <v-col class="pa-0" :cols="1">
            <BlindsStructureTableCell
              :value.sync="blind.level"
              :text-color="cellTextColor(index)"
              :back-color="cellBackgroundColor(index)"
            />
          </v-col>

          <v-col class="pa-0" :cols="colsGrid">
            <EditBlindsStructureTableCell
              :edit-value.sync="blind.smallBlind"
              :back-color="cellBackgroundColor(index)"
            />
          </v-col>

          <v-col class="pa-0" :cols="colsGrid">
            <EditBlindsStructureTableCell
              :edit-value.sync="blind.bigBlind"
              :back-color="cellBackgroundColor(index)"
            />
          </v-col>

          <v-col class="pa-0" :cols="2">
            <EditBlindsStructureTableCell
              :edit-value.sync="blind.ante"
              :back-color="cellBackgroundColor(index)"
            />
          </v-col>
        </template>

        <template v-else>
          <v-col class="pa-0" :cols="colsGrid * 3">
            <BreakTimeTableCell
              :text-color="cellTextColor(index)"
              :back-color="cellBackgroundColor(index)"
            />
          </v-col>
        </template>

        <v-col class="pa-0" :cols="2">
          <EditBlindsStructureTableCell
            :edit-value.sync="blind.minute"
            :back-color="cellBackgroundColor(index)"
          />
        </v-col>

        <v-col class="pa-0" :cols="1">
          <v-card
            class="pa-0 justify-center fill-height"
            color="gray5"
            outlined
            tile
          >
            <v-card-title class="pa-0 justify-center fill-height">
              <v-icon large @click.stop="onClickDelete(blind)">
                mdi-delete
              </v-icon>
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </draggable>
  </v-row>
</template>

<script lang="ts">
import { Component, Emit, Prop, PropSync, Vue } from 'nuxt-property-decorator'
import { PropType } from 'vue'
import draggable from 'vuedraggable'
import BlindsStructureTableCell from './structureTableCell.vue'
import EditBlindsStructureTableCell from './editStructureTableCell.vue'
import BreakTimeTableCell from './breakTimeTableCell.vue'
import { BlindStructureDto } from '~/dto/blindStructureDto'
import { BlindStructureModel } from '~/store/admin/tournament'

@Component({
  components: {
    draggable,
    BlindsStructureTableCell,
    BreakTimeTableCell,
    EditBlindsStructureTableCell,
  },
})
export default class EditBlindsStructureTable extends Vue {
  headers: string[] = ['LV', 'S.B', 'B.B', 'ANTE', 'TIME', '편집']
  colsGrid = 3

  @PropSync('editBlindStructures', {
    type: Array as PropType<Array<BlindStructureDto>>,
    required: true,
  })
  blindStructures!: BlindStructureModel[]

  @Prop({ type: Number, required: true })
  blindId!: number

  headerCols(headerText: string) {
    switch (headerText) {
      case 'LV':
        return 1
      case 'ANTE':
        return 2
      case 'TIME':
        return 2
      case '편집':
        return 1
      default:
        return this.colsGrid
    }
  }

  cellTextColor(index: number) {
    return this.blindId === index ? 'white' : 'primary'
  }

  cellBackgroundColor(index: number) {
    return this.blindId === index ? 'primary' : 'gray5'
  }

  onChanged() {
    // 드래그 앤 드랍 이벤트가 끝나면 `level` 값을 보정해주자
    // 많아봤자 100개 이내이므로 너무 복잡하게 처리할 필요가 없다.
    let level = 0
    for (let i = 0; i < this.blindStructures.length; i++) {
      const blind = this.blindStructures[i]
      if (blind.level > 0) {
        level += 1
        blind.level = level
      }
    }
  }

  @Emit('onBlindDelete')
  onClickDelete(blind: BlindStructureModel) {
    return blind
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/variables.scss';

.header-text {
  @include sub-copy-bold;
  @include secondary4-color;

  height: 100% !important;
  justify-content: center !important;
}
</style>
