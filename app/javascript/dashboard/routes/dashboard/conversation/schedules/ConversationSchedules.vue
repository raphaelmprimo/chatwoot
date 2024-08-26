<template>
  <div class="bg-white dark:bg-slate-900">
    <table v-if="schedules.length" class="woot-table text-xs">
      <tbody>
        <tr v-for="schedule in schedules" :key="schedule.id">
          <td>{{ schedule.Owner }}</td>
          <td>{{ schedule.Subject }}</td>
          <td>{{ formatDateTime(schedule.start_time) }}</td>
          <td>
            <woot-button
              v-if="isAdmin"
              v-tooltip.top="$t('INBOX_MGMT.DELETE.BUTTON_TEXT')"
              variant="smooth"
              color-scheme="alert"
              size="tiny"
              class-names="grey-btn"
              :is-loading="loading[schedule.id]"
              icon="dismiss-circle"
              @click="openDelete(schedule)"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <woot-button
      v-if="isAdmin"
      variant="smooth"
      icon="add"
      size="tiny"
      class="macros_add-button"
      @click="openModalSchedule()"
    >
      Agendar
    </woot-button>

    <woot-confirm-delete-modal
      v-if="showDeletePopup"
      :show.sync="showDeletePopup"
      :title="$t('SCHEDULE.DELETE.CONFIRM.TITLE')"
      message="Tem certeza que deseja excluir o Agendamento?"
      confirm-text="Digite 'Sim', sem aspas, para confirmar!"
      reject-text="Cancelar"
      confirm-value="Sim"
      @on-confirm="confirmDeletion"
      @on-close="closeDelete"
    />

    <woot-modal :show.sync="showModalSchedule" :on-close="closeModalSchedule">
      <modal-schedule-conversation
        :uuid="uuid"
        :conversation-id="conversationId"
        @close="closeModalSchedule"
      />
    </woot-modal>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import timeMixin from 'dashboard/mixins/time';
import adminMixin from '../../../../mixins/isAdmin';
import accountMixin from '../../../../mixins/account';
import ModalScheduleConversation from './ModalScheduleConversation.vue';

export default {
  components: {
    ModalScheduleConversation,
  },
  mixins: [timeMixin, adminMixin, accountMixin],
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    conversationId: {
      type: [Number, String],
      required: true,
    },
    onToggle: {
      type: Function,
      default: () => {
        !this.isOpen;
      },
    },
    uuid: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      eventsSettings: {
        dataSource: [],
      },
      loading: {},
      selectedSchedule: {},
      showDeletePopup: false,
      showModalSchedule: false,
    };
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

  beforeMount() {
    this.$store.dispatch('calendars/fetchSchedulesConversation', this.uuid);
    // this.$store.dispatch('agents/get');
    // this.$store.dispatch('calendars/getDefaultCalendar');
  },
  mounted() {},
  methods: {
    formatDateTime(date) {
      return this.dateFormat(date, 'dd/MM/yyyy HH:mm');
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
            start_time: event.start_time,
            end_time: event.end_time,
            IsAllDay: event.IsAllDay,
            IsBlock: event.IsBlock,
            IsReadonly: event.IsReadonly,
            RoomId: event.RoomId,
            ResourceId: event.ResourceId,
            CalendarId: event.CalendarId,
            WorkerIds: event.WorkerIds,
            Owner: event.Owner,
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
          }));
          this.resourceDataSource = workers;
        })
        .catch(error => {
          console.error(error);
        });
    },
    loadCalendarId() {
      const calendarId = LocalStorage.get(
        LOCAL_STORAGE_KEYS.DEFAULT_CALENDAR_ID || 0
      );
      if (calendarId && calendarId !== this.calendarId) {
        this.selectedCalendarId = parseInt(calendarId, 10);
        this.setCalendarId(calendarId);
      }
    },
    setCalendarId(calendarId) {
      if (calendarId === this.calendarId) return;
      this.$store.dispatch('calendars/setDefaultCalendarId', calendarId);
      this.$store.dispatch('calendars/getDefaultCalendarId');
      this.fetchEvents();
    },

    async deleteSchedule({ Id }) {
      try {
        await this.$store.dispatch('calendars/delete', Id).then(() => {
          this.refreshSchedules();
        });
        bus.$emit(
          'newToastMessage',
          this.$t('SCHEDULE.DELETE.API.SUCCESS_MESSAGE')
        );
      } catch (error) {
        bus.$emit(
          'newToastMessage',
          this.$t('SCHEDULE.DELETE.API.ERROR_MESSAGE')
        );
      }
    },

    confirmDeletion() {
      this.deleteSchedule(this.selectedSchedule);
      this.closeDelete();
    },
    openDelete(schedule) {
      this.showDeletePopup = true;
      this.selectedSchedule = schedule;
    },
    closeDelete() {
      this.showDeletePopup = false;
      this.selectedSchedule = {};
    },

    openModalSchedule() {
      this.showModalSchedule = true;
    },
    closeModalSchedule() {
      this.showModalSchedule = false;
    },
    refreshSchedules() {
      this.$store.dispatch('agents/get');
      this.$store.dispatch('calendars/fetchSchedulesConversation', this.uuid);
      this.fetchEvents();
      this.fetchWorkers();
    },
  },
};
</script>
