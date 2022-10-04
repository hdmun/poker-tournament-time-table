import { VApp } from 'vuetify/lib'

export default {
  title: 'Tournament',
}

const ClockTemplate = (args) => ({
  components: { VApp },
  setup() {
    return { args }
  },
  template: '<v-app><TournamentClock :data=args.data /></v-app>',
})

export const Clock = ClockTemplate.bind({})
Clock.args = {
  data: {
    playTime: '03:27:04',
    nextBreakTime: '58:42',
    remainTime: '05:32',
    level: 2,
    title: '토너먼트 타이틀',
    smallBlind: 10,
    bigBlind: 20,
    chipsInPlay: 1800000,
    player: 8,
    totalPlayer: 19,
    averageStack: 105000,
  },
}
