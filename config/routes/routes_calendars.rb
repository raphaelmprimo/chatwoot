module RoutesCalendars
  def self.extended(router)
    router.instance_exec do
      namespace :api, defaults: { format: 'json' } do
        namespace :v1 do
          resources :accounts, only: [:show] do
            resources :calendars
          end
        end
      end
    end
  end
end
