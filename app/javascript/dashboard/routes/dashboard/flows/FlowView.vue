<template>
  <div class="agent-table-container">
    <header class="app-header">
      <div style="padding-left: 15px; padding-top: 2px; margin-right: 30px">
        <woot-sidemenu-icon />
      </div>
      <div>
        <h1 id="title">Fluxo Typebot</h1>
      </div>
    </header>

    <ve-table
      v-if="!isLoading"
      max-height="calc(100vh - 21.875rem)"
      :fixed-header="true"
      :columns="columns"
      :table-data="tableData"
    />
    <woot-modal :show.sync="showModal" :on-close="hideModal">
      <woot-modal-header
        :header-title="$t('SIDEBAR_ITEMS.ASSOCIATE_EVOLUTION')"
      />
      <div class="bg-white ml-7 mr-7 mt-5">
        <select id="instance" v-model="selectedInstance">
          <option
            v-for="instance in selectedInstances"
            :key="instance.value"
            :value="instance.value"
          >
            {{ instance.label }}
          </option>
        </select>

        <div class="flex justify-end gap-2 mt-[30px] mb-[30px]">
          <button
            @click="hideModal"
            class="bg-red-400 w-[100px] p-2 text-white font-bold"
          >
            Cancelar
          </button>
          <button
            @click="createAssociate"
            class="bg-woot-400 w-[100px] p-2 text-white font-bold"
          >
            {{ this.loadingAssociate ? '...' : 'Associar' }}
          </button>
        </div>
      </div>
    </woot-modal>
  </div>
</template>

<script>
import Vue from 'vue';
import { VeTable } from 'vue-easytable';
import axios from 'axios';
import { mapGetters } from 'vuex';
import rtlMixin from 'shared/mixins/rtlMixin';
import timeMixin from 'dashboard/mixins/time';
import { mixin as clickaway } from 'vue-clickaway';
import Spinner from 'shared/components/Spinner.vue';

