<template>
  <v-card>
    <v-col>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title class="text-h5">
            BLINDS STRUCTURE
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-simple-table dense>
        <template #default>
          <thead>
            <tr>
              <th v-for="header in headers" :key="header">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in blindStructures" :key="item.sn">
              <template v-if="item.level > 0">
                <td>{{ item.level }}</td>
                <td>{{ item.smallBlind }} / {{ item.bigBlind }}</td>
                <td>{{ item.minute }}</td>
              </template>
              <template v-else>
                <td></td>
                <td>BREAK TIME</td>
                <td>{{ item.minute }}</td>
              </template>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-col>
  </v-card>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Component, PropSync, Vue } from 'nuxt-property-decorator'

import { BlindStructureDto } from '~/dto/blindStructureDto'

@Component
export default class AdminBlindStructureTemplate extends Vue {
  headers: string[] = ['Level', 'Blinds', 'Minute']

  @PropSync('blindstructure', {
    type: Array as PropType<Array<BlindStructureDto>>,
  })
  blindStructures!: BlindStructureDto[]
}
</script>
