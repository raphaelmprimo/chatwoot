/* global axios */
import ApiClient from './ApiClient';

class CalendarApi extends ApiClient {
  constructor() {
    super('calendars', { accountScoped: true });
  }

  getSchedules(calendarID) {
    return axios.get(`${this.url}/${calendarID}/schedules`);
  }

  getCalendarDefault () {
    return axios.get(`${this.url}/default`);
  }



  updateSchedule(calendarID, schedule) {
    return axios.put(`${this.url}/${calendarID}/schedules`, { schedule });
  }


  addSchedule(calendarID, schedule) {
    return axios.post(`${this.url}/${calendarID}/schedules`, {
      schedule,
    });
  }

  removeSchedule(calendarID, scheduleID) {
    return axios.delete(
      `${this.url}/${calendarID}/calendars/schedules/${scheduleID}`
    );
  }
}

export default new CalendarApi();
