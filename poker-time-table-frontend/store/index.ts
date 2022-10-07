import { Store } from 'vuex'
import { createProxy, extractVuexModule } from 'vuex-class-component'
import AdminBlindStructureStore from './admin/blindStructure'

import AdminTournamentStore from './admin/tournament'

const store = new Store({
  modules: {
    ...extractVuexModule(AdminBlindStructureStore),
    ...extractVuexModule(AdminTournamentStore),
  },
})

// Creating proxies.
export const vxm = {
  blindTemplate: createProxy(store, AdminBlindStructureStore),
  tournament: createProxy(store, AdminTournamentStore),
}
