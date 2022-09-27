<template>
  <v-flex class="ma-0 pa-0">
    <v-row justify="center" class="ma-0">
      <v-col
        v-for="(header, index) in headers"
        :key="index"
        class="pa-0"
        :cols="headerCols(header)"
      >
        <v-card class="pa-0" color="gray6" outlined tile>
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
      <template v-if="blind.level > 0">
        <v-col class="pa-0" :cols="1">
          <BlindsStructureTableCell
            :value="blind.level"
            :text-color="cellTextColor(index)"
            :back-color="cellBackgroundColor(index)"
          />
        </v-col>

        <v-col class="pa-0" :cols="colsGrid">
          <BlindsStructureTableCell
            :value="blind.smallBlind"
            :text-color="cellTextColor(index)"
            :back-color="cellBackgroundColor(index)"
          />
        </v-col>

        <v-col class="pa-0" :cols="colsGrid">
          <BlindsStructureTableCell
            :value="blind.bigBlind"
            :text-color="cellTextColor(index)"
            :back-color="cellBackgroundColor(index)"
          />
        </v-col>

        <v-col class="pa-0" :cols="2">
          <BlindsStructureTableCell
            :value="blind.ante"
            :text-color="cellTextColor(index)"
            :back-color="cellBackgroundColor(index)"
          />
        </v-col>
      </template>

      <template v-else>
        <v-col class="pa-0" :cols="colsGrid * 3">
          <v-card
            class="pa-0 fill-height"
            :color="cellBackgroundColor(index)"
            outlined
            tile
          >
            <v-card-title class="pa-2 breaktime-text">
              BREAK TIME
            </v-card-title>
          </v-card>
        </v-col>
      </template>

      <v-col class="pa-0" :cols="colsGrid">
        <BlindsStructureTableCell
          :value="blind.minute"
          value-prefix="분"
          :text-color="cellTextColor(index)"
          :back-color="cellBackgroundColor(index)"
        />
      </v-col>
    </v-row>
  </v-flex>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { PropType } from 'vue'
import BlindsStructureTableCell from './structureTableCell.vue'
import { BlindStructureDto } from '~/dto/blindStructureDto'
import { BlindStructureModel } from '~/store/admin/tournament'

@Component({
  components: {
    BlindsStructureTableCell,
  },
})
export default class BlindsStructureTable extends Vue {
  headers: string[] = ['LV', 'S.B', 'B.B', 'ANTE', 'TIME']
  colsGrid = 3

  @Prop({
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
}
</script>

<style lang="scss" scoped>
@import '~/assets/variables.scss';

.header-text {
  @extend .small-copy-2-exbold;
  @extend .secondary4-color;

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
