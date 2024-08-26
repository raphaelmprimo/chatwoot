import types from '../../mutation-types';
import ScheduleApi from '../../../api/schedules';
import { LOCAL_STORAGE_KEYS } from 'dashboard/constants/localStorage';
import { LocalStorage } from 'shared/helpers/localStorage';

const actions = {
  get: async ({ commit }) => {
    commit(types.SET_CALENDARS_UI_FLAG, {
      isFetching: true,
    });
    try {
      const response = await ScheduleApi.get();
      commit(types.SET_CALENDARS, response.data.payload);
    } catch (error) {
      commit(types.SET_CALENDARS_UI_FLAG, false);
    }
	},
	delete: async ({ commit }, scheduleId) => {
		commit(types.SET_SCHEDULES_UI_FLAG, {
			isDeleting: true,
		});
		try {
			await ScheduleApi.removeSchedule(scheduleId);
			commit(types.REMOVE_SCHEDULE, scheduleId);
		} catch (error) {
			// Handle error
		} finally {
			commit(types.SET_SCHEDULES_UI_FLAG, {
				isDeleting: false,
			});
		}
	},
	
  fetchCalendars: async ({ commit }) => {
    commit(types.SET_CALENDARS_UI_FLAG, {
      isFetching: true,
    });
    try {
      const response = await ScheduleApi.get();
      commit(types.SET_CALENDARS, response.data.payload);
    } catch (error) {
      // Handle error appropriately
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

  getDefaultCalendar: async ({ commit }) => {
    commit(types.SET_CALENDARS_UI_FLAG, {
      isFetching: true,
    });
    try {
        const response = await ScheduleApi.getDefaultCalendar();
        const id = response.data.payload[0].calendar_id;
        commit(types.SET_CALENDARS_DEFAULT, response.data.payload);
        LocalStorage.set(LOCAL_STORAGE_KEYS.DEFAULT_CALENDAR_ID, id);
    } catch (error) {
      // Handle error
    } finally {
      commit(types.SET_CALENDARS_UI_FLAG, {
        isFetching: false,
      });
    }
  },


  fetchSchedules: async({ commit }) => {
    commit(types.SET_SCHEDULES_UI_FLAG, {
      isFetching: true,
    });

    try {
      const response = await ScheduleApi.getSchedules();
      commit(types.SET_SCHEDULES, response.data);
    } catch (error) {
      // Handle error
    } finally {
      commit(types.SET_SCHEDULES_UI_FLAG, {
      isFetching: false,
    });
    }
	},
	

  fetchSchedulesConversation: async({ commit }, conversationUuid) => {
    commit(types.SET_SCHEDULES_UI_FLAG, {
      isFetching: true,
    });

    try {
      const response = await ScheduleApi.getConversationSchedules(conversationUuid);
      commit(types.SET_CONVERSATION_SCHEDULES, response.data);
    } catch (error) {
      // Handle error
    } finally {
      commit(types.SET_SCHEDULES_UI_FLAG, {
      isFetching: false,
    });
    }
  },

  fetchSchedulesLabel: async ({ commit }, labelID ) => {
    commit(types.SET_SCHEDULES_UI_FLAG, {
      isFetching: true,
    });

    try {
      const response = await ScheduleApi.getSchedulesLabel(labelID);
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
      const response = await ScheduleApi.post(calendar);
      commit(types.SET_CALENDARS, { data: response.data.payload }); // Assuming the response contains the updated list of calendars
    } catch (error) {
      // Handle error
    } finally {
      commit(types.SET_CALENDARS_UI_FLAG, {
        isCreating: false
      });
    }
  },

  async addSchedule({ commit }, schedule) {
    commit(types.SET_SCHEDULES_UI_FLAG, {
      isCreating: true
    });
    try {
      const response = await ScheduleApi.addSchedule(schedule);
      commit(types.ADD_SCHEDULE, schedule);
    } catch (error) {
      // Handle error
    } finally {
      commit(types.SET_SCHEDULES_UI_FLAG, {
        isCreating: false
      });
    }
  },

  async updateSchedule({ commit },  schedule ) {
    commit(types.SET_SCHEDULES_UI_FLAG, {
      isUpdating: true
    });
    try {
      const response = await ScheduleApi.updateSchedule(schedule);
      commit(types.UPDATE_SCHEDULE, response.data);
    } catch (error) {
      // Handle error
    } finally {
      commit(types.SET_SCHEDULES_UI_FLAG, {
       isUpdating: false
      });
    }
  },

  async removeSchedule({ commit }, scheduleID ) {
    commit(types.SET_SCHEDULES_UI_FLAG, { flag: 'isDeleting', value: true });
    try {
      await ScheduleApi.removeSchedule(scheduleID);
      commit(types.REMOVE_SCHEDULE, scheduleID);
    } catch (error) {
      // Handle error
    } finally {
      commit(types.SET_SCHEDULES_UI_FLAG, { isDeleting: false });
    }
  },
};
export default actions;
