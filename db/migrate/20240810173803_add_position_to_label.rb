class AddPositionToLabel < ActiveRecord::Migration[7.0]
  def change
    add_column :labels, :position, :integer
  end
end
