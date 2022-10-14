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
      <DealerPlayLogTable :dealers=args.dealers />
    </v-app>
  `,
})

export const DealerPlayLogTable = Template.bind({})
DealerPlayLogTable.args = {
  dealers: [
    { name: '딜러 이름', tournament: '토너먼트 이름', sitInTime: '18:00:00', sitOutTime: '18:15:00', dealingTime: '15분' },
    { name: '딜러 이름', tournament: '토너먼트 이름', sitInTime: '18:00:00', sitOutTime: '18:15:00', dealingTime: '15분' },
    { name: '딜러 이름', tournament: '토너먼트 이름', sitInTime: '18:00:00', sitOutTime: '18:15:00', dealingTime: '15분' },
    { name: '딜러 이름', tournament: '토너먼트 이름', sitInTime: '18:00:00', sitOutTime: '18:15:00', dealingTime: '15분' },
    { name: '딜러 이름', tournament: '토너먼트 이름', sitInTime: '18:00:00', sitOutTime: '18:15:00', dealingTime: '15분' },
    { name: '딜러 이름', tournament: '토너먼트 이름', sitInTime: '18:00:00', sitOutTime: '18:15:00', dealingTime: '15분' },
    { name: '딜러 이름', tournament: '토너먼트 이름', sitInTime: '18:00:00', sitOutTime: '18:15:00', dealingTime: '15분' },
    { name: '딜러 이름', tournament: '토너먼트 이름', sitInTime: '18:00:00', sitOutTime: '18:15:00', dealingTime: '15분' },
  ],
}
