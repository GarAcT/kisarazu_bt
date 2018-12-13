RSpec.describe Web::Views::Buses::Index, type: :view do
  let(:exposures) { Hash[buses: []] }
  let(:template)  { Hanami::View::Template.new('apps/web/templates/buses/index.html.erb') }
  let(:view)      { described_class.new(template, exposures) }
  let(:rendered)  { view.render }

  it 'exposes #buses' do
    expect(view.buses).to eq exposures.fetch(:buses)
  end

  context 'when there are no buses' do
    it 'shows a placeholder message' do
      expect(rendered).to include('<p class="placeholder">There are no bus info yet.</p>')
    end
  end

  context 'when there are buses' do
    let(:bus1) { Bus.new(isRunning: true, datetime: '123', busid: 3, rosenid: 2345, binid: 3, latitude: 1.1, longitude: 2.3, speed: 3, direction:3, destination: 'aaa', isdelay: false) }
    let(:bus2) { Bus.new(isRunning: true, datetime: '123', busid: 4, rosenid: 6789, binid: 23, latitude: 4.1, longitude: 2.3, speed: 3, direction:3, destination: 'aaa', isdelay: false) }
    let(:exposures) { Hash[buses: [bus1, bus2]] }

    it 'lists them all' do
      expect(rendered.scan(/class="bus"/).length).to eq(2)
      expect(rendered).to include('2345') & include('6789')
    end

    it 'hides the placeholder message' do
      expect(rendered).to_not include('<p class="placeholder">There are no bus info yet.</p>')
    end
  end
end
