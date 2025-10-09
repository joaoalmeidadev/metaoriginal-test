class CreateProjects < ActiveRecord::Migration[8.0]
  def change
    create_table :projects do |t|
      t.string :title, null: false, default: ''
      t.string :subtitle, default: ''
      
      t.timestamps
    end
  end
end