export default {
  components: {
    VeTable,
    Spinner,
  },
  mixins: [clickaway, timeMixin, rtlMixin],
  async mounted() {
    await this.fetchTypebots();
    await this.fetchInstances();
  },
  data() {
    return {
      typebots: [],
      apiTokenTypebot: '',
      isLoading: true,
      loading: { loadingPublished: false, loadingUnpublished: false, id: '' },
      showModal: false,
      instances: [],
      selectedInstance: null,
      typebot: null,
      loadingAssociate: false,
      selectedInstances: [],
    };
  },
  computed: {
    ...mapGetters({
      currentUser: 'getCurrentUser',
    }),
    tableData() {
      return this.typebots.map(item => {
        const associate = this.instances.find(
          int => int.typebot === item.publicId
        ) || { instanceName: '---', typebot: null, typebotUrl: null };

        return {
          name: item.name || '---',
          published: item.publishedTypebotId ? 'Sim' : 'Não',
          id: item.id || '---',
          isPublished: !!item.publishedTypebotId,
          publicId: item.publicId,
          instanceName: associate.instanceName,
          typebotUrl: associate.typebotUrl
            ? `${associate.typebotUrl}${associate.typebot}`
            : '---',
        };
      });
    },
    columns() {
      return [
        {
          field: 'id',
          key: 'id',
          title: 'Id',
          align: this.isRTLView ? 'right' : 'left',
          width: 25,
        },
        {
          field: 'name',
          key: 'name',
          title: 'Nome',
          align: this.isRTLView ? 'right' : 'left',
          width: 25,
        },
        {
          field: 'published',
          key: 'published',
          title: 'Publicado',
          align: this.isRTLView ? 'right' : 'left',
          width: 25,
        },
        {
          field: 'instanceName',
          key: 'instanceName',
          title: 'Instância',
          align: this.isRTLView ? 'right' : 'left',
          width: 25,
        },
        {
          field: 'actions',
          key: 'actions',
          title: '',
          align: this.isRTLView ? 'right' : 'left',
          width: 25,
          renderBodyCell: ({ row }) => {
            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <button
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.25rem',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: !row.isPublished ? '#3b82f6' : '#ef4444',
                    fontWeight: 'bold',
                    width: '150px',
                  }}
                  onClick={() =>
                    row.isPublished
                      ? this.unpublishedBot(row.id)
                      : this.publishedBot(row.id)
                  }
                >
                  {this.loading.loadingPublished && this.loading.id === row.id
                    ? '...'
                    : !row.isPublished
                      ? 'Publicar'
                      : 'Despublicar'}
                </button>
                <button
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.25rem',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: '#008000',
                    fontWeight: 'bold',
                    width: '150px',
                  }}
                  onClick={() => this.openModal(row)}
                  disabled={!row.isPublished || !this.selectedInstance}
                >
                  {this.loading.loadingUnpublished && this.loading.id === row.id
                    ? '...'
                    : 'Associar'}
                </button>
                <button
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.25rem',
                    color: '#000',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: '#FFE255',
                    fontWeight: 'bold',
                    width: '150px',
                    textAlign: 'center',
                  }}
                  disabled={
                    !row.isPublished || !row.typebotUrl.includes(row.publicId)
                  }
                >
                  <a
                    href={row.typebotUrl}
                    style={{
                      color: '#000',
                      textDecoration: 'none',
                      display: 'block',
                    }}
                    target="_blank"
                  >
                    Typebot
                  </a>
                </button>
              </div>
            );
          },
        },
      ];
    },
  },
  methods: {
    hideModal() {
      this.showModal = false;
      this.typebot = null;
    },
    openModal(selectedTypebot) {
      this.showModal = true;
      this.typebot = selectedTypebot;
    },
    async fetchTypebots() {
      try {
        this.isLoading = true;
        const { id } = this.currentUser;

        const responseNew = await axios.get(
          `https://dev.zapclick.digital/users/typebot/${id}}`
        );

        if (!!responseNew.data.api_token_typebot) {
          this.apiTokenTypebot = responseNew.data.api_token_typebot;

          const workspaces = await axios.get(
            'https://botdev.zapclick.digital/api/v1/workspaces',
            {
              headers: {
                Authorization: `Bearer ${responseNew.data.api_token_typebot}`,
              },
            }
          );

          const typebots = await axios.get(
            `https://botdev.zapclick.digital/api/v1/typebots?workspaceId=${workspaces.data.workspaces[0].id}`,
            {
              headers: {
                Authorization: `Bearer ${responseNew.data.api_token_typebot}`,
              },
            }
          );

          this.typebots = typebots.data.typebots;
        }
      } catch (error) {
        console.error(error, '@@@ error');
      } finally {
        this.isLoading = false;
      }
    },
    async fetchInstances() {
      try {
        const { account_id } = this.currentUser;

        const response = await axios.get(
          `https://dev.zapclick.digital:8080/instance/fetchInstances`,
          {
            headers: {
              apikey: `B6D711FCDE4D4FD5936544120E713976`,
            },
          }
        );

        const instancesByAccountId = response.data.filter(({ instance }) => {
          if (instance.chatwoot)
            return instance.chatwoot.account_id === String(account_id);
        });

        const instancesExists = instancesByAccountId.filter(({ instance }) =>
          this.typebots.every(typebot => typebot.publicId === instance.typebot)
        );

        const selectInstancesOptions = !!instancesExists.length
          ? instancesExists.map(item => ({
              label: item.instance.instanceName,
              value: item.instance.instanceName,
            }))
          : [{ label: '---', value: null }];

        this.selectedInstances = selectInstancesOptions;

        this.selectedInstance = selectInstancesOptions[0].value;

        this.instances = instancesByAccountId.map(item => ({
          instanceName: item.instance.instanceName,
          typebot: item.instance.typebot,
          typebotUrl: item.instance.typebotUrl,
        }));
      } catch (error) {
        console.error(error, '@@@ error');
      } finally {
      }
    },
    async publishedBot(typebotId) {
      try {
        this.loading = {
          loadingPublished: true,
          loadingUnpublished: false,
          id: typebotId,
        };
        await axios.post(
          `https://botdev.zapclick.digital/api/v1/typebots/${typebotId}/publish`,
          {},
          {
            headers: {
              Authorization: `Bearer ${this.apiTokenTypebot}`,
            },
          }
        );

        this.updateBots(typebotId);
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = {
          loadingPublished: false,
          loadingUnpublished: false,
          id: '',
        };
      }
    },
    async unpublishedBot(typebotId) {
      try {
        this.loading = {
          loadingPublished: false,
          loadingUnpublished: true,
          id: '',
        };

        await axios.post(
          `https://botdev.zapclick.digital/api/v1/typebots/${typebotId}/unpublish`,
          {},
          {
            headers: {
              Authorization: `Bearer ${this.apiTokenTypebot}`,
            },
          }
        );

        this.updateBots(typebotId, false);
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = {
          loadingPublished: false,
          loadingUnpublished: false,
          id: '',
        };
      }
    },
    updateBots(typebotId, publishedBot = true) {
      if (!this.typebots.length) return;
      const bot = this.typebots.find(bot => bot.id === typebotId);
      const index = this.typebots.findIndex(bot => bot.id === typebotId);

      const updateBot = {
        ...bot,
        publishedTypebotId: publishedBot ? '123' : '',
      };
      Vue.set(this.typebots, index, updateBot);
    },
    async createAssociate() {
      try {
        this.loadingAssociate = true;
        await axios.post(
          `https://dev.zapclick.digital:8080/typebot/set/${this.selectedInstance}`,
          {
            enabled: true,
            typebot: this.typebot.publicId,
            listening_from_me: true,
            url: `https://viewerdev.zapclick.digital/`,
            expire: 0,
            delay_message: 0,
            unknown_message: 'Messagem desconhecida',
            keyword_finish: '/sair',
          },
          {
            headers: {
              apikey: `B6D711FCDE4D4FD5936544120E713976`,
            },
          }
        );
      } catch (error) {
        console.error(error);
      } finally {
        this.loadingAssociate = false;
        this.hideModal();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.agent-table-container {
  @apply flex flex-col flex-1;

  .app-header {
    display: flex;
    background-color: #f8f9fa;
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #dee2e6;
    margin-bottom: 20px;
  }

  #title {
    margin: 0;
    font-size: 1.5rem;
    color: #343a40;
  }

  .ve-table {
    &::v-deep {
      th.ve-table-header-th {
        font-size: var(--font-size-mini) !important;
        padding: var(--space-small) var(--space-two) !important;
      }

      td.ve-table-body-td {
        padding: var(--space-one) var(--space-two) !important;
      }
    }
  }

  &::v-deep .ve-pagination {
    @apply bg-transparent dark:bg-transparent;
  }

  &::v-deep .ve-pagination-select {
    @apply hidden;
  }

  .row-user-block {
    @apply items-center flex text-left;

    .user-block {
      @apply items-start flex flex-col min-w-0 my-0 mx-2;

      .title {
        @apply text-sm m-0 leading-[1.2] text-slate-800 dark:text-slate-100;
      }
      .sub-title {
        @apply text-xs text-slate-600 dark:text-slate-200;
      }
    }
  }

  .table-pagination {
    @apply mt-4 text-right;
  }
}

.agents-loader {
  @apply items-center flex text-base justify-center p-8;
}

.button-container {
  display: flex;
  align-items: center;
  gap: 0.5rem; // Espaçamento entre os botões

  .btn {
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    color: #fff;
    border: none;
    cursor: pointer;

    &.btn-blue {
      background-color: #3b82f6; // Cor azul
    }

    &.btn-red {
      background-color: #ef4444; // Cor vermelha
    }
  }
}
</style>
