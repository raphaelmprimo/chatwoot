# == Schema Information
#
# Table name: values
#
#  id          :bigint           not null, primary key
#  value_type  :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  property_id :bigint           not null
#
# Indexes
#
#  index_values_on_property_id  (property_id)
#
# Foreign Keys
#
#  fk_rails_...  (property_id => properties.id)
#
class Value < ApplicationRecord
  belongs_to :property
  validates :value_type, presence: true
end
