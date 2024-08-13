class Api::V1::Accounts::LabelsController < Api::V1::Accounts::BaseController
  before_action :current_account
  before_action :fetch_label, except: [:index, :create]
  before_action :check_authorization

  def index
    @labels = policy_scope(Current.account.labels.order(position: :asc))
  end

  def list_labels
    @labels = policy_scope(Current.account.labels.order(position: :asc))
  end

  def show; end

  def create
    attribute_ids = params[:attribute_ids]
    @label = Current.account.labels.create!(permitted_params)
    Labels::ActionAttributesJob.perform_now(@label.id, Current.account.id, attribute_ids, :create) if attribute_ids.present?
  end

  def update
    attribute_ids = params[:attribute_ids]
    @label.update!(permitted_params)
    Labels::ActionAttributesJob.perform_now(@label.id, Current.account.id, attribute_ids, :update) if attribute_ids.present?
  end

  def update_position
    @label.insert_at(params[:position].to_i)
    head :ok
  end

  def destroy
    @label.destroy!
    head :ok
  end

  private

  def fetch_label
    @label = Current.account.labels.find(params[:id])
  end

  def permitted_params
    params.require(:label).permit(:title, :description, :color, :show_on_sidebar, :can_add_schedule, :final_step)
  end
end
