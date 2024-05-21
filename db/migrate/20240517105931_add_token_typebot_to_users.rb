class AddTokenTypebotToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :token_typebot, :string
  end
end
