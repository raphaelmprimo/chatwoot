import types from '../mutation-types';
import KanbanAPI from '../../api/kanban';
import AnalyticsHelper from '../../helper/AnalyticsHelper';
import { KANBAN_EVENTS } from '../../helper/AnalyticsHelper/events';

const state = {
  attributes: [],
  uiFlags: {
    isFetching: false,
    isUpdating: false,
  },
};

export const getters = {
  getUIFlags(_state) {
    return _state.uiFlags;
  },
  getAttributes: _state => {
     return _state.attributes;
  },

};

export const actions = {
  get: async function getAllAttributes({ commit }) {
    commit(types.SET_KANBAN_ATTRIBUTE_UI_FLAG, { isFetching: true });
    try {
      const response = await KanbanAPI.get();
      commit(types.SET_KANBAN_ATTRIBUTES, response.data);
    } catch (error) {
      // Ignore error
    } finally {
      commit(types.SET_KANBAN_ATTRIBUTE_UI_FLAG, { isFetching: false });
    }
  },
  fetchAttributes: async ({ commit }) => {
    commit(types.SET_KANBAN_ATTRIBUTE_UI_FLAG, {
      isFetching: true,
    });
    try {
      const response = await KanbanAPI.get();
      commit(types.SET_KANBAN_ATTRIBUTES, response.data);
    } catch (error) {
      // Handle error appropriately
    } finally {
      commit(types.SET_KANBAN_ATTRIBUTE_UI_FLAG, {
        isFetching: false,
      });
    }
  },
  update: async function updateKanbanAttributes({ commit },  kanbanAttributes ) {
    commit(types.SET_KANBAN_ATTRIBUTE_UI_FLAG, { isUpdating: true });
    try {
      const response = await KanbanAPI.update(kanbanAttributes);
      console.log("UPDATED", response.data);
      AnalyticsHelper.track(KANBAN_EVENTS.UPDATE);
      commit(types.UPDATE_KANBAN_ATTRIBUTES, response.data);
    } catch (error) {
      throw new Error(error);
    } finally {
      commit(types.SET_KANBAN_ATTRIBUTE_UI_FLAG, { isUpdating: false });
    }
  },
};


export const mutations = {
  [types.SET_KANBAN_ATTRIBUTE_UI_FLAG](_state, data) {
    _state.uiFlags = {
      ..._state.uiFlags,
      ...data,
    };
  },

  [types.SET_KANBAN_ATTRIBUTES] (_state, data) {
   _state.attributes = data;
  },

  [types.UPDATE_KANBAN_ATTRIBUTES] (_state, data) {
    console.log("IS UPDATED DATA", data);
  }
};

export default {
  namespaced: true,
  actions,
  state,
  getters,
  mutations,
};
