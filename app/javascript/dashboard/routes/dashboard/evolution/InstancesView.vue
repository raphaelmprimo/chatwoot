<template>
  <div class="agent-table-container">
    <header class="app-header">
      <div class="flex items-center">
        <div style="padding-left: 15px; padding-top: 2px; margin-right: 30px">
          <woot-sidemenu-icon />
        </div>
        <h1>Instâncias</h1>
      </div>
      <div class="mr-[30px]">
        <button
          class="bg-green-400 p-2 text-white font-bold"
          @click="openModal"
        >
          Criar Instância
        </button>
      </div>
    </header>

    <ve-table
      max-height="calc(100vh - 21.875rem)"
      :fixed-header="true"
      :columns="columns"
      :table-data="tableData"
    />

    <woot-modal :show.sync="showModal" :on-close="hideModal">
      <woot-modal-header :header-title="$t('SIDEBAR_ITEMS.CREATE_INSTANCE')" />
      <div class="bg-white ml-7 mr-7 mt-5">
        <input
          type="text"
          class="bg-slate-50 w-full pl-[10px] pr-[10px] rounded-md h-[40px]"
          placeholder="Nome da Instância"
          v-model="nameInstance"
        />
        <p class="text-red-400" v-if="!!errorMessage">{{ errorMessage }}</p>
        <div class="flex justify-end gap-2 mt-[30px] mb-[30px]">
          <button
            @click="hideModal"
            class="bg-red-400 w-[100px] p-2 text-white font-bold"
            :disabled="loadingActions.loadingCreate"
          >
            Cancelar
          </button>
          <button
            @click="createInstance"
            class="bg-woot-400 w-[100px] p-2 text-white font-bold"
            :disabled="loadingActions.loadingCreate"
          >
            Criar
          </button>
        </div>
      </div>
    </woot-modal>
    <woot-modal :show.sync="showModalRemove" :on-close="hideModalCancelRemove">
      <woot-modal-header />
      <div class="bg-white ml-7 mr-7 mt-5">
        <p class="text-base">
          Tem certeza que deseja remover a instância
          <strong>{{ instanceRemove }}</strong
          >?
        </p>

        <div class="flex justify-end gap-2 mt-[30px] mb-[30px]">
          <button
            @click="hideModalCancelRemove"
            class="bg-red-400 w-[100px] p-2 text-white font-bold"
          >
            Cancelar
          </button>
          <button
            @click="removeInstance"
            class="bg-woot-400 w-[100px] p-2 text-white font-bold"
          >
            {{ this.loadingActions.loadingRemove ? '...' : 'Remover' }}
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
import rtlMixin from 'shared/mixins/rtlMixin';
import timeMixin from 'dashboard/mixins/time';
import { mixin as clickaway } from 'vue-clickaway';
import { mapGetters } from 'vuex';

