import CacheEnabledApiClient from './CacheEnabledApiClient';

class LabelsAPI extends CacheEnabledApiClient {
  constructor() {
    super('labels', { accountScoped: true });
  }

  // eslint-disable-next-line class-methods-use-this
  get cacheModelName() {
    return 'label';
  }

  updatePosition(labelId,position) {
    return axios.patch(`${this.url}/${labelId}/update_position/${position}`);
  }
}

export default new LabelsAPI();
