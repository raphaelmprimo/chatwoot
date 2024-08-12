<template>
  <div class="h-auto overflow-auto flex flex-col">
    <woot-modal-header
      :header-title="$t('LABEL_MGMT.ADD.TITLE')"
      :header-content="$t('LABEL_MGMT.ADD.DESC')"
    />
    <form class="mx-0 flex flex-wrap" @submit.prevent="addLabel">
      <woot-input
        v-model.trim="title"
        :class="{ error: $v.title.$error }"
        class="w-full label-name--input"
        :label="$t('LABEL_MGMT.FORM.NAME.LABEL')"
        :placeholder="$t('LABEL_MGMT.FORM.NAME.PLACEHOLDER')"
        :error="getLabelTitleErrorMessage"
        data-testid="label-title"
        @input="$v.title.$touch"
      />

      <woot-input
        v-model.trim="description"
        :class="{ error: $v.description.$error }"
        class="w-full"
        :label="$t('LABEL_MGMT.FORM.DESCRIPTION.LABEL')"
        :placeholder="$t('LABEL_MGMT.FORM.DESCRIPTION.PLACEHOLDER')"
        data-testid="label-description"
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

      <div id="checklist-wrapper" class="mt-4 mb-2" v-if="attributes">
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
          :is-disabled="$v.title.$invalid || uiFlags.isCreating"
          :is-loading="uiFlags.isCreating"
          data-testid="label-submit"
        >
          {{ $t('LABEL_MGMT.FORM.CREATE') }}
        </woot-button>
        <woot-button class="button clear" @click.prevent="onClose">
          {{ $t('LABEL_MGMT.FORM.CANCEL') }}
        </woot-button>
      </div>
    </form>
  </div>
</template>

<script>
import alertMixin from 'shared/mixins/alertMixin';
import validationMixin from './validationMixin';
import { mapGetters } from 'vuex';
import validations from './validations';
import { getRandomColor } from 'dashboard/helper/labelColor';
import { ListViewComponent } from '@syncfusion/ej2-vue-lists';

export default {
  components: {
    'ejs-listview': ListViewComponent,
  },
  mixins: [alertMixin, validationMixin],
  props: {
    prefillTitle: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      color: '#000',
      description: '',
      title: '',
      showOnSidebar: true,
      canAddSchedule: false,
      isFinalStep: false,
      properties: [],
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
  },
  mounted() {
    this.color = getRandomColor();
    this.title = this.prefillTitle.toLowerCase();
    this.$store.dispatch('attributes/fetchAllAttributes');
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    addProperty() {
      this.properties.push({ name: '', property_type: 'TextValue' });
    },
    removeProperty(index) {
      this.properties.splice(index, 1);
    },
    async addLabel() {
      try {
        await this.$store.dispatch('labels/create', {
          color: this.color,
          description: this.description,
          title: this.title.toLowerCase(),
          show_on_sidebar: this.showOnSidebar,
          final_step: this.isFinalStep,
          can_add_schedule: this.canAddSchedule,
          attribute_ids: this.selectedAttributes,
        });
        this.showAlert(this.$t('LABEL_MGMT.ADD.API.SUCCESS_MESSAGE'));
        this.onClose();
      } catch (error) {
        const errorMessage =
          error.message || this.$t('LABEL_MGMT.ADD.API.ERROR_MESSAGE');
        this.showAlert(errorMessage);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.checklist #flat-list .displayText {
  padding-left: 15px;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.1;
}

// Label API supports only lowercase letters
.label-name--input {
  ::v-deep {
    input {
      @apply lowercase;
    }
  }
}

.attrs__node-drag-handle {
  @apply cursor-move -left-8 absolute;
}
.attrs__node-action-container {
  @apply w-full min-w-0 basis-full items-center flex relative;

  .attrs__node-action-item {
    @apply flex-grow bg-white dark:bg-slate-700 p-2 mr-2 rounded-md shadow-sm;

    &.has-error {
      animation: shake 0.3s ease-in-out 0s 2;
      @apply bg-red-50 dark:bg-red-800;
    }
  }
}
</style>
