<!-- eslint-disable prettier/prettier -->
<template>
  <section class="w-screen flex">
    <section class="min-w-[250px] h-full py-2 bordas">
      <div class="h-full rounded-xl w-full py-4 px-2">
        <label> Visualização: </label>
        <woot-button
          type="button"
          :disabled="showing === 'kanban'"
          class="button-visualization"
          @click="() => toggleView('kanban')"
        >
          <span class="flex items-center gap-0.5">
            <fluent-icon icon="arrow-trending-lines" size="16" />
            Kanban
          </span>
        </woot-button>
        <woot-button
          type="button"
          class="button-visualization"
          :disabled="showing === 'conversations'"
          @click="() => toggleView('conversations')"
        >
          <span class="flex items-center gap-0.5">
            <fluent-icon icon="chat" size="16" />
            Conversas
          </span>
        </woot-button>

        <section class="flex flex-col gap-8 mt-12">
          <div v-if="teamsList.length">
            <h2 class="mb-3">Times:</h2>
            <span class="flex items-center gap-2">
              <div class="flex items-center">
                <input
                  id="todos-os-times"
                  v-model="selectedTeamId"
                  value="0"
                  type="radio"
                  class="h-4 w-4 cursor-pointer mr-1"
                />
                <label
                  for="todos-os-times"
                  class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer"
                  >Todos os Times</label
                >
              </div>
            </span>
            <span
              v-for="item in teamsList"
              :key="item.id"
              class="flex items-center gap-2"
            >
              <div class="flex items-center">
                <input
                  :id="item.id"
                  v-model="selectedTeamId"
                  type="radio"
                  :value="item.id"
                  class="h-4 w-4 cursor-pointer mr-1"
                />
                <label
                  :for="item.id"
                  class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer"
                >
                  {{
                    item.name.replace(/(^\w{1})|(\s+\w{1})/g, letter =>
                      letter.toUpperCase()
                    )
                  }}
                </label>
              </div>
            </span>
          </div>

          <div>
            <h2>Caixa de entrada:</h2>
          </div>

          <div class="sidebar-labels-wrap">
            <div v-if="labelsList.length">
              <h2 class="mb-2">Marcadores:</h2>

              <ul class="pt-2 mb-0 ml-0 list-none">
                <li class="mt1">
                  <ul class="mb-0 ml-0 list-none">
                    <li class="font-medium h-7 ml-1">
                      <a
                        class="inline-flex text-left max-w-full w-full items-center cursor-pointer"
                        @click.prevent="labelSelect('todos')"
                        ><!---->
                        <span
                          class="inline-flex rounded-sm bg-slate-100 h-3 w-3.5 mr-1.5 rtl:mr-0 rtl:ml-1.5 border border-black dark:border-slate-900"
                          style="background-color: white"
                        />
                        <div
                          class="items-center flex overflow-hidden whitespace-nowrap text-ellipsis w-full justify-between"
                        >
                          <span
                            title="todos_os_marcadores"
                            class="text-xs text-slate-700 dark:text-slate-100 text-ellipsis overflow-hidden whitespace-nowrap max-w-full"
                          >
                            Todos os Marcadores
                          </span>
                        </div>
                      </a>
                    </li>
                    <li class="font-medium h-7 ml-1">
                      <a
                        class="inline-flex text-left max-w-full w-full items-center cursor-pointer"
                        @click.prevent="labelSelect('open')"
                        ><!---->
                        <span
                          class="inline-flex rounded-sm bg-slate-100 h-3 w-3.5 mr-1.5 rtl:mr-0 rtl:ml-1.5 border border-black dark:border-slate-900"
                          style="background-color: rgb(224 231 228)"
                        />
                        <div
                          class="items-center flex overflow-hidden whitespace-nowrap text-ellipsis w-full justify-between"
                        >
                          <span
                            title="nao_atribuidas"
                            class="text-xs text-slate-700 dark:text-slate-100 text-ellipsis overflow-hidden whitespace-nowrap max-w-full"
                          >
                            Não Atribuídas
                          </span>
                        </div>
                      </a>
                    </li>
                    <li v-for="label in labelsList" :key="label.id">
                      <a
                        url="javascrip:;"
                        class="inline-flex text-left max-w-full w-full items-center cursor-pointer"
                        :value="label.title"
                        @click.prevent="labelSelect(label)"
                      >
                        <woot-label
                          :value="label.title"
                          :title="label.description"
                          :description="label.title"
                          :show-close="false"
                          :color="label.color"
                          variant="dashed"
                          class="max-w-[calc(100%-0.5rem)]"
                        />
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </section>
    <conversation-status-view
      v-if="showing === 'kanban'"
      :selected-team="selectedTeamId"
      :selected-label="selectedLabel"
    />
    <conversation-view v-else />
  </section>
</template>

<script>
import ConversationStatusView from './ConversationStatusView';
import ConversationView from './ConversationView';
import uiSettingsMixin from 'dashboard/mixins/uiSettings';
import eventListenerMixins from 'shared/mixins/eventListenerMixins';
import conversationLabelMixin from 'dashboard/mixins/conversation/labelMixin';

import { mapGetters } from 'vuex';

export default {
  components: {
    'conversation-status-view': ConversationStatusView,
    'conversation-view': ConversationView,
  },
  mixis: [conversationLabelMixin, eventListenerMixins],
  data: function () {
    return {
      showing: 'kanban',
      selectedTeamId: 0,
      selectedLabel: '',
    };
  },
  mounted() {
    this.$store.dispatch('labels/get');
  },

  methods: {
    toggleView: function (value) {
      this.showing = value;
    },
    labelSelect(label) {
      if (label === 'todos' || label === 'open') {
        this.selectedLabel = label;
      } else {
        this.selectedLabel = label.title;
      }
    },
    teamSelect(event) {
      this.selectedTeamId = event.target.value;
    },
  },
  computed: {
    ...mapGetters({
      teamsList: 'teams/getTeams',
      labelsList: 'labels/getLabels',
    }),
  },
  mixins: [uiSettingsMixin],
  beforeDestroy: function () {
    this.updateUISettings({
      show_secondary_sidebar: true,
      previously_used_sidebar_view: true,
    });
  },
};
</script>

<style>
.bordas {
  border-right: 1px solid rgba(0, 0, 0, 0.03);
}
</style>
