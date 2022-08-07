<template>
  <v-card>
    <v-col>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title class="text-h5">
            Blind Structure
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-simple-table dense>
        <template v-slot:default>
          <thead>
            <tr>
              <th v-for="header in headers">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in blindStructure" :key="item.level">
              <td>{{ item.level }}</td>
              <td>{{ item.smallBlind }} / {{ item.bigBlind }}</td>
              <td>{{ item.minute }}</td>
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
export default class BlindStructureTemplate extends Vue {
  headers: string[] = ['Level', 'Blinds', 'Minute']

  @PropSync('structure', { type: Array as PropType<Array<BlindStructureDto>> })
  blindStructure?: BlindStructureDto[]
}
</script>