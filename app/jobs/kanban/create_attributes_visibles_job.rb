class Kanban::CreateAttributesVisiblesJob < ApplicationJob
  queue_as :default

  def perform(_account_id, _kanban_id)
    Kanban::AttributesVisiblesService.new(account_id: _account_id, kanban_id: _kanban_id, action: :create).perform
  end
end
