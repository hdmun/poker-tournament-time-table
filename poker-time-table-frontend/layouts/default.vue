<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      color="gray4"
    >
      <v-list color="gray4">
        <template v-for="(item, i) in items">
          <template v-if="item.to !== undefined">
            <v-list-item :key="i" :to="item.to" router exact>
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title
                  class="small-copy-1-bold"
                  v-text="item.title"
                />
              </v-list-item-content>
            </v-list-item>
          </template>

          <template v-else>
            <v-list-group
              :key="item.title"
              :value="true"
              :prepend-icon="item.icon"
              no-action
            >
              <template #activator>
                <v-list-item-content>
                  <v-list-item-title
                    class="small-copy-1-bold"
                    v-text="item.title"
                  ></v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list-item
                v-for="child in item.subItems"
                :key="child.title"
                :to="child.to"
                class="pl-4 gray5"
                router
                exact
              >
                <v-list-item-action>
                  <v-icon>{{ child.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title
                    class="small-copy-1-bold"
                    v-text="child.title"
                  ></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </template>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="clipped" fixed app color="gray6">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn v-if="false" icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn v-if="false" icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn v-if="false" icon @click.stop="fixed = !fixed">
        <v-icon>mdi-minus</v-icon>
      </v-btn>

      <v-spacer />

      <v-toolbar-title v-text="title"> </v-toolbar-title>

      <v-spacer />
    </v-app-bar>

    <v-main class="fill-height gray8">
      <Nuxt />
    </v-main>

    <v-footer
      class="justify-center gray4--text"
      color="gray7"
      :absolute="!fixed"
      app
    >
      <span> &copy; 2022 KMGM bundangseohyeon. All rights reserved. </span>
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
  title: string = 'KMGM 서현점'

  items: NavigationItem[] = [
    {
      icon: 'mdi-trophy',
      title: '토너먼트',
      to: '/',
    },
    {
      icon: 'mdi-cog',
      title: '관리자 메뉴',
      subItems: [
        {
          icon: 'mdi-tournament',
          title: '신규 토너먼트 생성',
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
