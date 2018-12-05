require 'features_helper'

RSpec.describe 'List buses' do
  let(:repository) { BusRepository.new }
  before do
    repository.clear

    repository.create({ isRunning: true, datetime: '123', busid: 1, rosenid: 2, binid: 3, latitude: 1.1, longitude: 2.3, speed: 3, direction:3, destination: 'aaa', isDelay: false })
    repository.create({ isRunning: true, datetime: '123', busid: 2, rosenid: 3333, binid: 23, latitude: 4.1, longitude: 2.3, speed: 3, direction:3, destination: 'aaa', isDelay: false })
  end

  it 'displays each bus info on the page' do
    visit '/buses'

    within '#buses' do
      expect(page).to have_selector('.bus', count: 2), 'Expected to find 2 buses'
    end
  end
end
