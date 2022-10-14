// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

async function main() {
  // [START iot_quickstart]
  const iot = require('@google-cloud/iot');
  const client = new iot.v1.DeviceManagerClient({"fallback":"rest"});

  async function quickstart() {
    /**
     * Get list device registry
     */
    // const projectId = await client.getProjectId();
    // const parent = client.locationPath(projectId, 'us-central1');
    // const [resources] = await client.listDeviceRegistries({parent});
    // console.log(`${resources.length}resource(s) found.`);
    // for (const resource of resources) {
    //   console.log(resource);
    // }
    /**
     * Send Command to Device
     */
    // const binaryData = Buffer.from("c2VuZEZ1bm55TWVzc2FnZVRvRGV2aWNl");

    // const request = {
    //   subfolder : 'prst-sub',
    //   name: 'prashant-device',
    //   binaryData: 'c2VuZEZ1bm55TWVzc2FnZVRvRGV2aWNl',
    // };

    // const [response] = await client.sendCommandToDevice(request);
    // console.log('Sent command: ', response);

    const request = {
      name : "projects/ingressdevelopmentenv/locations/us-central1/registries/prashant-registry/devices/prashant-device"
    };
    const [response] = await client.getDevice(request);
    console.log('Device Information');
    console.log(response);
    console.log("Device Information End");
  }
  quickstart();
  // [END iot_quickstart]
}
main();
