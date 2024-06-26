// Copyright 2023 ClearBlade Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Copyright 2020 Google LLC
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

const assert = require('assert');
const iot = require('@clearblade/iot');
const path = require('path');
const {PubSub} = require('@google-cloud/pubsub');
const uuid = require('uuid');

const {after, before, it, xit} = require('mocha');

const topicName = `nodejs-iot-test-topic-${uuid.v4()}`;
const registryName = `nodejs-iot-test-registry-${uuid.v4()}`;
const region = 'us-central1';
const projectId =
  process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT;

const cmd = 'node manager.js';
const cp = require('child_process');
const cwd = path.join(__dirname, '..');
const execSync = cmd => cp.execSync(cmd, {encoding: 'utf-8'});
const installDeps = 'npm install';
const rsaPublicCert = '../resources/rsa_cert.pem'; // process.env.NODEJS_IOT_RSA_PUBLIC_CERT;
const rsaPrivateKey = '../resources/rsa_private.pem'; //process.env.NODEJS_IOT_RSA_PRIVATE_KEY;
const ecPublicKey = '../resources/ec_public.pem'; // process.env.NODEJS_IOT_EC_PUBLIC_KEY;

const iotClient = new iot.v1.DeviceManagerClient();
const pubSubClient = new PubSub({projectId});

before(async () => {
  execSync(installDeps, `${cwd}/mqtt_example`);
  assert(
    process.env.GCLOUD_PROJECT,
    'Must set GCLOUD_PROJECT environment variable!'
  );
  assert(
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
    'Must set GOOGLE_APPLICATION_CREDENTIALS environment variable!'
  );
  // Create a topic to be used for testing.
  const [topic] = await pubSubClient.createTopic(topicName);
  console.log(`Topic ${topic.name} created.`);

  // Creates a registry to be used for tests.
  const createRegistryRequest = {
    parent: iotClient.locationPath(projectId, region),
    deviceRegistry: {
      id: registryName,
      eventNotificationConfigs: [
        {
          pubsubTopicName: topic.name,
        },
      ],
    },
  };
  await execSync(`${cmd} setupIotTopic ${topicName}`, cwd);

  await iotClient.createDeviceRegistry(createRegistryRequest);
  console.log(`Created registry: ${registryName}`);
});

after(async () => {
  await pubSubClient.topic(topicName).delete();
  console.log(`Topic ${topicName} deleted.`);

  execSync(`${cmd} clearRegistry ${registryName}`, cwd);

  console.log('Deleted test registry.');
});

it('should create and delete an unauthorized device', async () => {
  const localDevice = 'test-device-unauth-delete';

  let output = await execSync(
    `${cmd} createUnauthDevice ${localDevice} ${registryName}`,
    cwd
  );
  assert.ok(output.includes('Created device'));
  output = await execSync(
    `${cmd} deleteDevice ${localDevice} ${registryName}`,
    cwd
  );
  assert.ok(output.includes('Successfully deleted device'));
});

it('should list configs for a device', async () => {
  const localDevice = 'test-device-configs';
  let output = await execSync(
    `${cmd} createUnauthDevice ${localDevice} ${registryName}`,
    cwd
  );
  assert.ok(output.includes('Created device'));
  output = await execSync(
    `${cmd} getDeviceConfigs ${localDevice} ${registryName}`,
    cwd
  );
  assert.ok(output.includes('Configs'));
  output = await execSync(
    `${cmd} deleteDevice ${localDevice} ${registryName}`,
    cwd
  );
  assert.ok(output.includes('Successfully deleted device'));
});

it('should create and delete an RSA256 device', async () => {
  const localDevice = 'test-rsa-device';
  let output = await execSync(
    `${cmd} createRsa256Device ${localDevice} ${registryName} ${rsaPublicCert}`,
    cwd
  );
  assert.ok(output.includes('Created device'));
  output = await execSync(
    `${cmd} getDeviceState ${localDevice} ${registryName}`,
    cwd
  );
  assert.ok(output.includes('State'));
  output = await execSync(
    `${cmd} deleteDevice ${localDevice} ${registryName}`,
    cwd
  );
  assert.ok(output.includes('Successfully deleted device'));
});

it('should create and delete an ES256 device', async () => {
  const localDevice = 'test-es256-device';
  let output = await execSync(
    `${cmd} createEs256Device ${localDevice} ${registryName} ${ecPublicKey}`,
    cwd
  );
  assert.ok(output.includes('Created device'));
  output = await execSync(
    `${cmd} getDeviceState ${localDevice} ${registryName}`,
    cwd
  );
  assert.ok(output.includes('State'));
  output = await execSync(
    `${cmd} deleteDevice ${localDevice} ${registryName}`,
    cwd
  );
  assert.ok(output.includes('Successfully deleted device'));
});

