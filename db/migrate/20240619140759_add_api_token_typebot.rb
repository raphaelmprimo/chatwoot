class AddApiTokenTypebot < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :api_token_typebot, :string
  end
end
