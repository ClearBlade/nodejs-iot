<img src="https://avatars2.githubusercontent.com/u/2810941?v=3&s=96" alt="ClearBlade logo" title="ClearBlade IoT Core" align="right" height="96" width="96"/>

# ClearBlade IoT Core NodeJS HTTP example

This sample app publishes messages to [Google Cloud Pub/Sub](pubsub) or updates
device states using the HTTP bridge provided as part of ClearBlade IoT Core.

Note that before you can run this sample, you must register a device as
described in the parent README.

[pubsub]: https://cloud.google.com/pubsub/docs

# Setup

Run the following command to install the library dependencies for NodeJS:

    npm install

# Running the sample

The following command summarizes the sample usage:

Usage: cloudiot_http_example.js [options]

Example ClearBlade IoT Core HTTP device connection code.

Options:

    -h, --help                       output usage information
    --iotCredentials <iotCredentials>Service Account Credentials JSON file.
    --registryId <registryId>        ClearBlade IoT Core registry id.
    --deviceId <deviceId>            ClearBlade IoT Core device id.
    --cloudRegion [region]           GCP cloud region (e.g. us-central1, europe-west1). Defaults to us-central1.
    --numMessages [num]              Number of messages to publish.
    --messageType [events|state]     The message type to publish.

For example, if your region is asia-east1, and you have generated downloaded your credentials JSON file when you created a project Service Account, you can run the sample as:

    node cloudiot_http_example.js \
        --iotCredentials=../creds.json
        --cloudRegion=asia-east1 \
        --registryId=my-registry \
        --deviceId=my-node-device

# Reading Cloud Pub/Sub messages written by the sample client

1.  Create a subscription to your topic.

    gcloud beta pubsub subscriptions create \
    projects/your-project-id/subscriptions/my-subscription \
    --topic device-events

2.  Read messages published to the topic

    gcloud beta pubsub subscriptions pull --auto-ack \
    projects/my-iot-project/subscriptions/my-subscription
