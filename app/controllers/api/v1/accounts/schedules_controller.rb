class Api::V1::Accounts::SchedulesController < Api::V1::Accounts::BaseController
  before_action :current_account
  before_action :fetch_calendar
  before_action :fetch_schedule, only: [:update, :destroy]
  before_action :check_authorization
  def index
    @schedules = @calendar.schedules.all
  end

  def create
    @schedule = @calendar.schedules.new(schedule_params)
    @schedule.account = Current.account
    @schedule.worker = Current.user
    @schedule.save!
    @schedule.add_schedule_guests(params[:user_ids])
    head :no_content

    #@schedule.build_schedule_guests(user_ids)
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
    head :no_content
  end

  private

  def fetch_calendar
    @calendar = Current.account.calendars.find(params[:calendar_id])
  end

  def fetch_schedule
    @schedule = @calendar.schedules.find(params[:id])
  end

  def schedule_params
    params.require(:schedule).permit(:subject, :start_time, :end_time, :is_all_day, :location, :description, :status, :priority, :reminder, :user_ids)
  end
end
