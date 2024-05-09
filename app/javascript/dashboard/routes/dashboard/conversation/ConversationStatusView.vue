<template>
  <div id="container">
  <div id="container-kanban">
       <ejs-kanban id="kanban" keyField="Status" :dataSource="kanbanData" :cardSettings="cardSettings">
          <e-columns>
            <e-column headerText="Agendados" keyField="Agendado" :allowToggle="allowToggle"></e-column>
            <e-column headerText="Reagendados" keyField="Reagendado" :allowToggle="allowToggle"></e-column>
            <e-column headerText="Remarcados" keyField="Remarcado" :allowToggle="allowToggle"></e-column>
            <e-column headerText="Tratativas" keyField="Tratativa" :allowToggle="allowToggle"></e-column>
          </e-columns>
        </ejs-kanban>
  </div>
  </div>
</template>
<script>
  import Vue from "vue";
  import { KanbanComponent, ColumnDirective, ColumnsDirective, KanbanPlugin } from '@syncfusion/ej2-vue-kanban';
  Vue.use(KanbanPlugin);

  export default {
    components: {
      'ejs-kanban': KanbanComponent,
      'e-column': ColumnDirective,
      'e-columns': ColumnsDirective
    },
    data: () => {
    return {
      kanbanData: [
        { Nome: "John Doe",Status: 'Agendado', Descrição: 'Analyze the new requirements gathered from the customer.', Type: 'Story', Priority: 'Baixa', Tags: 'Analyze,Customer', Estimate: 3.5, Assignee: 'Nancy Davloio', RankId: 1 },
        {  Nome: 'Vinicius Mendes',Status: 'Agendado', Descrição: 'Analyze the new requirements gathered from the customer.', Type: 'Story', Priority: 'Baixa', Tags: 'Analyze,Customer', Estimate: 3.5, Assignee: 'Nancy Davloio', RankId: 1 },
        {  Nome: 'Marcio Barbosa',Status: 'Agendado', Descrição: 'Analyze the new requirements gathered from the customer.', Type: 'Story', Priority: 'Média', Tags: 'Analyze,Customer', Estimate: 3.5, Assignee: 'Nancy Davloio', RankId: 1 },
        {  Nome: 'Ana Oliveira',Status: 'Reagendado', Descrição: 'Fix the issues reported in the IE browser.', Type: 'Bug', Priority: 'Baixa', Tags: 'IE', Estimate: 2.5, Assignee: 'Janet Leverling', RankId: 2  },
        { Nome: 'João Pereira',Status: 'Remarcado', Descrição: 'Fix the issues reported by the customer.', Type: 'Bug', Priority: 'Alta', Tags: 'Customer', Estimate: '3.5', Assignee: 'Steven walker', RankId: 1 },
        { Nome: 'Carlos Souza',Status: 'Tratativa', Descrição: 'Arrange a web meeting with the customer to get the login page requirements.', Type: 'Others', Priority: 'Média', Tags: 'Meeting', Estimate: 2, Assignee: 'Michael Suyama', RankId: 1 },
        {  Nome: 'Fernanda Santos',Status: 'Tratativa', Descrição: 'Validate new requirements', Type: 'Improvement', Priority: 'Alta', Tags: 'Validation', Estimate: 1.5, Assignee: 'Robert King', RankId: 1 }
    ],
    allowToggle: true,
      cardSettings: {
        contentField: "Descrição",
        headerField: "Nome",
        tagsField: "Priority"
      }
    };
  },
    
   }
</script>
<style>
@import '../../../../../../node_modules/@syncfusion/ej2-base/styles/material.css';
@import '../../../../../../node_modules/@syncfusion/ej2-buttons/styles/material.css';
@import '../../../../../../node_modules/@syncfusion/ej2-layouts/styles/material.css';
@import '../../../../../../node_modules/@syncfusion/ej2-dropdowns/styles/material.css';
@import '../../../../../../node_modules/@syncfusion/ej2-inputs/styles/material.css';
@import '../../../../../../node_modules/@syncfusion/ej2-navigations/styles/material.css';
@import '../../../../../../node_modules/@syncfusion/ej2-popups/styles/material.css';
@import '../../../../../../node_modules/@syncfusion/ej2-vue-kanban/styles/material.css';

#container {
  height: 100%;
  background: #FFF;
}

#container-kanban {
  padding: 20px;
}

.e-kanban .e-kanban-table.e-content-table .e-content-row:not(.e-swimlane-row) td {
    background: #f5f5f5;
    height: 800px;
}
</style>