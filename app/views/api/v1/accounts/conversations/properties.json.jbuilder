  json.payload do
    json.array! @conversation.label.properties do |prop|
      json.id prop.id
      json.name prop.name
      json.type prop.property_type
      json.label_id prop.label_id
    end
  end
