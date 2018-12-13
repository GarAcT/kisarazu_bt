require 'net/http'
require 'uri'
require 'json'

module Web
  module Controllers
    module Buses
      class Fetch
        include Web::Action

        expose :resp
        expose :existsData
        expose :message

        def call(params)
          BusRepository.new.clear
          rosenNum = 11
          @resp = []
          @existsData = false
          for num in 1..rosenNum
            params = URI.encode_www_form({busid: num})
            uri = URI.parse("http://tutujibus.com/busLookup.php?#{params}")

            res = Net::HTTP.start(uri.host, uri.port) do |http|
              http.open_timeout = 5
              http.read_timeout = 10
              http.get(uri.request_uri)
            end

            @resp << res

            begin
              case @resp.last
              when Net::HTTPSuccess #2xx
                @result = JSON.parse(@resp.last.body.split('(')[1].sub(')',''))#.gsub(/(\w+):/, '"\1":'))
                #BusRepository.new.create({ isRunning: true, datetime: '123', busid: 1, rosenid: 2, binid: 3, latitude: 1.1, longitude: 2.3, speed: 3, direction:3, destination: 'aaa', isdelay: false })
                if !@result.empty? and @result["isRunning"]
                  @existsData = true
                  BusRepository.new.create({ isRunning: @result["isRunning"], datetime: @result["datetime"], busid: @result["busid"], rosenid: @result["rosenid"], binid: @result["binid"], latitude: @result["latitude"], longitude: @result["longitude"], speed: @result["speed"], direction: @result["direction"], destination: @result["destination"], isdelay: @result["isdelay"]})
                  @message = @result
                end
                if num == 11
                  redirect_to '/buses'
                end
              when Net::HTTPRedirection #3xx
                @message = "Redirection: code=#{@resp.code} message=#{@resp.message}"
              else
                @message = "HTTP ERROR: code=#{@resp.code} message=#{@resp.message}"
              end

            #error handling
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
end
