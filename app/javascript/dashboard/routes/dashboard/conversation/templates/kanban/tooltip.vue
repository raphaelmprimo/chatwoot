<template v-slot:tooltipTemplate="{ data }">
  <div
    class="e-kanbantooltiptemp"
    v-if="data.custom_attributes && isVisible('custom_attributes')"
  >
    <table>
      <tr>
        <td class="e-kanban-card-details">
          <table>
            <colgroup>
              <col style="width: 30%" />
              <col style="width: 70%" />
            </colgroup>
            <tbody>
              <!-- <tr
                v-if="
                  data.agent_last_seen_at && isVisible('agent_last_seen_at')
                "
                class="e-text"
                v-html="formatTd('agent_last_seen_at', data.agent_last_seen_at)"
              ></tr>
              <tr
                v-if="
                  data.assignee_last_seen_at &&
                  isVisible('assignee_last_seen_at')
                "
                class="e-text"
                v-html="
                  formatTd('assignee_last_seen_at', data.assignee_last_seen_at)
                "
              ></tr>
              <tr
                v-if="
                  data.contact_last_seen_at && isVisible('contact_last_seen_at')
                "
                class="e-text"
                v-html="
                  formatTd('contact_last_seen_at', data.contact_last_seen_at)
                "
              ></tr> -->
              <tr
                class="e-text"
                v-for="(attribute, key) in data.custom_attributes"
                :key="key"
              >
                <td class="CardHeader" style="color: white">
                  {{ key.toUpperCase() }}:
                </td>
                <td style="color: white">{{ attribute }}</td>
              </tr>
              <!-- <tr
                v-if="data.muted && isVisible('muted')"
                class="e-text"
                v-html="formatTd('mute', data.muted)"
              ></tr>
              <tr
                v-if="data.snoozed_until && isVisible('snoozed_until')"
                class="e-text"
                v-html="formatTd('snnozed_until', data.snoozed_until)"
              ></tr>
              <tr
                v-if="data.status && isVisible('status')"
                class="e-text"
                v-html="formatTd('status', data.status)"
              ></tr>
              <tr
                v-if="data.created_at && isVisible('created_at')"
                class="e-text"
                v-html="formatTd('created_at', data.created_at)"
              ></tr>
              <tr
                v-if="data.timestamp && isVisible('timestamp')"
                class="e-text"
                v-html="formatTd('timestamp', data.timestamp)"
              ></tr>
              <tr
                v-if="
                  data.first_reply_created_at &&
                  isVisible('first_reply_created_at')
                "
                class="e-text"
                v-html="
                  formatTd(
                    'first_reply_created_at',
                    data.first_reply_created_at
                  )
                "
              ></tr>
              <tr
                v-if="data.last_activity_at && isVisible('last_activity_at')"
                class="e-text"
                v-html="formatTd('last_activity_at', data.last_activity_at)"
              ></tr>
              <tr
                v-if="data.priority && isVisible('priority')"
                class="e-text"
                v-html="formatTd('priority', data.priority)"
              ></tr>
              <tr
                v-if="data.waiting_since && isVisible('waiting_since')"
                class="e-text"
                v-html="formatTd('waiting_since', data.waiting_since)"
              ></tr> -->
            </tbody>
          </table>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
const MINUTE_IN_MILLI_SECONDS = 60000;
const HOUR_IN_MILLI_SECONDS = MINUTE_IN_MILLI_SECONDS * 60;
const DAY_IN_MILLI_SECONDS = HOUR_IN_MILLI_SECONDS * 24;

import { mapGetters } from 'vuex';
import timeMixin from 'dashboard/mixins/time';
import Thumbnail from '../../../../../components/widgets/Thumbnail.vue';

