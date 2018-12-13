require 'net/http'

RSpec.describe Web::Controllers::Buses::Fetch do
  let(:action) { Web::Controllers::Buses::Fetch.new }
  let(:repository) { BusRepository.new }
  let(:params) {Hash[]}

  before do
    repository.clear
  end

  it 'succeeds in http get' do
    action.call(params)
    expect(action.exposures[:resp]).to all(be_a(Net::HTTPSuccess))
    be_ok = -> res { res.code == "200" }
    expect(action.exposures[:resp]).to all(satisfy &be_ok)
  end

  it 'create bus info' do
    action.call(params)
    bus = repository.last
    if action.exposures[:existsData]
      expect(action.exposures[:existsData]).to be true
      expect(bus.id).to_not be_nil
    else
      expect(action.exposures[:existsData]).to be false
    end

  end

  it 'redirects the user to the bus info listing' do
    response = action.call(params)

    expect(response[0]).to eq(302)
    expect(response[1]['Location']).to eq('/buses')
  end
end
