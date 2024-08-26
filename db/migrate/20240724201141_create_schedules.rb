class CreateSchedules < ActiveRecord::Migration[7.0]
  def change
    create_table :schedules do |t|
      t.integer :account_id, null: false,index: true
      t.integer :user_id, null: false,index: true
			t.integer :owner_id
      t.uuid :uuid, default: -> { 'gen_random_uuid()' }, null: false,index: true
      t.uuid :conversation_uuid
      t.integer :calendar_id, null: false
      t.string :subject
      t.string :description
      t.string :location
      t.string :reminder
      t.datetime :start_time
      t.datetime :end_time
      t.boolean :is_all_day, null: false, default: false
      t.boolean :is_block, null: false, default: false
      t.boolean :is_readonly, null: false, default: false
      t.boolean :is_reschedule, null: false, default: false
      t.integer :status, default: 0, null: false
      t.integer :room_id
      t.integer :resource_id
			t.integer :group_id
			t.string  :group_color, default: "#0fa7e8"
			

      t.timestamps
    end

    # add_index :schedules, [:account_id, :id], name: 'index_schedules_on_account_id_and_id'
    # add_index :schedules, [:user_id, :id], name: 'index_schedules_on_user_id_and_id'
    # add_index :schedules, :conversation_uuid, name: 'index_schedules_conversations_on_uuid'
    # add_index :schedules, :uuid, unique: true, name: 'index_schedules_on_uuid'

  end
end
