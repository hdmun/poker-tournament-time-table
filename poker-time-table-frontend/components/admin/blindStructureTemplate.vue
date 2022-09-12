<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-data-table
    :headers="headers"
    :items="blindStructures"
    :items-per-page="-1"
    hide-default-footer
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>BLINDS STRUCTURE</v-toolbar-title>
      </v-toolbar>
    </template>

    <template #item.smallBlind="props">
      <v-edit-dialog :return-value.sync="props.item.smallBlind">
        {{ props.item.smallBlind }}
        <template #input>
          <v-text-field
            v-model="props.item.smallBlind"
            label="Edit"
            single-line
            counter
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template #item.bigBlind="props">
      <v-edit-dialog :return-value.sync="props.item.bigBlind">
        {{ props.item.bigBlind }}
        <template #input>
          <v-text-field
            v-model="props.item.bigBlind"
            label="Edit"
            single-line
            counter
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template #item.minute="props">
      <v-edit-dialog :return-value.sync="props.item.minute">
        {{ props.item.minute }}
        <template #input>
          <v-text-field
            v-model="props.item.minute"
            label="Edit"
            single-line
            counter
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template #item.actions="{ item }">
      <v-icon @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Component, Emit, PropSync, Vue } from 'nuxt-property-decorator'

import { BlindStructureDto } from '~/dto/blindStructureDto'

@Component
export default class AdminBlindStructureTemplate extends Vue {
  headers = [
    { text: 'Level', value: 'level' },
    { text: 'SB', value: 'smallBlind' },
    { text: 'BB', value: 'bigBlind' },
    { text: 'Minute', value: 'minute' },
    { text: 'Actions', value: 'actions' },
  ]

  @PropSync('blindstructure', {
    type: Array as PropType<Array<BlindStructureDto>>,
  })
  blindStructures!: BlindStructureDto[]

  @Emit('delete')
  deleteItem(item: BlindStructureDto) {
    return item
  }
}
</script>
