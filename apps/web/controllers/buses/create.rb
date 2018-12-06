require 'net/http'
require 'uri'
require 'json'

module Web
  module Controllers
    module Buses
      class Create
        include Web::Action

        def call(params)
          #For num in 1..11
          params = URI.encode_www_form({busid: '1'})
          uri = URI.parse("http://tutujibus.com/busLookup.php?#{params}")

          response = Net::HTTP.start(uri.host, uri.port) do |http|
            http.open_timeout = 5
            http.read_timeout = 10
            http.get(uri.request_uri)
          end
          begin
            case response
            when Net::HTTPSuccess
              @result = JSON.parse(response.body.split('(')[1].sub(')',''))#.gsub(/(\w+):/, '"\1":'))
              #BusRepository.new.create({ isRunning: true, datetime: '123', busid: 1, rosenid: 2, binid: 3, latitude: 1.1, longitude: 2.3, speed: 3, direction:3, destination: 'aaa', isdelay: false })
              BusRepository.new.create({ isRunning: @result["isRunning"], datetime: @result["datetime"], busid: @result["busid"], rosenid: @result["rosenid"], binid: @result["binid"], latitude: @result["latitude"], longitude: @result["longitude"], speed: @result["speed"], direction: @result["direction"], destination: @result["destination"], isdelay: @result["isdelay"]})
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
