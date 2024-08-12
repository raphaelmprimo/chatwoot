# == Schema Information
#
# Table name: calendars
#
#  id                :integer          not null, primary key
#  conversation_uuid :uuid
#  description       :string
#  is_default        :boolean          default(FALSE), not null
#  status            :integer          default(0), not null
#  title             :string
#  uuid              :uuid             not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  account_id        :integer          not null
#  display_id        :integer          not null
#  worker_id         :integer
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
  belongs_to :worker, class_name: 'User', inverse_of: :calendarss, optional: true
  belongs_to :conversation, primary_key: :uuid, foreign_key: :conversation_uuid, inverse_of: :calendars, optional: true
  default_scope { where(is_default: true) }

  has_many :schedules, class_name: 'Schedule', dependent: :destroy_async

  # Validações
  validates :account_id, presence: true
  validates :status, presence: true
  validates :title, presence: true
  validates :description, presence: true
  # validar title e description como unicos por account_id
  validates :title, uniqueness: { scope: :account_id }

  after_commit :set_display_id, unless: :display_id?

  private

  def set_display_id
    reload
  end

  trigger.before(:insert).for_each(:row) do
    "NEW.display_id := nextval('conv_dpid_seq_' || NEW.account_id);"
  end
end
