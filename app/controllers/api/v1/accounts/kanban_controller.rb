class Api::V1::Accounts::KanbanController < Api::V1::Accounts::BaseController
  before_action :current_account
  before_action :fetch_kanban, except: [:index, :create]
  before_action :check_authorization

  def index
    @kanban = policy_scope(Current.account.kanban)
  end

  def list_attributes
    @kanban = policy_scope(Current.account.kanban)
  end

  def create
    @kanban = Current.account.build_kanban(kanban_params)
    @kanban.save!
  end

  def update_attributes
    attributes = params[:attributes]
    ::Kanban::AttributesVisiblesService.new(account_id: Current.account.id,
                                            kanban_id: @kanban.id, attributes_visibles: attributes, action: :update).perform
  end

  private

  def fetch_kanban
    @kanban = Current.account.kanban
  end

  def kanban_params
    params.require(:attributes).permit(:attributes_visibles)
  end
end