export default {
  components: {
    VeTable,
  },
  mixins: [clickaway, timeMixin, rtlMixin],
  async mounted() {
    await this.fetchInstances();
  },
  data() {
    return {
      errorMessage: '',
      loading: false,
      showModal: false,
      instances: [],
      statusEnum: {
        open: 'Conectado',
        close: 'Desconectado',
        connecting: 'Conectando...',
      },
      nameInstance: '',
      loadingActions: { loadingCreate: false, loadingRemove: false, name: '' },
      showModalRemove: false,
      instanceRemove: ''
    };
  },
  computed: {
    ...mapGetters({
      currentUser: 'getCurrentUser',
    }),
    tableData() {
      const { account_id } = this.currentUser;

      return this.instances
        .filter(({ instance }) => {
          if (instance.chatwoot) {
            return instance.chatwoot.account_id === String(account_id);
          }
          return instance.instanceName === this.nameInstance;
        })
        .map(item => {
          return {
            name: item.instance.instanceName || '---',
            status: this.statusEnum[item.instance.status] || '---',
            id: item.instance.instanceId || '---',
            owner: !!item.instance.owner
              ? item.instance.owner.replace(/@.*$/, '')
              : '---',
            account_id:
              item.instance.chatwoot && item.instance.chatwoot.account_id
                ? item.instance.chatwoot.account_id
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
          field: 'status',
          key: 'status',
          title: 'Status',
          align: this.isRTLView ? 'right' : 'left',
          width: 25,
        },
        {
          field: 'owner',
          key: 'owner',
          title: 'Dono',
          align: this.isRTLView ? 'right' : 'left',
          width: 25,
        },
        {
          field: 'account_id',
          key: 'account_id',
          title: 'Id da conta',
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
                    backgroundColor: '#ef4444',
                    fontWeight: 'bold',
                    width: '150px',
                  }}
                  disabled={this.loadingActions.loadingRemove}
                  onClick={() => this.openModalCancelRemove(row.name)}
                >
                  {this.loadingActions.loadingRemove &&
                  this.loadingActions.name === row.name
                    ? '...'
                    : 'Remover'}
                </button>
              </div>
            );
          },
        },
      ];
    },
  },
  methods: {
    handleInstance(event) {
      this.nameInstance = event.target.value;
    },
    hideModal() {
      this.showModal = false;
      this.nameInstance = '';
    },
    openModal() {
      this.showModal = true;
    },
    hideModalCancelRemove() {
      this.showModalRemove = false;
      this.instanceRemove = '';
    },
    openModalCancelRemove(instanceName) {
      this.showModalRemove = true;
      this.instanceRemove = instanceName;
    },
    async createInstance() {
      try {
        this.loadingActions = { loadingCreate: true };
        const { access_token, account_id } = this.currentUser;

        const response = await axios.post(
          'https://dev.zapclick.digital:8080/instance/create',
          {
            instanceName: this.nameInstance,
            chatwoot_account_id: account_id,
            chatwoot_token: access_token,
          },
          {
            headers: {
              apikey: `B6D711FCDE4D4FD5936544120E713976`,
            },
          }
        );

        await axios.post(
          `https://dev.zapclick.digital:8080/chatwoot/set/${response.data.instance.instanceName}`,
          {
            account_id: String(account_id),
            token: access_token,
            sign_msg: false,
            enabled: true,
            reopen_conversation: true,
            conversation_pending: false,
            url: 'https://dev.zapclick.digital',
          },
          {
            headers: {
              apikey: `B6D711FCDE4D4FD5936544120E713976`,
            },
          }
        );

        const newInstance = {
          instance: {
            instanceName: response.data.instance.instanceName,
            status: 'close',
            instanceId: response.data.instance.instanceId,
            owner: '---',
            chatwoot: {
              account_id: String(account_id),
            },
          },
        };
        this.update(newInstance);
        this.hideModal();
      } catch (error) {
        console.error('[InstanceView]', error);
        this.errorMessage =
          'O nome da instância já está em uso. Por favor, escolha um nome diferente.';
      } finally {
        this.loadingActions = { loadingCreate: false };
      }
    },
    async fetchInstances() {
      try {
        this.isLoading = true;

        const responseNew = await axios.get(
          `https://dev.zapclick.digital:8080/instance/fetchInstances`,
          {
            headers: {
              apikey: `B6D711FCDE4D4FD5936544120E713976`,
            },
          }
        );
        this.instances = responseNew.data;
      } catch (error) {
        console.error(error, '@@@ error');
      } finally {
        this.isLoading = false;
      }
    },
    async removeInstance() {
      try {
        this.loadingActions = { loadingRemove: true, name: this.instanceRemove };

        const response = await axios.delete(
          `https://dev.zapclick.digital:8080/instance/delete/${this.instanceRemove}`,
          {
            headers: {
              apikey: `B6D711FCDE4D4FD5936544120E713976`,
            },
          }
        );

        if (response.data.status === 'SUCCESS') this.remove(this.instanceRemove);
        this.hideModalCancelRemove()
      } catch (error) {
        console.error(error);
      } finally {
        this.loadingActions = { loadingRemove: false, name: '' };
      }
    },
    update(newInstance) {
      const lastIndex = this.instances.length;

      Vue.set(this.instances, lastIndex, newInstance);
    },
    remove(instanceName) {
      if (!this.instances.length) return;

      const index = this.instances.findIndex(
        ({ instance }) => instance.instanceName === instanceName
      );
      Vue.delete(this.instances, index);
    },
  },
};
</script>
<style lang="scss" scoped>
.agent-table-container {
  @apply flex flex-col flex-1;

  .app-header {
    display: flex;
    justify-content: space-between;
    background-color: #f8f9fa;
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #dee2e6;
    margin-bottom: 20px;
  }

  .app-header h1 {
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
