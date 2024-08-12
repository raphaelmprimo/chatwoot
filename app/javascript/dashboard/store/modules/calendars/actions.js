import types from '../../mutation-types';
import CalendarApi from '../../../api/calendars';
import { LOCAL_STORAGE_KEYS } from 'dashboard/constants/localStorage';
import { LocalStorage } from 'shared/helpers/localStorage';

const actions = {
  get: async ({ commit }) => {
    commit(types.SET_CALENDARS_UI_FLAG, {
      isFetching: true,
    });
    try {
      const response = await CalendarApi.get();
      commit(types.SET_CALENDARS, response.data.payload);
    } catch (error) {
      commit(types.SET_CALENDARS_UI_FLAG, false);
    }
  },
  fetchCalendars: async ({ commit }) => {
    commit(types.SET_CALENDARS_UI_FLAG, {
      isFetching: true,
    });
    try {
      const response = await CalendarApi.get();
      commit(types.SET_CALENDARS, response.data.payload);
    } catch (error) {
      // Handle error appropriately
      console.error('Error fetching calendars:', error);
    } finally {
      commit(types.SET_CALENDARS_UI_FLAG, {
        isFetching: false,
      });
    }
  },

  setDefaultCalendarId: ({ commit }, calendarId) => {
    commit(types.SET_CALENDARS_UI_FLAG, {
      isFetching: true,
    });
    try {
      LocalStorage.set(LOCAL_STORAGE_KEYS.DEFAULT_CALENDAR_ID, calendarId);
    } finally {
      commit(types.SET_CALENDARS_UI_FLAG, {
        isFetching: false,
      });
    }
  },

  getDefaultCalendarId: ({ commit }) => {
    commit(types.SET_CALENDARS_UI_FLAG, {
      isFetching: true,
    });
    const idCal = LocalStorage.get(
      LOCAL_STORAGE_KEYS.DEFAULT_CALENDAR_ID
    )
    try {
      if (idCal !== null) {
        commit(types.SET_CALENDARS_DEFAULT, parseInt(idCal, 10));
      }
    }catch (error) {
      // Handle error
    } finally {
      commit(types.SET_CALENDARS_UI_FLAG, {
        isFetching: false,
      });
    }
  },

  fetchSchedules: async({ commit }, calendarID) => {
    commit(types.SET_SCHEDULES_UI_FLAG, {
      isFetching: true,
    });

    try {
      const response = await CalendarApi.getSchedules(calendarID);
      commit(types.SET_SCHEDULES, response.data);
    } catch (error) {
      // Handle error
    } finally {
      commit(types.SET_SCHEDULES_UI_FLAG, {
      isFetching: false,
    });
    }
  },

  fetchSchedulesLabel: async ({ commit }, { calendarID, labelID }) => {
    commit(types.SET_SCHEDULES_UI_FLAG, {
      isFetching: true,
    });

    try {
      const response = await CalendarApi.getSchedulesLabel(calendarID, labelID);
      commit(types.SET_SCHEDULES, response.data);
    } catch (error) {
      // Handle error
    } finally {
      commit(types.SET_SCHEDULES_UI_FLAG, {
      isFetching: false,
    });
    }
  },


    fetchSchedules: async({ commit }, calendarID) => {
    commit(types.SET_SCHEDULES_UI_FLAG, {
      isFetching: true,
    });

    try {
      const response = await CalendarApi.getSchedules(calendarID);
      commit(types.SET_SCHEDULES, response.data);
    } catch (error) {
      // Handle error
    } finally {
      commit(types.SET_SCHEDULES_UI_FLAG, {
      isFetching: false,
    });
    }
  },

  async createCalendar({ commit }, calendar) {
    commit(types.SET_CALENDARS_UI_FLAG, {
      isCreating: true
    });
    try {
      const response = await CalendarApi.post(calendar);
      commit(types.SET_CALENDARS, { data: response.data.payload }); // Assuming the response contains the updated list of calendars
    } catch (error) {
      // Handle error
    } finally {
      commit(types.SET_CALENDARS_UI_FLAG, {
        isCreating: false
      });
    }
  },

  async addSchedule({ commit }, { calendarID, schedule }) {
    commit(types.SET_SCHEDULES_UI_FLAG, {
      isCreating: true
    });
    try {
      const response = await CalendarApi.addSchedule(calendarID, schedule);
      commit(types.ADD_SCHEDULE, schedule);
    } catch (error) {
      // Handle error
    } finally {
      commit(types.SET_SCHEDULES_UI_FLAG, {
        isCreating: false
      });
    }
  },

  async updateSchedule({ commit }, { calendarID, schedule }) {
    commit(types.SET_SCHEDULES_UI_FLAG, {
      isUpdating: true
    });
    try {
      const response = await CalendarApi.updateSchedule(calendarID, schedule);
      commit(types.UPDATE_SCHEDULE, response.data);
    } catch (error) {
      // Handle error
    } finally {
      commit(types.SET_SCHEDULES_UI_FLAG, {
       isUpdating: false
      });
    }
  },

  async removeSchedule({ commit }, { calendarID, scheduleID }) {
    commit(types.SET_SCHEDULES_UI_FLAG, { flag: 'isDeleting', value: true });
    try {
      await CalendarApi.removeSchedule(calendarID, scheduleID);
      commit(types.REMOVE_SCHEDULE, scheduleID);
    } catch (error) {
      // Handle error
    } finally {
      commit(types.SET_SCHEDULES_UI_FLAG, { isDeleting: false });
    }
  },
};
export default actions;
