import Vue from 'vue';
import * as types from '../mutation-types';
import ConversationAPI from '../../api/conversations';

const state = {
  records: {},
  properties: {},
  uiFlags: {
    isFetching: false,
    isUpdating: false,
    isError: false,
  },
};

export const getters = {
  getUIFlags($state) {
    return $state.uiFlags;
  },
  getConversationLabels: $state => id => {
    return $state.records[Number(id)] || [];
  },
  listProperties: $state => {
    return $state.properties || [];
  },
};

export const actions = {
  get: async ({ commit }, conversationId) => {
    commit(types.default.SET_CONVERSATION_LABELS_UI_FLAG, {
      isFetching: true,
    });
    try {
      const response = await ConversationAPI.getLabels(conversationId);
      commit(types.default.SET_CONVERSATION_LABELS, {
        id: conversationId,
        data: response.data.payload,
      });
      commit(types.default.SET_CONVERSATION_LABELS_UI_FLAG, {
        isFetching: false,
      });
    } catch (error) {
      commit(types.default.SET_CONVERSATION_LABELS_UI_FLAG, {
        isFetching: false,
      });
    }
  },
  getProperties: async ({ commit }, uuid) => {
    commit(types.default.SET_CONVERSATION_PROPERTIES_UI_FLAG, {
      isFetching: true,
    });
    try {
      const response = await ConversationAPI.getProperties(uuid);

      console.log('RESULTADO', response.data.payload);
      commit(types.default.SET_CONVERSATION_PROPERTIES, {
        data: response.data.payload,
      });
      commit(types.default.SET_CONVERSATION_PROPERTIES_UI_FLAG, {
        isFetching: false,
      });
    } catch (error) {
      commit(types.default.SET_CONVERSATION_PROPERTIES_UI_FLAG, {
        isFetching: false,
      });
    }
  },
  updateLabel: async ({ commit }, { conversationId, conversation }) => {
    commit(types.default.SET_CONVERSATION_LABELS_UI_FLAG, {
      isUpdating: true,
    });
    try {
      const response = await ConversationAPI.updateLabel(
        conversationId,
        conversation
      );
    } catch (error) {
      commit(types.default.SET_CONVERSATION_LABELS_UI_FLAG, {
        isUpdating: false,
        isError: true,
      });
    }
  },
  update: async ({ commit }, { conversationId, labels }) => {
    commit(types.default.SET_CONVERSATION_LABELS_UI_FLAG, {
      isUpdating: true,
    });
    try {
      const response = await ConversationAPI.updateLabels(
        conversationId,
        labels
      );
      commit(types.default.SET_CONVERSATION_LABELS, {
        id: conversationId,
        data: response.data.payload,
      });
      commit(types.default.SET_CONVERSATION_LABELS_UI_FLAG, {
        isUpdating: false,
        isError: false,
      });
    } catch (error) {
      commit(types.default.SET_CONVERSATION_LABELS_UI_FLAG, {
        isUpdating: false,
        isError: true,
      });
    }
  },
  setBulkConversationLabels({ commit }, conversations) {
    commit(types.default.SET_BULK_CONVERSATION_LABELS, conversations);
  },
  setConversationLabel({ commit }, { id, data }) {
    commit(types.default.SET_CONVERSATION_LABELS, { id, data });
  },
};

export const mutations = {
  [types.default.SET_CONVERSATION_LABELS_UI_FLAG]($state, data) {
    $state.uiFlags = {
      ...$state.uiFlags,
      ...data,
    };
  },
  [types.default.SET_CONVERSATION_PROPERTIES_UI_FLAG]($state, data) {
    $state.uiFlags = {
      ...$state.uiFlags,
      ...data,
    };
  },
  [types.default.SET_CONVERSATION_LABELS]: ($state, { id, data }) => {
    Vue.set($state.records, id, data);
  },
  [types.default.SET_CONVERSATION_PROPERTIES]: ($state, { data }) => {
    data.forEach(property => {
      Vue.set($state.properties, property.id, property);
    });
  },
  [types.default.SET_BULK_CONVERSATION_LABELS]: ($state, conversations) => {
    conversations.forEach(conversation => {
      Vue.set($state.records, conversation.id, conversation.labels);
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
