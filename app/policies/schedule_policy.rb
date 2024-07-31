class SchedulePolicy < ApplicationPolicy
  def index?
    @account_user.administrator? || @account_user.worker?
  end

  def update?
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
