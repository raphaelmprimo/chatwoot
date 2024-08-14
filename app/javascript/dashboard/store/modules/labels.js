import * as MutationHelpers from 'shared/helpers/vuex/mutationHelpers';
import types from '../mutation-types';
import LabelsAPI from '../../api/labels';
import AnalyticsHelper from '../../helper/AnalyticsHelper';
import { LABEL_EVENTS } from '../../helper/AnalyticsHelper/events';

export const state = {
  records: [],
  labelForKanban: null,
  uiFlags: {
    isFetching: false,
    isFetchingItem: false,
    isCreating: false,
    isDeleting: false,
  },
};

export const getters = {
  getLabels(_state) {
    return _state.records.sort((a, b) => a.position - b.position);
  },
  getUIFlags(_state) {
    return _state.uiFlags;
  },
  getLabelsOnSidebar(_state) {
    return _state.records
      .filter(record => record.show_on_sidebar)
      .sort((a, b) => a.title.localeCompare(b.title));
  },
};

export const actions = {
  revalidate: async function revalidate({ commit }, { newKey }) {
    try {
      const isExistingKeyValid = await LabelsAPI.validateCacheKey(newKey);
      if (!isExistingKeyValid) {
        const response = await LabelsAPI.refetchAndCommit(newKey);
        commit(types.SET_LABELS, response.data.payload);
      }
    } catch (error) {
      // Ignore error
    }
  },
  async getAllLabels({ commit }) {
    try {
      const response = await LabelsAPI.get(true);
      const listLabels = response.data.payload.sort((a, b) => a.position - b.position);
      commit(types.SET_LABELS, listLabels);
    } catch (error) {
    } finally {
      commit(types.SET_LABEL_UI_FLAG, { isFetching: false });
    }
  },

  get: async function getLabels({ commit }) {
    commit(types.SET_LABEL_UI_FLAG, { isFetching: true });
    try {
      const response = await LabelsAPI.get(false);
      const sortedLabels = response.data.payload.sort((a, b) => a.position - b.position);
      commit(types.SET_LABELS, sortedLabels);
    } catch (error) {
      // Ignore error
    } finally {
      commit(types.SET_LABEL_UI_FLAG, { isFetching: false });
    }
  },

  create: async function createLabels({ commit }, cannedObj) {
    commit(types.SET_LABEL_UI_FLAG, { isCreating: true });
    try {
      const response = await LabelsAPI.create(cannedObj);
      AnalyticsHelper.track(LABEL_EVENTS.CREATE);
      commit(types.ADD_LABEL, response.data);
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      throw new Error(errorMessage);
    } finally {
      commit(types.SET_LABEL_UI_FLAG, { isCreating: false });
    }
  },

  update: async function updateLabels({ commit }, { id, ...updateObj }) {
    commit(types.SET_LABEL_UI_FLAG, { isUpdating: true });
    try {
      const response = await LabelsAPI.update(id, updateObj);
      AnalyticsHelper.track(LABEL_EVENTS.UPDATE);
      commit(types.EDIT_LABEL, response.data);
    } catch (error) {
      throw new Error(error);
    } finally {
      commit(types.SET_LABEL_UI_FLAG, { isUpdating: false });
    }
  },

  getLabelForKanban: async ({ commit }, labelTitle) => {
    commit(types.SET_LABEL_UI_FLAG, { isFetching: false });
    try {
      const response = await LabelsAPI.getLabelForKanban(labelTitle);
      commit(types.SET_LABEL_KANBAN, response.data);
      return response.data
    } catch (error) {
    } finally {
      commit(types.SET_LABEL_UI_FLAG, { isFetching: false });
    }
  },

  updatePosition: async ({ commit }, { labelId, position }) => {
    commit(types.SET_LABEL_UI_FLAG, { isUpdating: true });
    try {
      const response = await LabelsAPI.updatePosition(labelId, position);
      commit(types.EDIT_LABEL, response.data);
    } catch (error) {
      // listen to error
    } finally {
      commit(types.SET_LABEL_UI_FLAG, {
        isUpdating: false,
      });
    }
  },

  delete: async function deleteLabels({ commit }, id) {
    commit(types.SET_LABEL_UI_FLAG, { isDeleting: true });
    try {
      await LabelsAPI.delete(id);
      AnalyticsHelper.track(LABEL_EVENTS.DELETED);
      commit(types.DELETE_LABEL, id);
    } catch (error) {
      throw new Error(error);
    } finally {
      commit(types.SET_LABEL_UI_FLAG, { isDeleting: false });
    }
  },
};

export const mutations = {
  [types.SET_LABEL_UI_FLAG](_state, data) {
    _state.uiFlags = {
      ..._state.uiFlags,
      ...data,
    };
  },

  [types.SET_LABEL_KANBAN](_state, label) {
    _state.labelForKanban = label;
  },

  [types.SET_LABELS]: MutationHelpers.set,
  [types.ADD_LABEL]: MutationHelpers.create,
  [types.EDIT_LABEL]: MutationHelpers.update,
  [types.DELETE_LABEL]: MutationHelpers.destroy,
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