it('should patch an unauthorized device with RSA256', async () => {
  const localDevice = 'test-device-patch-rs256';
  let output = await execSync(
    `${cmd} createUnauthDevice ${localDevice} ${registryName}`,
    cwd
  );
  assert.ok(output.includes('Created device'));
  output = await execSync(
    `${cmd} patchRsa256 ${localDevice} ${registryName} ${rsaPublicCert}`,
    cwd
  );
  assert.ok(output.includes('Patched device:'));
  output = await execSync(
    `${cmd} deleteDevice ${localDevice} ${registryName}`,
    cwd
  );
  assert.ok(output.includes('Successfully deleted device'));
});

it('should patch an unauthorized device with ES256', async () => {
  const localDevice = 'test-device-patch-es256';
  let output = await execSync(
    `${cmd} createUnauthDevice ${localDevice} ${registryName}`,
    cwd
  );
  assert.ok(output.includes('Created device'));
  output = await execSync(
    `${cmd} patchEs256 ${localDevice} ${registryName} ${ecPublicKey}`,
    cwd
  );
  assert.ok(output.includes('Patched device:'));
  output = await execSync(
    `${cmd} deleteDevice ${localDevice} ${registryName}`,
    cwd
  );
  assert.ok(output.includes('Successfully deleted device'));
});

it('should create and list devices', async () => {
  const localDevice = 'test-device-list';
  let output = await execSync(
    `${cmd} createUnauthDevice ${localDevice} ${registryName}`,
    cwd
  );
  assert.ok(output.includes('Created device'));
  output = await execSync(`${cmd} listDevices ${registryName}`, cwd);
  assert.ok(output.includes('Current devices in registry:'));
  assert.ok(output.includes(localDevice));
  output = await execSync(
    `${cmd} deleteDevice ${localDevice} ${registryName}`,
    cwd
  );
  assert.ok(output.includes('Successfully deleted device'));
});

it('should create and get a device', async () => {
  const localDevice = 'test-device-get';
  let output = await execSync(
    `${cmd} createUnauthDevice ${localDevice} ${registryName}`,
    cwd
  );
  assert.ok(output.includes('Created device'));
  output = await execSync(
    `${cmd} getDevice ${localDevice} ${registryName}`,
    cwd
  );
  assert.ok(output.includes(`Found device: ${localDevice}`));
  output = await execSync(
    `${cmd} deleteDevice ${localDevice} ${registryName}`,
    cwd
  );
});

xit('should create and get an iam policy', async () => {
  const localMember = 'group:dpebot@google.com';
  const localRole = 'roles/viewer';

  let output = await execSync(
    `${cmd} setIamPolicy ${registryName} ${localMember} ${localRole}`,
    cwd
  );
  assert.ok(output.includes('ETAG'));

  output = await execSync(`${cmd} getIamPolicy ${registryName}`, cwd);
  assert.ok(output.includes('dpebot'));
});

it('should create and delete a registry', async () => {
  const createRegistryId = `${registryName}-create`;

  let output = await execSync(`${cmd} setupIotTopic ${topicName}`, cwd);
  output = await execSync(
    `${cmd} createRegistry ${createRegistryId} ${topicName}`,
    cwd
  );
  assert.ok(output.includes('Successfully created registry'));
  output = await execSync(`${cmd} deleteRegistry ${createRegistryId}`, cwd);
  assert.ok(output.includes('Successfully deleted registry'));
});

xit('should send command message to device', async () => {
  const deviceId = 'test-device-command';
  const commandMessage = 'rotate:180_degrees';

  await execSync(
    `${cmd} createRsa256Device ${deviceId} ${registryName} ${rsaPublicCert}`,
    cwd
  );

  cp.exec(
    `node mqtt_example/cloudiot_mqtt_example_nodejs.js mqttDeviceDemo --deviceId=${deviceId} --registryId=${registryName}\
  --privateKeyFile=${rsaPrivateKey} --algorithm=RS256 --numMessages=20 --mqttBridgePort=8883`,
    path.join(__dirname, '../../mqtt_example')
  );

  const output = await execSync(
    `${cmd} sendCommand ${deviceId} ${registryName} ${commandMessage}`
  );
  console.log(output);
  assert.ok(output.includes('Sent command'));

  await execSync(`${cmd} deleteDevice ${deviceId} ${registryName}`, cwd);
});

it('should create a new gateway', async () => {
  const gatewayId = `nodejs-test-gateway-iot-${uuid.v4()}`;
  const gatewayOut = await execSync(
    `${cmd} createGateway --registryId=${registryName} --gatewayId=${gatewayId}\
  --format=RSA_X509_PEM --key=${rsaPublicCert}`
  );

  // test no error on create gateway.
  assert.ok(gatewayOut.includes('Created device'));

  await iotClient.deleteDevice({
    name: iotClient.devicePath(projectId, region, registryName, gatewayId),
  });
});

