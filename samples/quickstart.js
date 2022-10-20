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
  const client = new iot.v1.DeviceManagerClient({ "fallback": "rest" });

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
    //   subfolder : 'sub',
    //   name: 'device_ingress',
    //   binaryData: 'c2VuZEZ1bm55TWVzc2FnZVRvRGV2aWNl',
    // };

    // const [response] = await client.sendCommandToDevice(request);
    // console.log('Sent command: ', response);
    /**
     * Device config modify
     */
    // const request = {
    //   versionToUpdate : '6',
    //   name: 'device_ingress',
    //   binaryData: 'c2VuZEZ1bm55TWVzc2FnZVRvRGV2aWNl',
    // };

    // const [response] = await client.modifyCloudToDeviceConfig(request);
    // console.log('Sent command: ', response);
    /**
     * Create Device
     */
    // const regPath = 'ingressRegistry';
    // const device = {
    //   id: 'ingress_device_node',
    //   credentials: [
    //     // {
    //     //   publicKey: {
    //     //     format: 'ES256_PEM',
    //     //     key: readFileSync(esCertificateFile).toString(),
    //     //   },
    //     // },
    //   ],
    // };
    // const requestCreateDevice = {
    //   parent: regPath,
    //   device,
    // };

    // const [response] = await client.createDevice(requestCreateDevice);
    // console.log('Created device', response);

    // /**
    //  * Get list config version device
    //  */
    // const request = {
    //   name: 'device_ingress',
    //   numVersions : 2
    // };
    // const [version] = await client.listDeviceConfigVersions(request);
    // console.log(`RES : `, version);

    /**
     * delete device
     */
    // const request = {
    //   name: 'device_ingress'
    // };
    // const [res] = await client.deleteDevice(request);
    // console.log(`RES : `, res);

    /*
    Device Update
    */
    const request = {
      device: {
        id: 'prashant-device',
        name: 'prashant-device',
        logLevel: 'NONE',
        metadata: {
          Test1: 13,
        },
      },
      updateMask: 'logLevel,metadata',
    };
    const [response] = await client.updateDevice(request);
    console.log('Update Start');
    console.log(response);
    console.log('Update End');
  }
  quickstart();
  // [END iot_quickstart]
}
main();
