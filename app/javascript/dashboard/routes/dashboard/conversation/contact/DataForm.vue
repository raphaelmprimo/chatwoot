<template>
  <div>
    <form @submit.prevent="submitForm">
      <div
        v-for="(property, index) in properties"
        :key="index"
        class="property-field"
      >
        <label :for="'property' + index">{{ property.name }}</label>
        <input
          v-if="property.type === 'TextValue'"
          :id="'property' + index"
          v-model="property.value"
          type="text"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <input
          v-if="property.type === 'MoneyValue'"
          :id="'property' + index"
          v-model="property.value"
          type="number"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <input
          v-if="property.type === 'NumberValue'"
          :id="'property' + index"
          v-model="property.value"
          type="number"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      <div class="flex flex-row justify-end w-full gap-2 px-0 py-2">
        <div class="w-full">
          <woot-submit-button
            :loading="inProgress"
            :button-text="$t('CONTACT_FORM.FORM.SUBMIT')"
          />
          <button class="button clear" @click.prevent="onCancel">
            {{ $t('CONTACT_FORM.FORM.CANCEL') }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'LabelForm',
  props: {
    properties: {
      type: Array,
      required: true,
    },
  },

  methods: {
    onCancel() {
      this.$emit('cancel');
    },
    onSuccess() {
      this.$emit('success');
    },
    submitForm() {
      // Handle form submission
      console.log(this.labelProperties);
    },
  },
};
</script>

<style scoped>
.property-field {
  margin-bottom: 1em;
}
</style>
