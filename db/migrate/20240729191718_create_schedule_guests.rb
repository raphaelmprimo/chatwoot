class CreateScheduleGuests < ActiveRecord::Migration[7.0]
  def change
    create_table :schedule_guests do |t|
      t.references :schedule, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
    add_index :schedule_guests, [:schedule_id, :user_id], unique: true
  end
end
