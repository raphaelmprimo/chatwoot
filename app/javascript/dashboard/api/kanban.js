import ApiClient from './ApiClient';

class KanbanAPI extends ApiClient {
  constructor() {
    super('kanban', { accountScoped: true });
  }

  // eslint-disable-next-line class-methods-use-this
  get() {
    return axios.get(`${this.url}/list_attributes`);
  }

  update(attributes) {
    return axios.put(`${this.url}/update_attributes`, { attributes });
  }
}

export default new KanbanAPI();
