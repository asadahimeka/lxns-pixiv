<script>
import Axios from 'axios'

export default {
  name: 'Settings',
  data: () => ({
    selectLang: 3,
    dialog: false,
    r18Dialog: false,
    r18: false,
    loginDialog: false,
    showPassword: false,
    loginPassword: null,
    loginAccount: null,
    snackbar: false,
    snackbarText: null,
    session: null,
  }),
  mounted() {
    if (localStorage.getItem('r18') !== null)
      this.r18 = localStorage.getItem('r18') === 'true'
    else
      localStorage.setItem('r18', 'false')

    if (localStorage.getItem('session') !== null)
      this.session = localStorage.getItem('session')

    if (localStorage.getItem('locale') === 'zhHans')
      this.selectLang = 0
    else if (localStorage.getItem('locale') === 'zhHant')
      this.selectLang = 1
    else if (localStorage.getItem('locale') === 'ja')
      this.selectLang = 2
  },
  methods: {
    darkMode() {
      localStorage.setItem('darkMode', this.$vuetify.theme.dark)
    },
    changeLang() {
      if (this.selectLang === 0)
        localStorage.setItem('locale', 'zhHans')
      else if (this.selectLang === 1)
        localStorage.setItem('locale', 'zhHant')
      else if (this.selectLang === 2)
        localStorage.setItem('locale', 'ja')
      else
        localStorage.setItem('locale', 'en')

      this.$i18n.locale = localStorage.getItem('locale')
      this.dialog = false
    },
    r18DialogFunc(action) {
      if (action === true) {
        localStorage.setItem('r18', 'true')
      }
      else {
        if (this.r18 === true)
          this.r18Dialog = true
        else
          localStorage.setItem('r18', 'false')
      }
    },
    loginSubmit() {
      Axios
        .post('https://pixiv-api.lxns.org/login.php', `username=${this.loginAccount}&password=${this.loginPassword}`, undefined)
        .then((res) => {
          if (res.data.status === 'success') {
            localStorage.setItem('session', res.data.session)
            this.session = res.data.session
            this.$emit('getValue', { session: this.session })
          }
          this.snackbarText = this.$i18n.t(`statusCode.${res.data.code}`)
          this.snackbar = true
        })
    },
    logout() {
      this.session = null
      localStorage.removeItem('session')
      this.$emit('getValue', { clearSession: true })
    },
  },
}
</script>

<template>
  <v-main fluid style="padding: 56px 0 0 0">
    <v-list flat>
      <!-- <v-list-item-group
        subheader
        two-line
        flat
      >
        <v-subheader>{{ $i18n.t('settings.account') }}</v-subheader>
        <v-list-item-group>
          <v-list-item v-if="session === null" @click="loginDialog = true">
            <v-list-item-content>
              <v-list-item-title>{{ $i18n.t('settings.login') }}</v-list-item-title>
              <v-list-item-subtitle>{{ $i18n.t('settings.loginDetail') }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-else @click="logout()">
            <v-list-item-content>
              <v-list-item-title>{{ $i18n.t('settings.logout') }}</v-list-item-title>
              <v-list-item-subtitle>{{ $i18n.t('settings.logoutDetail') }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-dialog v-model="loginDialog" max-width="300px">
            <v-card>
              <v-card-title class="headline">
                {{ $i18n.t('settings.loginDialog') }}
              </v-card-title>
              <v-text-field
                v-model="loginAccount"
                style="margin: 0 24px"
                :label="$i18n.t('settings.loginAccount')"
              />
              <v-text-field
                v-model="loginPassword"
                style="margin: 0 24px"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                :label="$i18n.t('settings.loginPassword')"
                @click:append="showPassword = !showPassword"
              />
              <v-card-actions>
                <v-spacer />
                <v-btn text @click="loginDialog = false">
                  {{ $i18n.t('settings.loginDialogCancel') }}
                </v-btn>
                <v-btn text @click="loginDialog = false, loginSubmit()">
                  {{ $i18n.t('settings.loginDialogSubmit') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-list-item-group>
      </v-list-item-group> -->
      <v-list-item-group
        subheader
        two-line
        flat
      >
        <v-subheader>{{ $i18n.t('settings.display') }}</v-subheader>
        <v-list-item-group>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox
                v-model="r18"
                color="primary"
                @change="r18DialogFunc()"
              />
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ $i18n.t('settings.r18') }}</v-list-item-title>
              <v-list-item-subtitle>{{ $i18n.t('settings.r18Detail') }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-dialog v-model="r18Dialog" persistent max-width="300px">
            <v-card>
              <v-card-title class="headline">
                {{ $i18n.t('settings.r18Dialog') }}
              </v-card-title>
              <v-card-text>{{ $i18n.t('settings.r18DialogContent') }}</v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn text @click="r18Dialog = false, r18 = false">
                  {{ $i18n.t('settings.r18DialogDisagree') }}
                </v-btn>
                <v-btn text @click="r18Dialog = false, r18DialogFunc(true)">
                  {{ $i18n.t('settings.r18DialogAgree') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-list-item-group>
      </v-list-item-group>
      <v-list-item-group subheader two-line flat>
        <v-subheader>{{ $i18n.t('settings.accessibility') }}</v-subheader>
        <v-list-item-group>
          <v-list-item @click="dialog = true">
            <v-list-item-icon>
              <v-icon>mdi-earth</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $i18n.t('settings.language') }}</v-list-item-title>
              <v-list-item-subtitle>{{ $i18n.t('settings.languageDetail') }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-dialog v-model="dialog" scrollable max-width="300px">
            <v-card>
              <v-card-title>{{ $i18n.t('settings.language') }}</v-card-title>
              <v-divider />
              <v-list>
                <v-list-item-group v-model="selectLang" mandatory @change="changeLang">
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>简体中文</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>繁體中文</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>日本語</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>English</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
          </v-dialog>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox
                v-model="$vuetify.theme.dark"
                color="primary"
                @change="darkMode()"
              />
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>{{ $i18n.t('settings.darkMode') }}</v-list-item-title>
              <v-list-item-subtitle>{{ $i18n.t('settings.darkModeDetail') }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list-item-group>
    </v-list>
    <v-snackbar v-model="snackbar">
      {{ snackbarText }}
      <template #action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          {{ $i18n.t('close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </v-main>
</template>

<style scoped>

</style>
