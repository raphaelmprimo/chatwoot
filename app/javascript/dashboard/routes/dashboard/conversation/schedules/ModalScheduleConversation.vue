<template>
  <div class="h-auto overflow-auto flex flex-col">
    <woot-modal-header header-title="Adicionar Agendamento" />
    <div class="w-full me-3 modal-content">
      <div class="content-wrapper schedule-wrapper">
        <ejs-schedule
          id="schedule"
          ref="ScheduleObj"
          width="100%"
          class="w-full"
          :selectedDate="selectedDate"
          :eventSettings="eventSettings"
          currentView="Month"
          :enableAdaptiveUI="enableAdaptiveUI"
          :group="group"
          @actionBegin="onActionBegin"
          @actionComplete="onActionComplete"
          :popupClose="onPopupClose"
          :locale="locale"
          :eventRendered="oneventRendered"
        >
          <e-views>
            <e-view option="Agenda"></e-view>
            <e-view option="Day"></e-view>
            <e-view option="Week"></e-view>
            <e-view option="Month"></e-view>
          </e-views>
          <e-resources>
            <e-resource
              field="GroupId"
              title="Selecione a Agenda"
              name="Agendas"
              :dataSource="agendasDataSource"
              textField="text"
              idField="id"
              colorField="color"
            >
            </e-resource>
            <e-resource
              field="AgentIds"
              title="Agente"
              name="Agentes"
              :dataSource="resourceDataSource"
              :allowMultiple="allowMultiple"
              textField="Name"
              idField="Id"
              groupIDField="groupId"
              colorField="color"
            >
            </e-resource>
          </e-resources>
        </ejs-schedule>
      </div>
    </div>
  </div>
</template>
<style>
@media (min-width: 481px) {
  .schedule-vue-sample .schedule-wrapper {
    margin: 0 25%;
  }
}
</style>
<script>
import { resourceData, timelineResourceData } from '../dataSourceSchedule';
import localeText from '../syncfusion-locale/pt.json';
import { loadCldr, L10n, createElement, extend } from '@syncfusion/ej2-base';
import { mapGetters } from 'vuex';
import { apiURL } from '../../../../helper/URLHelper';

import {
  ScheduleComponent,
  ViewDirective,
  ViewsDirective,
  ResourcesDirective,
  ResourceDirective,
  Day,
  Week,
  Month,
  Agenda,
  DragAndDrop,
  Resize,
} from '@syncfusion/ej2-vue-schedule';