export default {
  mixins: [timeMixin],
  components: {
    Thumbnail,
  },
  data() {
    return {
      data: {},
    };
  },
  computed: {
    ...mapGetters({
      cardAttributes: 'kanban/getAttributes',
    }),
  },
  methods: {
    getString: function (name) {
      return name
        .match(/\b(\w)/g)
        .join('')
        .toUpperCase();
    },
    getCardFooter: function (data) {
      return `<div class='e-card-tag-field e-tooltip-text'> ${data.name} </div>
        <div><thumbnail src="${data.image_agent}" username="${data.image_agent}" class="e-card-avatar"/></div>`;
    },

    getAvatarAgent: function (url) {
      return url;
    },
    isVisible(attributeName) {
      const attribute = this.cardAttributes.find(
        attr => attr.Name === attributeName
      );

      return attribute ? attribute.Visible : false;
    },
    formatTime(time) {
      return `${this.$t('CHAT_LIST.CHAT_TIME_STAMP.LAST_ACTIVITY.ACTIVE')}: ${this.dateFormat(
        time
      )}`;
    },
    formatTd(text, value) {
      let result;
      switch (text) {
        case 'agent_last_seen_at':
          result = `<td class="CardHeader" style='color:white'>Agente viu em:</td>
          <td style="color: white">${this.dateFormat(value)}</td>`;
          break;
        case 'assignee_last_seen_at':
          result = `<td class="CardHeader" style='color:white'>Responsável viu pela última vez em</td><td style='color:white;'>${this.dateFormat(
            value
          )}</td>`;
          break;
        case 'contact_last_seen_at':
          result = `<td class="CardHeader" style='color:white'>Contato viu pela última</td><td style='color:white;'>${this.dateFormat(
            value
          )}</td>`;
          break;
        case 'custom_attributes':
          let campos = '<td>';

          for (let chave in value) {
            if (value.hasOwnProperty(chave)) {
              campos += '<tr>';
              campos += `<td class="CardHeader" style='color:white'>${chave}</td>`;
              campos += `<td style='color:white'>${value[chave]}</td>`;
              campos += '</tr>';
            }
          }
          campos += '</td>';
          result = `${campos.slice(0, -2)}`;
          break;
        case 'muted':
          result = `<td class="CardHeader" style='color:white'>${this.$t('CONTACT_PANEL.MUTED')}</td><td style='color:white;'>${value}</td>`;
          break;
        case 'snoozed_until':
          result = `<td class="CardHeader" style='color:white'>Adiado até</td><td style='color:white;'>${this.dateFormat(
            value
          )}</td>`;
          break;
        case 'status':
          result = `<td class="CardHeader" style='color:white'>Status</td><td style='color:white;'>${value}</td>`;
          break;
        case 'created_at':
          result = `<td class="CardHeader" style='color:white'>${this.$t('CHAT_LIST.CHAT_TIME_STAMP.CREATED.OLDEST')}</td> ${this.dateFormat(
            value
          )}</td>`;
          break;
        case 'timestamp':
          result = `<td class="CardHeader" style='color:white'>${this.$t('CHAT_LIST.CHAT_TIME_STAMP.LAST_ACTIVITY.ACTIVE')}</td><td style='color:white;'>${this.dateFormat(
            value
          )}</td>`;
          break;
        case 'first_reply_created_at':
          result = `<td class="CardHeader" style='color:white'>Primeira Resposta</td><td style='color:white;'>${this.dateFormat(
            value
          )}</td>`;
          break;
        case 'last_activity_at':
          result = `<td class="CardHeader" style='color:white'>${this.$t('CHAT_LIST.CHAT_TIME_STAMP.LAST_ACTIVITY.ACTIVE')}</td><td style='color:white;'>${this.dateFormat(
            value
          )}</td>`;
          break;
        case 'priority':
          result = `<td class="CardHeader" style='color:white'>${this.$t('CONVERSATION.PRIORITY.TITLE')}</td><td style='color:white;'>${this.$t('CONVERSATION.PRIORITY.OPTIONS.' + value.toUpperCase())}</td>`;
          break;
        case 'waiting_since':
          result = `<td class="CardHeader" style='color:white'>Esperando desde</td><td style='color:white;'>${this.dateFormat(
            value
          )}</td>`;
          break;
        default:
          result = `Sem Nome: ${value}`;
      }

      return result;
    },
  },
};
</script>
