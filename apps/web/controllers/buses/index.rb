module Web
  module Controllers
    module Buses
      class Index
        include Web::Action

        expose :buses

        def call(params)
          @buses = BusRepository.new.all
        end
      end
    end
  end
end
