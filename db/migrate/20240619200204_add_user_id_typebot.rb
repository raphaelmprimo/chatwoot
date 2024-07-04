class AddUserIdTypebot < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :user_id_typebot, :string
  end
end
