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
          <v-col class="pa-0" :cols="2">
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

          <v-col class="pa-0" :cols="2">
            <BlindsStructureTableCell
              :value="item.ante"
              :text-color="cellTextColor(index)"
              :back-color="cellBackgroundColor(index)"
            />
          </v-col>
        </template>

        <template v-else>
          <v-col class="pa-0" :cols="colsGrid * 3 + 1">
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
  itemCount = 7

  @Prop({ type: Boolean, default: true })
  landscapeMode!: boolean

  @Prop({
    type: Array as PropType<Array<BlindStructureDto>>,
    required: true,
  })
  blindStructures!: BlindStructureModel[]

  @Prop({ type: Number, required: true })
  blindId!: number

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
    return false
  }

  headerCols(headerText: string) {
    switch (headerText) {
      case 'LV':
        return 2
      case 'ANTE':
        return 2
      case 'TIME':
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
  @include media('lg-and-up') {
    @include sub-copy-bold;
  }

  @include media('md-and-down') {
    @include small-copy1-bold;
  }

  @include secondary4-color;
  justify-content: center !important;
}
.breaktime-text {
  @include media('lg-and-up') {
    @include title2-bold;
    padding: 16px !important;
  }

  @include media('md-and-down') {
    @include sub-copy-bold;
  }

  @include accent1-color;
  height: 100%;
  justify-content: center !important;
}
</style>