L10n.load(localeText);
loadCldr(
  require('cldr-data/supplemental/numberingSystems.json'),
  require('cldr-data/main/pt/ca-gregorian.json'),
  require('cldr-data/main/pt/numbers.json'),
  require('cldr-data/main/pt/timeZoneNames.json')
);
export default {
  components: {
    'ejs-schedule': ScheduleComponent,
    'e-view': ViewDirective,
    'e-views': ViewsDirective,
    'e-resource': ResourceDirective,
    'e-resources': ResourcesDirective,
  },
  props: {
    conversationId: {
      type: [Number, String],
      required: true,
    },
    uuid: {
      type: String,
      default: '',
    },
  },
  data: function () {
    return {
      eventSettings: {
        dataSource: [],
      },
      locale: 'pt',
      selectedDate: new Date(),
      enableAdaptiveUI: true,
      allowMultiple: true,
      group: {
        resources: ['Agendas', 'Agentes'],
      },
      agendasDataSource: [{ text: 'Agenda', id: 1, color: '#0fa7e8' }],
      resourceDataSource: [],
      projectId: null,
    };
  },
  provide: {
    schedule: [Day, Week, Month, Agenda, DragAndDrop, Resize],
  },
  computed: {
    ...mapGetters({
      accountId: 'getCurrentAccountId',
      currentUser: 'getCurrentUser',
      calendar: 'calendars/defaultCalendar',
      agents: 'agents/getVerifiedAgents',
      schedules: 'calendars/getAllSchedules',
    }),
  },
  beforeMounted() {
    this.$store.dispatch('agents/get');
    this.$store.dispatch('calendars/fetchSchedulesConversation', this.uuid);
  },
  mounted() {
    this.$refs.ScheduleObj = this.$refs.ScheduleObj.$el.ej2_instances[0];
    this.fetchEvents();
    this.fetchWorkers();
  },
  methods: {
    onActionBegin(args) {
      if (args.requestType === 'eventCreate') {
        this.createEvent(args.data[0]);
      } else if (args.requestType === 'eventChange') {
        this.updateEvent(args.data);
      } else if (args.requestType === 'eventRemove') {
        this.deleteEvent(args.data[0]);
      }
    },
    onActionComplete(args) {},
    updateEvent(event) {
      axios
        .put(apiURL(`accounts/${this.accountId}/schedules/${event.Id}`), {
          subject: event.Subject,
          start_time: event.StartTime,
          end_time: event.EndTime,
          description: event.Description,
          location: event.Location,
          user_ids: event.AgentIds,
          group_id: event.GroupId,
        })
        .then(response => {
          this.refreshSchedules();
        })
        .catch(error => {
          console.error(error);
        });
    },
    deleteEvent(event) {
      axios
        .delete(apiURL(`accounts/${this.accountId}/schedules/${event.Id}`))
        .then(response => {
          bus.$emit(
            'newToastMessage',
            this.$t('SCHEDULE.DELETE.API.SUCCESS_MESSAGE')
          );
          this.refreshSchedules();
        })
        .catch(error => {
          console.error(error);
        });
    },
    createEvent(event) {
      axios
        .post(apiURL(`accounts/${this.accountId}/schedules`), {
          user_id: this.currentUser.id,
          owner_id: Array.isArray(event.AgentIds)
            ? event.AgentIds[0]
            : event.AgentIds,
          subject: event.Subject,
          start_time: event.StartTime,
          end_time: event.EndTime,
          description: event.Description,
          location: event.Location,
          group_id: event.GroupId,
          conversation_uuid: this.uuid,
        })
        .then(response => {
          this.refreshSchedules();
        })
        .catch(error => {
          console.error(error);
        });
    },
    generateData: function () {
      var collections = [];
      var dataCollections = [this.schedules, timelineResourceData];
      for (var i = 0; i < dataCollections.length; i++) {
        collections = collections.concat(dataCollections[i]);
      }
      return collections;
    },
    fetchEvents() {
      const accountId = this.accountId;
      axios
        .get(
          apiURL(
            `accounts/${this.accountId}/schedules/${this.uuid}/conversation_schedules`
          )
        )
        .then(response => {
          const mappedData = response.data.map(event => ({
            Id: event.Id,
            Subject: event.Subject,
            Description: event.Description,
            Location: event.Location,
            StartTime: new Date(event.StartTime),
            EndTime: new Date(event.EndTime),
            IsAllDay: event.IsAllDay,
            IsBlock: event.IsBlock,
            IsReadonly: event.IsReadonly,
            CalendarId: event.CalendarId,
            WorkerIds: event.WorkerIds,
            GroupId: event.GroupId,
            AgentIds: event.OwnerId,
          }));
          this.eventSettings = {
            ...this.eventSettings,
            dataSource: mappedData,
          };
        })
        .catch(error => {
          console.error(error);
        });
    },
    fetchWorkers() {
      axios
        .get(apiURL(`accounts/${this.accountId}/agents`))
        .then(response => {
          const workers = response.data.map(worker => ({
            Id: worker.id,
            Name: worker.name,
            Color: worker.color,
            Roles: worker.roles,
            groupId: 1,
          }));
          this.resourceDataSource = workers;
        })
        .catch(error => {
          console.error(error);
        });
    },

    refreshSchedules() {
      this.$store.dispatch('agents/get');
      this.$store.dispatch('calendars/fetchSchedulesConversation', this.uuid);
      this.fetchEvents();
      this.fetchWorkers();
    },
    onPopupOpen: function (args) {
      if (args.type === 'Editor') {
      }
    },
    onPopupClose: function (args) {
      if (args.type === 'Editor') {
        if (
          args.event.srcElement.innerText === 'Salvar' ||
          args.event.srcElement.innerText === 'Save'
        ) {
          this.createEvent(args.data);
        }
      }
    },
    oneventRendered: function (args) {
      let scheduleObj = this.$refs.ScheduleObj;
      let categoryColor = args.data.GroupColor;
      if (!args.element || !categoryColor) {
        return;
      }
      if (scheduleObj.ej2Instances.currentView === 'Agenda') {
        args.element.firstChild.style.borderLeftColor = categoryColor;
      } else {
        args.element.style.backgroundColor = categoryColor;
      }
    },
  },
};
</script>
<style>
@import '@syncfusion/ej2-base/styles/tailwind.css';
@import '@syncfusion/ej2-layouts/styles/tailwind.css';
@import '@syncfusion/ej2-buttons/styles/tailwind.css';
@import '@syncfusion/ej2-calendars/styles/tailwind.css';
@import '@syncfusion/ej2-dropdowns/styles/tailwind.css';
@import '@syncfusion/ej2-inputs/styles/tailwind.css';
@import '@syncfusion/ej2-navigations/styles/tailwind.css';
@import '@syncfusion/ej2-popups/styles/tailwind.css';
@import '@syncfusion/ej2-vue-schedule/styles/tailwind.css';

