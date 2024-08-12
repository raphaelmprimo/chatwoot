class Labels::ActionAttributesJob < ApplicationJob
  queue_as :default

  def perform(_label_id, account_id, _attribute_ids, _action)
    Labels::AddAttributesService.new(
      label_id: _label_id,
      account_id: account_id,
      attribute_ids: _attribute_ids,
      action: _action
    ).perform
  end
end
