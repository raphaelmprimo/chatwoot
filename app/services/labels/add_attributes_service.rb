class Labels::AddAttributesService
  pattr_initialize [:label_id!, :account_id!, :attribute_ids!, :action!]

  def perform
    case action.to_sym
    when :create
      create_label_attributes
    when :update
      update_label_attributes
    end
  end

  private

  def create_label_attributes
    account.custom_attribute_definitions.conversation_only.where(id: attribute_ids).find_each do |_attribute_def|
      LabelAttribute.create!(
        custom_attribute_definition: _attribute_def,
        label: label
      )
    end
  end

  def update_label_attributes
    label.label_attributes.destroy_all
    account.custom_attribute_definitions.conversation_only.where(id: attribute_ids).find_each do |_attribute_def|
      LabelAttribute.create!(
        custom_attribute_definition: _attribute_def,
        label: label
      )
    end
  end

  def label
    @label ||= Label.find(label_id)
  end

  def account
    @account ||= Account.find(account_id)
  end
end
