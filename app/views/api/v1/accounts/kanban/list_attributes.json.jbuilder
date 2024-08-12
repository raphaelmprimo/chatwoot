json.array! @kanban.attributes_visibles do |attribute|
  json.Id attribute['id']
  json.Name attribute['name']
  json.Description attribute['description']
  json.Visible attribute['visible']
end
