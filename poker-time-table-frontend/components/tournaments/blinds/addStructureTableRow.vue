<template>
  <v-row class="ma-0 pa-0">
    <v-col class="pa-0" :cols="1">
      <v-card class="pa-0 fill-height" color="gray5" outlined tile> </v-card>
    </v-col>

    <v-col class="pa-0" :cols="1">
      <BlindsStructureTableCell
        :value="isAddBreakTime ? null : blindLevel"
        :value-prefix="isAddBreakTime ? 'BreakTime' : ''"
        text-color="white"
        back-color="gray5"
      />
    </v-col>

    <v-col class="pa-0" :cols="colsGrid">
      <EditBlindsStructureTableCell
        :edit-value.sync="addBlind.smallBlind"
        back-color="gray5"
      />
    </v-col>

    <v-col class="pa-0" :cols="colsGrid">
      <EditBlindsStructureTableCell
        :edit-value.sync="addBlind.bigBlind"
        back-color="gray5"
      />
    </v-col>

    <v-col class="pa-0" :cols="colsGrid">
      <EditBlindsStructureTableCell
        :edit-value.sync="addBlind.ante"
        back-color="gray5"
      />
    </v-col>

    <v-col class="pa-0" :cols="colsGrid">
      <EditBlindsStructureTableCell
        :edit-value.sync="addBlind.minute"
        back-color="gray5"
      />
    </v-col>

    <v-col class="pa-0" :cols="1">
      <v-card class="pa-0 fill-height" color="gray5" outlined tile>
        <v-card-title class="pa-0 justify-center fill-height">
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" @click.stop="onClickSetBreak()">
                mdi-coffee-outline
              </v-icon>
            </template>
            <span>Break Time으로 세팅합니다.</span>
          </v-tooltip>
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
          <v-icon
            large
            :disabled="addBlind.smallBlind === 0 || addBlind.bigBlind === 0"
            @click.stop="onClickAdd()"
          >
            mdi-plus
          </v-icon>
        </v-card-title>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'
import BlindsStructureTableCell from './structureTableCell.vue'
import EditBlindsStructureTableCell from './editStructureTableCell.vue'
import { BlindStructureModel } from '~/store/admin/tournament'

@Component({
  components: {
    BlindsStructureTableCell,
    EditBlindsStructureTableCell,
  },
})
export default class AddBlindsStructureTableRow extends Vue {
  colsGrid = 2

  @Prop({ type: Number, required: true })
  blindLevel!: number

  addBlind: BlindStructureModel = {
    level: -1,
    ante: 0,
    smallBlind: 0,
    bigBlind: 0,
    minute: 0,
  }

  get isAddBreakTime() {
    return this.addBlind.smallBlind < 0 || this.addBlind.bigBlind < 0
  }

  update(blind: BlindStructureModel) {
    this.addBlind.level = blind.level
    this.addBlind.smallBlind = blind.smallBlind
    this.addBlind.bigBlind = blind.bigBlind
    this.addBlind.minute = blind.minute
  }

  onClickSetBreak() {
    this.addBlind.smallBlind = -1
    this.addBlind.bigBlind = -1
  }

  @Emit('onBlindAdd')
  onClickAdd() {
    return this.addBlind
  }
}
</script>

<style lang="scss" scoped>
// @import '~/assets/variables.scss';
</style>
