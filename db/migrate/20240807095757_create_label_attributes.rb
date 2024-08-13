class CreateLabelAttributes < ActiveRecord::Migration[7.0]
  def change
    create_table :label_attributes do |t|
      t.references :custom_attribute_definition, null: false, foreign_key: true
      t.references :label, null: false, foreign_key: true

      t.timestamps
    end
  end
end
