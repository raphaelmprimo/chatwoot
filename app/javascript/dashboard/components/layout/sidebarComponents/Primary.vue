<template>
  <div
    class="h-full w-16 bg-white dark:bg-slate-900 border-r border-slate-50 dark:border-slate-800/50 rtl:border-l rtl:border-r-0 flex justify-between flex-col"
  >
    <div class="flex flex-col items-center">
      <logo
        :source="logoSource"
        :name="installationName"
        :account-id="accountId"
        class="m-4 mb-10"
      />
      <button :disabled="isLoading" @click="updateUrl">
        <a :href="url" target="_blank">BOT</a>
      </button>
      <primary-nav-item
        v-for="menuItem in menuItems"
        :key="menuItem.toState"
        :icon="menuItem.icon"
        :name="menuItem.label"
        :to="menuItem.toState"
        :is-child-menu-active="menuItem.key === activeMenuItem"
      />
    </div>
    <div class="flex flex-col items-center justify-end pb-6">
      <primary-nav-item
        v-if="!isACustomBrandedInstance"
        icon="book-open-globe"
        name="DOCS"
        :open-in-new-page="true"
        :to="helpDocsURL"
      />
      <notification-bell @open-notification-panel="openNotificationPanel" />
      <agent-details @toggle-menu="toggleOptions" />
      <options-menu
        :show="showOptionsMenu"
        @toggle-accounts="toggleAccountModal"
        @show-support-chat-window="toggleSupportChatWindow"
        @key-shortcut-modal="$emit('key-shortcut-modal')"
        @close="toggleOptions"
      />
    </div>
  </div>
</template>
<script>
import Logo from './Logo.vue';
import PrimaryNavItem from './PrimaryNavItem.vue';
import OptionsMenu from './OptionsMenu.vue';
import AgentDetails from './AgentDetails.vue';
import NotificationBell from './NotificationBell.vue';
import wootConstants from 'dashboard/constants/globals';
import { frontendURL } from 'dashboard/helper/URLHelper';
import { ACCOUNT_EVENTS } from '../../../helper/AnalyticsHelper/events';
import { mapGetters } from 'vuex';
import axios from 'axios';
import { LocalStorage } from '../../../../shared/helpers/localStorage';

export default {
  components: {
    Logo,
    PrimaryNavItem,
    OptionsMenu,
    AgentDetails,
    NotificationBell,
  },
  props: {
    isACustomBrandedInstance: {
      type: Boolean,
      default: false,
    },
    logoSource: {
      type: String,
      default: '',
    },
    installationName: {
      type: String,
      default: '',
    },
    accountId: {
      type: Number,
      default: 0,
    },
    menuItems: {
      type: Array,
      default: () => [],
    },
    activeMenuItem: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      helpDocsURL: wootConstants.DOCS_URL,
      showOptionsMenu: false,
      typebotToken: '',
      typebotEmail: '',
      isLoading: false,
      url: '',
    };
  },
  computed: {
    ...mapGetters({
      currentUser: 'getCurrentUser',
    }),
  },
  async mounted() {
    await this.fetchTypebotToken();
    console.log('test mounted @@@');

    await this.createApiTokenTypebot();
  },
  methods: {
    frontendURL,
    toggleOptions() {
      this.showOptionsMenu = !this.showOptionsMenu;
    },
    toggleAccountModal() {
      this.$emit('toggle-accounts');
    },
    getUrlTypebot() {
      const urlTypebot = 'https://botdev.zapclick.digital/pt-BR/typebots';
      console.log(this.typebotToken, this.typebotEmail, "@@@ getUrlTypebot")
      if (!this.typebotToken || !this.typebotEmail) return urlTypebot;

      const viewBot = LocalStorage.get('view-bot-primary') || false;
      console.log(viewBot, 'viewBot');
      const primaryUrl = `https://botdev.zapclick.digital/api/auth/callback/email?callbackUrl=https%3A%2F%2Fbotdev.zapclick.digital%2Fpt-BR%2Fsignin&token=${
        this.typebotToken
      }&email=${this.typebotEmail.replace('@', '%40')}`;

      const newUrl = viewBot ? urlTypebot : primaryUrl;
      console.log(newUrl, 'newUrl');

      LocalStorage.set('view-bot-primary', true);
      console.log('@@@@ chamou axios get post');

      return newUrl;
    },
    updateUrl() {
      this.url = this.getUrlTypebot();
    },
    toggleSupportChatWindow() {
      window.$chatwoot.toggle();
    },
    openNotificationPanel() {
      this.$track(ACCOUNT_EVENTS.OPENED_NOTIFICATIONS);
      this.$emit('open-notification-panel');
    },
    async createApiTokenTypebot() {
      try {
        const { id, email } = this.currentUser;

        const responseNew = await axios.get(
          `https://dev.zapclick.digital/users/typebot/${id}}`
        );

        if (
          !!responseNew.data.token_typebot &&
          !responseNew.data.api_token_typebot
        ) {
          const primaryUrl = `https://botdev.zapclick.digital/api/auth/callback/email?callbackUrl=https%3A%2F%2Fbotdev.zapclick.digital%2Fpt-BR%2Fsignin&token=${
            responseNew.data.token_typebot
          }&email=${email.replace('@', '%40')}`;

          await axios.post(
            'https://botdev.zapclick.digital/api/auth/api-token-devbot',
            {
              url: primaryUrl,
            },
            {
              timeout: 80000,
              headers: {
                Authorization: 'a8Fj4G7Kd9L2mO1Qp6RzVw3',
                Accept: '*/*',
                'Accept-Language': 'pt-BR,pt;q=0.9',
                Connection: 'keep-alive',
                'Content-Type': 'application/json',
                Origin: 'https://botdev.zapclick.digital',
                Referer: 'https://botdev.zapclick.digital/pt-BR/signin',
                'Sec-Fetch-Mode': 'cors',
              },
            }
          );
        }
      } catch (error) {
        console.error(error, '@@@ error');
      }
    },
    async fetchTypebotToken() {
      try {
        this.isLoading = true;

        const { id, email } = this.currentUser;
        const response = await axios.get(
          `https://dev.zapclick.digital/users/typebot/${id}}`
        );
        this.typebotToken = response.data.token_typebot;
        this.typebotEmail = email;
        console.log(response.data.token_typebot, email, '@@@ email');

        const expirationToken =
          new Date(response.data.expiration_token).getTime() <
          new Date().getTime();

        const viewBot = LocalStorage.get('view-bot-primary') || false;

        if (!response.data.expiration_token || expirationToken || !viewBot) {
          await axios.post(
            'https://botdev.zapclick.digital/api/auth/signtype',
            {
              email,
            },
            {
              timeout: 60000,
              headers: {
                Authorization: 'a8Fj4G7Kd9L2mO1Qp6RzVw3',
                Accept: '*/*',
                'Accept-Language': 'pt-BR,pt;q=0.9',
                Connection: 'keep-alive',
                'Content-Type': 'application/json',
                Origin: 'https://botdev.zapclick.digital',
                Referer: 'https://botdev.zapclick.digital/pt-BR/signin',
                'Sec-Fetch-Mode': 'cors',
              },
            }
          );
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch Typebot token:', error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
