/* global axios */
import ApiClient from './ApiClient';

class ConversationApi extends ApiClient {
  constructor() {
    super('conversations', { accountScoped: true });
  }

  getLabels(conversationID) {
    return axios.get(`${this.url}/${conversationID}/labels`);
  }

  updateLabels(conversationID, labels) {
    return axios.post(`${this.url}/${conversationID}/labels`, { labels });
  }

  updateLabel(conversationID, conversation) {
    return axios.patch(`${this.url}/${conversationID}/update_label`, {
      conversation,
    });
  }
}

export default new ConversationApi();
