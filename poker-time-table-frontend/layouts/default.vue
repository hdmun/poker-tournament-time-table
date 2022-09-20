<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <template v-for="(item, i) in items">
          <template v-if="item.to !== undefined">
            <v-list-item :key="i" :to="item.to" router exact>
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="item.title" />
              </v-list-item-content>
            </v-list-item>
          </template>

          <template v-else>
            <v-list-group
              :key="item.title"
              v-model="item.active"
              :prepend-icon="item.icon"
              no-action
            >
              <template #activator>
                <v-list-item-content>
                  <v-list-item-title v-text="item.title"></v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list-item
                v-for="child in item.subItems"
                :key="child.title"
                :to="child.to"
                router
                exact
              >
                <v-list-item-content>
                  <v-list-item-title v-text="child.title"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </template>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn v-if="false" icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn v-if="false" icon @click.stop="fixed = !fixed">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn v-if="false" icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <Nuxt />
    </v-main>

    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

interface NavigationItem {
  icon: string
  title: string
  to?: string
  subItems?: NavigationItem[]
  active?: boolean
}

@Component({
  components: {},
})
export default class DefaultLayout extends Vue {
  name: string = 'DefaultLayout'
  clipped: boolean = false
  drawer: boolean = false
  fixed: boolean = false
  miniVariant: boolean = false
  right: boolean = true
  rightDrawer: boolean = false
  title: string = 'KMGM 서현점'

  items: NavigationItem[] = [
    {
      icon: 'mdi-apps',
      title: '토너먼트',
      to: '/',
    },
    {
      icon: 'mdi-cog',
      title: '관리자 메뉴',
      subItems: [
        {
          icon: 'mdi-tournament',
          title: '토너먼트 편집',
          to: '/admin/tournament',
        },
        {
          icon: 'mdi-poker-chip',
          title: '블라인드 템플릿',
          to: '/admin/blindStructure',
        },
      ],
    },
  ]
}
</script>
