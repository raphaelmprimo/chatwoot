<template>
  <div id="container" class="col-md-12 control-section">
    <div id="container-kanban" class="content-wrapper">
      <div class="flex justify-between items-center xl:items-end w-full mb-8">
        <div class="xl:mb-4" @click="() => toggleModalFunil('open')">
          <ejs-button css-class="e-flat" :is-primary="false" d="dlgbtn">
            Configurar funil
          </ejs-button>
        </div>
        <div class="container-search">
          <span class="flex items-end gap-0.5">
            <fluent-icon
              icon="filter"
              size="30"
              class="icon-filter xl:hidden"
            />
            <span class="mr-4 hidden xl:block">
              <div>
                <div
                  class="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
                >
                  <div class="flex flex-col h-min">
                    <label
                      for="contacts"
                      class="text-stone-600 text-sm font-medium"
                      >Contatos</label
                    >
                    <select
                      id="contacts"
                      class="mt-2 h-[40px] mb-0 block w-full rounded-md border border-gray-200 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    >
                      <option>Selecione o Agente</option>
                      <option
                        v-for="agent in agentList"
                        :key="agent.email"
                        :value="agent.name"
                      >
                        {{ agent.name }}
                      </option>
                    </select>
                    <!-- <label for="name" class="text-stone-600 text-sm font-medium">Nome</label>
                      <input type="text" id="name" placeholder="Filtre por nome" class="mt-2 h-[40px] block w-full rounded-md border border-gray-200 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" /> -->
                  </div>
                  <div style="display: none">
                    <ejs-textbox
                      id="search_labels"
                      ref="SearchLabel"
                      :v-model="selectedLabel"
                      :value="selectedLabel"
                      @change="handleLabelsChange"
                    />
                    <ejs-textbox
                      id="search_teams"
                      ref="SearchTeam"
                      :v-model="selectedTeam"
                      :value="selectedTeam"
                      @change="handleTeamsChange"
                    />
                  </div>

                  <div class="flex flex-col h-min">
                    <label for="date" class="text-stone-600 text-sm font-medium"
                      >Data</label
                    >
                    <input
                      id="date"
                      type="date"
                      class="mt-2 h-[40px] block w-full rounded-md border border-gray-200 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </div>

                  <div class="flex flex-col h-min">
                    <label
                      for="status"
                      class="text-stone-600 text-sm font-medium"
                      >Funil</label
                    >

                    <select
                      id="status"
                      class="mt-2 h-[40px] mb-0 block w-full rounded-md border border-gray-200 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    >
                      <option>Selecione o Marcador</option>
                      <option
                        v-for="label in labelsList"
                        :key="label.title"
                        :value="label.description"
                      >
                        {{ label.description }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </span>
            <ejs-textbox
              id="search_text"
              ref="SearchText"
              width="250px"
              class="e-large"
              placeholder="Pesquisar"
            />
            <woot-button type="button" class="button-search">
              <span class="flex items-center gap-0.5">
                <fluent-icon icon="search" size="16" />
              </span>
            </woot-button>
          </span>
        </div>
      </div>
      <div />
      <div v-if="loadLabel" class="text-center">
        <span class="mt-4 mb-4 spinner" />
      </div>
      <ejs-kanban
        id="kanban"
        ref="KanbanObj"
        cssClass="kanban-overview"
        key-field="label_title"
        :data-source="conversationList"
        :cardSettings="cardSettings"
        :card-click="onCardClick"
        :allow-toggle="allowToggle"
        :drag-start="dragStart"
        :drag-stop="dragStop"
      >
        <e-columns>
          <e-column
            headerText="Não Atribuídas"
            keyField="open"
            :allowToggle="allowToggle"
          ></e-column>

          <e-column
            v-for="label in labelsList"
            :key="label.title"
            :headerText="label.description"
            :keyField="label.title"
            :allowToggle="allowToggle"
          ></e-column>
        </e-columns>
      </ejs-kanban>
    </div>

    <Modal
      :show="showModalFunil"
      :on-close="() => toggleModalFunil('close')"
      :w60="true"
    >
      <div class="h-[82vh] w-full px-4 pt-16">
        <h2 class="text-xl font-semibold mb-4">Configurar Etapas</h2>
        <config-funnel />
      </div>
    </Modal>

    <Modal
      :show="showModalChat"
      :on-close="() => toggleModalChat('close')"
      :w80="true"
    >
      <div class="h-[82vh] w-full px-4 pt-16">
        <conversation-box
          :inbox-id="inboxId"
          :is-contact-panel-open="true"
          :is-on-expanded-layout="true"
          class="h-full"
          @contact-panel-toggle="false"
        />
      </div>
    </Modal>
  </div>
</template>
<script>
import Vue from 'vue';
import { extend } from '@syncfusion/ej2-base';
import {
  KanbanComponent,
  ColumnDirective,
  ColumnsDirective,
  KanbanPlugin,
} from '@syncfusion/ej2-vue-kanban';
import { ButtonPlugin } from '@syncfusion/ej2-vue-buttons';
import { TextBoxPlugin } from '@syncfusion/ej2-vue-inputs';
import { kanbanData } from './datasource';
import { GridComponent, Edit, GridPlugin } from '@syncfusion/ej2-vue-grids';
import { TextBoxComponent } from '@syncfusion/ej2-vue-inputs';
import ConversationBox from '../../../components/widgets/conversation/ConversationBox.vue';
import Modal from '../../../components/Modal.vue';
import { mapGetters, mapActions } from 'vuex';
import uiSettingsMixin from 'dashboard/mixins/uiSettings';
import conversationMixin from '../../../mixins/conversations';
import { Query } from '@syncfusion/ej2-data';
import AddLabelModal from 'dashboard/routes/dashboard/settings/labels/AddLabel.vue';
import ConfigFunnel from './funnel/ConfigFunnel.vue';
import { actionBegin } from '@syncfusion/ej2-vue-treegrid';
import cardTemplate from './templates/kanban/card.vue';
import bodyColumn from './templates/kanban/column.vue';

Vue.use(KanbanPlugin);
Vue.use(TextBoxPlugin);
Vue.use(ButtonPlugin);
Vue.use(GridPlugin);
let CardComponent = Vue.extend(cardTemplate);
let ColumnComponent = Vue.extend(bodyColumn);
export default {
  components: {
    'ejs-kanban': KanbanComponent,
    'e-column': ColumnDirective,
    'e-columns': ColumnsDirective,
    'ejs-textbox': TextBoxComponent,
    'ejs-grid': GridComponent,
    Modal: Modal,
    ConversationBox,
    AddLabelModal,
    ConfigFunnel,
  },
  mixins: [uiSettingsMixin, conversationMixin],
  provide: {
    kanban: [],
    grid: [Edit],
  },
  props: {
    conversationId: {
      type: [String, Number],
      default: 0,
    },
    inboxId: {
      type: [String, Number],
      default: 0,
    },
    selectedTeam: {
      type: [String, Number],
      default: 0,
    },
    selectedLabel: {
      type: String,
      default: 'todos',
    },
  },
  data: function () {
    return {
      kanbanData: extend([], kanbanData, null, true),
      cardSettings: {
        id: 'id',
        teamId: 'team_id',
        contentField: 'name',
        headerField: 'agent_name',
        tagsField: 'status',
        grabberField: 'color',
        Assignee: 'agent_name',
        PrimaryKey: 'id',
        Type: 'uuid',
        Color: 'color',
        template: function () {
          return {
            template: {
              parent: this,
              extends: CardComponent,
            },
          };
        },
      },
      columnsTemplate: function () {
        return {
          template: {
            parent: this,
            extends: ColumnComponent,
          },
        };
      },

      allowToggle: true,
      showModalFunil: false,
      showModalChat: false,
      editSettings: { allowEditing: true, mode: 'Batch' },
      data: [],
      statusOnStartDrag: '',
      selectedChat: [],
      showAddLabelModal: false,
      kanbanItem: {},
      loadLabel: false,
      originalCard: {},
    };
  },
  watch: {
    conversationId() {
      this.fetchConversationIfUnavailable();
    },
  },
  mounted() {
    this.$store.dispatch('agents/get');
    this.$store.dispatch('labels/get');
    this.$store.dispatch('kanban/get');
    this.initializeKanban();
    this.initialize();
  },

  beforeMount: function () {
    this.updateUISettings({
      show_secondary_sidebar: false,
      previously_used_sidebar_view: false,
    });
  },

  methods: {
    attributesMissing(required_attributes, registered_attributes) {
      if (required_attributes && required_attributes.length > 0) {
        const missingKeys = required_attributes.filter(
          attribute =>
            !Object.keys(registered_attributes)
              .map(key => key.toLowerCase())
              .includes(attribute['attribute_key'].toLowerCase())
        );
        const allKeysFound = missingKeys.length === 0;
        const missingKeysNames = missingKeys.map(key => key['attribute_name']);
        return [allKeysFound, missingKeysNames];
      } else {
        return [true, []];
      }
    },

    async getProcessedListLabels() {
      await this.$store.dispatch('labels/get');
      this.localLabels = this.labels.map(label => ({
        description: label.description,
        title: label.title,
        color: label.color,
        id: label.id,
      }));
    },
    handleTeamsChange() {
      var emptyValue = true;
      if (
        this.textTeamObj.element.value.length === 0 ||
        this.textTeamObj.element.value === 0
      ) {
        this.kanbanObj.query = new Query();
        return;
      }
      let searchValue = this.textTeamObj.element.value;
      searchValue.length === 0 ? (emptyValue = true) : (emptyValue = false);

      let searchQuery = new Query();
      if (searchValue !== '0') {
        searchQuery = new Query().search(
          searchValue,
          ['team_id'],
          'contains',
          true
        );
      }
      this.kanbanObj.query = searchQuery;
    },

    handleLabelsChange() {
      var emptyValue = true;
      if (this.textLabelObj.element.value === 'todos') {
        this.kanbanObj.query = new Query();
        return;
      }
      let searchValue = this.textLabelObj.element.value;
      searchValue.length === 0 ? (emptyValue = true) : (emptyValue = false);
      let searchIds = searchValue.split(',').map(id => parseInt(id.trim(), 10));

      let searchQuery = new Query();
      if (searchValue !== '') {
        searchQuery = new Query().where('status', 'equal', searchValue);
      }
      this.kanbanObj.query = searchQuery;
    },

    initializeKanban() {
      this.kanbanObj = this.$refs.KanbanObj.ej2Instances;
      this.textTeamObj = this.$refs.SearchTeam.ej2Instances;
      this.textLabelObj = this.$refs.SearchLabel.ej2Instances;
    },
    initialize() {
      const filtersToFetchAllConversations = {
        assigneeType: 'me',
        status: 'open',
        sortBy: 'last_activity_at_desc',
        page: 1,
      };
      this.$store.dispatch(
        'fetchAllConversations',
        filtersToFetchAllConversations
      );
    },
    onCardClick: function (_args) {
      const conversationId = _args?.data?.id;
      let filtredSelectedChat = this.selectedChat.filter(
        chat => conversationId === chat?.id
      );
      this.$store.dispatch('setActiveChat', {
        data: filtredSelectedChat[0],
        after: 1,
      });
      this.toggleModalChat('open');
    },
    redirectToDashboard() {
      this.$router.push('/app/accounts/1/dashboard');
    },
    toggleModalFunil(action) {
      if (action == 'open') {
        this.$store.dispatch('labels/get');
        this.showModalFunil = true;
      } else {
        this.$store.dispatch('kanban/get');
        this.showModalFunil = false;
      }
    },
    toggleModalChat(action) {
      if (action == 'open') {
        this.showModalChat = true;
      } else {
        this.showModalChat = false;
      }
    },

    dragStart(event) {
      this.originalCard = {
        data: event.data,
        keyField: event.data[this.$refs.KanbanObj.keyField],
      };
    },
    async dragStop(event) {
      this.loadLabel = true;
      const conversation = event?.data[0];

      if (conversation.label_title === 'open') {
        this.loadLabel = false;
        this.updateCardKanban(conversation);
        return;
      }

      this.$store
        .dispatch('labels/getLabelForKanban', event?.data[0].label_title)
        .then(nextLabel => {
          this.loadLabel = false;
          const labelAttributes = nextLabel.attribules_requireds;
          const customAttributes = event?.data[0].custom_attributes;
          const canChange = this.attributesMissing(
            labelAttributes,
            customAttributes
          );
          if (!canChange[0]) {
            event.cancel = true;
            this.$refs.KanbanObj.deleteCard(event.data); // Remove o card da nova posição
            this.$refs.KanbanObj.addCard(this.originalCard.data);
            this.onNoChangeCard(canChange[1], event?.data[0].id);
            this.$refs.KanbanObj.refresh();

            return;
          } else {
            this.updateCardKanban(conversation);
          }
        });
    },

    async updateCardKanban(conversation) {
      const conv = {
        id: conversation.id,
        uuid: conversation.uuid,
        status: conversation.label_title,
        can_schedule: conversation.can_schedule,
      };
      try {
        await this.$store.dispatch('conversationLabels/updateLabel', {
          conversationId: conversation.id,
          conversation: conv,
        });
      } catch (error) {
        //
      } finally {
        this.$store.dispatch('fetchConversationForKanban', conversation.id);
      }
    },

    onNoChangeCard(attributes, conversationId) {
      this.showAlert(
        `Campos obrigatórios não preenchidos: <b>${attributes.join(', ')}</b>`,
        conversationId
      );
    },

    conversationListFormatter(conversationList) {
      let formatedConversationList = [];

      conversationList.map(conversation => {
        let getData = {
          id: conversation.id,
          uuid: conversation?.uuid,
          name: conversation.meta.sender.name.replace(
            /(^\w{1})|(\s+\w{1})/g,
            letter => letter.toUpperCase()
          ),
          label_title: conversation?.label_title,
          label_id: conversation?.label_id,
          teamId: conversation?.team_id,
          status: conversation?.status,
          agent_name: conversation?.meta.assignee.name,
          image_agent: conversation?.meta.assignee.thumbnail,
          color: conversation?.color,
          schedule: conversation?.schedule,
          can_schedule: conversation?.can_schedule,
          custom_attributes: conversation?.custom_attributes,
          label_attributes: conversation?.label_attributes,
          can_schedule: conversation?.can_schedule,
          agent_last_seen_at: conversation?.agent_last_seen_at,
          assignee_last_seen_at: conversation?.assignee_last_seen_at,
          contact_last_seen_at: conversation?.contact_last_seen_at,
          custom_attributes: conversation?.custom_attributes,
          muted: conversation?.muted,
          snoozed_until: conversation?.snoozed_until,
          created_at: conversation?.created_at,
          timestamp: conversation?.timestamp,
          first_reply_created_at: conversation?.first_reply_created_at,
          last_activity_at: conversation?.last_activity_at,
          priority: conversation?.priority,
          waiting_since: conversation?.waiting_since,
        };
        formatedConversationList.push(getData);
      });
      this.selectedChat = conversationList;
      return formatedConversationList;
    },
    showAlert(message, conversationID) {
      this.$swal({
        title: 'Aviso!',
        html: `
        <p class="text-gray-500 dark:text-gray-400"> ${message}.</p>
        <p class="text-gray-500 dark:text-gray-400">Você precisa abrir a conversa e preencher os campos para continuar.</p>

        `,
        icon: 'error',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Abrir conversa',
        cancelButtonText: 'Fechar',
      }).then(result => {
        if (result.isConfirmed) {
          this.abrirConversa(conversationID); // Chama o método quando o botão for confirmado
        }
      });
    },
    abrirConversa(coversationID) {
      let filtredSelectedChat = this.selectedChat.filter(
        chat => coversationID === chat?.id
      );
      this.$store.dispatch('setActiveChat', {
        data: filtredSelectedChat[0],
        after: 1,
      });
      this.toggleModalChat('open');
    },
  },
  computed: {
    ...mapGetters({
      chatList: 'getAllConversations',
      currentChat: 'getSelectedChat',
      allChatList: 'getAllStatusChats',
      currentUser: 'getCurrentUser',
      labelsList: 'labels/getLabels',
      agentList: 'agents/getAgents',
      cardAttributes: 'kanban/getAttributes',
    }),

    ...mapActions('labels', ['getAllLabels']),

    labels() {
      return this.$store.state.labels.records;
    },
    isContactPanelOpen() {
      if (this.currentChat.id) {
        const { is_contact_sidebar_open: isContactSidebarOpen } =
          this.uiSettings;
        return isContactSidebarOpen;
      }
      return false;
    },
    conversationList() {
      const filters = {
        assigneeType: 'me',
        status: 'open',
        sortBy: 'last_activity_at_desc',
        page: 1,
      };
      let conversationList = [];
      conversationList = [...this.allChatList(filters)];
      return this.conversationListFormatter(conversationList);
    },
  },
};
</script>
<style>
@import '@syncfusion/ej2-base/styles/material3.css';
@import '@syncfusion/ej2-buttons/styles/material3.css';
@import '@syncfusion/ej2-layouts/styles/material3.css';
@import '@syncfusion/ej2-dropdowns/styles/material3.css';
@import '@syncfusion/ej2-navigations/styles/material3.css';
@import '@syncfusion/ej2-popups/styles/material3.css';
@import '@syncfusion/ej2-vue-kanban/styles/tailwind.css';
@import '@syncfusion/ej2-vue-inputs/styles/bootstrap.css';
@import '@syncfusion/ej2-vue-grids/styles/tailwind.css';
@import '@syncfusion/ej2-vue-treegrid/styles/material3.css';

.e-kanban.kanban-card-default .e-card-footer-css {
  align-self: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  height: 16px;
  width: 16px;
}
.e-kanban.kanban-card-default .e-improvement {
  background-image: url(https://syncfusion.atlassian.net/secure/viewavatar?size=medium&avatarId=15507&avatarType=issuetype);
}
.e-kanban.kanban-card-default .e-story {
  background-image: url(https://syncfusion.atlassian.net/secure/viewavatar?size=medium&avatarId=15515&avatarType=issuetype);
}
.e-kanban.kanban-card-default .e-epic {
  background-image: url(https://syncfusion.atlassian.net/secure/viewavatar?size=medium&avatarId=15507&avatarType=issuetype);
}
.e-kanban.kanban-card-default .e-bug {
  background-image: url(https://syncfusion.atlassian.net/secure/viewavatar?size=medium&avatarId=15503&avatarType=issuetype);
}
.e-kanban.kanban-card-default .e-others {
  background-image: url(https://syncfusion.atlassian.net/images/icons/issuetypes/documentation.png);
}
.e-kanban.kanban-card-default .e-low {
  margin-right: auto;
  background-image: url(https://syncfusion.atlassian.net/images/icons/priorities/trivial.svg);
}
.e-kanban.kanban-card-default .e-high {
  margin-right: auto;
  background-image: url(https://syncfusion.atlassian.net/images/icons/priorities/major.svg);
}
.e-kanban.kanban-card-default .e-critical {
  margin-right: auto;
  background-image: url(https://syncfusion.atlassian.net/images/icons/priorities/critical.svg);
}
.e-kanban.kanban-card-default .e-release {
  margin-right: auto;
  background-image: url(https://syncfusion.atlassian.net/images/icons/priorities/critical.svg);
}
.e-kanban.kanban-card-default .e-normal {
  margin-right: auto;
  background-image: url(https://syncfusion.atlassian.net/images/icons/priorities/minor.svg);
}
.e-kanban.kanban-card-default .e-nancy-davloio {
  background-image: url(https://ej2.syncfusion.com/demos/src/kanban/images/Nancy%20Davloio.png);
}
.e-kanban.kanban-card-default .e-andrew-fuller {
  background-image: url(https://ej2.syncfusion.com/demos/src/kanban/images/Andrew%20Fuller.png);
}
.e-kanban.kanban-card-default .e-janet-leverling {
  background-image: url(https://ej2.syncfusion.com/demos/src/kanban/images/Janet%20Leverling.png);
}
.e-kanban.kanban-card-default .e-steven-walker {
  background-image: url(https://ej2.syncfusion.com/demos/src/kanban/images/Steven%20walker.png);
}
.e-kanban.kanban-card-default .e-michael-suyama {
  background-image: url(https://ej2.syncfusion.com/demos/src/kanban/images/Michael%20Suyama.png);
}
.e-kanban.kanban-card-default .e-robert-king {
  background-image: url(https://ej2.syncfusion.com/demos/src/kanban/images/Robert%20King.png);
}
.e-kanban.kanban-card-default .e-margaret-hamilt {
  background-image: url(https://ej2.syncfusion.com/demos/src/kanban/images/Margaret%20hamilt.png);
}

.e-kanban.kanban-card-default .e-nancy-davloio,
.e-kanban.kanban-card-default .e-andrew-fuller,
.e-kanban.kanban-card-default .e-janet-leverling,
.e-kanban.kanban-card-default .e-steven-walker,
.e-kanban.kanban-card-default .e-michael-suyama,
.e-kanban.kanban-card-default .e-robert-king,
.e-kanban.kanban-card-default .e-margaret-hamilt {
  border-radius: 72px;
  height: 40px;
  width: 40px;
}

#container {
  height: 100%;
}

#container-kanban {
  padding: 10px 20px;
}

.e-kanban
  .e-kanban-table.e-content-table
  .e-content-row:not(.e-swimlane-row)
  td {
  background: #f5f5f5;
  height: 800px;
  border-radius: 15px;
}

.e-kanban .e-card-wrapper::-webkit-scrollbar {
  width: 8px;
}

.e-kanban .e-card-wrapper::-webkit-scrollbar-thumb {
  background-color: #dbdbdb;
  border-radius: 6px;
}

.e-kanban .e-card-wrapper::-webkit-scrollbar-track {
  background-color: #ebebeb;
  border-radius: 10px;
}

.e-kanban
  .e-kanban-content
  .e-content-row
  .e-content-cells
  .e-card-wrapper
  .e-card {
  border-radius: 15px;
}

.e-kanban
  .e-kanban-content
  .e-content-row
  .e-content-cells
  .e-card-wrapper
  .e-card:hover {
  background-color: rgb(216, 216, 216);
}

.e-kanban
  .e-kanban-content
  .e-content-row
  .e-content-cells.e-collapsed
  .e-collapse-header-text {
  rotate: 180deg;
}

.e-kanban .e-kanban-header .e-header-cells {
  border-radius: 15px;
}

.button-visualization {
  border-radius: 15px;
  background-color: #00bdd1 !important;
}

.container-button-visualization {
  margin: 10px 10px 40px 10px;
}

.container-search {
  margin: 10px 10px 10px 10px;
  display: flex;
  justify-content: center;
}

.e-input:not(:valid),
.e-input:valid,
.e-float-input.e-control-wrapper input:not(:valid),
.e-float-input.e-control-wrapper input:valid,
.e-float-input input:not(:valid),
.e-float-input input:valid,
.e-input-group input:not(:valid),
.e-input-group input:valid,
.e-input-group.e-control-wrapper input:not(:valid),
.e-input-group.e-control-wrapper input:valid,
.e-float-input.e-control-wrapper textarea:not(:valid),
.e-float-input.e-control-wrapper textarea:valid,
.e-float-input textarea:not(:valid),
.e-float-input textarea:valid,
.e-input-group.e-control-wrapper textarea:not(:valid),
.e-input-group.e-control-wrapper textarea:valid,
.e-input-group textarea:not(:valid),
.e-input-group textarea:valid {
  height: 2.5rem;
}

.e-input-group:not(.e-success):not(.e-warning):not(.e-error):not(
    .e-float-icon-left
  ),
.e-input-group:hover:not(.e-success):not(.e-warning):not(.e-error):not(
    .e-float-icon-left
  ) {
  /* csslint allow: adjoining-classes */
  border-radius: 15px;
}

.button-search {
  margin-left: 15px;
  border-radius: 15px;
  background-color: #00bdd1 !important;
}

.icon-filter {
  color: #00def7 !important;
  margin-right: 15px;
  align-self: center;
}

.container-search .e-input-group.e-control-wrapper {
  border-radius: 0px !important;
  background: rgba(0, 0, 0, 0.05) !important;
  padding: 0 10px !important;
  height: 40px !important;
}
</style>
