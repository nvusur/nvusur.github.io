import paho.mqtt.client as mqtt
import serial
import time

#def send_room_temp(room, temp, client):
#    client.publish("Vusur", f'*start*{{"temp":{temp},"soba":{room}}}*end*')

def forward_serial_to_mqtt(serial_port, client, mqtt_topic):
    try:
        # Open the serial port (adjust the port and baudrate to match your setup)
        ser = serial.Serial(serial_port, 9600, timeout=1)
        print(f"Connected to serial port {serial_port}")
        
        while True:
            # Read a line of data from the serial port
            if ser.in_waiting > 0:  # If data is available in the buffer
                serial_data = ser.readline().decode(errors='ignore')  # Read and decode the data
                
                # Forward the data to MQTT
                if "*start*" in serial_data:
                    print(f"Received from serial: {serial_data}")
                    client.publish(mqtt_topic, serial_data)
                    
    except serial.SerialException as e:
        print(f"Error reading from serial port: {e}")
    finally:
        ser.close()

# Define the callback functions
def on_connect(client, userdata, flags, rc):
    """ Callback for successful connection to the broker. """
    print(f"Connected with result code {rc}")
    # Publish a message after connecting
    client.publish("Vusur", "Hello MQTT!")

def on_publish(client, userdata, mid):
    """ Callback for a message successfully published. """
    print(f"Message published with id: {mid}")

# Create the MQTT client
client = mqtt.Client()

# Assign callback functions
client.on_connect = on_connect
client.on_publish = on_publish

# Connect to the MQTT broker (replace with your broker's address)
broker_address = "mqtt-dashboard.com"  # You can use a public broker or a local one
port = 1883 
serial_port='COM5'
mqtt_topic="Vusur"

client.connect(broker_address, port,keepalive=60)

# Start the network loop in the background to handle messages
client.loop_start()

forward_serial_to_mqtt(serial_port, client, mqtt_topic)
# You can continue your program here, and the client will publish the message when it connects.
# Optionally, you can wait for the client to finish its work
client.loop_forever()