it('should list gateways', async () => {
  const gatewayId = `nodejs-test-gateway-iot-${uuid.v4()}`;
  await execSync(
    `${cmd} createGateway --registryId=${registryName} --gatewayId=${gatewayId}\
  --format=RSA_X509_PEM --key=${rsaPublicCert}`
  );

  // look for output in list gateway
  const gateways = await execSync(`${cmd} listGateways ${registryName}`);
  assert.ok(gateways.includes(`${gatewayId}`));

  await iotClient.deleteDevice({
    name: iotClient.devicePath(projectId, region, registryName, gatewayId),
  });
});

it('should bind existing device to gateway', async () => {
  const gatewayId = `nodejs-test-gateway-iot-${uuid.v4()}`;
  await execSync(
    `${cmd} createGateway --registryId=${registryName} --gatewayId=${gatewayId}\
  --format=RSA_X509_PEM --key=${rsaPublicCert}`
  );

  // create device
  const deviceId = `nodejs-test-device-iot-${uuid.v4()}`;
  await iotClient.createDevice({
    parent: iotClient.registryPath(projectId, region, registryName),
    device: {
      id: deviceId,
    },
  });

  // bind device to gateway
  const bind = await execSync(
    `${cmd} bindDeviceToGateway ${registryName} ${gatewayId} ${deviceId}`
  );

  assert.ok(bind.includes(`Binding device: ${deviceId}`));
  assert.strictEqual(bind.includes('Could not bind device'), false);

  // test unbind
  const unbind = await execSync(
    `${cmd} unbindDeviceFromGateway ${registryName} ${gatewayId} ${deviceId}`
  );
  assert.ok(unbind.includes(`Unbound ${deviceId} from ${gatewayId}`));

  await iotClient.deleteDevice({
    name: iotClient.devicePath(projectId, region, registryName, gatewayId),
  });

  await iotClient.deleteDevice({
    name: iotClient.devicePath(projectId, region, registryName, deviceId),
  });
});

it('should list devices bound to gateway', async () => {
  const gatewayId = `nodejs-test-gateway-iot-${uuid.v4()}`;
  await execSync(
    `${cmd} createGateway --registryId=${registryName} --gatewayId=${gatewayId}\
  --format=RSA_X509_PEM --key=${rsaPublicCert}`
  );

  const deviceId = `nodejs-test-device-iot-${uuid.v4()}`;
  await iotClient.createDevice({
    parent: iotClient.registryPath(projectId, region, registryName),
    device: {
      id: deviceId,
    },
  });

  await execSync(
    `${cmd} bindDeviceToGateway ${registryName} ${gatewayId} ${deviceId}`
  );

  const devices = await execSync(
    `${cmd} listDevicesForGateway ${registryName} ${gatewayId}`
  );

  assert.ok(devices.includes(deviceId));
  assert.strictEqual(
    devices.includes('No devices bound to this gateway.'),
    false
  );

  // cleanup
  await execSync(
    `${cmd} unbindDeviceFromGateway ${registryName} ${gatewayId} ${deviceId}`
  );

  await iotClient.deleteDevice({
    name: iotClient.devicePath(projectId, region, registryName, gatewayId),
  });

  await iotClient.deleteDevice({
    name: iotClient.devicePath(projectId, region, registryName, deviceId),
  });
});

it('should list gateways for bound device', async () => {
  const gatewayId = `nodejs-test-gateway-iot-${uuid.v4()}`;
  await execSync(
    `${cmd} createGateway --registryId=${registryName} --gatewayId=${gatewayId}\
  --format=RSA_X509_PEM --key=${rsaPublicCert}`
  );

  // create device
  const deviceId = `nodejs-test-device-iot-${uuid.v4()}`;
  await iotClient.createDevice({
    parent: iotClient.registryPath(projectId, region, registryName),
    device: {
      id: deviceId,
    },
  });

  await execSync(
    `${cmd} bindDeviceToGateway ${registryName} ${gatewayId} ${deviceId}`
  );

  const devices = await execSync(
    `${cmd} listGatewaysForDevice ${registryName} ${deviceId}`
  );

  assert.ok(devices.includes(gatewayId));
  assert.strictEqual(
    devices.includes('No gateways associated with this device'),
    false
  );

  // cleanup
  await execSync(
    `${cmd} unbindDeviceFromGateway ${registryName} ${gatewayId} ${deviceId}`
  );

  await iotClient.deleteDevice({
    name: iotClient.devicePath(projectId, region, registryName, gatewayId),
  });

  await iotClient.deleteDevice({
    name: iotClient.devicePath(projectId, region, registryName, deviceId),
  });
});
