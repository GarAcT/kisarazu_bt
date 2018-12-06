require 'features_helper'

RSpec.describe 'Create buses' do
  after do
    BusRepository.new.clear
  end

  it 'can create buses' do
    visit '/buses/fetch'

    expect(page).to have_current_path('/buses')
  end
end
