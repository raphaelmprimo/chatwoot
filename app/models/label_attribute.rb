# == Schema Information
#
# Table name: label_attributes
#
#  id                             :bigint           not null, primary key
#  created_at                     :datetime         not null
#  updated_at                     :datetime         not null
#  custom_attribute_definition_id :bigint           not null
#  label_id                       :bigint           not null
#
# Indexes
#
#  index_label_attributes_on_custom_attribute_definition_id  (custom_attribute_definition_id)
#  index_label_attributes_on_label_id                        (label_id)
#
# Foreign Keys
#
#  fk_rails_...  (custom_attribute_definition_id => custom_attribute_definitions.id)
#  fk_rails_...  (label_id => labels.id)
#
class LabelAttribute < ApplicationRecord
  belongs_to :custom_attribute_definition
  belongs_to :label, class_name: 'Label'

  validates :custom_attribute_definition_id, uniqueness: { scope: :label_id }
end
