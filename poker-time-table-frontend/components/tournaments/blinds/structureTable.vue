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

    <template v-for="(item, index) in blindStructures">
      <v-row v-if="isRender(index)" :key="index" justify="center" class="ma-0">
        <template v-if="item.level > 0">
          <v-col class="pa-0" :cols="1">
            <BlindsStructureTableCell
              :value="item.level"
              :text-color="cellTextColor(index)"
              :back-color="cellBackgroundColor(index)"
            />
          </v-col>

          <v-col class="pa-0" :cols="colsGrid">
            <BlindsStructureTableCell
              :value="item.smallBlind"
              :text-color="cellTextColor(index)"
              :back-color="cellBackgroundColor(index)"
            />
          </v-col>

          <v-col class="pa-0" :cols="colsGrid">
            <BlindsStructureTableCell
              :value="item.bigBlind"
              :text-color="cellTextColor(index)"
              :back-color="cellBackgroundColor(index)"
            />
          </v-col>

          <v-col class="pa-0" :cols="colsGrid">
            <BlindsStructureTableCell
              :value="item.ante"
              :text-color="cellTextColor(index)"
              :back-color="cellBackgroundColor(index)"
            />
          </v-col>
        </template>

        <template v-else>
          <v-col class="pa-0" :cols="colsGrid * 3 + 1">
            <BreakTimeTableCell
              :text-color="breakTimeTextColor(index)"
              :back-color="cellBackgroundColor(index)"
            />
          </v-col>
        </template>

        <v-col class="pa-0" :cols="2">
          <BlindsStructureTableCell
            :value="item.minute"
            value-prefix="분"
            :text-color="cellTextColor(index)"
            :back-color="cellBackgroundColor(index)"
          />
        </v-col>
      </v-row>
    </template>

    <v-row v-if="isMoreBlind" justify="center" class="ma-0">
      <v-col class="pa-0" :cols="12">
        <BlindsStructureTableCell
          value="..."
          text-color="primary"
          back-color="gray5"
        />
      </v-col>
    </v-row>
  </v-flex>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { PropType } from 'vue'
import BlindsStructureTableCell from './structureTableCell.vue'
import BreakTimeTableCell from './breakTimeTableCell.vue'
import { BlindStructureDto } from '~/dto/blindStructureDto'
import { BlindStructureModel } from '~/store/admin/tournament'

@Component({
  components: {
    BlindsStructureTableCell,
    BreakTimeTableCell,
  },
})
export default class BlindsStructureTable extends Vue {
  headers: string[] = ['LV', 'S.B', 'B.B', 'ANTE', 'TIME']
  colsGrid = 3
  itemCount = 6

  @Prop({ type: Boolean, default: true })
  landscapeMode!: boolean

  @Prop({
    type: Array as PropType<Array<BlindStructureDto>>,
    required: true,
  })
  blindStructures!: BlindStructureModel[]

  @Prop({ type: Number, required: true })
  blindId!: number

  get isMoreBlind(): boolean {
    if (this.landscapeMode) {
      return false
    }
    return this.blindStructures.length - this.blindId >= this.itemCount
  }

  isRender(index: number): boolean {
    if (this.landscapeMode || this.blindId < 0) {
      return true
    }

    const firstRenderIdx = this.blindId - 1
    if (firstRenderIdx <= index) {
      const count = index - firstRenderIdx
      if (count < this.itemCount) {
        return true
      }
    }

    const remainCount = this.blindStructures.length - index
    if (remainCount <= this.itemCount) {
      if (!this.isMoreBlind) {
        return true
      }
    }

    return false
  }

  headerCols(headerText: string) {
    switch (headerText) {
      case 'LV':
        return 1
      case 'ANTE':
        return 3
      case 'TIME':
        return 2
      default:
        return this.colsGrid
    }
  }

  cellTextColor(index: number) {
    return this.blindId === index ? 'white' : 'primary'
  }

  breakTimeTextColor(index: number) {
    return this.blindId === index ? 'white' : 'accent1'
  }

  cellBackgroundColor(index: number) {
    return this.blindId === index ? 'accent1' : 'gray5'
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/variables.scss';

.header-text {
  @include media('lg-and-up') {
    @include sub-copy-bold;
    padding: 8px !important;
  }

  @include media('md-only') {
    @include title2-bold;
    padding: 16px !important;
  }

  @include media('sm-and-down') {
    @include sub-copy-bold;
  }

  @include secondary4-color;
  justify-content: center !important;
}
</style>
