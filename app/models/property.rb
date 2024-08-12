# == Schema Information
#
# Table name: properties
#
#  id             :bigint           not null, primary key
#  name           :string
#  property_type  :string
#  required_field :boolean          default(FALSE), not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  label_id       :bigint           not null
#
# Indexes
#
#  index_properties_on_label_id  (label_id)
#
# Foreign Keys
#
#  fk_rails_...  (label_id => labels.id)
#
class Property < ApplicationRecord
  belongs_to :label
  has_one :value, dependent: :destroy
  accepts_nested_attributes_for :value

  validates :name, presence: { message: I18n.t('errors.validations.presence') }

  def title
    name
  end
end
