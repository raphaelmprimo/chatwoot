<template>
  <div class="h-auto overflow-auto flex flex-col">
    <!-- Modal Content -->
    <woot-modal-header
      header-title="Configuração de Funil"
      header-content="Adicionar Agendamento"
    />
    <hr />
    <form class="mx-0 flex flex-wrap" @submit.prevent="saveEvent">
      <div class="grid gap-4 mb-4 sm:grid-cols-2">
        <div class="mb-4">
          <label for="subject" class="block text-sm font-medium text-gray-700"
            >Assunto</label
          >
          <input
            v-model="eventData.subject"
            type="text"
            id="subject"
            class="mt-1 block w-full border border-gray-300 rounded-lg text-sm p-2"
          />
        </div>
        <div class="mb-4">
          <label
            for="description"
            class="block text-sm font-medium text-gray-700"
            >Descrição</label
          >
          <input
            v-model="eventData.description"
            type="text"
            id="description"
            class="mt-1 block w-full border border-gray-300 rounded-lg text-sm p-2"
          />
        </div>
        <div class="mb-4">
          <label for="location" class="block text-sm font-medium text-gray-700"
            >Localização</label
          >
          <input
            v-model="eventData.location"
            type="text"
            id="location"
            class="mt-1 block w-full border border-gray-300 rounded-lg text-sm p-2"
          />
        </div>
        <div class="mb-4">
          <label
            for="start_time"
            class="block text-sm font-medium text-gray-700"
            >Hora de Início</label
          >
          <woot-date-time-picker
            v-model="eventData.start_time"
            confirm-text="Confirmar"
            placeholder="Digite a Data de Início"
            @change="onChangeStart"
          />
        </div>
        <div class="mb-4">
          <label for="end_time" class="block text-sm font-medium text-gray-700"
            >Hora de Término</label
          >
          <woot-date-time-picker
            v-model="eventData.end_time"
            confirm-text="Confirmar"
            placeholder="Digite a Data de Término"
            @change="onChangeEnd"
          />
        </div>
      </div>
      <div class="flex justify-end items-center py-2 px-0 gap-2 w-full">
        <woot-button> Salvar </woot-button>
        <woot-button class="button clear" @click.prevent="closeModal">
          Cancelar
        </woot-button>
      </div>
    </form>
  </div>
</template>

<script>
import alertMixin from 'shared/mixins/alertMixin';
import { DateTimePickerComponent } from '@syncfusion/ej2-vue-calendars';
import WootDateTimePicker from 'dashboard/components/ui/DateTimePicker.vue';

export default {
  props: ['showModal', 'modalTitle', 'color', 'labelId'],
  mixins: [alertMixin],
  components: {
    'ejs-datetimepicker': DateTimePickerComponent,
    WootDateTimePicker,
  },

  data() {
    let year = new Date().getFullYear();
    let month = new Date().getMonth();
    return {
      eventData: {
        subject: null,
        description: null,
        location: null,
        start_time: new Date(),
        end_time: new Date(),
        color: this.color,
        label_id: this.labelId,
      },
      waterMarkText: 'Select a date and time',
      date: new Date(year, month, 14, 10, 30),
      minDate: new Date(year, month, 7, 10),
      maxDate: new Date(year, month, 27, 22, 30),
      dateFormat: 'dd/MMM/yy hh:mm',
      dataSource: [],
    };
  },
  methods: {
    saveEvent() {
      this.eventData.label_id = this.labelId;
      this.$store.dispatch('calendars/addSchedule', {
        calendarID: 1,
        schedule: this.eventData,
      });
      this.closeModal();
    },
    closeModal() {
      console.log('CLOSE');
      this.$emit('close-modal');
    },

    onClose() {
      this.$emit('close-modal');
    },
    onChangeStart(value) {
      this.eventData.start_time = value;
    },
    onChangeEnd(value) {
      this.eventData.end_time = value;
    },
  },
};
</script>
<style>
@import '../../../../../../../node_modules/@syncfusion/ej2-base/styles/material3.css';
@import '../../../../../../../node_modules/@syncfusion/ej2-buttons/styles/material3.css';
@import '../../../../../../../node_modules/@syncfusion/ej2-layouts/styles/material3.css';
@import '../../../../../../../node_modules/@syncfusion/ej2-dropdowns/styles/material3.css';
@import '../../../../../../../node_modules/@syncfusion/ej2-navigations/styles/material3.css';
@import '../../../../../../../node_modules/@syncfusion/ej2-popups/styles/material3.css';
@import '../../../../../../../node_modules/@syncfusion/ej2-vue-kanban/styles/tailwind.css';
@import '../../../../../../../node_modules/@syncfusion/ej2-vue-inputs/styles/bootstrap.css';
@import '../../../../../../../node_modules/@syncfusion/ej2-vue-grids/styles/tailwind.css';
@import '../../../../../../../node_modules/@syncfusion/ej2-vue-treegrid/styles/material3.css';
.control_wrapper.datetimepicker_format {
  max-width: 246px;
  margin: 30px auto;
  padding-top: 15px;
}
#property.property-section,
#property.property-section {
  margin: 30px auto;
  padding-top: 5px;
}
.control-section.datetimeformat {
  padding: 5%;
}

#control_wrapper #container {
  min-height: 300px;
}

.content {
  width: 43%;
  margin: 0 auto;
  min-width: 185px;
  padding: 20px 0px;
}
#propertyWrapper {
  padding: 5%;
}
</style>
