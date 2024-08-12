class CalendarPolicy < ApplicationPolicy
  def index?
    @account_user.administrator? || @account_user.worker?
  end

  def update?
    index?
  end

  def show?
    index?
  end

  def default_calendar?
    index?
  end

  def create?
    index?
  end

  def destroy?
    index?
  end
end
