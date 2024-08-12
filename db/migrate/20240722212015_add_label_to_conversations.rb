class AddLabelToConversations < ActiveRecord::Migration[7.0]
  def change
    add_column :conversations, :label_id, :integer
    add_index :conversations, :label_id
    Conversation.reset_column_information
  end
end
