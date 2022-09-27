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

    <v-row
      v-for="(blind, index) in blindStructures"
      :key="index"
      justify="center"
      class="ma-0"
    >
      <v-col class="pa-0" :cols="1">
        <v-card
          class="pa-0 justify-center fill-height"
          color="gray2"
          outlined
          tile
        >
          <v-card-title class="pa-0 justify-center fill-height">
            <v-icon
              x-large
              color="gray5"
              :disabled="index < 1"
              @click.stop="onClickUp(blind)"
            >
              mdi-menu-up
            </v-icon>
          </v-card-title>
        </v-card>
      </v-col>

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

        <v-col class="pa-0" :cols="colsGrid">
          <EditBlindsStructureTableCell
            :edit-value.sync="blind.ante"
            :back-color="cellBackgroundColor(index)"
          />
        </v-col>
      </template>

      <template v-else>
        <v-col class="pa-0" :cols="colsGrid * 3 + 1">
          <v-card class="pa-0 fill-height" color="gray5" outlined tile>
            <v-card-title class="pa-2 breaktime-text">
              BREAK TIME
            </v-card-title>
          </v-card>
        </v-col>
      </template>

      <v-col class="pa-0" :cols="colsGrid">
        <EditBlindsStructureTableCell
          :edit-value.sync="blind.minute"
          :back-color="cellBackgroundColor(index)"
        />
      </v-col>

      <v-col class="pa-0" :cols="1">
        <v-card
          class="pa-0 justify-center fill-height"
          color="gray2"
          outlined
          tile
        >
          <v-card-title class="pa-0 justify-center fill-height">
            <v-icon
              x-large
              color="gray5"
              :disabled="blindStructures.length <= index + 1"
              @click.stop="onClickDown(blind)"
            >
              mdi-menu-down
            </v-icon>
          </v-card-title>
        </v-card>
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
  </v-row>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'
import { PropType } from 'vue'
import BlindsStructureTableCell from './structureTableCell.vue'
import EditBlindsStructureTableCell from './editStructureTableCell.vue'
import { BlindStructureDto } from '~/dto/blindStructureDto'
import { BlindStructureModel } from '~/store/admin/tournament'

@Component({
  components: {
    BlindsStructureTableCell,
    EditBlindsStructureTableCell,
  },
})
export default class EditBlindsStructureTable extends Vue {
  headers: string[] = [' ', 'LV', 'S.B', 'B.B', 'ANTE', 'TIME', ' ', '편집']
  colsGrid = 2

  @Prop({
    type: Array as PropType<Array<BlindStructureDto>>,
    required: true,
  })
  blindStructures!: BlindStructureModel[]

  @Prop({ type: Number, required: true })
  blindId!: number

  headerCols(headerText: string) {
    switch (headerText) {
      case ' ':
        return 1
      case 'LV':
        return 1
      case 'TIME':
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

  @Emit('onBlindUp')
  onClickUp(blind: BlindStructureModel) {
    return blind
  }

  @Emit('onBlindDown')
  onClickDown(blind: BlindStructureModel) {
    return blind
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
  @extend .small-copy-2-exbold;
  @extend .secondary4-color;

  height: 100% !important;
  justify-content: center !important;
}
.breaktime-text {
  @extend .sub-copy;
  @extend .accent1-color;

  height: 100%;
  padding: 16px !important;
  justify-content: center !important;
}
</style>
