import Vue from 'vue';
import * as MutationHelpers from 'shared/helpers/vuex/mutationHelpers';
import types from '../../mutation-types';
import actions from './actions';

// const getters = {
//   calendars: state => state.calendars,
//   currentCalendar: state => state.currentCalendar,
//   schedules: state => state.schedules,
// };

const state = {
  calendars: [],
  defaultCalendarId: null,
  schedules: [],
  uiFlags: {
    isFetching: false,
    isUpdating: false,
    isCreating: false,
    isDeleting: false,
  },
};

// mutations
export const getters = {
  getAllCalendars (_state) {
    return _state.calendars;
  },
  getAllSchedules (state) {
    return state.schedules;
  },
  getDefaultCalendarId (_state) {
    console.log("DEFALT_CALENDAR",_state.defaultCalendarId)
    return _state.defaultCalendarId;
  },
};
export const mutations = {
  [types.SET_CALENDARS_UI_FLAG](_state, data) {
    _state.uiFlags = {
      ..._state.uiFlags,
      ...data,
    };
  },
  [types.SET_CALENDARS] (_state, data) {
    _state.calendars = data;
  },
  [types.SET_SCHEDULES](_state, data) {
    _state.schedules = data
  },
  [types.SET_CALENDARS_DEFAULT](_state, calendarId) {
    _state.defaultCalendarId = calendarId;
  },

  [types.SET_SCHEDULES_UI_FLAG](_state, data) {
    _state.uiFlags = {
      ..._state.uiFlags,
      ...data,
    };
  },
  [types.ADD_SCHEDULE](_state, schedule) {
    _state.schedules.push(schedule);
  },

  [types.UPDATE_SCHEDULE](_state, updatedSchedule) {
    const index = _state.schedules.findIndex(
      schedule => schedule.id === updatedSchedule.id
    );
    if (index !== -1) {
      _state.schedules.splice(index, 1, updatedSchedule);
    }
  },
 // [types.default.SET_CALENDARS]: MutationHelpers.set(state, data),
 // [types.default.SET_CALENDARS_SCHEDULES]: MutationHelpers.set,
 // [types.default.SET_CURRENT_CALENDAR]: MutationHelpers.set,
  // [types.REMOVE_SCHEDULE]($state, scheduleID) {
  //   $state.schedules = $state.schedules.filter(
  //     schedule => schedule.id !== scheduleID
  //   );
  // },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
