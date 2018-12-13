# Configure your routes here
# See: http://hanamirb.org/guides/routing/overview/
#
# Example:
# get '/hello', to: ->(env) { [200, {}, ['Hello from Hanami!']] }
get '/buses/fetch', to: 'buses#fetch', as: :fetch_buses
get '/buses', to: 'buses#index'
