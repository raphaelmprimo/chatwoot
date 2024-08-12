# == Schema Information
#
# Table name: schedules
#
#  id                :bigint           not null, primary key
#  color             :string           default("#9bbef5")
#  conversation_uuid :uuid
#  description       :string
#  end_time          :datetime
#  is_all_day        :boolean          default(FALSE), not null
#  is_block          :boolean          default(FALSE), not null
#  is_readonly       :boolean          default(FALSE), not null
#  is_reschedule     :boolean          default(FALSE), not null
#  location          :string
#  reminder          :string
#  start_time        :datetime
#  status            :integer          default("scheduled"), not null
#  subject           :string
#  uuid              :uuid             not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  account_id        :integer          not null
#  calendar_id       :integer          not null
#  label_id          :integer
#  resource_id       :integer
#  room_id           :integer
#  worker_id         :integer          not null
#
class Schedule < ApplicationRecord
  belongs_to :account
  belongs_to :worker, class_name: 'User', inverse_of: :schedules, optional: true
  belongs_to :conversation, primary_key: :uuid, foreign_key: :conversation_uuid, inverse_of: :schedule, optional: true
  belongs_to :calendar, class_name: 'Calendar', inverse_of: :schedules
  belongs_to :room, optional: true
  belongs_to :resource, optional: true
  belongs_to :label, optional: true

  has_many :schedule_guests, dependent: :destroy
  has_many :guests, through: :schedule_guests, source: :user

  scope :in_label, ->(label_id) { where(label_id: label_id) }
  scope :of_conversation, ->(conversation_uuid) { where(conversation_uuid: conversation_uuid) }

  enum status: {
    scheduled: 0,
    confirmed: 1,
    cancelled: 2,
    completed: 3,
    pending: 4,
    rescheduled: 5,
    in_progress: 6
  }

  def user_ids
    guests.map(&:id).push(worker.id)
  end

  def add_schedule_guests(user_guests)
    user_guests -= [worker_id]
    if user_guests.blank?
      schedule_guests.destroy_all
      return
    end

    user_guests.each do |user_id|
      schedule_guests.create!(user: User.find(user_id))
    end
  end
end
