<template>
  <div class="agent-table-container">
    <header class="app-header">
      <h1>Fluxo Typebot</h1>
    </header>

    <ve-table
      v-if="isLoading"
      max-height="calc(100vh - 21.875rem)"
      :fixed-header="true"
      :columns="columns"
      :table-data="tableData"
    />
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
  },
  data() {
    return {
      typebots: [],
      apiTokenTypebot: '',
      isLoading: true,
      loading: { loadingPublished: false, loadingUnpublished: false, id: '' },
    };
  },
  computed: {
    ...mapGetters({
      currentUser: 'getCurrentUser',
    }),
    tableData() {
      console.log(this.typebots, '@@@ this.');
      return this.typebots.map(item => ({
        name: item.name || '---',
        published: item.publishedTypebotId ? 'Sim' : 'Não',
        id: item.id || '---',
        isPublished: !!item.publishedTypebotId,
      }));
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
                    backgroundColor: '#3b82f6',
                    fontWeight: 'bold',
                    width: '150px',
                  }}
                  onClick={() => this.publishedBot(row.id)}
                  disabled={row.isPublished}
                >
                  {this.loading.loadingPublished && this.loading.id === row.id
                    ? '...'
                    : 'Publicar'}
                </button>
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
                  onClick={() => this.unpublishedBot(row.id)}
                  disabled={!row.isPublished}
                >
                  {this.loading.loadingUnpublished && this.loading.id === row.id
                    ? '...'
                    : 'Despublicar'}
                </button>
              </div>
            );
          },
        },
      ];
    },
  },
  methods: {
    async fetchTypebots() {
      try {
        this.isLoading = true;
        const { id } = this.currentUser;

        const responseNew = await axios.get(
          `https://dev.zapclick.digital/users/typebot/${3}}`
        );

        console.log(responseNew.data, id, '@@@ id');

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
          console.log(workspaces, '@@@ typebots');

          const typebots = await axios.get(
            `https://botdev.zapclick.digital/api/v1/typebots?workspaceId=${workspaces.data.workspaces[0].id}`,
            {
              headers: {
                Authorization: `Bearer ${responseNew.data.api_token_typebot}`,
              },
            }
          );

          this.typebots = typebots.data.typebots;

          console.log(typebots, '@@@ typebots');
        }
      } catch (error) {
        console.error(error, '@@@ error');
      } finally {
        this.isLoading = false;
      }
    },
    async publishedBot(typebotId) {
      try {
        console.log(typebotId, this.apiTokenTypebot, '@@@ publishedBot');
        this.loading = {
          loadingPublished: true,
          loadingUnpublished: false,
          id: typebotId,
        };
        const response = await axios.post(
          `https://botdev.zapclick.digital/api/v1/typebots/${typebotId}/publish`,
          {},
          {
            headers: {
              Authorization: `Bearer ${this.apiTokenTypebot}`,
            },
          }
        );

        console.log(response.data, '@@@ response publishedBot');
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
        console.log(typebotId, this.apiTokenTypebot, '@@@ unpublishedBot');
        this.loading = {
          loadingPublished: false,
          loadingUnpublished: true,
          id: '',
        };

        const response = await axios.post(
          `https://botdev.zapclick.digital/api/v1/typebots/${typebotId}/unpublish`,
          {},
          {
            headers: {
              Authorization: `Bearer ${this.apiTokenTypebot}`,
            },
          }
        );

        this.updateBots(typebotId, false);
        console.log(response.data, '@@@ response unpublishedBot');
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

      console.log(bot, index, this.typebots[index], publishedBot);
      const updateBot = {
        ...bot,
        publishedTypebotId: publishedBot ? '123' : '',
      };
      Vue.set(this.typebots, index, updateBot);
    },
  },
};
</script>
<style lang="scss" scoped>
.agent-table-container {
  @apply flex flex-col flex-1;

  .app-header {
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
