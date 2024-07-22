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
      <div id="properties">
        <div
          v-for="(property, index) in properties"
          :key="index"
          class="flex justify-end items-center py-0 px-0 gap-2 w-full"
        >
          <div>
            <woot-input
              v-model.trim="property.name"
              class="w-full"
              :label="$t('LABEL_MGMT.FORM.PROPERTY_NAME.LABEL')"
              :placeholder="$t('LABEL_MGMT.FORM.PROPERTY_NAME.PLACEHOLDER')"
            />
          </div>
          <div>
            <label>
              {{ $t('LABEL_MGMT.FORM.PROPERTY_TYPE.LABEL') }}
              <select v-model="property.property_type">
                <option value="TextValue">
                  {{ $t('LABEL_MGMT.FORM.PROPERTY_TYPE_VALUE.TEXT_VALUE') }}
                </option>
                <option value="MoneyValue">
                  {{ $t('LABEL_MGMT.FORM.PROPERTY_TYPE_VALUE.MONEY_VALUE') }}
                </option>
                <option value="NumberValue">
                  {{ $t('LABEL_MGMT.FORM.PROPERTY_TYPE_VALUE.NUMBER_VALUE') }}
                </option>
              </select>
            </label>
          </div>
          <woot-button
            v-tooltip.top="$t('LABEL_MGMT.FORM.REMOVE_PROPERTY')"
            variant="smooth"
            color-scheme="alert"
            size="tiny"
            icon="dismiss-circle"
            class-names="grey-btn"
            @click="removeProperty(index)"
          />
        </div>
      </div>
      <div class="flex justify-end items-center py-2 px-0 gap-2 w-full">
        <woot-button
          class="button success"
          icon="add-circle"
          size="tiny"
          @click.prevent="addProperty"
        >
          {{ $t('LABEL_MGMT.FORM.ADD_PROPERTY') }}
        </woot-button>
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

export default {
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
      properties: [
        {
          name: '',
          property_type: 'TextValue',
        },
      ],
    };
  },
  validations,
  computed: {
    ...mapGetters({
      uiFlags: 'labels/getUIFlags',
    }),
  },
  mounted() {
    this.color = getRandomColor();
    this.title = this.prefillTitle.toLowerCase();
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
          properties_attributes: this.properties,
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
// Label API supports only lowercase letters
.label-name--input {
  ::v-deep {
    input {
      @apply lowercase;
    }
  }
}
</style>
