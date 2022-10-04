import { VApp } from 'vuetify/lib'

export default {
  title: 'Tournament',
}

const blindStructure = [
  { sn: 1, level: 1, smallBlind: 50, bigBlind: 100, minute: 40 },
  { sn: 2, level: 2, smallBlind: 100, bigBlind: 200, minute: 40 },
  { sn: 3, level: 3, smallBlind: 200, bigBlind: 400, minute: 40 },
  { sn: 4, level: -1, smallBlind: -1, bigBlind: -1, minute: 15 },
  { sn: 5, level: 4, smallBlind: 400, bigBlind: 800, minute: 40 },
  { sn: 6, level: 5, smallBlind: 500, bigBlind: 1000, minute: 40 },
  { sn: 7, level: 6, smallBlind: 600, bigBlind: 1200, minute: 40 },
  { sn: 8, level: -1, smallBlind: -1, bigBlind: -1, minute: 15 },
  { sn: 9, level: 7, smallBlind: 800, bigBlind: 1600, minute: 40 },
  { sn: 10, level: 8, smallBlind: 100, bigBlind: 2000, minute: 40 },
  { sn: 11, level: 9, smallBlind: 1200, bigBlind: 2400, minute: 40 },
]

const Template = (args) => ({
  components: { VApp },
  setup() {
    return { args }
  },
  template: `
    <v-app>
      <TournamentBlinds :structure=args.blindStructure :currentStep=3 />
    </v-app>
  `,
})

export const Blinds = Template.bind({})
Blinds.args = {
  blindStructure,
}
