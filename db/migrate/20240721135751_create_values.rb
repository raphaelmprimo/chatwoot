class CreateValues < ActiveRecord::Migration[7.0]
  def change
    create_table :values do |t|
      t.references :property, null: false, foreign_key: true
      t.string :value_type

      t.timestamps
    end
    create_table :text_values do |t|
      t.references :value, null: false, foreign_key: true
      t.text :value
      t.timestamps
    end

    create_table :number_values do |t|
      t.references :value, null: false, foreign_key: true
      t.integer :value
      t.timestamps
    end

    create_table :money_values do |t|
      t.references :value, null: false, foreign_key: true
      t.integer :value
      t.timestamps
    end
  end
end
