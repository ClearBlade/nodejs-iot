// Copyright 2022 ClearBlade, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';
// [START iot_http_includes]
const {request} = require('axios');
// [END iot_http_includes]

console.log('ClearBlade IoT Core HTTP example.');
const {argv} = require('yargs')
  .options({
    iotCredentials: {
      description: 'ServiceAccount Credentials JSON file.',
      requiresArg: true,
      demandOption: true,
      type: 'string',
    },
    cloudRegion: {
      default: 'us-central1',
      description: 'GCP cloud region.',
      requiresArg: true,
      type: 'string',
    },
    registryId: {
      description: 'Cloud IoT registry ID.',
      requiresArg: true,
      demandOption: true,
      type: 'string',
    },
    deviceId: {
      description: 'Cloud IoT device ID.',
      requiresArg: true,
      demandOption: true,
      type: 'string',
    },
    numMessages: {
      default: 100,
      description: 'Number of messages to publish.',
      requiresArg: true,
      type: 'number',
    },
    messageType: {
      default: 'events',
      description: 'Message type to publish.',
      requiresArg: true,
      choices: ['events', 'state'],
      type: 'string',
    },
  })
  .example(
    'node $0 cloudiot_http_example.js --iotCredentials=../../creds.json --registryId=my-registry --deviceId=my-node-device'
  )
  .wrap(120)
  .recommendCommands()
  .epilogue('For more information, see https://clearblade.com/iot-core')
  .help()
  .strict();

// [START read iot credentials - available in downloaded JSON when Project ServiceAccount was created]
const iotCredsObj = require(argv.iotCredentials);
// [EMD read opt credentials]

// [START read registry credentials]
const getRegistryCredentials = async iotCredsObj => {
  const url = `${iotCredsObj.url}/api/v/1/code/${iotCredsObj.systemKey}/getRegistryCredentials`;
  const options = {
    url,
    headers: {
      'ClearBlade-UserToken': iotCredsObj.token,
    },
    data: {
      project: iotCredsObj.project,
      region: argv.cloudRegion,
      registry: argv.registryId,
    },
    method: 'POST',
    // retry: true,
  };
  try {
    const res = await request(options);
    return res.data;
  } catch (err) {
    console.error('Received error: ', err);
    if (err.response && err.response.data && err.response.data.error) {
      console.error(
        `Received error: ${JSON.stringify(err.response.data.error)}`
      );
    }
  }
};

// [START iot_http_variables]
// A unique string that identifies this device. For ClearBlade IoT Core, it
// must be in the format below.
const devicePath = `projects/${iotCredsObj.project}/locations/${argv.cloudRegion}/registries/${argv.registryId}/devices/${argv.deviceId}`;
let iatTime = parseInt(Date.now() / 1000);
// [END iot_http_variables]

// Publish numMessages message asynchronously, starting from message
// messageCount. Telemetry events are published at a rate of 1 per second and
// states at a rate of 1 every 2 seconds.
// [START iot_http_publish]
const publishAsync = async (
  urlBase,
  serviceAccountToken,
  messageCount,
  numMessages
) => {
  // The request path, set accordingly depending on the message type.
  const method = argv.messageType === 'events' ? 'publishEvent' : 'setState';
  const url = `${urlBase}&method=${method}`;
  const payload = `${argv.registryId}/${argv.deviceId}-payload-${messageCount}`;
  console.log('Publishing message:', payload);
  const binaryData = Buffer.from(payload).toString('base64');
  const postData =
    argv.messageType === 'events' ? {binaryData} : {state: {binaryData}};

  const options = {
    url,
    headers: {
      'ClearBlade-UserToken': serviceAccountToken,
      'content-type': 'application/json',
      'cache-control': 'no-cache',
    },
    data: postData,
    method: 'POST',
    retry: true,
  };

  // Send events for high-frequency updates, update state only occasionally.
  const delayMs = argv.messageType === 'events' ? 1000 : 2000;
  try {
    await request(options);
    console.log('Message sent.');
  } catch (err) {
    console.error('Received error: ', err);
    if (err.response && err.response.data && err.response.data.error) {
      console.error(
        `Received error: ${JSON.stringify(err.response.data.error)}`
      );
    }
  }
  if (messageCount < numMessages) {
    // If we have published fewer than numMessage messages, publish payload
    // messageCount + 1.
    setTimeout(() => {
      const secsFromIssue = parseInt(Date.now() / 1000) - iatTime;
      if (secsFromIssue > argv.tokenExpMins * 60) {
        iatTime = parseInt(Date.now() / 1000);
        console.log(`\tRefreshing token after ${secsFromIssue} seconds.`);
      }

      publishAsync(urlBase, serviceAccountToken, messageCount + 1, numMessages);
    }, delayMs);
  }
};
// [END iot_http_publish]

// [START iot_http_getconfig]
const getConfig = async (urlBase, serviceAccountToken, localVersion) => {
  const url = `${urlBase}&localVersion=${localVersion}`;
  console.log(`Getting config from URL: ${url}`);

  const options = {
    url,
    headers: {
      'ClearBlade-UserToken': serviceAccountToken,
      'content-type': 'application/json',
      'cache-control': 'no-cache',
    },
    retry: true,
  };
  try {
    const res = await request(options);
    console.log('Received config', JSON.stringify(res.data));
  } catch (err) {
    console.error('Received error: ', err);
    if (err.response && err.response.data && err.response.data.error) {
      console.error(
        `Received error: ${JSON.stringify(err.response.data.error)}`
      );
    }
  }
};
// [END iot_http_getconfig]

// [START Get Registry Credentials from IoT Credentials JSON file]
getRegistryCredentials(iotCredsObj).then(registryCredsObj => {
  const urlBase = `${registryCredsObj.url}/api/v/4/webhook/execute/${registryCredsObj.systemKey}/cloudiotdevice_devices?name=${devicePath}`;
  const serviceAccountToken = registryCredsObj.serviceAccountToken;

  // [START iot_run_http]
  // Print latest configuration
  getConfig(urlBase, serviceAccountToken, 0);

  // Publish messages.
  publishAsync(urlBase, serviceAccountToken, 1, argv.numMessages);
  // [END iot_run_http]
});
// [END Get Registry Credentials]
