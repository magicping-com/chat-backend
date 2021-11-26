MagicPing - Personal chat server backend

GET - /users/ - to get all users
input-
{}
output-
success response with http 200


POST - /users/ - to create user
input-
{'user_id':'user_id'}
output-
success response with http 200 or http 409 if duplicate found.


POST - /keys/ - get new auth key for client to connect to websocket
input-
{'user_id':'user_id'}
output-
success response with http 200 or http 404 if user is not found.


