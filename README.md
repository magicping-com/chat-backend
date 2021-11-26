MagicPing - Personal chat server backend

All REST API calls should contain app_id and app_secret in header
## This is to send message to sockets subscribed to public channels
POST - /send-message/ - to send message to a channel
input-
{"channel_name":"", "event_name":"", "event_json":""}
output-
success response with http 200.
