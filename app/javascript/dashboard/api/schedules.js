/* global axios */
import ApiClient from './ApiClient';

class ScheduleApi extends ApiClient {
  constructor() {
    super('schedules', { accountScoped: true });
  }

  getSchedules() {
    return axios.get(`${this.url}`);
	}
	
	getConversationSchedules(conversationUuid) {
    return axios.get(`${this.url}/${conversationUuid}/conversation_schedules`);
  }

  getSchedulesLabel(labelID) {
    return axios.get(`${this.url}/${labelID}/in_label`);
  }

  getDefaultCalendar () {
    return axios.get(`${this.url}/default_calendar`);
  }



  updateSchedule(schedule) {
    return axios.put(`${this.url}`, { schedule });
  }


  addSchedule(schedule) {
    return axios.post(`${this.url}/schedules`, {
      schedule,
    });
  } 

  removeSchedule(scheduleID) {
    return axios.delete(
      `${this.url}/${scheduleID}`
    );
  }
}

export default new ScheduleApi();
