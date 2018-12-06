RSpec.describe Web::Controllers::Buses::Fetch do
  let(:action) { Web::Controllers::Buses::Fetch.new }
  let(:repository) { BusRepository.new }
  let(:params) {Hash[]}

  before do
    repository.clear
  end

  it 'create new buses' do
    action.call(params)
    bus = repository.last

    expect(bus.id).to_not be_nil
  end

  it 'redirects the user to the bus info listing' do
    response = action.call(params)

    expect(response[0]).to eq(302)
    expect(response[1]['Location']).to eq('/buses')
  end
end
