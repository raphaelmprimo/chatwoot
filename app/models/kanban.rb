# == Schema Information
#
# Table name: kanbans
#
#  id                  :bigint           not null, primary key
#  attributes_visibles :jsonb
#  configuration       :jsonb
#  is_default          :boolean          default(FALSE), not null
#  name                :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  account_id          :integer          not null
#  kanban_id           :string
#
class Kanban < ApplicationRecord
  belongs_to :account

  after_create_commit :create_visible_attributes

  private

  def create_visible_attributes
    ::Kanban::CreateAttributesVisiblesJob.perform_now(account.id, id)
  end
end
