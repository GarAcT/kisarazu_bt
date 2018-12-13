RSpec.describe Web::Controllers::Buses::Index, type: :action do
  let(:action) { Web::Controllers::Buses::Index.new }
  let(:params) { Hash[] }
  let(:repository) { BusRepository.new }

  before do
    repository.clear

    @bus = repository.create(isRunning: true, datetime: '123', busid: 3, rosenid: 2345, binid: 3, latitude: 1.1, longitude: 2.3, speed: 3, direction:3, destination: 'aaa', isdelay: false)
  end

  it 'is successful' do
    response = action.call(params)
    expect(response[0]).to eq 200
  end

  it 'exposes all buses' do
    action.call(params)
    expect(action.exposures[:buses]).to eq([@bus])
  end
end
