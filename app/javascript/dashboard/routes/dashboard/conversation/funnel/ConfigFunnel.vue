<template>
  <div class="col-lg-12 control-section">
    <div aria-label="TreeGrid">
      <ejs-treegrid
        ref="treegrid"
        childMapping="properties"
        :dataSource="allLabels"
        :pageSettings="pageSettings"
        :editSettings="editSettings"
        :actionComplete="actionComplete"
        :actionBegin="actionBegin"
        @beforeDelete="beforeDeleteHandler"
        :rowSelected="rowSelected"
        :rowDeselected="rowDeselected"
        :allowRowDragAndDrop="true"
        :rowDrop="onColumnDrop"
        locale="pt"
      >
        <e-columns>
          <e-column
            field="id"
            headerText="ID"
            headeremplate="'<template><div>Olá</div></template>'"
            isPrimaryKey="true"
            :edit="editparams"
            width="60"
            :allowEditing="false"
            textAlign="Center"
          ></e-column>
          <e-column
            field="description"
            headerText="ETAPAS DO FUNIL"
            width="200"
            headeremplate="<template><div>Olá</div></template>"
            :allowEditing="false"
          >
          </e-column>
          <e-column
            field="attributes_requireds"
            headerText="CAMPOS OBRIGATÓRIOS"
            width="150"
            :allowEditing="false"
          ></e-column>
          <e-column
            field="can_add_schedule"
            headerText="PODE AGENDAR?"
            width="150"
            display-as-check-box="true"
            edit-type="booleanedit"
            textAlign="Center"
          ></e-column>
          <e-column
            field="final_step"
            headerText="ETAPA FINAL?"
            width="100"
            display-as-check-box="true"
            edit-type="booleanedit"
            textAlign="Center"
          >
          </e-column>
          <e-column
            headerText="Ações"
            :commands="commands"
            width="120"
          ></e-column>
        </e-columns>
      </ejs-treegrid>
    </div>
    <woot-delete-modal
      :show.sync="showDeleteConfirmationPopup"
      :on-close="closeDeletePopup"
      :on-confirm="confirmDeletion"
      :title="$t('LABEL_MGMT.DELETE.CONFIRM.TITLE')"
      :message="$t('LABEL_MGMT.DELETE.CONFIRM.MESSAGE')"
      :message-value="deleteMessage"
      :confirm-text="deleteConfirmText"
      :reject-text="deleteRejectText"
    />
    <woot-modal :show.sync="showEditPopup" :on-close="hideEditPopup">
      <edit-label
        :selected-response="selectedResponse"
        :properties-label="labelSelected.properties"
        @close="hideEditPopup"
      />
    </woot-modal>

    <woot-modal :show.sync="showAddLabelModal" :on-close="hideAddLabelPopup">
      <add-label-modal @close="hideAddLabelPopup" />
    </woot-modal>
    <div class="d-flex justify-content-between mt-4 mb-3">
      <woot-button
        color-scheme="success"
        icon="add-circle"
        size="small"
        @click="showAddLabelPopup"
      >
        Adicionar etapa
      </woot-button>
      <woot-button
        color-scheme="primary"
        icon="edit"
        size="small"
        :disabled="editButtonDisabled"
        @click="openEditPopup"
      >
        Editar Etapa
      </woot-button>
      <!-- <woot-button
        color-scheme="secondary"
        icon="edit"
        size="small"
        :disabled="scheduleButtonDisabled"
        :propriedades="labelSelected.properties"
        @click="openScheduleModal"
      >
        Adicionar Agendamento
      </woot-button> -->
    </div>
    <hr />
    <div>
      <h4 class="text-xl font-semibold my-3">
        Campos que vão aparecer no card
      </h4>
      <div class="w-full pb-8">
        <ejs-grid
          ref="grid"
          :dataSource="cardAttributes"
          :editSettings="gridEditSettings"
          :toolbar="toolbar"
          :actionComplete="onCompleteActionAttributes"
          :autoFit="true"
        >
          <e-columns>
            <e-column
              field="id"
              headerText="ID"
              width="60"
              textAlign="Center"
              :isPrimaryKey="true"
            ></e-column>

            <e-column
              field="description"
              header-text="Nome do campo"
              text-align="left"
            />
            <e-column
              field="visible"
              header-text="Visível?"
              width="100"
              display-as-check-box="true"
              edit-type="booleanedit"
              textAlign="Center"
            />
          </e-columns>
        </ejs-grid>
      </div>
    </div>
    <woot-modal :show.sync="showScheduleModal" :on-close="closeScheduleModal">
      <add-schedule
        @save-event="addEvent"
        @close-modal="closeScheduleModal"
        :color="labelSelected.color"
        :labelId="labelSelected.id"
      >
      </add-schedule>
    </woot-modal>
  </div>
</template>

