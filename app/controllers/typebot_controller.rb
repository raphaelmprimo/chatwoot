# app/controllers/typebot_controller.rb
class TypebotController < ApplicationController
  def update_token_typebot
    user = User.find_by(email: params[:email])

    if user
      user.update(token_typebot: params[:token_typebot])
      render json: { message: 'Token typebot updated successfully' }, status: :ok
    else
      render json: { error: 'User not found' }, status: :not_found
    end
  end

  def show_token_typebot
    user = User.find_by(id: params[:id])

    if user
      render json: { token_typebot: user.token_typebot }, status: :ok
    else
      render json: { error: 'User not found' }, status: :not_found
    end
  end

  private

  def user_params
    params.permit(:email, :token_typebot, :id)
  end
end
