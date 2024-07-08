<template>
  <div v-if="!loadingIframe" class="iframe-devbot">
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
    await this.fetchTypebots();
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
  async mounted() {
    await this.fetchTypebotToken();
    console.log('test mounted @@@');

    await this.createApiTokenTypebot();
  },
  methods: {
    async createApiTokenTypebot() {
      try {
        const { id, email } = this.currentUser;

        const responseNew = await axios.get(
          `https://dev.zapclick.digital/users/typebot/${3}}`
        );

        if (
          !!responseNew.data.token_typebot &&
          !responseNew.data.api_token_typebot
        ) {
          const primaryUrl = `https://botdev.zapclick.digital/api/auth/callback/email?callbackUrl=https://botdev.zapclick.digital/pt-BR/signin&token=${responseNew.data.token_typebot}&email=${email.replace('@', '%40')}`;

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
        this.loadingIframe = true;
        console.log('@@@ chamou fetch');
        const { id, email } = this.currentUser;

        const response = await axios.get(
          `https://dev.zapclick.digital/users/typebot/${id}}`
        );

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

          const primaryUrl = `https://botdev.zapclick.digital/api/auth/callback/email?callbackUrl=https%3A%2F%2Fbotdev.zapclick.digital%2Fpt-BR%2Fsignin&token=${
            response.data.token_typebot
          }&email=${email.replace('@', '%40')}`;

          console.log(response.data.token_typebot, '@@@@ token_typebot');

          LocalStorage.set('view-bot-primary', true);

          this.url = primaryUrl;
        }

        this.url = 'https://botdev.zapclick.digital/pt-BR/typebots';
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
loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.spinner {
  border: 16px solid #f3f3f3;
  border-top: 16px solid #3498db;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
