  json.array! @schedules do |schedule|
    json.Id schedule.id
    json.Subject schedule.subject
    json.Description schedule.description
    json.Location schedule.location
    json.StartTime schedule.start_time
    json.EndTime schedule.end_time
		json.start_time schedule.start_time.to_i
    json.end_time schedule.end_time.to_i
    json.IsAllDay schedule.is_all_day
    json.IsBlock  schedule.is_block
    json.IsReadonly schedule.is_readonly
    json.RoomId schedule.conversation_uuid
    json.WorkerIds schedule.user_ids
    json.CalendarId schedule.calendar_id
		json.Color schedule.color
  end
