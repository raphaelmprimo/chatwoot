<template>
  <woot-modal :show.sync="show" :on-close="onCancel" modal-type="right-aligned">
    <div class="h-auto overflow-auto flex flex-col">
      <woot-modal-header
        :header-title="`${$t('ADD_DATA.TITLE')}`"
        :header-content="`${$t('ADD_DATA.DESC')}`"
      />
      <data-form
        :properties="properties"
        :in-progress="uiFlags.isUpdating"
        :on-submit="onSubmit"
        @success="onSuccess"
        @cancel="onCancel"
      />
    </div>
  </woot-modal>
</template>
<script>
import { mapGetters } from 'vuex';
import DataForm from './DataForm.vue';

export default {
  components: {
    DataForm,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    properties: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    ...mapGetters({
      uiFlags: 'contacts/getUIFlags',
    }),
  },

  methods: {
    onCancel() {
      this.$emit('cancel');
    },
    onSuccess() {
      this.$emit('cancel');
    },
    async onSubmit(contactItem) {
      console.log('Data', contactItem);
      // await this.$store.dispatch('contacts/update', contactItem);
      // await this.$store.dispatch(
      //   'contacts/fetchContactableInbox',
      //   this.contact.id
      // );
    },
  },
};
</script>
