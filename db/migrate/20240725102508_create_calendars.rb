class CreateCalendars < ActiveRecord::Migration[7.0]
  def change
    create_table :calendars, id: :serial do |t|
      t.integer :display_id, null: false
      t.integer :account_id, null: false
      t.integer :worker_id, null: false
      t.uuid :uuid, default: -> { 'gen_random_uuid()' }, null: false
      t.uuid :conversation_uuid
      t.string :title
      t.string :description
      t.integer :status, default: 0, null: false

      t.timestamps
    end

    add_index :calendars, :account_id, name: 'index_calendars_on_account_id'
    add_index :calendars, :worker_id, name: 'index_calendars_on_worker_id'
    add_index :calendars, :conversation_uuid, name: 'index_calendars_on_conversation_uuid'
    add_index :calendars, :uuid, unique: true, name: 'index_calendars_on_uuid'

    create_trigger('calendars_before_insert_row_tr', generated: true, compatibility: 1).
      on('calendars').before(:insert).for_each(:row) do
        "NEW.display_id := nextval('conv_dpid_seq_' || NEW.account_id);"
      end
  end
end
