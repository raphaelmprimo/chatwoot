class Kanban::UpdateAttributesVisiblesJob < ApplicationJob
  queue_as :default

  def perform(_account_id, _kanban_id, _attributes)
    Kanban::AttributesVisiblesService.new(account_id: _account_id, kanban_id: _kanban_id, attributes_visibles: _attributes, action: :update).perform
  end
end
