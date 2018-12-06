Hanami::Model.migration do
  change do
    create_table :buses do
      primary_key :id

      column :isRunning, 'boolean', null: false
      column :datetime, String, null: false
      column :busid, Integer, null: false
      column :rosenid, Integer, null: false
      column :binid, Integer, null: false
      column :latitude, Float, null: false
      column :longitude, Float, null: false
      column :speed, Integer, null: false
      column :direction, Integer, null: false
      column :destination, String, null: false
      column :isdelay, 'boolean', null: false

      column :created_at, DateTime, null: false
      column :updated_at, DateTime, null: false
    end
  end
end
