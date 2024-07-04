class AddExpirationTokenToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :expiration_token, :string
  end
end
