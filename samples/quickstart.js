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
  const iot = require('@clearblade/iot');
  const cloudRegion = 'us-central1';
  const registryId = 'ingressRegistry';
  const deviceId = 'device_ingress';
  const client = new iot.v1.DeviceManagerClient();

  async function quickstart() {
    /**
     * Get list device registry
     */
    const projectId = await client.getProjectId();
    const parent = client.locationPath(projectId, 'us-central1');
    const [resources] = await client.listDeviceRegistries({ parent });
    //console.log('parent', parent);
    //console.log(`${resources.length}resource(s) found.`);
    for (const resource of resources) {
      //console.log(resource);
    }

    /**
     * Send Command to Device - DevicePath - name
     */
    // const devicePath = client.devicePath(
    //   projectId,
    //   cloudRegion,
    //   registryId,
    //   deviceId
    // );
    // const requestSendCommandDevice = {
    //   subfolder: 'sub',
    //   name: devicePath,
    //   binaryData: 'c2VuZEZ1bm55TWVzc2FnZVRvRGV2aWNl', //64 encoded
    // };
    // const [responseSendCommandDevice] = await client.sendCommandToDevice(
    //   requestSendCommandDevice
    // );
    // console.log('Sent command: ', responseSendCommandDevice);

    /**
     * Get List Devices - Parent
     */
    // const parentName = client.registryPath(
    //   projectId,
    //   'us-central1',
    //   'ingressRegistry'
    // );
    // const [responseListDevices] = await client.listDevices({
    //   parent: parentName,
    // });
    // console.log('Device list: ', responseListDevices);

    /**
     * Device Update - Device Path - deviceName
     */
    // const devicePath = client.devicePath(
    //   projectId,
    //   cloudRegion,
    //   registryId,
    //   deviceId
    // );

    // const device = {
    //   name: devicePath,
    //   logLevel: 'NONE',
    //   metadata: {
    //     Test1: 123,
    //   },
    //   credentials: [
    //     {
    //       // publicKey: {
    //       //   format: 'RSA_X509_PEM',
    //       //   key: readFileSync(rsaPublicKeyFile).toString(),
    //       // },
    //     },
    //   ],
    // };
    // const requestUpdateDevice = {
    //   device,
    //   updateMask: 'logLevel,metadata',
    // };
    // const [responseUpdateDevice] = await client.updateDevice(
    //   requestUpdateDevice
    // );
    // console.log(responseUpdateDevice);

    /**
     * Un bind gateway to device - Parent - RegistryPath
     */
    // const registryPath = client.registryPath(
    //   projectId,
    //   cloudRegion,
    //   registryId
    // );
    // const unbindRequest = {
    //   parent: registryPath,
    //   deviceId: 'ingress_device_node',
    //   gatewayId: 'gateway_ingress',
    // };
    // const [responseUnBindGateway] = await client.unbindDeviceFromGateway(
    //   unbindRequest
    // );
    // console.log('RES: ', responseUnBindGateway);
    /**
     * bind gateway to device - Parent - RegistryPath
     */
    // const registryPath = client.registryPath(
    //   projectId,
    //   cloudRegion,
    //   registryId
    // );
    // const requestBindGateway = {
    //   parent: registryPath,
    //   deviceId: 'ingress_device_node',
    //   gatewayId: 'gateway_ingress',
    // };
    // const [responseBindGateway] = await client.bindDeviceToGateway(
    //   requestBindGateway
    // );
    // console.log('RES: ', responseBindGateway);
    /**
     * Get device state list - Device Path - Parent
     */
    // const devicePath = client.devicePath(
    //   projectId,
    //   cloudRegion,
    //   registryId,
    //   deviceId
    // );
    // const requestGetDeviceState = {
    //   name: devicePath,
    //   numStates: -1,
    // };
    // const [responseDeviceStateList] = await client.listDeviceStates(
    //   requestGetDeviceState
    // );
    // console.log('RES: ', responseDeviceStateList);

    /*
     * Device Registry Update - RegistryPath - name
     */
    // const registryPath = client.registryPath(
    //   projectId,
    //   cloudRegion,
    //   registryId
    // );
    // const request = {
    //   deviceRegistry: {
    //     id: registryId,
    //     name: registryPath,
    //     logLevel: '',
    //     httpConfig: {
    //       httpEnabledState: 'HTTP_ENABLED',
    //     },
    //   },
    //   updateMask: 'httpConfig.http_enabled_state',
    // };
    // const [response] = await client.updateDeviceRegistry(request);
    // console.log(response);

    /*
     * Device Registry Create - No parent/name needed
     */
    // const request = {
    //   deviceRegistry: {
    //     id: 'test-create-2',
    //     name: 'test-create-2',
    //     eventNotificationConfigs: [],
    //     stateNotificationConfig: {},
    //     mqttConfig: {},
    //     httpConfig: {},
    //     logLevel: 'NONE',
    //     credentials: [],
    //   },
    //   parent: parent,
    // };
    // const [response] = await client.createDeviceRegistry(request);
    // console.log('Create Start');
    // console.log(response);
    // console.log('Create End');

    /**
     * Get Device - name {devicePath}
     */
    // const devicePath = client.devicePath(
    //   projectId,
    //   cloudRegion,
    //   registryId,
    //   deviceId
    // );
    //const [responseDevice] = await client.getDevice({name: devicePath});
    //console.log('Device', responseDevice);
    /*
     * Delete Registry
     */
    // const req = {
    //   name: 'projects/ingressdevelopmentenv/locations/us-central1/registries/Test12',
    // };
    // const [response] = await client.deleteDeviceRegistry(req);
    // console.log('Delete State: ', response);
    /*
     * List Registry - Admin
     */
    // const req = {
    //   parent: 'projects/ingressdevelopmentenv/locations/us-central1',
    // };
    // const [response] = await client.listDeviceRegistries(req);
    // console.log('List State: ', response);
    /*
    Device Registry Create
    */
    // const projectId = await client.getProjectId();
    // const parent = client.locationPath(projectId, 'us-central1');

    // const request = {
    //   deviceRegistry: {
    //     id: 'test-create-2',
    //     name: 'test-create-2',
    //     eventNotificationConfigs: [],
    //     stateNotificationConfig: {},
    //     mqttConfig: {},
    //     httpConfig: {},
    //     logLevel: 'NONE',
    //     credentials: [],
    //   },
    //   parent: parent,
    // };
    // const [response] = await client.createDeviceRegistry(request);
    // console.log('Create Start');
    // console.log(response);
    // console.log('Create End');

    /**
     * Create Device -- Registry Path -- Parent
     */

    // const registryPath = client.registryPath(
    //   projectId,
    //   cloudRegion,
    //   registryId
    // );

    // const device = {
    //   id: 'sdk_device_dummy',
    //   name: 'sdk_device_dummy',
    //   numId: 987,
    //   credentials: [
    //     // {
    //     //   publicKey: {
    //     //     format: publicKeyFormat,
    //     //     key: readFileSync(publicKeyFile).toString(),
    //     //   },
    //     // },
    //   ],
    // };

    // const requestCreateDevice = {
    //   parent: registryPath,
    //   device,
    // };

    // const [responseCreateDevice] = await client.createDevice(requestCreateDevice);
    // console.log('Created device: ', responseCreateDevice);

    /**
     * Get list config version device = Device Path - Name
     */
    //  const devicePath = client.devicePath(
    //   projectId,
    //   cloudRegion,
    //   registryId,
    //   deviceId
    // );

    // const requestGetDeviceConfigVersions = {
    //   name: devicePath,
    //   numVersions : 5
    // };
    // const [version] = await client.listDeviceConfigVersions(requestGetDeviceConfigVersions);
    // console.log(`RES : `, version);

    /**
     * Device config modify - Device Path - name
     */

    // const request = {
    //   versionToUpdate : '5',
    //   name: devicePath,
    //   binaryData: 'c2VuZEZ1bm55TWVzc2FnZVRvRGV2aWNl',
    // };

    // const [response] = await client.modifyCloudToDeviceConfig(request);
    // console.log('Sent command: ', response);

    /**
    * delete device
    */
    const devicePath = client.devicePath(
      projectId,
      cloudRegion,
      registryId,
      'ingress_device_node_second'
    );
    const request = {
      name: devicePath
    };

    const [resDeleteDevice] = await client.deleteDevice(request);
    console.log(`RES : `, resDeleteDevice);
  }
  quickstart();
  // [END iot_quickstart]
}
main();
