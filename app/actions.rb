# Homepage (Root path)
get '/' do
  erb :index
end

get '/contacts/index.json' do
  content_type :json
  @contacts = Contact.all
  # 'data' variable returned is a json object containing all users.
  @contacts.to_json
end

get '/contacts/search.json' do
  content_type :json
  @contacts = Contact.where("first_name LIKE ? OR last_name LIKE ? OR email LIKE ?",
    "%#{params[:searchParam]}%",
    "%#{params[:searchParam]}%",
    "%#{params[:searchParam]}%"
  )
  @contacts.to_json
end 

post '/contacts/create' do 
  # Parse the string DOB into something usable by ActiveRecord
  parsedDOB = params[:newDOB][0,4] + params[:newDOB][5,2] + params[:newDOB][8,2]

  Contact.create(
    first_name: params[:newFirstName],
    last_name: params[:newLastName],
    date_of_birth: parsedDOB,
    email: params[:newEmail],
    occupation: params[:newOccupation]
   )
end

delete '/contacts/destroy' do
  Contact.find(params[:contactID]).destroy
end