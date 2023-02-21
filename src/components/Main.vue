<script>
import dayjs from 'dayjs'
import { getWindowHeight, getWindowWidth } from '@/utils/screen'
import request from '@/utils/request'

export default {
  name: 'MainContainer',
  props: {
    source: String,
    attrs: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    drawer: null,
    page: 1,
    loading: true,
    loaded: false,
    list: [],
    hidden: true,
    dialog: false,
    dialogId: null,
    pageId: 0,
    overlay: false,
    maxHeight: getWindowHeight(),
    maxWidth: getWindowWidth(),
    mode: 'day',
    date: dayjs().subtract(2, 'days').format('YYYY-MM-DD'),
    maxDate: dayjs().subtract(2, 'days').format('YYYY-MM-DD'),
    scrollTop: 0,
    scrollTopDefault: 0,
    searchContent: null,
    dateSort: 'date_desc',
    searchType: 'partial_match_for_tags',
    searchUrl: null,
    errorContent: null,
    filter: false,
    filterPanel: [],
    cardCol: 1,
    share: false,
    shareId: 0,
    session: localStorage.getItem('session'),
    r18: false,
    isPageInit: true,
    fullRankModes: [
      { value: 'day', text: '日榜' },
      { value: 'week', text: '周榜' },
      { value: 'month', text: '月榜' },
      { value: 'day_male', text: '男性向' },
      { value: 'day_female', text: '女性向' },
      { value: 'week_original', text: '原创' },
      { value: 'week_rookie', text: '新人' },
      { value: 'day_ai', text: 'AI' },
      { value: 'day_r18', text: 'R18 日' },
      { value: 'day_male_r18', text: 'R18 男' },
      { value: 'day_female_r18', text: 'R18 女' },
      { value: 'week_r18', text: 'R18 周' },
      { value: 'week_r18g', text: 'R18G 周 ' },
      { value: 'day_r18_ai', text: 'R18 AI' },
    ],
    masonryCols: {
      300: 1,
      600: 2,
      900: 3,
      1200: 4,
      1600: 5,
      1920: 6,
      2400: 7,
      2700: 8,
      3000: 9,
      default: 6,
    },
  }),
  computed: {
    rankModes() {
      return this.r18
        ? this.fullRankModes
        : this.fullRankModes.filter(e => !e.value.includes('r18'))
    },
  },
  mounted() {
    request
      .get(`/rank?page=1&date=${this.date}&mode=${this.mode}`)
      .then(res => {
        if (res.data.code === -1) {
          this.errorContent = this.$i18n.t('errorContent.needLogin')
          this.loaded = true
          return
        }
        if (!res.data.illusts?.length) {
          this.errorContent = this.$i18n.t('errorContent.failedGetRankOfDay')
          this.loaded = true
        } else {
          this.list = res.data.illusts
          this.isPageInit = false
        }
      })
    this.$emit('getValue', { headerSrc: null })
    this.handleResize()
  },
  created() {
    this.page = 1
    this.loaded = false
    this.loading = false
    window.addEventListener('resize', this.handleResize)
  },
  unmounted() {
    window.removeEventListener('resize', this.handleResize)
  },
  activated() {
    if (localStorage.getItem('r18') !== null) { this.r18 = localStorage.getItem('r18') === 'true' } else { localStorage.setItem('r18', 'false') }

    this.$emit('getValue', { headerSrc: null })
  },
  methods: {
    handleScroll(_ev, _ob, isIntersecting) {
      if (this.$route.path !== '/') return
      if (this.isPageInit) {
        if (this.page == 1) this.isPageInit = false
        return
      }
      if (this.loading || this.loaded || !isIntersecting) return
      this.loading = true
      this.page += 1
      let reqUrl
      if (this.searchContent) {
        reqUrl = `/search?word=${this.searchContent}&order=${this.dateSort}&mode=${this.searchType}&page=${this.page}`
      } else {
        reqUrl = `/rank?page=${this.page}&date=${this.date}&mode=${this.mode}`
      }
      setTimeout(() => {
        request
          .get(reqUrl)
          .then(res => {
            this.loading = false
            if (res.data.illusts?.length > 0) {
              this.list = [
                ...this.list,
                ...res.data.illusts,
              ]
            } else {
              this.loaded = true
            }
          }).catch(error => {
            console.log('error: ', error)
            this.loading = false
          })
      }, 200)
    },
    handleResize() {
      this.maxHeight = getWindowHeight()
      this.maxWidth = getWindowWidth()
    },
    clearContent() {
      this.page = 1
      this.isPageInit = true
      this.errorContent = null
      this.loaded = false
      this.list = []
    },
    backToRank() {
      this.searchContent = ''
      this.onModeChange()
    },
    onModeChange() {
      this.getRankFromDate()
    },
    getRankFromDate() {
      this.filter = false
      this.filterPanel = []
      this.clearContent()
      request
        .get(`/rank?page=${this.page}&date=${this.date}&mode=${this.mode}`)
        .then(res => {
          this.list = res.data.illusts
          if (res.data.illusts?.length > 0) {
            this.list = res.data.illusts
          } else {
            this.errorContent = this.$i18n.t('errorContent.failedGetRankOfDay')
            this.loaded = true
          }
        })
    },
    searchTerm() {
      this.clearContent()
      request
        .get(`/search?word=${this.searchContent}&order=${this.dateSort}&mode=${this.searchType}&page=1`)
        .then(res => {
          this.list = res.data.illusts
        })
    },
    filterExpand() {
      this.filter = !this.filter
      if (this.filter === false) { this.filterPanel = [] } else { this.filterPanel = [...Array(1).keys()].map((k, i) => i) }
    },
    toPath(path) {
      this.dialog = false
      this.pageId = 0
      if (this.$route.path !== path) { this.$router.push({ path }) }
    },
    toUrl(url) {
      window.open(url, '_blank')
    },
    copyToClipboard(str) {
      const el = document.createElement('textarea')
      el.addEventListener('focusin', e => e.stopPropagation())
      el.value = str
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    },
  },
}
</script>

