class Api::V1::Accounts::CalendarsController < Api::V1::Accounts::BaseController
  before_action :current_account
  before_action :fetch_calendar, except: [:index, :create]
  before_action :check_authorization

  def index
    @calendars = Current.account.calendars
  end

  def show; end

  def create
    @calendar = Current.user.calendars.create!(permitted_params, account: Current.account)
  end

  def update
    @calendar.update!(permitted_params)
  end

  def destroy
    @calendar.destroy!
    head :ok
  end

  private

  def fetch_calendar
    @calendar = Current.account.calendars.find(params[:id])
  end

  def permitted_params
    params.require(:calendar).permit(:title, :description, :status)
  end
end
