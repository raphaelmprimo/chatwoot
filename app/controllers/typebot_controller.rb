class TypebotController < ApplicationController
  def update_token_typebot
    user = User.find_by(email: params[:email])

    if user
      updated_attributes = user_params.compact_blank
      if user.update(updated_attributes)
        render json: { message: 'Token typebot updated successfully' }, status: :ok
      else
        render json: { error: 'Failed to update token typebot' }, status: :unprocessable_entity
      end
    else
      render json: { error: 'User not found' }, status: :not_found
    end
  end

  def show_token_typebot
    user = User.find_by(id: params[:id])

    if user
      render json: { token_typebot: user.token_typebot, expiration_token: user.expiration_token, api_token_typebot: user.api_token_typebot },
             status: :ok
    else
      render json: { error: 'User not found' }, status: :not_found
    end
  end

  private

  def user_params
    params.permit(:email, :token_typebot, :expiration_token, :id, :api_token_typebot)
  end
end
