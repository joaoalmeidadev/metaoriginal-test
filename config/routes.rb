Rails.application.routes.draw do
  resources :projects, only: :index

  root "projects#index"
  get "up" => "rails/health#show", as: :rails_health_check
end
