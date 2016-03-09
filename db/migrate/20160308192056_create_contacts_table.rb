class CreateContactsTable < ActiveRecord::Migration
  
  def change
    create_table :contacts do |t|
      t.string :first_name
      t.string :last_name
      t.date :date_of_birth
      t.string :email
      t.string :occupation
      
      t.timestamps
    end
  end

end
