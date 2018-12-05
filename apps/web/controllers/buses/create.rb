module Web
  module Controllers
    module Buses
      class Create
        include Web::Action

        def call(params)
          #bus = Bus.new
          #For num in 1..11
          params = URI.encode_www_form({busid: '3'})
          uri = URI.parse("http://tutujibus.com/busLookup.php?#{params}")
          #@query = uri.query

          response = Net::HTTP.start(uri.host, uri.port) do |http|
            http.open_timeout = 5
            http.read_timeout = 10
            http.get(uri.request_uri)
          end
          begin
            case response
            when Net::HTTPSuccess
              @result = JSON.parse(response.body.split('(')[1].sub(')',''))#.gsub(/(\w+):/, '"\1":'))
              bi = @result["busid"]
              #bus.new(@result)
              #bus.save
              #BusRepository.new.create(@result)
              BusRepository.new.create({ id: 1, isRunning: true, datetime: '123', busid: 1, rosenid: 2, binid: 3, latitude: 1.1, longitude: 2.3, speed: 3, direction:3, destination: 'aaa', isDelay: false })
              redirect_to '/buses'
            when Net::HTTPRedirection
              @message = "Redirection: code=#{response.code} message=#{response.message}"
            else
              @message = "HTTP ERROR: code=#{response.code} message=#{response.message}"
            end
          rescue IOError => e
            @message = e.message
          rescue TimeoutError => e
            @message = e.message
          rescue JSON::ParserError => e
            @message = e.message
          rescue => e
            @message = e.message
          end
        end
      end
    end
  end
end
