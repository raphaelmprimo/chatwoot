# == Schema Information
#
# Table name: calendars
#
#  id                :integer          not null, primary key
#  conversation_uuid :uuid
#  description       :string
#  status            :integer          default(0), not null
#  title             :string
#  uuid              :uuid             not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  account_id        :integer          not null
#  display_id        :integer          not null
#  worker_id         :integer          not null
#
# Indexes
#
#  index_calendars_on_account_id         (account_id)
#  index_calendars_on_conversation_uuid  (conversation_uuid)
#  index_calendars_on_uuid               (uuid) UNIQUE
#  index_calendars_on_worker_id          (worker_id)
#
class Calendar < ApplicationRecord
  belongs_to :account
  belongs_to :worker, class_name: 'User', inverse_of: :calendars
  belongs_to :conversation, primary_key: :uuid, foreign_key: :conversation_uuid, inverse_of: :calendars, optional: true

  has_many :schedules, dependent: :destroy_async

  # Validações
  validates :account_id, :worker_id, presence: true
  validates :status, presence: true

  after_commit :set_display_id, unless: :display_id?

  private

  def set_display_id
    reload
  end

  trigger.before(:insert).for_each(:row) do
    "NEW.display_id := nextval('conv_dpid_seq_' || NEW.account_id);"
  end
end
