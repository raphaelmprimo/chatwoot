class AddColorForScheduleToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :color_for_schedule, :string
  end
end
