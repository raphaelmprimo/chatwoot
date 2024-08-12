class AddCanAddScheduleAndFinalStepToLabels < ActiveRecord::Migration[7.0]
  def change
    add_column :labels, :can_add_schedule, :boolean, null: false, default: false
    add_column :labels, :final_step, :boolean, null: false, default: false
  end
end
