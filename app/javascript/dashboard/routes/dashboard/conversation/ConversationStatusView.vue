<template>
  <div class="col-md-12 control-section" id="container">
    <div class="content-wrapper" id="container-kanban">
      <div class="container-button-visualization">
        <label>
          Visualização:
        </label>
        <woot-button
          type="button"
          :disabled="true"
          class="button-visualization"
        >
          <span class="flex items-center gap-0.5">
            <fluent-icon icon="arrow-trending-lines" size="16" />
            Kanban
          </span>
        </woot-button>
        <woot-button
          type="button"
          @click="redirectToDashboard"
          class="button-visualization"
        > 
          <span class="flex items-center gap-0.5">
            <fluent-icon icon="chat" size="16" />
            Conversas
          </span>
        </woot-button>
      </div>
      <ejs-kanban cssClass="kanban-card-default" id="kanban" keyField="Status" :dataSource="kanbanData"
      :cardSettings="cardSettings" :cardClick="onCardClick">
        <e-columns>
          <e-column headerText="Agendados" keyField="Open" :allowToggle="allowToggle"></e-column>
          <e-column headerText="Reagendados" keyField="InProgress" :allowToggle="allowToggle"></e-column>
          <e-column headerText="Remarcados" keyField="Testing" :allowToggle="allowToggle"></e-column>
          <e-column headerText="Tratativas" keyField="Close" :allowToggle="allowToggle"></e-column>
        </e-columns>
      </ejs-kanban>
    </div>
  </div>
</template>
<style>
@import '../../../../../../node_modules/@syncfusion/ej2-base/styles/material.css';
@import '../../../../../../node_modules/@syncfusion/ej2-buttons/styles/material.css';
@import '../../../../../../node_modules/@syncfusion/ej2-layouts/styles/material.css';
@import '../../../../../../node_modules/@syncfusion/ej2-dropdowns/styles/material.css';
@import '../../../../../../node_modules/@syncfusion/ej2-inputs/styles/material.css';
@import '../../../../../../node_modules/@syncfusion/ej2-navigations/styles/material.css';
@import '../../../../../../node_modules/@syncfusion/ej2-popups/styles/material.css';
@import '../../../../../../node_modules/@syncfusion/ej2-vue-kanban/styles/material.css';

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

.e-kanban.kanban-card-default .e-nancy-davloio, .e-kanban.kanban-card-default .e-andrew-fuller, .e-kanban.kanban-card-default .e-janet-leverling,
.e-kanban.kanban-card-default .e-steven-walker, .e-kanban.kanban-card-default .e-michael-suyama, .e-kanban.kanban-card-default .e-robert-king, .e-kanban.kanban-card-default .e-margaret-hamilt  {
  border-radius: 72px;
  height: 40px;
  width: 40px;
}

#container {
  height: 100%;
  background: #FFF;
  margin-top: 30px;
}

#container-kanban {
  padding: 20px;
}

.e-kanban .e-kanban-table.e-content-table .e-content-row:not(.e-swimlane-row) td {
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

.e-kanban .e-kanban-content .e-content-row .e-content-cells .e-card-wrapper .e-card {
  border-radius: 15px;
}

.e-kanban .e-kanban-content .e-content-row .e-content-cells .e-card-wrapper .e-card:hover {
  background-color: rgb(216, 216, 216);
}

.e-kanban .e-kanban-content .e-content-row .e-content-cells.e-collapsed .e-collapse-header-text {
  rotate: 180deg;
}

.e-kanban .e-kanban-header .e-header-cells {
  border-radius: 15px;
}

.button-visualization {
  border-radius: 15px;
  background-color: #00BDD1 !important;
}

.container-button-visualization {
  margin: 10px 10px 40px 10px;
}

</style>
<script>
import { extend } from "@syncfusion/ej2-base";
import Vue from "vue";
import { KanbanComponent, ColumnDirective, ColumnsDirective, KanbanPlugin } from "@syncfusion/ej2-vue-kanban";
import { kanbanData } from "./datasource";

Vue.use(KanbanPlugin);

export default {
  components: {
    'ejs-kanban': KanbanComponent,
    'e-column': ColumnDirective,
    'e-columns': ColumnsDirective
  },  
  data: function() {
    return {
      kanbanData: extend([], kanbanData, null, true),
      cardSettings: {
        contentField: "Summary",
        headerField: "Id",
        tagsField: 'Tags',
        grabberField: 'Color',
        footerCssField: 'ClassName'
      },
      allowToggle: true,
    };
  },
  provide: {
    kanban: []
  },
  methods: {
    onCardClick: function(_args) {
      const id = 1; // Substituir pelo id da conversa
      const conversationUrl = `/app/accounts/1/conversations/${id}`;
      window.open(conversationUrl, '_blank');
    },
    redirectToDashboard() {
      this.$router.push('/app/accounts/1/dashboard');
    }
  }
}
</script>