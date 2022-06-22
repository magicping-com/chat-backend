# MagicPing - Personal chat server backend

Current status: To serve as a websocket relay server without storing actual messages sent.  
Planned feature: Complete chat backend capability.

You can create and manage Users, Channels, Tokens from REST API.  
Clients such as apps developed in javascript, react, angular, flutter, etc. can connect and comunicate.

## you can access the UI at /app/

for example <http://localhost:9060/app/>

## Communication with this server

There are two communication types.

### 1. REST API (from your backend server)

All the requests should contain appi-id and app-secret in header for authentication purpose.

1. create user
2. create channel (alpanumeric, \_@. allowed)
3. add user to channel
4. send message to channel
5. send message to user( with the socket id )

### 2. socket.io client (from your frontend application)

1. connect to server.
2. connect to channel (need to get token if the channel is private).
3. listen all emits from server.
4. Send device/platform details for notification purpose (optional) (TODO)
5. Send messages to channel (TODO)

## This is to send message to sockets subscribed to public channels

POST - /send-message/ - to send message to a channel
input-
{"channel_name":"", "event_name":"", "event_json":""}
output-
success response with http 200.
