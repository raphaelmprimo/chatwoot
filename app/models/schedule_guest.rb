# == Schema Information
#
# Table name: schedule_guests
#
#  id          :bigint           not null, primary key
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  schedule_id :bigint           not null
#  user_id     :bigint           not null
#
# Indexes
#
#  index_schedule_guests_on_schedule_id              (schedule_id)
#  index_schedule_guests_on_schedule_id_and_user_id  (schedule_id,user_id) UNIQUE
#  index_schedule_guests_on_user_id                  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (schedule_id => schedules.id)
#  fk_rails_...  (user_id => users.id)
#
class ScheduleGuest < ApplicationRecord
  belongs_to :schedule
  belongs_to :user
end