<script>
import { loadCldr, L10n, setCulture } from '@syncfusion/ej2-base';
import { mapGetters, mapActions } from 'vuex';
import {
  TreeGridComponent,
  ColumnDirective,
  ColumnsDirective,
  Edit,
  Page,
  CommandColumn,
  actionComplete,
  Selection,
  RowDD,
} from '@syncfusion/ej2-vue-treegrid';
import AddLabelModal from 'dashboard/routes/dashboard/settings/labels/AddLabel.vue';
import alertMixin from 'shared/mixins/alertMixin';
import EditLabel from 'dashboard/routes/dashboard/settings/labels/EditLabel.vue';
import { isThisSecond } from 'date-fns';
import AddSchedule from './AddSchedule.vue';
import localeText from '../syncfusion-locale/pt.json';
setCulture('pt');
L10n.load(localeText);
loadCldr(
  require('cldr-data/supplemental/numberingSystems.json'),
  require('cldr-data/main/pt/ca-gregorian.json'),
  require('cldr-data/main/pt/numbers.json'),
  require('cldr-data/main/pt/timeZoneNames.json'),
  require('cldr-data/supplemental/weekData.json')
);
import {
  GridComponent,
  Toolbar,
  ColumnDirective as GridColumnDirective,
  ColumnsDirective as GridColumnsDirective,
  Edit as GridEdit,
  Page as GridPage,
} from '@syncfusion/ej2-vue-grids';

