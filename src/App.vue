<script>
import {
  mdiHome,
  mdiInformation,
  mdiCog,
} from '@mdi/js'

export default {
  name: 'App',
  data: () => ({
    mdiHome,
    mdiInformation,
    mdiCog,
    drawer: null,
    headerSrc: null,
    proxyUrl: 'https://lxns.org/proxy.php?type=pixiv&header=image/png&link=',
    isDark: localStorage.getItem('darkMode') === 'true',
  }),
  watch: {
    $route() {
      // console.log(to.path)
      // console.log(from.path)
      this.headerSrc = null
    },
  },
  methods: {
    getValueFunc(text) { // 子部件传参
      if (text.headerSrc !== null) { this.headerSrc = text.headerSrc }

      if (text.session !== null) { this.session = text.session }

      if (text.clearSession !== null) {
        if (text.clearSession === true) { this.session = null }
      }
    },
    toPath(path) {
      this.headerSrc = null
      if (this.$route.path !== path) { this.$router.push({ path }) }
    },
    darkMode() {
      localStorage.setItem('darkMode', (!this.isDark).toString())
      this.isDark = !this.isDark
    },
  },
}
</script>

<template>
  <div id="app">
    <v-app
      id="inspire"
      v-touch="{
        right: () => drawer = true,
        left: () => drawer = false,
      }"
      :dark="isDark"
    >
      <v-navigation-drawer
        v-model="drawer"
        app
        fixed
        temporary
      >
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">
              Pixiv Lxns
            </v-list-item-title>
            <v-list-item-subtitle>
              Modified version
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list
          dense
          nav
        >
          <v-list-item-group color="primary">
            <v-list-item
              link
              @click="toPath('/')"
            >
              <v-list-item-icon>
                <v-icon>{{ mdiHome }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ $i18n.t('header.homePage') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              link
              @click="toPath('/about')"
            >
              <v-list-item-icon>
                <v-icon>{{ mdiInformation }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ $i18n.t('header.aboutPage') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              link
              @click="toPath('/settings')"
            >
              <v-list-item-icon>
                <v-icon>{{ mdiCog }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ $i18n.t('header.settingsPage') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-divider />
        <v-list
          dense
          nav
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ $i18n.t('header.darkMode') }}</v-list-item-title>
            </v-list-item-content>
            <v-switch
              v-model="$vuetify.theme.dark"
              style="margin-top: -4px;"
              hide-details
              inset
              @change="darkMode()"
            />
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <div>
        <v-app-bar
          v-if="!headerSrc"
          app
          elevate-on-scroll
          :color="$vuetify.theme.dark ? '' : 'deep-purple lighten-1'"
          dark
          height="56px"
        >
          <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
          <v-toolbar-title
            style="width: 300px"
            class="ml-0 pl-4"
          >
            <span>Pixiv Lxns</span>
          </v-toolbar-title>
        </v-app-bar>
        <v-app-bar
          v-else
          app
          elevate-on-scroll
          color="blue darken-3"
          dark
          :src="proxyUrl + headerSrc"
        >
          <template #img="{ props }">
            <v-img
              v-bind="props"
              gradient="to top, rgba(0,0,0,.2), rgba(0,0,0,.2)"
            />
          </template>
          <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
          <v-toolbar-title
            style="width: 300px;"
            class="ml-0 pl-4"
          >
            <span>Pixiv Lxns</span>
          </v-toolbar-title>
        </v-app-bar>
      </div>
      <div>
        <keep-alive>
          <router-view
            v-if="$route.meta.keepAlive"
            @get-value="getValueFunc"
          />
        </keep-alive>
        <router-view
          v-if="!$route.meta.keepAlive"
          @get-value="getValueFunc"
        />
      </div>
    </v-app>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
