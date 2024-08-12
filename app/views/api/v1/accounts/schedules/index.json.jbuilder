  json.array! @schedules do |schedule|
    json.Id schedule.id
    json.Subject schedule.subject
    json.Description schedule.description
    json.Location schedule.location
    json.StartTime schedule.start_time
    json.EndTime schedule.end_time
    json.IsAllDay schedule.is_all_day
    json.IsBlock  schedule.is_block
    json.IsReadonly schedule.is_readonly
    json.RoomId schedule.conversation_uuid
    json.WorkerIds schedule.user_ids
    json.CalendarId schedule.calendar_id
  end
