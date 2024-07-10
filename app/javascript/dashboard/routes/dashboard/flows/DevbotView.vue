<template>
  <div v-if="!loadingIframe" class="iframe-devbot">
    <div style="padding-left: 15px; padding-top: 2px">
      <woot-sidemenu-icon />
    </div>
    <iframe
      :src="url"
      title="Devbot"
      width="100%"
      height="100%"
      frameborder="0"
      allowfullscreen
      sandbox="allow-same-origin allow-scripts allow-top-navigation"
      @load="handleIframeLoad"
    ></iframe>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import { LocalStorage } from '../../../../shared/helpers/localStorage';

export default {
  async mounted() {
    await this.fetchTypebotToken();
  },
  data() {
    return {
      loadingIframe: true,
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
  methods: {
    async fetchTypebotToken() {
      try {
        this.loadingIframe = true;
        const { id, email } = this.currentUser;
        console.log(id, email, '@@@ 1');

        const viewBot = LocalStorage.get('view-bot-primary') || false;
        const tokenTypebot = LocalStorage.get('token_typebot') || '';
        const expirationToken = LocalStorage.get('expiration_token') || '';

        const isExpirationToken = !!expirationToken
          ? new Date(expirationToken).getTime() < new Date().getTime()
          : true;

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

        const response = await axios.get(
          `https://dev.zapclick.digital/users/typebot/${id}}`
        );
        console.log(response.data.token_typebot, '@@@ 2');

        const primaryUrl = `https://botdev.zapclick.digital/api/auth/callback/email?callbackUrl=https%3A%2F%2Fbotdev.zapclick.digital%2Fpt-BR%2Fsignin&token=${
          response.data.token_typebot
        }&email=${email.replace('@', '%40')}`;

        console.log(response.data.token_typebot, '@@@@ token_typebot');
        LocalStorage.set('token_typebot', response.data.token_typebot);
        LocalStorage.set('expiration_token', response.data.expiration_token);
        LocalStorage.set('view-bot-primary', true);

        this.url = primaryUrl;
      } catch (error) {
        console.error('Failed to fetch Typebot token:', error);
      } finally {
        this.loadingIframe = false;
      }
    },
    handleIframeLoad() {
      console.log('Iframe carregado e pronto para comunicação.');
    },
  },
};
</script>
<style>
.iframe-devbot {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
