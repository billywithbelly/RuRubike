import paho.mqtt.client as mqtt
import json
import requests

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))

    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("client/200000065/200000065-GIOT-MAKER")

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
	dickPayload = str(msg.payload)[2:len(str(msg.payload))-1]
	json_extractor = json.loads(dickPayload)
	string_value = json_extractor['data']
	print(string_value)
	requests.post('http://127.0.0.1:5000/loraDick', data = {'data':string_value})


client = mqtt.Client(client_id="adfadsfasdf", protocol=mqtt.MQTTv31)
client.on_connect = on_connect
client.on_message = on_message

client.username_pw_set("200000019", password="86873039")
client.connect("52.193.146.103", 80, 60)

# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.
client.loop_forever()