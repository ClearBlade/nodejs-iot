<img src="https://avatars.githubusercontent.com/u/2822779?s=200&v=4" alt="ClearBlade logo" title="ClearBlade" align="right" height="96" width="96"/>

# ClearBlade IoT Core NodeJS MQTT example

This sample app publishes data to Cloud Pub/Sub using the MQTT bridge provided
as part of ClearBlade IoT Core.

Before you can run this sample, you must register a device as
described in the parent README. For the gateway samples, you must register and bind
a device as described in the [ClearBlade IoT gateway docs](https://clearblade.atlassian.net/wiki/spaces/IC/pages/2202664978/Creating+gateways).

# Setup

Run the following command to install the NodeJS library dependencies:

    npm install

Download the server certificate as described in the [ClearBlade docs](https://clearblade.atlassian.net/wiki/spaces/IC/pages/2210299905/Re-targetting+Devices).

# Running the sample

The following command summarizes the sample usage:

    Usage: cloudiot_mqtt_example_nodejs [command] [options]

    Commands:
        mqttDeviceDemo              Example ClearBlade IoT Core MQTT device connection demo.
        sendDataFromBoundDevice     Demonstrates sending data from a gateway on behalf of a bound device.
        listenForConfigMessages     Demonstrates listening for config messages on a gateway client of a bound device.
        listenForErrorMessages      Demonstrates listening for error messages on a gateway.

    Options:

        --projectId           The Project ID to use.
        --cloudRegion         GCP cloud region.
        --registryId          Cloud IoT registry ID.
        --deviceId            Cloud IoT device ID.
        --privateKeyFile      Path to the private key file.
        --serverCertFile      Path to the server certificate file.
        --algorithm           Encryption algorithm to generate the JWT.
        --numMessages         Number of messages to publish.
        --tokenExpMins        Minutes to JWT token expiration.
        --mqttBridgeHostname  MQTT bridge hostname.
        --mqttBridgePort      MQTT bridge port.
        --messageType         Message type to publish.
        --help                Show help

Examples:

    node cloudiot_mqtt_example_nodejs.js mqttDeviceDemo \
        --mqttBridgeHostname=us-central1-mqtt.clearblade.com \
        --projectId=blue-jet-123 \
        --cloudRegion=us-central1 \
        --registryId=my-registry \
        --deviceId=my-device \
        --privateKeyFile=/path/to/rsa_private.pem \
        --serverCertFile=/path/to/root.pem \
        --algorithm=RS256

    node cloudiot_mqtt_example_nodejs.js sendDataFromBoundDevice \
        --mqttBridgeHostname=us-central1-mqtt.clearblade.com \
        --projectId=blue-jet-123 \
        --cloudRegion=us-central1 \
        --registryId=my-registry \
        --gatewayId=my-gateway \
        --deviceId=my-device \
        --privateKeyFile=/path/to/rsa_private.pem \
        --serverCertFile=/path/to/root.pem \
        --algorithm=RS256

    node cloudiot_mqtt_example_nodejs.js listenForConfigMessages \
        --mqttBridgeHostname=us-central1-mqtt.clearblade.com \
        --projectId=blue-jet-123 \
        --cloudRegion=us-central1 \
        --registryId=my-registry \
        --gatewayid=my-gateway \
        --deviceId=my-device \
        --privateKeyFile=/path/to/rsa_private.pem \
        --serverCertFile=/path/to/root.pem \
        --algorithm=RS256
        --clientDuration=60000

# Sending a configuration update

For the `listenForConfigMessages` example, try sending a config update to the device while the client is running. This can be done via the ClearBlade IoT Core UI.

# Reading the messages written by the sample client

1.  Create a subscription to your topic.

        gcloud pubsub subscriptions create \
            projects/your-project-id/subscriptions/my-subscription \
            --topic device-events

2.  Read messages published to the topic.

        gcloud pubsub subscriptions pull --auto-ack \
            projects/my-iot-project/subscriptions/my-subscription
