<template>
  <main
    class="flex flex-col bg-woot-25 min-h-screen w-full py-20 sm:px-6 lg:px-8 dark:bg-slate-900"
  >
    <section class="max-w-5xl mx-auto">
      <img
        :src="globalConfig.logo"
        :alt="globalConfig.installationName"
        class="mx-auto h-8 w-auto block dark:hidden"
      />
      <img
        v-if="globalConfig.logoDark"
        :src="globalConfig.logoDark"
        :alt="globalConfig.installationName"
        class="mx-auto h-8 w-auto hidden dark:block"
      />
      <h2
        class="mt-6 text-center text-3xl font-medium text-slate-900 dark:text-woot-50"
      >
        {{
          useInstallationName($t('LOGIN.TITLE'), globalConfig.installationName)
        }}
      </h2>
      <p
        v-if="showSignupLink"
        class="mt-3 text-center text-sm text-slate-600 dark:text-slate-400"
      >
        {{ $t('COMMON.OR') }}
        <router-link to="auth/signup" class="text-link lowercase">
          {{ $t('LOGIN.CREATE_NEW_ACCOUNT') }}
        </router-link>
      </p>
    </section>
    <section
      class="bg-white shadow sm:mx-auto mt-11 sm:w-full sm:max-w-lg dark:bg-slate-800 p-11 sm:shadow-lg sm:rounded-lg"
      :class="{
        'mb-8 mt-15': !showGoogleOAuth,
        'animate-wiggle': loginApi.hasErrored,
      }"
    >
      <div v-if="!email">
        <GoogleOAuthButton v-if="showGoogleOAuth" />
        <form class="space-y-5" @submit.prevent="submitLogin">
          <form-input
            v-model.trim="credentials.email"
            name="email_address"
            type="text"
            data-testid="email_input"
            :tabindex="1"
            required
            :label="$t('LOGIN.EMAIL.LABEL')"
            :placeholder="$t('LOGIN.EMAIL.PLACEHOLDER')"
            :has-error="$v.credentials.email.$error"
            @input="$v.credentials.email.$touch"
          />
          <form-input
            v-model.trim="credentials.password"
            type="password"
            name="password"
            data-testid="password_input"
            required
            :tabindex="2"
            :label="$t('LOGIN.PASSWORD.LABEL')"
            :placeholder="$t('LOGIN.PASSWORD.PLACEHOLDER')"
            :has-error="$v.credentials.password.$error"
            @input="$v.credentials.password.$touch"
          >
            <p v-if="!globalConfig.disableUserProfileUpdate">
              <router-link
                to="auth/reset/password"
                class="text-link text-sm"
                tabindex="4"
              >
                {{ $t('LOGIN.FORGOT_PASSWORD') }}
              </router-link>
            </p>
          </form-input>
          <submit-button
            :disabled="loginApi.showLoading"
            :tabindex="3"
            :button-text="$t('LOGIN.SUBMIT')"
            :loading="loginApi.showLoading"
          />
        </form>
      </div>
      <div v-else class="flex items-center justify-center">
        <spinner color-scheme="primary" size="" />
      </div>
    </section>
  </main>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators';
import globalConfigMixin from 'shared/mixins/globalConfigMixin';
import SubmitButton from '../../components/Button/SubmitButton.vue';
import { mapGetters } from 'vuex';
import { parseBoolean } from '@chatwoot/utils';
import GoogleOAuthButton from '../../components/GoogleOauth/Button.vue';
import FormInput from '../../components/Form/Input.vue';
import { login } from '../../api/auth';
import Spinner from 'shared/components/Spinner.vue';
import axios from 'axios';

const ERROR_MESSAGES = {
  'no-account-found': 'LOGIN.OAUTH.NO_ACCOUNT_FOUND',
  'business-account-only': 'LOGIN.OAUTH.BUSINESS_ACCOUNTS_ONLY',
};

