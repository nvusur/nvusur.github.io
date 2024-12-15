# Smart home system based on ZigBee technology

Welcome to the Smart Home System, an innovative project designed for my master thesis. This system leverages ZigBee communication through XBee modules to create a reliable network of smart devices. Systems central coordinator is realized on Raspberry Pi. It collects data from various nodes within the network and uploads this information to a web application for seamless real-time monitoring and control.

Key Components

ZigBee Communication:

The project uses XBee modules to establish a robust and secure ZigBee communication network. ZigBee is known for its low power consumption and high reliability, making it ideal for home automation systems.

Central Coordinator:

A Raspberry Pi serves as the central coordinator of the system. It is connected to an XBee module that enables it to communicate with all the nodes in the ZigBee network. The Raspberry Pi collects data from these nodes through its serial port.

Data Management:

The collected data is transmitted to a web application using the MQTT (Message Queuing Telemetry Transport) protocol. MQTT is a lightweight messaging protocol, perfect for IoT (Internet of Things) applications, allowing efficient data transfer.

Web Application:

The web application provides an intuitive interface for users to monitor and control their smart home devices. The data from the Raspberry Pi is updated in real-time, offering users instant insights into their home environment.

Features

Real-time Monitoring: Users can monitor the status of their smart home devices in real-time through the web application.

Scalability: The modular design allows for easy addition of new devices and nodes to the existing network.

