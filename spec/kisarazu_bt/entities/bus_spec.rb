RSpec.describe Bus, type: :entity do
  it 'can be initialized with isRunning' do
    bus = Bus.new(isRunning: false)
    expect(bus.isRunning).to eq(false)
  end
end
