json.payload do
  json.array! @calendars do |calendar|
    json.id calendar.id
    json.title calendar.title
    json.description calendar.description
  end
end