.horizontaldot.e-icons::before {
  content: '\eb04';
}
.schedule-vue-sample {
  width: 100%;
  height: 100%;
}

.schedule-vue-sample
  .groupediting.e-schedule
  .e-month-view
  .e-appointment
  .e-appointment-details {
  padding: 1px;
  padding-left: 3px;
}

.schedule-vue-sample
  .groupediting.e-schedule
  .e-vertical-view
  .e-resource-cells {
  height: 62px;
}

.schedule-vue-sample .groupediting.e-schedule .template-wrap {
  display: flex;
  text-align: left;
}

.schedule-vue-sample .groupediting.e-schedule .template-wrap .resource-image {
  width: 45px;
  height: 45px;
  background-size: 45px;
  background-repeat: no-repeat;
}

.schedule-vue-sample .groupediting.e-schedule .template-wrap .resource-details {
  padding-left: 10px;
}

.schedule-vue-sample
  .groupediting.e-schedule
  .template-wrap
  .resource-details
  .resource-name {
  font-size: 16px;
  font-weight: 500;
  padding-right: 10px;
}

.schedule-vue-sample
  .groupediting.e-schedule
  .template-wrap
  .resource-details
  .resource-designation {
  font-size: 12px;
}

.schedule-vue-sample
  .groupediting.e-schedule.e-device
  .template-wrap
  .resource-details
  .resource-designation {
  display: none;
}

.schedule-vue-sample
  .groupediting.e-schedule.e-device
  .template-wrap
  .resource-details
  .resource-name {
  font-size: inherit;
  font-weight: inherit;
  padding-top: 5px;
}

.schedule-vue-sample
  .groupediting.e-schedule.e-device
  .e-resource-tree-popup
  .e-fullrow {
  height: 50px;
}

.e-calendar {
  border: none;
}

.e-schedule {
  border: none;
}

.border-custom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.e-time-slots {
  padding: 0 !important;
}

#calendar .e-footer-container {
  display: none !important;
}

#btnsChevron .chevron-button,
#btnSearch .search-button {
  background-color: transparent !important;
  color: rgba(0, 0, 0, 0.8);
}

.e-schedule-table .e-current-day,
.e-calendar .e-content td.e-focused-date .e-today span.e-day,
.e-calendar .e-content td.e-today:not(e-selected) span.e-day,
.e-calendar .e-content td.e-today:hover span.e-day,
.e-schedule .e-vertical-view .e-current-time,
.e-btn.e-flat.e-primary {
  color: rgb(26, 115, 232) !important;
}

.e-calendar .e-content td.e-selected span.e-day {
  background-color: rgb(26, 115, 232) !important;
}

.e-calendar .e-content td.e-focused-date.e-today span.e-day,
.e-calendar .e-content td.e-today span.e-day,
.e-calendar .e-content td.e-today:hover span.e-day,
.e-schedule .e-vertical-view .e-current-timeline,
.e-schedule .e-vertical-view .e-previous-timeline {
  border-color: rgb(26, 115, 232) !important;
}

.e-accordion
  .e-acrdn-item.e-select.e-selected.e-expand-state
  > .e-acrdn-header
  .e-acrdn-header-content {
  color: rgba(0, 0, 0, 0.87) !important;
}

.e-input-focus::before,
.e-input-focus::after,
#ScheduleEditForm .e-input-focus .e-float-line::before,
#ScheduleEditForm .e-input-focus .e-float-line::after {
  background: rgb(26, 115, 232) !important;
}

.today-btn {
  padding: 5px 10px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  color: rgba(0, 0, 0, 0.8);
  transition: 0.15s;
}
.today-btn:hover {
  background: rgba(0, 0, 0, 0.15);
  transition: 0.15s;
}

.today-btn:active {
  background: rgba(0, 0, 0, 0.3);
  transition: 0.15s;
}

#searchNamesContainer > span {
  border-radius: 0px !important;
  background: rgba(0, 0, 0, 0.05) !important;
  padding: 0 10px !important;
  height: 40px !important;
}

#ScheduleEditForm .e-input-focus label {
  color: rgb(26, 115, 232);
}

#ScheduleEditForm .e-check {
  background: rgb(26, 115, 232) !important;
}
</style>
