<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-data-table
    class="gray7"
    :headers="headers"
    :items="blindStructures"
    :items-per-page="-1"
    hide-default-footer
  >
    <template #top>
      <v-toolbar class="gray7" flat>
        <v-toolbar-title>BLINDS STRUCTURE</v-toolbar-title>
      </v-toolbar>
    </template>

    <template #item.smallBlind="props">
      <v-edit-dialog :return-value.sync="props.item.smallBlind">
        {{ props.item.smallBlind }}
        <template #input>
          <EditNumberField :value="props.item.smallBlind" label="S.B" />
        </template>
      </v-edit-dialog>
    </template>

    <template #item.bigBlind="props">
      <v-edit-dialog :return-value.sync="props.item.bigBlind">
        {{ props.item.bigBlind }}
        <template #input>
          <EditNumberField :value="props.item.bigBlind" label="B.B" />
        </template>
      </v-edit-dialog>
    </template>

    <template #item.ante="props">
      <v-edit-dialog :return-value.sync="props.item.ante">
        {{ props.item.ante }}
        <template #input>
          <EditNumberField :value="props.item.ante" label="ANTE" />
        </template>
      </v-edit-dialog>
    </template>

    <template #item.minute="props">
      <v-edit-dialog :return-value.sync="props.item.minute">
        {{ props.item.minute }}
        <template #input>
          <EditNumberField :value="props.item.minute" label="Minute" />
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

import EditNumberField from './editNumberField.vue'
import { BlindStructureDto } from '~/dto/blindStructureDto'

@Component({
  components: {
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

  @Emit('delete')
  deleteItem(item: BlindStructureDto) {
    return item
  }
}
</script>
