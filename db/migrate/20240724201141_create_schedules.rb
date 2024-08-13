class CreateSchedules < ActiveRecord::Migration[7.0]
  def change
    create_table :schedules do |t|
      t.integer :account_id, null: false
      t.integer :worker_id, null: false
      t.uuid :uuid, default: -> { 'gen_random_uuid()' }, null: false
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

      t.timestamps
    end

    # add_index :schedules, [:account_id, :id], name: 'index_schedules_on_account_id_and_id'
    # add_index :schedules, [:worker_id, :id], name: 'index_schedules_on_worker_id_and_id'
    # add_index :schedules, :conversation_uuid, name: 'index_schedules_conversations_on_uuid'
    # add_index :schedules, :uuid, unique: true, name: 'index_schedules_on_uuid'

  end
end
