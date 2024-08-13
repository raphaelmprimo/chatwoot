class CreateKanbans < ActiveRecord::Migration[7.0]
  def change
    create_table :kanbans do |t|
      t.integer :account_id, null: false
      t.string  :kanban_id
      t.string  :name
      t.jsonb   :configuration, default: {}
      t.jsonb   :attributes_visibles, default: {}
      t.boolean :is_default, null: false, default: false

      t.timestamps
    end
  end
end
