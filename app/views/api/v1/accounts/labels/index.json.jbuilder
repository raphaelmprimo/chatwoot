json.payload do
  json.array! @labels do |label|
    json.id label.id
    json.title label.title
    json.description label.description
    json.color label.color
    json.show_on_sidebar label.show_on_sidebar
    json.can_add_schedule label.can_add_schedule
    json.final_step label.final_step
    json.properties label.properties
    json.attributes_requireds label.attributes_requireds
    json.attributes_requireds_keys label.attributes_requireds_keys
    json.attribute_ids label.attribute_ids
    json.position label.position
  end
end