<template>
  <v-main fluid style="padding: 70px 12px 12px 12px">
    <v-card style="margin-bottom: 12px;">
      <v-text-field
        v-model="searchContent"
        :placeholder="$i18n.t('search')"
        solo
        flat
        style="height: 48px"
        @keyup.enter="searchTerm"
      />
      <v-toolbar flat height="0px">
        <v-spacer />
        <v-btn
          v-if="searchContent"
          absolute
          icon
          text
          style="float: right; right: 96px; top: -48px;"
          @click="backToRank"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-btn
          absolute
          icon
          text
          style="float: right; right: 48px; top: -48px;"
          :disabled="!searchContent"
          @click="searchTerm"
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-btn
          absolute
          icon
          text
          style="float: right; right: 12px; top: -48px;"
          :color="filter ? 'pink' : ''"
          @click="filterExpand"
        >
          <v-icon>mdi-filter</v-icon>
        </v-btn>
      </v-toolbar>
      <v-expansion-panels v-model="filterPanel" flat hover multiple>
        <v-expansion-panel :key="1">
          <v-expansion-panel-content>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <p>{{ $i18n.t('dateSort') }}</p>
                <v-radio-group v-model="dateSort" :mandatory="false">
                  <v-radio :label="$i18n.t('dateSortDesc')" value="date_desc" />
                  <v-radio :label="$i18n.t('dateSortAsc')" value="date_asc" />
                </v-radio-group>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <p>{{ $i18n.t('searchType') }}</p>
                <v-radio-group v-model="searchType" :mandatory="false">
                  <v-radio :label="$i18n.t('partialMatchForTags')" value="partial_match_for_tags" />
                  <v-radio :label="$i18n.t('exactMatchForTags')" value="exact_match_for_tags" />
                  <v-radio :label="$i18n.t('titleAndCaption')" value="title_and_caption" />
                </v-radio-group>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
    <div v-if="!searchContent" class="d-flex justify-end">
      <v-select
        v-model="mode"
        solo
        hide-details
        :label="$i18n.t('rankType')"
        :items="rankModes"
        @change="onModeChange"
      />

      <v-menu>
        <template #activator="{ on }">
          <v-text-field
            v-model="date"
            class="mt-0 pt-0 ml-5"
            style="max-width: 25%;"
            prepend-icon="mdi-calendar"
            hide-details
            readonly
            solo
            v-on="on"
          />
        </template>
        <v-date-picker
          v-model="date"
          no-title
          :max="maxDate"
          @change="getRankFromDate"
        />
      </v-menu>
    </div>
    <v-dialog
      v-if="dialogId != null && list[dialogId] != null"
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card style="overflow-x: hidden;">
        <v-toolbar
          dark
          color="primary"
          style="position: absolute; width: 100%; z-index: 1; background-color: rgba(0,0,0,0) !important; box-shadow: none;"
        >
          <v-btn icon dark @click="dialog = false, pageId = 0">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ $i18n.t('illustInfo') }}</v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="share = true, shareId = list[dialogId].id">
            <v-icon>mdi-share-variant</v-icon>
          </v-btn>
          <v-btn icon dark @click="toPath(`/artworks/${list[dialogId].id}`)">
            <v-icon>mdi-open-in-new</v-icon>
          </v-btn>
        </v-toolbar>
        <v-row>
          <v-carousel
            v-if="list[dialogId].meta_pages != null && list[dialogId].meta_pages.length > 0"
            v-model="pageId"
            class="grey lighten-2"
          >
            <v-carousel-item
              v-for="(urls, t) in list[dialogId].meta_pages"
              :key="t"
              :src="`https://lxns.org/proxy.php?type=pixiv&link=${urls.image_urls.large}`"
              contain
              reverse-transition="fade-transition"
              transition="fade-transition"
              gradient="to top, rgba(0,0,0,0), rgba(0,0,0,.1)"
              @click="overlay = true"
            >
              <template #placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey lighten-5" />
                </v-row>
              </template>
            </v-carousel-item>
          </v-carousel>
          <v-img
            v-else
            :src="`https://lxns.org/proxy.php?type=pixiv&link=${list[dialogId].image_urls.large}`"
            aspect-ratio="1"
            contain
            class="grey lighten-2"
            max-height="500"
            style="cursor: zoom-in; width: calc(100% - 12px);"
            gradient="to top, rgba(0,0,0,0), rgba(0,0,0,.1)"
            @click="overlay = !overlay"
          >
            <template #placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5" />
              </v-row>
            </template>
          </v-img>
        </v-row>
        <div v-if="overlay">
          <v-overlay :value="overlay">
            <img
              v-if="list[dialogId].meta_pages != null && list[dialogId].meta_pages.length > 0"
              :alt="`${list[dialogId].title}_${pageId}`"
              :src="`https://lxns.org/proxy.php?type=pixiv&link=${list[dialogId].meta_pages[pageId].image_urls.original}`"
              :style="`cursor: zoom-out; max-height: ${maxHeight}px; max-width: ${maxWidth}px; display: block;`"
              loading="lazy"
              @click="overlay = false"
            >
            <img
              v-else
              :alt="list[dialogId].title"
              :src="`https://lxns.org/proxy.php?type=pixiv&link=${list[dialogId].meta_single_page.original_image_url}`"
              :style="`cursor: zoom-out; max-height: ${maxHeight}px; max-width: ${maxWidth}px; display: block;`"
              loading="lazy"
              @click="overlay = false"
            >
          </v-overlay>
        </div>
        <v-list two-line subheader>
          <v-card-title>{{ list[dialogId].title }}</v-card-title>
          <v-card-subtitle v-html="list[dialogId].caption" />
          <div style="margin-left: 8px;">
            <v-chip v-for="(tags, j) in list[dialogId].tags" :key="j" class="ma-2" label>
              {{ tags.name }}
            </v-chip>
          </div>
          <div style="margin-left: 8px;">
            <v-tooltip bottom>
              <template #activator="{ on }">
                <v-chip class="ma-2" v-on="on">
                  <v-avatar left>
                    <v-icon>mdi-eye</v-icon>
                  </v-avatar>
                  {{ list[dialogId].total_view }}
                </v-chip>
              </template>
              <span>{{ $i18n.t('view') }}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template #activator="{ on }">
                <v-chip class="ma-2" v-on="on">
                  <v-avatar left>
                    <v-icon>mdi-heart</v-icon>
                  </v-avatar>
                  {{ list[dialogId].total_bookmarks }}
                </v-chip>
              </template>
              <span>{{ $i18n.t('favourite') }}</span>
            </v-tooltip>
          </div>
          <v-card-subtitle>{{ list[dialogId].create_date }}</v-card-subtitle>
          <v-divider />
          <v-list-item @click="toPath(`/users/${list[dialogId].user.id}`)">
            <v-list-item-avatar size="48">
              <v-img
                class="grey lighten-2"
                :src="`https://lxns.org/proxy.php?type=pixiv&link=${list[dialogId].user.profile_image_urls.medium}`"
              />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-html="list[dialogId].user.name" />
              <v-list-item-subtitle v-html="`@${list[dialogId].user.account}`" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
    <v-bottom-sheet v-if="shareId !== 0" v-model="share" inset>
      <v-list>
        <v-subheader>{{ $i18n.t('shareTo') }}</v-subheader>
        <v-list-item @click="share = false, copyToClipboard(`https://lxns.pixiv.pics/artworks/${shareId}`)">
          <v-list-item-avatar>
            <v-avatar size="32px" tile>
              <v-icon>mdi-link</v-icon>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-title>{{ $i18n.t('copyLink') }}</v-list-item-title>
          <v-list-item-subtitle>https://lxns.pixiv.pics/artworks/{{ shareId }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item
          @click="share = false, toUrl(`https://lxns.org/proxy.php?type=pixiv&dl=true&link=${list[dialogId].meta_single_page.original_image_url}`)"
        >
          <v-list-item-avatar>
            <v-avatar size="32px" tile>
              <v-icon>mdi-download</v-icon>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-title>{{ $i18n.t('save') }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-bottom-sheet>
    <div style="margin-top: 56px;">
      <masonry
        :cols="masonryCols"
        :gutter="10"
      >
        <template v-for="(item, i) in list">
          <v-card
            v-if="r18 || (!r18 && !item.x_restrict)"
            :key="i"
            class="mb-3"
            style="min-height: 100px;max-height: 60vh;"
          >
            <v-img
              :src="`https://lxns.org/proxy.php?type=pixiv&link=${item.image_urls.medium}`"
              :aspect-ratio="item.width / item.height"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            >
              <v-card-title v-text="item.title" />
              <template #placeholder>
                <v-row
                  class="fill-height ma-0"
                  align="center"
                  justify="center"
                >
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  />
                </v-row>
              </template>
            </v-img>
            <v-card-actions>
              <v-chip
                v-if="item.x_restrict"
                class="ma-2"
                style="margin: 0 !important;"
                color="red"
                text-color="white"
              >
                R18
              </v-chip>
              <v-chip
                v-if="item.illust_ai_type == 2"
                class="ma-2"
                style="margin: 0 !important;"
                color="red"
                text-color="white"
              >
                AI
              </v-chip>
              <v-spacer />
              <v-btn icon @click.stop="share = true, shareId = item.id, dialogId = i">
                <v-icon>mdi-share-variant</v-icon>
              </v-btn>
              <v-btn icon @click.stop="dialog = true, dialogId = i">
                <v-icon>mdi-open-in-app</v-icon>
              </v-btn>
              <v-btn icon @click.stop="toPath(`/artworks/${item.id}`)">
                <v-icon>mdi-open-in-new</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </masonry>
    </div>
    <v-alert v-if="errorContent !== null" border="right" colored-border type="error" elevation="2">
      {{ errorContent }}
    </v-alert>
    <div v-if="loading" class="text-center" style="margin-top: 12px;">
      <v-progress-circular indeterminate color="primary" />
    </div>
    <div v-if="loaded" class="text-center" style="margin-top: 40px;">
      <p>没有了</p>
    </div>
    <v-fab-transition>
      <v-btn
        v-if="page > 1"
        color="pink"
        dark
        fab
        style="position: fixed; right: 24px; bottom: 24px;"
        @click="$vuetify.goTo(0, {
          duration: 400,
          offset: 0,
          easing: 'easeInOutCubic',
        })"
      >
        <v-icon>mdi-arrow-up</v-icon>
      </v-btn>
    </v-fab-transition>
    <div
      v-intersect.quiet="{
        handler: handleScroll,
        options: {
          rootMargin: '0px 0px 500px 0px',
          threshold: [0],
        },
      }"
      style="height: 40px;"
    ></div>
  </v-main>
</template>
