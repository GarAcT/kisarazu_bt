require 'features_helper'

RSpec.describe 'Create buses' do
  after do
    BusRepository.new.clear
  end

  it 'can create buses' do
    visit '/buses'

    within 'form#bus-form' do
      click_button 'Fetch'
    end

    expect(page).to have_current_path('/buses')
  end
end
