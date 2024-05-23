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
      <button>
        <a :href="getUrlTypebot" target="_blank">BOT</a>
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
      typebotToken: null,
      typebotEmail: '',
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: 'getCurrentUser',
    }),
    getUrlTypebot() {
      if (!this.typebotToken || !this.typebotEmail) return '';

      const url = `http://botdev.zapclick.digital:3000/api/auth/callback/email?callbackUrl=http%3A%2F%2Fbotdev.zapclick.digital%3A3000%2Fpt-BR%2Fregister&amp;token=${
        this.typebotToken
      }&amp;email=${this.typebotEmail.replace('@', '%40')}`;
      return url;
    },
  },
  async mounted() {
    this.createTypebotToken();
  },
  methods: {
    frontendURL,
    toggleOptions() {
      this.showOptionsMenu = !this.showOptionsMenu;
    },
    toggleAccountModal() {
      this.$emit('toggle-accounts');
    },
    toggleSupportChatWindow() {
      window.$chatwoot.toggle();
    },
    openNotificationPanel() {
      this.$track(ACCOUNT_EVENTS.OPENED_NOTIFICATIONS);
      this.$emit('open-notification-panel');
    },
    async createTypebotToken() {
      await axios
        .get('https://botdev.zapclick.digital/api/auth/providers')
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });

      const response = await axios.get(
        'https://botdev.zapclick.digital/api/auth/csrf',
        {
          headers: {
            Accept: '*/*',
            'Accept-Language': 'pt-BR,pt;q=0.9',
            Connection: 'keep-alive',
            'Content-Type': 'application/json',
            Cookie:
              '__Secure-next-auth.callback-url=https%3A%2F%2Fbotdev.zapclick.digital; __Host-next-auth.csrf-token=046f05d5abbaead854c547548323f77f31912d0a452477d7fe621c005123fdeb%7Cfa20eea0063398e0aa1ed6a47afd9fe31e46bf77b769636ad5961e8cdc4ac3c9',
            Referer: 'https://botdev.zapclick.digital/pt-BR/signin',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'User-Agent':
              'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'sec-ch-ua':
              '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Linux"',
          },
        }
      );
      console.log(response.data.csrfToken, '@@@ response');

      const { email } = this.currentUser;

      const formData = new FormData();
      formData.append('email', email);
      formData.append('csrfToken', response.data.csrfToken);
      formData.append('redirect', false);
      formData.append(
        'callbackUrl',
        'https://botdev.zapclick.digital/pt-BR/signin'
      );
      formData.append('json', true);

      const x = await axios.post(
        'https://botdev.zapclick.digital/api/auth/signin/email',
        formData,
        {
          headers: {
            cookie:
              'next-auth.callback-url=http%253A%252F%252Fbotdev.zapclick.digital%253A3000%252Fpt-BR%252Fsignin%253FredirectPath%253D%25252Ftypebots; next-auth.csrf-token=a305722528b497223f9e72a8f2bd8fc9eb6cbdf7b7db67cb17208b6a195ab149%257C014ffba229921ac1d0c99fe9af8652a53aa56378a0a081d8bb085ebdad173bdd; __Host-next-auth.csrf-token=e11293c4a587d9a528589f7c89e87bf43995bc9261f61638ffd876b7c7680a73%257C860db6daeda5d346c42384347ff720c39b8b318919905f0b7f1b33061ce33cba; __Secure-next-auth.callback-url=https%253A%252F%252Fbotdev.zapclick.digital%252Fpt-BR%252Fsignin',
            Accept: '*/*',
            'Accept-Language': 'pt-BR,pt;q=0.9',
            Connection: 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            Cookie:
              '__Secure-next-auth.callback-url=https%3A%2F%2Fbotdev.zapclick.digital; __Host-next-auth.csrf-token=6cbff3080e296b76754f41475d228b0fa70a4558874f6b93a9a103f403cc526e%7Cf2a658ed795176a8df2fe50228b40406cce7b2ecd86f017d5315c097f83ab46e',
            Origin: 'https://botdev.zapclick.digital',
            Referer: 'https://botdev.zapclick.digital/pt-BR/signin',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'User-Agent':
              'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'sec-ch-ua':
              '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Linux"',
          },
        }
      );

      axios.get('https://botdev.zapclick.digital/api/auth/session', {
        headers: {
          cookie:
            'next-auth.callback-url=http%253A%252F%252Fbotdev.zapclick.digital%253A3000%252Fpt-BR%252Fsignin%253FredirectPath%253D%25252Ftypebots; next-auth.csrf-token=a305722528b497223f9e72a8f2bd8fc9eb6cbdf7b7db67cb17208b6a195ab149%257C014ffba229921ac1d0c99fe9af8652a53aa56378a0a081d8bb085ebdad173bdd; __Host-next-auth.csrf-token=e11293c4a587d9a528589f7c89e87bf43995bc9261f61638ffd876b7c7680a73%257C860db6daeda5d346c42384347ff720c39b8b318919905f0b7f1b33061ce33cba; __Secure-next-auth.callback-url=https%253A%252F%252Fbotdev.zapclick.digital%252Fpt-BR%252Fsignin',
          Accept: '*/*',
          'Accept-Language': 'pt-BR,pt;q=0.9',
          Connection: 'keep-alive',
          'Content-Type': 'application/json',
          Cookie:
            '__Secure-next-auth.callback-url=https%3A%2F%2Fbotdev.zapclick.digital; __Host-next-auth.csrf-token=046f05d5abbaead854c547548323f77f31912d0a452477d7fe621c005123fdeb%7Cfa20eea0063398e0aa1ed6a47afd9fe31e46bf77b769636ad5961e8cdc4ac3c9',
          Referer: 'https://botdev.zapclick.digital/pt-BR/signin',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'sec-ch-ua':
            '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Linux"',
        },
      });
      console.log(x, '@@@ x');
    },
    /* async fetchTypebotToken() {
      this.isLoading = true;
      try {
        const { id, email } = this.currentUser;
        const response = await axios.get(
          `https://dev.zapclick.digital/users/typebot/${id}}`
        );
        this.typebotToken = response.data.token_typebot;
        this.typebotEmail = email;
        console.log(response.data.token_typebot, "@@@ token")
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch Typebot token:', error);
      } finally {
        this.isLoading = false;
      }
    }, */
  },
};
</script>