export default {
  components: {
    FormInput,
    GoogleOAuthButton,
    Spinner,
    SubmitButton,
  },
  mixins: [globalConfigMixin],
  props: {
    ssoAuthToken: { type: String, default: '' },
    ssoAccountId: { type: String, default: '' },
    ssoConversationId: { type: String, default: '' },
    config: { type: String, default: '' },
    email: { type: String, default: '' },
    authError: { type: String, default: '' },
  },
  data() {
    return {
      // We need to initialize the component with any
      // properties that will be used in it
      credentials: {
        email: '',
        password: '',
      },
      loginApi: {
        message: '',
        showLoading: false,
        hasErrored: false,
      },
      error: '',
    };
  },
  validations: {
    credentials: {
      password: {
        required,
      },
      email: {
        required,
        email,
      },
    },
  },
  computed: {
    ...mapGetters({ globalConfig: 'globalConfig/get' }),
    showGoogleOAuth() {
      return Boolean(window.chatwootConfig.googleOAuthClientId);
    },
    showSignupLink() {
      return parseBoolean(window.chatwootConfig.signupEnabled);
    },
  },
  created() {
    if (this.ssoAuthToken) {
      this.submitLogin();
    }
    if (this.authError) {
      const message = ERROR_MESSAGES[this.authError] ?? 'LOGIN.API.UNAUTH';
      this.showAlert(this.$t(message));
      // wait for idle state
      window.requestIdleCallback(() => {
        // Remove the error query param from the url
        const { query } = this.$route;
        this.$router.replace({ query: { ...query, error: undefined } });
      });
    }
  },
  methods: {
    showAlert(message) {
      // Reset loading, current selected agent
      this.loginApi.showLoading = false;
      this.loginApi.message = message;
      bus.$emit('newToastMessage', this.loginApi.message);
    },
    submitLogin() {
      if (this.$v.credentials.email.$invalid && !this.email) {
        this.showAlert(this.$t('LOGIN.EMAIL.ERROR'));
        return;
      }

      this.loginApi.hasErrored = false;
      this.loginApi.showLoading = true;

      let credentials = {
        email: this.email
          ? decodeURIComponent(this.email)
          : this.credentials.email,
        password: this.credentials.password,
        sso_auth_token: this.ssoAuthToken,
        ssoAccountId: this.ssoAccountId,
        ssoConversationId: this.ssoConversationId,
      };

      login(credentials)
        .then(async () => {
          /* await axios.get(
            'https://botdev.zapclick.digital/api/auth/providers',
            {
              headers: {
                cookie:
                  'next-auth.callback-url=http%253A%252F%252Fbotdev.zapclick.digital%253A3000%252Fpt-BR%252Fsignin%253FredirectPath%253D%25252Ftypebots; next-auth.csrf-token=a305722528b497223f9e72a8f2bd8fc9eb6cbdf7b7db67cb17208b6a195ab149%257C014ffba229921ac1d0c99fe9af8652a53aa56378a0a081d8bb085ebdad173bdd; __Host-next-auth.csrf-token=e11293c4a587d9a528589f7c89e87bf43995bc9261f61638ffd876b7c7680a73%257C860db6daeda5d346c42384347ff720c39b8b318919905f0b7f1b33061ce33cba; __Secure-next-auth.callback-url=https%253A%252F%252Fbotdev.zapclick.digital%252Fpt-BR%252Fsignin',
                Accept: ,
                'Accept-Language': 'pt-BR,pt;q=0.9',
                Connection: 'keep-alive',
                'Content-Type': 'application/json',
                Cookie:
                  '__Secure-next-auth.callback-url=https%3A%2F%2Fbotdev.zapclick.digital; __Host-next-auth.csrf-token=046f05d5abbaead854c547548323f77f31912d0a452477d7fe621c005123fdeb%7Cfa20eea0063398e0aa1ed6a47afd9fe31e46bf77b769636ad5961e8cdc4ac3c9',
                'If-None-Match': '"vo9jtywp045e"',
                Referer: 'https://botdev.zapclick.digital/pt-BR/signin',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'User-Agent':
                  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'sec-ch-ua':
                  '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Linux"',
              },
            }
          ); */

          const response = await axios.get(
            'https://botdev.zapclick.digital/api/auth/csrf',
            {
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
                'Sec-Fetch-Site': 'same-origin',
                'User-Agent':
                  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'sec-ch-ua':
                  '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Linux"',
              },
            }
          );
          // eslint-disable-next-line no-console
          console.log(response.data.csrfToken, '@@@response');
          /* const formData = new FormData();

          formData.append('email', credentials.email);
          formData.append('csrfToken', response.data.csrfToken);
          formData.append('redirect', false);
          formData.append('json', true);
          formData.append(
            'csrfToken',
            '5ec1bda5d877891c0f1fa007af26c30972824f41b388cf2efffe4b968f633cd2'
          );

          axios.post(
            'https://botdev.zapclick.digital/api/auth/signin/email',
            formData,
            {
              headers: {
                Accept: ,
                'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                Connection: 'keep-alive',
                'Content-Type': 'application/json',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
              },
            }
          ); */
          this.showAlert(this.$t('LOGIN.API.SUCCESS_MESSAGE'));
        })
        .catch(response => {
          // Reset URL Params if the authentication is invalid
          if (this.email) {
            window.location = '/app/login';
          }
          this.loginApi.hasErrored = true;
          this.showAlert(response?.message || this.$t('LOGIN.API.UNAUTH'));
        });
    },
  },
};
</script>
