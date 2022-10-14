import { Store } from 'vuex'
import { createProxy, extractVuexModule } from 'vuex-class-component'
import AdminBlindStructureStore from './admin/blindStructure'
import AdminDealerStore from './admin/dealer'

import AdminTournamentStore from './admin/tournament'

const store = new Store({
  modules: {
    ...extractVuexModule(AdminBlindStructureStore),
    ...extractVuexModule(AdminDealerStore),
    ...extractVuexModule(AdminTournamentStore),
  },
})

// Creating proxies.
export const vxm = {
  blindTemplate: createProxy(store, AdminBlindStructureStore),
  dealer: createProxy(store, AdminDealerStore),
  tournament: createProxy(store, AdminTournamentStore),
}
