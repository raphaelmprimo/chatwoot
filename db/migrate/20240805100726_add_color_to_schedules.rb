class AddColorToSchedules < ActiveRecord::Migration[7.0]
  def change
    add_column :schedules, :color, :string, default: '#9bbef5'
  end
end
