import { Store } from 'vuex'
import { createProxy, extractVuexModule } from 'vuex-class-component'

import AdminTournamentStore from './admin/tournament'

const store = new Store({
  modules: {
    ...extractVuexModule(AdminTournamentStore),
  },
})

// Creating proxies.
export const vxm = {
  tournament: createProxy(store, AdminTournamentStore),
}
