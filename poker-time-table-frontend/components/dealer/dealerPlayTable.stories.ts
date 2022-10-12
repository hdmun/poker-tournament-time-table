import { VApp } from 'vuetify/lib'

export default {
  title: 'Dealer',
}

const Template = (args) => ({
  components: { VApp },
  setup() {
    return { args }
  },
  template: `
    <v-app>
      <DealerPlayTable :dealers=args.dealers />
    </v-app>
  `,
})

export const DealerPlayTable = Template.bind({})
DealerPlayTable.args = {
  dealers: [
    {
      name: '딜러 이름',
      tournament: '6프리 데일리',
      dealingTime: '12분',
    },
    {
      name: '딜러 이름',
      tournament: '만원의 행복',
      dealingTime: '0분',
    },
    {
      name: '딜러 이름',
      tournament: '',
      dealingTime: '',
    },
    {
      name: '딜러 이름',
      tournament: '',
      dealingTime: '',
    },
    {
      name: '딜러 이름',
      tournament: '4프리 데일리',
      dealingTime: '-10분',
    },
  ],
}
