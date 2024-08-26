class Api::V1::Accounts::SchedulesController < Api::V1::Accounts::BaseController
  before_action :current_account
  before_action :fetch_calendar
  before_action :fetch_schedule, only: [:update, :destroy]
  before_action :check_authorization
  def index
    @schedules = @calendar.schedules.all
  end

  def in_label
    @schedules = @calendar.schedules.in_label(params[:label_id]).all
  end

	def conversation_schedules
		@schedules = @calendar.schedules.of_conversation(params[:conversation_uuid]).all
	end

  def of_conversation
    @schedule = @calendar.schedules.of_conversation(params[:conversation_uuid]).first
  end

  def default_calendar
    @calendar = Current.account.calendar
  end

  def create
    @schedule = @calendar.schedules.new(schedule_params)
    @schedule.account = Current.account
    @schedule.user = Current.user
    @schedule.save!
    @schedule.add_schedule_guests(params[:user_ids]) if  params[:user_ids].present?
    head :no_content
  end

  def update
    if @schedule.update(schedule_params)
      @schedule.add_schedule_guests(params[:user_ids])
      render json: @schedule
    else
      render json: { errors: @schedule.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @schedule.destroy
    head :ok
  end

  private

  def fetch_user
    params[:schedule][:user_id] = Current.user.id
  end

  def fetch_calendar
    @calendar = Current.account.calendar
  end

  def fetch_schedule
    @schedule = @calendar.schedules.find(params[:id])
  end

  def schedule_params
    params.require(:schedule).permit(:subject, :start_time, :end_time, :is_all_day, :location,
                                     :description, :status, :priority, :reminder,
                                     :label_id, :color_for_schedule,:group_id, :user_id, :conversation_uuid,:owner_id)
  end
end
