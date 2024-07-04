<template>
  <div class="agent-table-container">
    <header class="app-header">
      <h1>Fluxo Devbot</h1>
    </header>
    <ve-table
      max-height="calc(100vh - 21.875rem)"
      :fixed-header="true"
      :columns="columns"
      :table-data="tableData"
    />
  </div>
</template>

<script>
import { VeTable } from 'vue-easytable';
import axios from 'axios';
import { mapGetters } from 'vuex';
import rtlMixin from 'shared/mixins/rtlMixin';
import timeMixin from 'dashboard/mixins/time';
import { mixin as clickaway } from 'vue-clickaway';

export default {
  components: {
    VeTable,
  },
  mixins: [clickaway, timeMixin, rtlMixin],
  async mounted() {
    await this.fetchTypebots();
  },
  data() {
    return {
      typebots: [],
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
        published: item.publishedTypebotId || '---',
        id: item.id || '---',
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
      ];
    },
  },
  methods: {
    async fetchTypebots() {
      try {
        const { id } = this.currentUser;

        const responseNew = await axios.get(
          `https://dev.zapclick.digital/users/typebot/${id}}`
        );

        console.log(responseNew.data, id, '@@@ id');

        if (!!responseNew.data.api_token_typebot) {
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
      }
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
</style>
