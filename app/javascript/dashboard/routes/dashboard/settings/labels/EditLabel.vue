<template>
  <div class="h-auto overflow-auto flex flex-col">
    <woot-modal-header :header-title="pageTitle" />
    <form class="mx-0 flex flex-wrap" @submit.prevent="editLabel">
      <woot-input
        v-model.trim="title"
        :class="{ error: $v.title.$error }"
        class="w-full label-name--input"
        :label="$t('LABEL_MGMT.FORM.NAME.LABEL')"
        :placeholder="$t('LABEL_MGMT.FORM.NAME.PLACEHOLDER')"
        :error="getLabelTitleErrorMessage"
        @input="$v.title.$touch"
      />
      <woot-input
        v-model.trim="description"
        :class="{ error: $v.description.$error }"
        class="w-full"
        :label="$t('LABEL_MGMT.FORM.DESCRIPTION.LABEL')"
        :placeholder="$t('LABEL_MGMT.FORM.DESCRIPTION.PLACEHOLDER')"
        @input="$v.description.$touch"
      />
      <div class="w-full">
        <label>
          {{ $t('LABEL_MGMT.FORM.COLOR.LABEL') }}
          <woot-color-picker v-model="color" />
        </label>
      </div>
      <div class="w-full flex items-center gap-2">
        <input v-model="showOnSidebar" type="checkbox" :value="true" />
        <label for="conversation_creation">
          {{ $t('LABEL_MGMT.FORM.SHOW_ON_SIDEBAR.LABEL') }}
        </label>
      </div>
      <div class="w-full flex items-center gap-2">
        <input v-model="canAddSchedule" type="checkbox" :value="false" />
        <label for="conversation_creation">
          {{ $t('LABEL_MGMT.FORM.CAN_ADD_SCHEDULE.LABEL') }}
        </label>
      </div>
      <div class="w-full flex items-center gap-2">
        <input v-model="isFinalStep" type="checkbox" :value="false" />
        <label for="conversation_creation">
          {{ $t('LABEL_MGMT.FORM.IS_FINAL_STEP.LABEL') }}
        </label>
      </div>

      <div id="checklist-wrapper" class="mt-4 mb-2">
        <div id="flat-list">
          <p>Campos Disponíveis</p>
          <span v-for="attribute in attributes" :key="attribute.id">
            <label :for="`attribute-${attribute.id}`">
              <input
                type="checkbox"
                :value="attribute.id"
                :id="`attribute-${attribute.id}`"
                v-model="selectedAttributes"
                class="mr-2"
              />
              {{ attribute.attribute_display_name }} -
              {{ translatedTypes[attribute.attribute_display_type] }}
            </label>
          </span>
        </div>
      </div>
      <div class="flex justify-end items-center py-2 px-0 gap-2 w-full">
        <woot-button
          :is-disabled="$v.title.$invalid || uiFlags.isUpdating"
          :is-loading="uiFlags.isUpdating"
        >
          {{ $t('LABEL_MGMT.FORM.EDIT') }}
        </woot-button>
        <woot-button class="button clear" @click.prevent="onClose">
          {{ $t('LABEL_MGMT.FORM.CANCEL') }}
        </woot-button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import alertMixin from 'shared/mixins/alertMixin';
import validationMixin from './validationMixin';
import validations from './validations';
import { properties } from '@syncfusion/ej2-vue-treegrid/src/treegrid/treegrid.component';

export default {
  mixins: [alertMixin, validationMixin],
  props: {
    selectedResponse: {
      type: Object,
      default: () => {},
    },
    propertiesLabel: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      title: '',
      description: '',
      showOnSidebar: true,
      canAddSchedule: false,
      isFinalStep: false,
      color: '',
      selectedAttributes: [],
      translatedTypes: {
        text: 'Texto',
        number: 'Número',
        link: 'Link',
        date: 'Data',
        list: 'Lista',
        checkbox: 'Sim/Não',
      },
    };
  },
  validations,
  computed: {
    ...mapGetters({
      uiFlags: 'labels/getUIFlags',
      attributes: 'attributes/getAttributes',
    }),
    pageTitle() {
      return `${this.$t('LABEL_MGMT.EDIT.TITLE')} - ${
        this.selectedResponse.title
      }`;
    },
  },
  mounted() {
    this.setFormValues();
    this.$store.dispatch('attributes/fetchAllAttributes');
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    setFormValues() {
      this.title = this.selectedResponse.title;
      this.description = this.selectedResponse.description;
      this.showOnSidebar = this.selectedResponse.show_on_sidebar;
      this.color = this.selectedResponse.color;
      this.properties = this.propertiesLabel || [];
      this.final_step = this.selectedResponse.final_step;
      this.can_add_schedule = this.selectedResponse.can_add_schedule;
      this.selectedAttributes = this.selectedResponse.attribute_ids;
    },
    editLabel() {
      this.$store
        .dispatch('labels/update', {
          id: this.selectedResponse.id,
          color: this.color,
          description: this.description,
          title: this.title.toLowerCase(),
          show_on_sidebar: this.showOnSidebar,
          final_step: this.isFinalStep,
          can_add_schedule: this.canAddSchedule,
          attribute_ids: this.selectedAttributes,
        })
        .then(() => {
          this.showAlert(this.$t('LABEL_MGMT.EDIT.API.SUCCESS_MESSAGE'));
          setTimeout(() => this.onClose(), 10);
        })
        .catch(() => {
          this.showAlert(this.$t('LABEL_MGMT.EDIT.API.ERROR_MESSAGE'));
        });
    },
    addProperty() {
      this.properties.push({ name: '', property_type: 'TextValue' });
    },
    removeProperty(index) {
      this.properties.splice(index, 1);
    },
  },
};
</script>
<style lang="scss" scoped>
// Label API supports only lowercase letters
.label-name--input {
  ::v-deep {
    input {
      @apply lowercase;
    }
  }
}
</style>
