class LabelPolicy < ApplicationPolicy
  def index?
    @account_user.administrator? || @account_user.agent? || @account_user.worker?
  end

  def update?
    @account_user.administrator?
  end

  def show?
    @account_user.administrator?
  end

  def label_kanban?
    show?
  end

  def update_position?
    @account_user.administrator?
  end

  def create?
    @account_user.administrator?
  end

  def destroy?
    @account_user.administrator?
  end
end
