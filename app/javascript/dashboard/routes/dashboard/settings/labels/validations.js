import { required, minLength } from 'vuelidate/lib/validators';

export const validLabelCharacters = (str = '') => !!str && !str.includes(' ');

export default {
  title: {
    required,
    minLength: minLength(2),
    validLabelCharacters,
  },
  property: {
    name: {
      required,
      minLength: minLength(2),
  },
  },
  description: {},
  color: {
    required,
  },
  showOnSidebar: {},
};
