<template>
  <v-card class="gray7">
    <v-card-title> BLIND STRUCTURE TEMPLATE </v-card-title>

    <v-list class="gray7">
      <draggable v-model="blindStructures" draggable=".item" :move="onMove">
        <v-list-item
          v-for="(item, index) in blindStructures"
          :key="index"
          class="item"
        >
          <template v-if="item.level > 0">
            <v-col cols="2" class="pa-0">
              <v-list-item-action class="ma-2">
                <v-btn
                  class="level-text"
                  color="gray7"
                  tabindex="-1"
                  small
                  depressed
                  no-focus
                >
                  Level {{ index + 1 }}
                </v-btn>
              </v-list-item-action>
            </v-col>

            <v-col cols="9" class="pa-0">
              <v-list-item-content class="pa-0">
                <v-col class="pa-2">
                  <EditNumberField
                    :value.sync="item.smallBlind"
                    :solo="true"
                    background-color="gray6"
                  />
                </v-col>
                <v-col class="pa-2">
                  <EditNumberField
                    :value.sync="item.bigBlind"
                    :solo="true"
                    background-color="gray6"
                  />
                </v-col>
                <v-col class="pa-2">
                  <EditNumberField
                    :value.sync="item.ante"
                    :solo="true"
                    background-color="gray6"
                  />
                </v-col>
                <v-col class="pa-2">
                  <EditNumberField
                    :value.sync="item.minute"
                    :solo="true"
                    background-color="gray6"
                  />
                </v-col>
              </v-list-item-content>
            </v-col>

            <v-col cols="1" class="pa-0">
              <v-list-item-action
                class="ml-2 mr-2"
                justify="center"
                tabindex="-1"
              >
                <v-btn class="pa-4 accent" @click="deleteItem(item)">
                  <v-icon> mdi-delete </v-icon>
                </v-btn>
              </v-list-item-action>
            </v-col>
          </template>

          <template v-else>
            <v-col class="pa-0">
              <v-list-item-content justify="center">
                <v-list-item-title class="text-center">
                  Break Time <strong>{{ item.minute }}</strong> Minute
                </v-list-item-title>
              </v-list-item-content>
            </v-col>

            <v-col cols="1" class="pa-0">
              <v-list-item-action
                class="ml-2 mr-2"
                justify="center"
                tabindex="-1"
              >
                <v-btn class="pa-4 accent" @click="deleteItem(item)">
                  <v-icon> mdi-delete </v-icon>
                </v-btn>
              </v-list-item-action>
            </v-col>
          </template>
        </v-list-item>
      </draggable>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Component, Emit, PropSync, Vue } from 'nuxt-property-decorator'

import draggable, { MoveEvent } from 'vuedraggable'
import EditNumberField from './editNumberField.vue'
import { BlindStructureDto } from '~/dto/blindStructureDto'

@Component({
  components: {
    draggable,
    EditNumberField,
  },
})
export default class AdminBlindStructureTemplate extends Vue {
  headers = [
    { text: 'Level', value: 'level' },
    { text: 'SB', value: 'smallBlind' },
    { text: 'BB', value: 'bigBlind' },
    { text: 'ANTE', value: 'ante' },
    { text: 'Minute', value: 'minute' },
    { text: 'Actions', value: 'actions' },
  ]

  @PropSync('blindstructure', {
    type: Array as PropType<Array<BlindStructureDto>>,
  })
  blindStructures!: BlindStructureDto[]

  benched: number = 0

  onMove(event: MoveEvent<BlindStructureDto>): boolean {
    const from = event.draggedContext.element
    const to = event.relatedContext.element
    if (from.level > 0 && to.level > 0) {
      const toLevel = to.level
      to.level = from.level
      from.level = toLevel
    }

    return true
  }

  @Emit('delete')
  deleteItem(item: BlindStructureDto) {
    return item
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/variables.scss';

.level-text {
  @include small-copy1;
}
</style>