export default {
  components: {
    'ejs-treegrid': TreeGridComponent,
    'e-column': ColumnDirective,
    'e-columns': ColumnsDirective,
    'ejs-grid': GridComponent,
    'e-grid-columns': GridColumnsDirective,
    'e-grid-column': GridColumnDirective,
    AddLabelModal,
    EditLabel,
    AddSchedule,
  },
  data: () => {
    return {
      pageSettings: { pageSize: 6 },
      editparams: { params: { format: 'n' } },
      editSettings: {
        allowDeleting: true,
        allowEditing: true,
        allowAdding: true,
        mode: 'Col',
      },
      gridEditSettings: {
        allowDeleting: false,
        allowEditing: true,
        allowAdding: false,
        mode: 'Batch',
      },

      toolbar: ['Update', 'Cancel'],
      commands: [
        {
          type: 'Edit',
          buttonOption: { iconCss: ' e-icons e-edit', cssClass: 'e-flat' },
        },
        {
          type: 'Delete',
          buttonOption: { iconCss: 'e-icons e-delete', cssClass: 'e-flat' },
        },
        {
          type: 'Save',
          buttonOption: { iconCss: 'e-icons e-update', cssClass: 'e-flat' },
        },
        {
          type: 'Cancel',
          buttonOption: {
            iconCss: 'e-icons e-cancel-icon',
            cssClass: 'e-flat',
          },
        },
      ],
      showAddLabelModal: false,
      showDeleteConfirmationPopup: false,
      showEditPopup: false,
      selectedResponse: {},
      loading: {},
      labelSelected: {},
      editButtonDisabled: true,
      scheduleButtonDisabled: true,
      showScheduleModal: false,
      modalTitle: '',
      eventData: {},
      childs: [],
    };
  },
  provide: {
    treegrid: [Edit, Page, CommandColumn, Selection, RowDD],
    grid: [GridEdit, GridPage, Toolbar],
  },
  mixins: [alertMixin],
  props: {
    labels: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapGetters({
      currentUser: 'getCurrentUser',
      currentAccoun: 'getCurrentAccount',
      allLabels: 'labels/getLabels',
      schedules: 'calendars/getAllSchedules',
      attributes: 'attributes/getAttributes',
    }),
    transformedLabelsList() {
      return this.allLabels;
    },
    ...mapActions('labels', ['getAllLabels']),
    // Delete Modal
    deleteConfirmText() {
      return this.$t('LABEL_MGMT.DELETE.CONFIRM.YES');
    },
    deleteRejectText() {
      return this.$t('LABEL_MGMT.DELETE.CONFIRM.NO');
    },
    deleteMessage() {
      return ` ${this.selectedResponse.title}?`;
    },
    cardAttributes() {
      const allAtributes = [];
      this.$store.getters['kanban/getAttributes'].map((attribute, index) => {
        allAtributes.push({
          id: attribute.Id,
          name: attribute.Name,
          description: attribute.Description,
          visible: attribute.Visible,
        });
      });
      return allAtributes;
    },
  },

  mounted() {
    this.$refs.treegrid = this.$refs.treegrid.$el.ej2_instances[0];
    this.$store.dispatch('attributes/fetchAllAttributes');
    this.$store.dispatch('labels/get');
    this.$store.dispatch('kanban/get');
  },
  methods: {
    onColumnDrop(event) {
      const etapaId = event.data[0].id;
      const position = event.dropIndex + 1;
      this.$store.dispatch('labels/updatePosition', {
        labelId: etapaId,
        position: position,
      });
    },
    showAddLabelPopup() {
      this.showAddLabelModal = true;
    },
    hideAddLabelPopup() {
      const kanbanInstance = document.getElementById('kanban').ej2_instances[0];
      this.$store.dispatch('labels/get');
      kanbanInstance.refresh();
      this.showAddLabelModal = false;
    },
    openEditPopup() {
      this.showEditPopup = true;
      this.selectedResponse = this.labelSelected;
    },
    hideEditPopup() {
      const kanbanInstance = document.getElementById('kanban').ej2_instances[0];
      this.$store.dispatch('labels/get');
      kanbanInstance.refresh();
      this.showEditPopup = false;
    },
    transformItem(item) {
      item.show_on_sidebar = '';
      return item;
    },
    handleCheckboxChange(data, field, event) {
      data[field] = event.target.checked;
    },
    onClose() {
      this.$emit('close');
    },
    actionBegin(event) {
      switch (event.requestType) {
        case 'delete':
          event.cancel = true;
          this.openDeletePopup(event.data[0], event.data[0]['id']);
          break;
      }
    },

    rowSelected(event) {
      this.labelSelected = event.data;
      this.editButtonDisabled = false;
      if (event.data['can_add_schedule'] === true) {
        this.scheduleButtonDisabled = false;
      } else {
        this.scheduleButtonDisabled = true;
      }
      this.$store.dispatch('calendars/fetchSchedulesLabel', {
        calendarID: 1,
        labelID: this.labelSelected['id'],
      });
    },

    rowDeselected() {
      this.editButtonDisabled = true;
      this.scheduleButtonDisabled = true;
      this.labelSelected = {};
    },

    actionComplete(event) {
      if (event.action === 'edit') {
        this.$store
          .dispatch('labels/update', {
            id: event.data['id'],
            can_add_schedule: event.data['can_add_schedule'],
            final_step: event.data['final_step'],
            show_on_sidebar: event.data['show_on_sidebar'],
          })
          .then(() => {
            this.showAlert(this.$t('LABEL_MGMT.EDIT.API.SUCCESS_MESSAGE'));
            setTimeout(() => this.onClose(), 10);
          })
          .catch(() => {
            this.showAlert(this.$t('LABEL_MGMT.EDIT.API.ERROR_MESSAGE'));
          });
      }
    },
    onCompleteActionAttributes(event) {
      if (event.requestType === 'batchsave') {
        const dataUpdate = this.preperaDataToUpdate(event.rows);
        this.$store
          .dispatch('kanban/update', dataUpdate)
          .then(() => {
            this.showAlert(this.$t('LABEL_MGMT.EDIT.API.SUCCESS_MESSAGE'));
          })
          .catch(() => {
            this.showAlert(this.$t('LABEL_MGMT.EDIT.API.ERROR_MESSAGE'));
          });
      }
    },
    showAddLabelPopup() {
      this.showAddLabelModal = true;
    },
    beforeDeleteHandler(event) {
      event.cancel = true;
      this.openDeletePopup(event.data[0], event.data[0]['id']);
    },
    openDeletePopup(response) {
      this.showDeleteConfirmationPopup = true;
      this.selectedResponse = response;
    },

    closeDeletePopup() {
      this.showDeleteConfirmationPopup = false;
    },

    confirmDeletion() {
      this.loading[this.selectedResponse.id] = true;
      this.closeDeletePopup();
      this.deleteLabel(this.selectedResponse.id);
    },

    deleteLabel(id) {
      this.$store
        .dispatch('labels/delete', id)
        .then(() => {
          this.showAlert(this.$t('LABEL_MGMT.DELETE.API.SUCCESS_MESSAGE'));
        })
        .catch(() => {
          this.showAlert(this.$t('LABEL_MGMT.DELETE.API.ERROR_MESSAGE'));
        });
    },
    // Schedule
    openScheduleModal() {
      //this.modalTitle = eventData.Id ? 'Edit Event' : 'Add Event';
      //this.eventData = eventData;
      this.showScheduleModal = true;
    },
    closeScheduleModal() {
      this.showScheduleModal = false;
    },
    closeModal() {
      this.showScheduleModal = false;
    },
    addEvent(eventData) {
      this.closeScheduleModal();
    },
    preperaDataToUpdate(data) {
      const dataToUpdate = [];
      data.forEach(item => {
        dataToUpdate.push(item.data);
      });
      return dataToUpdate;
    },
  },
};
</script>
<style>
@import '../../../../../../../node_modules/@syncfusion/ej2-base/styles/material3.css';
@import '../../../../../../../node_modules/@syncfusion/ej2-buttons/styles/material3.css';
@import '../../../../../../../node_modules/@syncfusion/ej2-layouts/styles/material3.css';
@import '../../../../../../../node_modules/@syncfusion/ej2-dropdowns/styles/material3.css';
@import '../../../../../../../node_modules/@syncfusion/ej2-navigations/styles/material3.css';
@import '../../../../../../../node_modules/@syncfusion/ej2-popups/styles/material3.css';
@import '../../../../../../../node_modules/@syncfusion/ej2-vue-kanban/styles/tailwind.css';
@import '../../../../../../../node_modules/@syncfusion/ej2-vue-inputs/styles/bootstrap.css';
@import '../../../../../../../node_modules/@syncfusion/ej2-vue-grids/styles/tailwind.css';
@import '../../../../../../../node_modules/@syncfusion/ej2-vue-treegrid/styles/material3.css';
</style>
