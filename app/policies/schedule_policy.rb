class SchedulePolicy < ApplicationPolicy
  def index?
    @account_user.administrator? || @account_user.worker?
  end

  def update?
    index?
  end

  def in_label?
    index?
  end

  def default_calendar?
    index?
  end

	def conversation_schedules?
		index?
	end
		
  def show?
    index?
  end

  def create?
    index?
  end

  def destroy?
    index?
  end
end
