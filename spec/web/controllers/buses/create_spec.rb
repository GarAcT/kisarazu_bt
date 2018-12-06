RSpec.describe Web::Controllers::Buses::Create do
  let(:action) { Web::Controllers::Buses::Create.new }
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
end
