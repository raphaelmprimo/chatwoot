/* global axios */
import ApiClient from './ApiClient';

class AttributeAPI extends ApiClient {
  constructor() {
    super('custom_attribute_definitions', { accountScoped: true });
  }

  getAttributesByModel() {
    return axios.get(this.url);
  }
  getAllAttributes() {
    return axios.get(`${this.url}/all_for_conversation`);
  }
  getAllAttributesRequireds() {
    return axios.get(`${this.url}/only_requireds`);
  }
}

export default new AttributeAPI();
