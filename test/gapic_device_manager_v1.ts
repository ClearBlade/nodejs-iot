// Copyright 2023 ClearBlade Inc.
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
//
// Copyright 2022 Google LLC
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

import * as protos from '../protos/protos';
import * as assert from 'assert';
import * as sinon from 'sinon';
import {SinonStub} from 'sinon';
import {describe, it} from 'mocha';
import * as devicemanagerModule from '../src';

// import {PassThrough} from 'stream';

import {protobuf} from 'google-gax';
import {
  requestFactory,
  ServiceAccountCredentials,
  timeSecondsNanos,
} from '../src/v1/device_manager_client';
import path = require('path');
import {IoTCoreError} from '../src/v1/iotCoreError';

function generateSampleMessage<T extends object>(instance: T) {
  const filledObject = (
    instance.constructor as typeof protobuf.Message
  ).toObject(instance as protobuf.Message<T>, {defaults: true});
  return (instance.constructor as typeof protobuf.Message).fromObject(
    filledObject
  ) as T;
}

function stubSimpleCall<ResponseType>(response?: ResponseType, error?: Error) {
  return error
    ? sinon.stub().rejects(error)
    : sinon.stub().resolves([response]);
}

function stubSimpleCallWithCallback<ResponseType>(
  response?: ResponseType,
  error?: Error
) {
  return error
    ? sinon.stub().callsArgWith(2, error)
    : sinon.stub().callsArgWith(2, null, response);
}

// function stubPageStreamingCall<ResponseType>(
//   responses?: ResponseType[],
//   error?: Error
// ) {
//   const pagingStub = sinon.stub();
//   if (responses) {
//     for (let i = 0; i < responses.length; ++i) {
//       pagingStub.onCall(i).callsArgWith(2, null, responses[i]);
//     }
//   }
//   const transformStub = error
//     ? sinon.stub().callsArgWith(2, error)
//     : pagingStub;
//   const mockStream = new PassThrough({
//     objectMode: true,
//     transform: transformStub,
//   });
//   // trigger as many responses as needed
//   if (responses) {
//     for (let i = 0; i < responses.length; ++i) {
//       setImmediate(() => {
//         mockStream.write({});
//       });
//     }
//     setImmediate(() => {
//       mockStream.end();
//     });
//   } else {
//     setImmediate(() => {
//       mockStream.write({});
//     });
//     setImmediate(() => {
//       mockStream.end();
//     });
//   }
//   return sinon.stub().returns(mockStream);
// }

// function stubAsyncIterationCall<ResponseType>(
//   responses?: ResponseType[],
//   error?: Error
// ) {
//   let counter = 0;
//   const asyncIterable = {
//     [Symbol.asyncIterator]() {
//       return {
//         async next() {
//           if (error) {
//             return Promise.reject(error);
//           }
//           if (counter >= responses!.length) {
//             return Promise.resolve({done: true, value: undefined});
//           }
//           return Promise.resolve({done: false, value: responses![counter++]});
//         },
//       };
//     },
//   };
//   return sinon.stub().returns(asyncIterable);
// }

describe('v1.DeviceManagerClient', () => {
  const env = process.env;

  beforeEach(() => {
    process.env = {...env};
  });

  afterEach(() => {
    process.env = env;
  });
  describe('Common methods', () => {
    it('has servicePath', () => {
      const servicePath =
        devicemanagerModule.v1.DeviceManagerClient.servicePath;
      assert(servicePath);
    });

    it('has apiEndpoint', () => {
      const apiEndpoint =
        devicemanagerModule.v1.DeviceManagerClient.apiEndpoint;
      assert(apiEndpoint);
    });

    it('has port', () => {
      const port = devicemanagerModule.v1.DeviceManagerClient.port;
      assert(port);
      assert(typeof port === 'number');
    });

    // it('should create a client with gRPC fallback', () => {
    //   const client = new devicemanagerModule.v1.DeviceManagerClient({
    //     fallback: true,
    //   });
    //   assert(client);
    // });

    // it('has initialize method and supports deferred initialization', async () => {
    //   const client = new devicemanagerModule.v1.DeviceManagerClient({
    //     credentials: {client_email: 'bogus', private_key: 'bogus'},
    //     projectId: 'bogus',
    //   });
    //   assert.strictEqual(client.deviceManagerStub, undefined);
    //   await client.initialize();
    //   assert(client.deviceManagerStub);
    // });

    //   it('has close method for the initialized client', done => {
    //     const client = new devicemanagerModule.v1.DeviceManagerClient({
    //       credentials: {client_email: 'bogus', private_key: 'bogus'},
    //       projectId: 'bogus',
    //     });
    //     client.initialize();
    //     assert(client.deviceManagerStub);
    //     client.close().then(() => {
    //       done();
    //     });
    //   });

    //   it('has close method for the non-initialized client', done => {
    //     const client = new devicemanagerModule.v1.DeviceManagerClient({
    //       credentials: {client_email: 'bogus', private_key: 'bogus'},
    //       projectId: 'bogus',
    //     });
    //     assert.strictEqual(client.deviceManagerStub, undefined);
    //     client.close().then(() => {
    //       done();
    //     });
    //   });

    it('has getProjectId method', async () => {
      const fakeProjectId = 'fake-project-id';
      const client = new devicemanagerModule.v1.DeviceManagerClient({
        credentials: {
          systemKey: 'bogus',
          token: 'bogus',
          url: 'https://bogus.com',
          project: fakeProjectId,
        },
      });
      const result = await client.getProjectId();
      assert.strictEqual(result, fakeProjectId);
    });

    it('has getProjectId method with callback', async () => {
      const fakeProjectId = 'fake-project-id';
      const client = new devicemanagerModule.v1.DeviceManagerClient({
        credentials: {
          systemKey: 'bogus',
          project: 'bogus',
          token: 'bogus',
          url: 'https://bogus.com',
        },
      });
      client.getProjectId = sinon.stub().callsArgWith(0, null, fakeProjectId);
      const promise = new Promise((resolve, reject) => {
        client.getProjectId((err?: Error | null, projectId?: string | null) => {
          if (err) {
            reject(err);
          } else {
            resolve(projectId);
          }
        });
      });
      const result = await promise;
      assert.strictEqual(result, fakeProjectId);
    });

    describe('constructor', () => {
      it('should throw an error with no credentials option and no env variable', () => {
        assert.throws(
          () => new devicemanagerModule.v1.DeviceManagerClient(),
          err =>
            (err as Error).message ===
            'Must supply service account credentials via constructor or CLEARBLADE_CONFIGURATION environment variable'
        );
      });

      it('accepts credentials from constructor options', () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: '',
            token: '',
            url: '',
            project: '',
          },
        });
        assert(client);
      });

      it('throws error on invalid credentials option', () => {
        assert.throws(
          () =>
            new devicemanagerModule.v1.DeviceManagerClient({
              credentials: {
                bad: 'credentials',
              } as unknown as ServiceAccountCredentials,
            }),
          err =>
            (err as Error).message ===
            'Invalid credentials supplied to constructor options'
        );
      });

      it('accepts environment variable for service account credentials', () => {
        process.env.CLEARBLADE_CONFIGURATION = path.resolve(
          __dirname,
          '../../test/service_account_credentials_valid.json'
        );
        const client = new devicemanagerModule.v1.DeviceManagerClient();
        assert(client);
      });

      it('throws error when service account credentials from environment variable cannot be loaded', () => {
        process.env.CLEARBLADE_CONFIGURATION = path.resolve(
          __dirname,
          '../../test/notthere.json'
        );
        assert.throws(
          () => new devicemanagerModule.v1.DeviceManagerClient(),
          err =>
            (err as Error).message.includes('Failed to load configuration file')
        );
      });

      it('throws error when service account credentials from environment variable are invalid', () => {
        process.env.CLEARBLADE_CONFIGURATION = path.resolve(
          __dirname,
          '../../test/service_account_credentials_invalid.json'
        );

        assert.throws(
          () => new devicemanagerModule.v1.DeviceManagerClient(),
          err =>
            (err as Error).message.includes(
              'Please make sure it is a json file with the properties systemKey, token, url, and project'
            )
        );
      });
    });

    describe('createDeviceRegistry', () => {
      it('invokes createDeviceRegistry without error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.CreateDeviceRegistryRequest()
        );
        request.parent = '';
        const expectedOptions = {};
        const expectedResponse = generateSampleMessage(
          new protos.google.cloud.iot.v1.DeviceRegistry()
        );

        client.innerApiCalls.createDeviceRegistry =
          stubSimpleCall(expectedResponse);
        const [response] = await client.createDeviceRegistry(request);
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.createDeviceRegistry as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      it('invokes createDeviceRegistry without error using callback', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.CreateDeviceRegistryRequest()
        );
        request.parent = '';
        const expectedOptions = {};
        const expectedResponse = generateSampleMessage(
          new protos.google.cloud.iot.v1.DeviceRegistry()
        );
        client.innerApiCalls.createDeviceRegistry =
          stubSimpleCallWithCallback(expectedResponse);
        const promise = new Promise((resolve, reject) => {
          client.createDeviceRegistry(
            request,
            (
              err?: Error | null,
              result?: protos.google.cloud.iot.v1.IDeviceRegistry | null
            ) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
        const response = await promise;
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.createDeviceRegistry as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions /*, callback defined above */)
        );
      });

      it('invokes createDeviceRegistry with error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.CreateDeviceRegistryRequest()
        );
        request.parent = '';
        const expectedOptions = {};
        const expectedError = new Error('expected');
        client.innerApiCalls.createDeviceRegistry = stubSimpleCall(
          undefined,
          expectedError
        );
        await assert.rejects(
          client.createDeviceRegistry(request),
          expectedError
        );
        assert(
          (client.innerApiCalls.createDeviceRegistry as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      //   it('invokes createDeviceRegistry with closed client', async () => {
      //     const client = new devicemanagerModule.v1.DeviceManagerClient({
      //       credentials: {client_email: 'bogus', private_key: 'bogus'},
      //       projectId: 'bogus',
      //     });
      //     client.initialize();
      //     const request = generateSampleMessage(
      //       new protos.google.cloud.iot.v1.CreateDeviceRegistryRequest()
      //     );
      //     request.parent = '';
      //     const expectedError = new Error('The client has already been closed.');
      //     client.close();
      //     await assert.rejects(client.createDeviceRegistry(request), expectedError);
      //   });
    });

    describe('getDeviceRegistry', () => {
      it('invokes getDeviceRegistry without error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.GetDeviceRegistryRequest()
        );
        request.name = '';
        const expectedOptions = {};
        const expectedResponse = generateSampleMessage(
          new protos.google.cloud.iot.v1.DeviceRegistry()
        );
        client.innerApiCalls.getDeviceRegistry =
          stubSimpleCall(expectedResponse);
        const [response] = await client.getDeviceRegistry(request);
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.getDeviceRegistry as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      it('invokes getDeviceRegistry without error using callback', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.GetDeviceRegistryRequest()
        );
        request.name = '';
        const expectedOptions = {};
        const expectedResponse = generateSampleMessage(
          new protos.google.cloud.iot.v1.DeviceRegistry()
        );
        client.innerApiCalls.getDeviceRegistry =
          stubSimpleCallWithCallback(expectedResponse);
        const promise = new Promise((resolve, reject) => {
          client.getDeviceRegistry(
            request,
            (
              err?: Error | null,
              result?: protos.google.cloud.iot.v1.IDeviceRegistry | null
            ) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
        const response = await promise;
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.getDeviceRegistry as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions /*, callback defined above */)
        );
      });

      it('invokes getDeviceRegistry with error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.GetDeviceRegistryRequest()
        );
        request.name = '';
        const expectedOptions = {};
        const expectedError = new Error('expected');
        client.innerApiCalls.getDeviceRegistry = stubSimpleCall(
          undefined,
          expectedError
        );
        await assert.rejects(client.getDeviceRegistry(request), expectedError);
        assert(
          (client.innerApiCalls.getDeviceRegistry as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      // it('invokes getDeviceRegistry with closed client', async () => {
      //   const client = new devicemanagerModule.v1.DeviceManagerClient({
      //     credentials: {
      //       systemKey: 'bogus',
      //       project: 'bogus',
      //       token: 'bogus',
      //       url: 'https://bogus.com',
      //     },
      //   });
      //   client.initialize();
      //   const request = generateSampleMessage(
      //     new protos.google.cloud.iot.v1.GetDeviceRegistryRequest()
      //   );
      //   request.name = '';
      //   const expectedError = new Error('The client has already been closed.');
      //   client.close();
      //   await assert.rejects(client.getDeviceRegistry(request), expectedError);
      // });
    });

    describe('updateDeviceRegistry', () => {
      it('invokes updateDeviceRegistry without error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.UpdateDeviceRegistryRequest()
        );
        request.deviceRegistry = {};
        request.deviceRegistry.name = '';
        const expectedOptions = {};
        const expectedResponse = generateSampleMessage(
          new protos.google.cloud.iot.v1.DeviceRegistry()
        );
        client.innerApiCalls.updateDeviceRegistry =
          stubSimpleCall(expectedResponse);
        const [response] = await client.updateDeviceRegistry(request);
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.updateDeviceRegistry as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      it('invokes updateDeviceRegistry without error using callback', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.UpdateDeviceRegistryRequest()
        );
        request.deviceRegistry = {};
        request.deviceRegistry.name = '';
        const expectedOptions = {};
        const expectedResponse = generateSampleMessage(
          new protos.google.cloud.iot.v1.DeviceRegistry()
        );
        client.innerApiCalls.updateDeviceRegistry =
          stubSimpleCallWithCallback(expectedResponse);
        const promise = new Promise((resolve, reject) => {
          client.updateDeviceRegistry(
            request,
            (
              err?: Error | null,
              result?: protos.google.cloud.iot.v1.IDeviceRegistry | null
            ) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
        const response = await promise;
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.updateDeviceRegistry as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions /*, callback defined above */)
        );
      });

      it('invokes updateDeviceRegistry with error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.UpdateDeviceRegistryRequest()
        );
        request.deviceRegistry = {};
        request.deviceRegistry.name = '';
        const expectedOptions = {};
        const expectedError = new Error('expected');
        client.innerApiCalls.updateDeviceRegistry = stubSimpleCall(
          undefined,
          expectedError
        );
        await assert.rejects(
          client.updateDeviceRegistry(request),
          expectedError
        );
        assert(
          (client.innerApiCalls.updateDeviceRegistry as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      // it('invokes updateDeviceRegistry with closed client', async () => {
      //   const client = new devicemanagerModule.v1.DeviceManagerClient({
      //     credentials: {client_email: 'bogus', private_key: 'bogus'},
      //     projectId: 'bogus',
      //   });
      //   client.initialize();
      //   const request = generateSampleMessage(
      //     new protos.google.cloud.iot.v1.UpdateDeviceRegistryRequest()
      //   );
      //   request.deviceRegistry = {};
      //   request.deviceRegistry.name = '';
      //   const expectedError = new Error('The client has already been closed.');
      //   client.close();
      //   await assert.rejects(client.updateDeviceRegistry(request), expectedError);
      // });
    });

    describe('deleteDeviceRegistry', () => {
      it('invokes deleteDeviceRegistry without error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.DeleteDeviceRegistryRequest()
        );
        request.name = '';
        const expectedOptions = {};
        const expectedResponse = generateSampleMessage(
          new protos.google.protobuf.Empty()
        );
        client.innerApiCalls.deleteDeviceRegistry =
          stubSimpleCall(expectedResponse);
        const [response] = await client.deleteDeviceRegistry(request);
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.deleteDeviceRegistry as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      it('invokes deleteDeviceRegistry without error using callback', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.DeleteDeviceRegistryRequest()
        );
        request.name = '';
        const expectedOptions = {};
        const expectedResponse = generateSampleMessage(
          new protos.google.protobuf.Empty()
        );
        client.innerApiCalls.deleteDeviceRegistry =
          stubSimpleCallWithCallback(expectedResponse);
        const promise = new Promise((resolve, reject) => {
          client.deleteDeviceRegistry(
            request,
            (
              err?: Error | null,
              result?: protos.google.protobuf.IEmpty | null
            ) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
        const response = await promise;
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.deleteDeviceRegistry as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions /*, callback defined above */)
        );
      });

      it('invokes deleteDeviceRegistry with error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.DeleteDeviceRegistryRequest()
        );
        request.name = '';
        const expectedOptions = {};
        const expectedError = new Error('expected');
        client.innerApiCalls.deleteDeviceRegistry = stubSimpleCall(
          undefined,
          expectedError
        );
        await assert.rejects(
          client.deleteDeviceRegistry(request),
          expectedError
        );
        assert(
          (client.innerApiCalls.deleteDeviceRegistry as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      // it('invokes deleteDeviceRegistry with closed client', async () => {
      //   const client = new devicemanagerModule.v1.DeviceManagerClient({
      //     credentials: {client_email: 'bogus', private_key: 'bogus'},
      //     projectId: 'bogus',
      //   });
      //   client.initialize();
      //   const request = generateSampleMessage(
      //     new protos.google.cloud.iot.v1.DeleteDeviceRegistryRequest()
      //   );
      //   request.name = '';
      //   const expectedError = new Error('The client has already been closed.');
      //   client.close();
      //   await assert.rejects(client.deleteDeviceRegistry(request), expectedError);
      // });
    });

    describe('createDevice', () => {
      it('invokes createDevice without error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.CreateDeviceRequest()
        );
        request.parent = '';
        const expectedOptions = {};
        const expectedResponse = generateSampleMessage(
          new protos.google.cloud.iot.v1.Device()
        );
        client.innerApiCalls.createDevice = stubSimpleCall(expectedResponse);
        const [response] = await client.createDevice(request);
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.createDevice as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      it('invokes createDevice without error using callback', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.CreateDeviceRequest()
        );
        request.parent = '';
        const expectedOptions = {};
        const expectedResponse = generateSampleMessage(
          new protos.google.cloud.iot.v1.Device()
        );
        client.innerApiCalls.createDevice =
          stubSimpleCallWithCallback(expectedResponse);
        const promise = new Promise((resolve, reject) => {
          client.createDevice(
            request,
            (
              err?: Error | null,
              result?: protos.google.cloud.iot.v1.IDevice | null
            ) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
        const response = await promise;
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.createDevice as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions /*, callback defined above */)
        );
      });

      it('invokes createDevice with error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.CreateDeviceRequest()
        );
        request.parent = '';
        const expectedOptions = {};
        const expectedError = new Error('expected');
        client.innerApiCalls.createDevice = stubSimpleCall(
          undefined,
          expectedError
        );
        await assert.rejects(client.createDevice(request), expectedError);
        assert(
          (client.innerApiCalls.createDevice as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      // it('invokes createDevice with closed client', async () => {
      //   const client = new devicemanagerModule.v1.DeviceManagerClient({
      //     credentials: {
      //       systemKey: 'bogus',
      //       project: 'bogus',
      //       token: 'bogus',
      //       url: 'https://bogus.com',
      //     },
      //   });
      //   client.initialize();
      //   const request = generateSampleMessage(
      //     new protos.google.cloud.iot.v1.CreateDeviceRequest()
      //   );
      //   request.parent = '';
      //   const expectedError = new Error('The client has already been closed.');
      //   client.close();
      //   await assert.rejects(client.createDevice(request), expectedError);
      // });
    });

    describe('getDevice', () => {
      it('invokes getDevice without error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.GetDeviceRequest()
        );
        request.name = '';
        const expectedOptions = {};
        const expectedResponse = generateSampleMessage(
          new protos.google.cloud.iot.v1.Device()
        );
        client.innerApiCalls.getDevice = stubSimpleCall(expectedResponse);
        const [response] = await client.getDevice(request);
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.getDevice as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      it('invokes getDevice without error using callback', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.GetDeviceRequest()
        );
        request.name = '';
        const expectedOptions = {};
        const expectedResponse = generateSampleMessage(
          new protos.google.cloud.iot.v1.Device()
        );
        client.innerApiCalls.getDevice =
          stubSimpleCallWithCallback(expectedResponse);
        const promise = new Promise((resolve, reject) => {
          client.getDevice(
            request,
            (
              err?: Error | null,
              result?: protos.google.cloud.iot.v1.IDevice | null
            ) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
        const response = await promise;
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.getDevice as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions /*, callback defined above */)
        );
      });

      it('invokes getDevice with error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.GetDeviceRequest()
        );
        request.name = '';
        const expectedOptions = {};
        const expectedError = new Error('expected');
        client.innerApiCalls.getDevice = stubSimpleCall(
          undefined,
          expectedError
        );
        await assert.rejects(client.getDevice(request), expectedError);
        assert(
          (client.innerApiCalls.getDevice as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      // it('invokes getDevice with closed client', async () => {
      //   const client = new devicemanagerModule.v1.DeviceManagerClient({
      //     credentials: {client_email: 'bogus', private_key: 'bogus'},
      //     projectId: 'bogus',
      //   });
      //   client.initialize();
      //   const request = generateSampleMessage(
      //     new protos.google.cloud.iot.v1.GetDeviceRequest()
      //   );
      //   request.name = '';
      //   const expectedError = new Error('The client has already been closed.');
      //   client.close();
      //   await assert.rejects(client.getDevice(request), expectedError);
      // });
    });

    describe('updateDevice', () => {
      it('invokes updateDevice without error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.UpdateDeviceRequest()
        );
        request.device = {};
        request.device.name = '';
        const expectedOptions = {};
        const expectedResponse = generateSampleMessage(
          new protos.google.cloud.iot.v1.Device()
        );
        client.innerApiCalls.updateDevice = stubSimpleCall(expectedResponse);
        const [response] = await client.updateDevice(request);
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.updateDevice as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      it('invokes updateDevice without error using callback', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.UpdateDeviceRequest()
        );
        request.device = {};
        request.device.name = '';
        const expectedOptions = {};
        const expectedResponse = generateSampleMessage(
          new protos.google.cloud.iot.v1.Device()
        );
        client.innerApiCalls.updateDevice =
          stubSimpleCallWithCallback(expectedResponse);
        const promise = new Promise((resolve, reject) => {
          client.updateDevice(
            request,
            (
              err?: Error | null,
              result?: protos.google.cloud.iot.v1.IDevice | null
            ) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
        const response = await promise;
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.updateDevice as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions /*, callback defined above */)
        );
      });

      it('invokes updateDevice with error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.UpdateDeviceRequest()
        );
        request.device = {};
        request.device.name = '';
        const expectedOptions = {};
        const expectedError = new Error('expected');
        client.innerApiCalls.updateDevice = stubSimpleCall(
          undefined,
          expectedError
        );
        await assert.rejects(client.updateDevice(request), expectedError);
        assert(
          (client.innerApiCalls.updateDevice as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      // it('invokes updateDevice with closed client', async () => {
      //   const client = new devicemanagerModule.v1.DeviceManagerClient({
      //     credentials: {client_email: 'bogus', private_key: 'bogus'},
      //     projectId: 'bogus',
      //   });
      //   client.initialize();
      //   const request = generateSampleMessage(
      //     new protos.google.cloud.iot.v1.UpdateDeviceRequest()
      //   );
      //   request.device = {};
      //   request.device.name = '';
      //   const expectedError = new Error('The client has already been closed.');
      //   client.close();
      //   await assert.rejects(client.updateDevice(request), expectedError);
      // });
    });

    describe('deleteDevice', () => {
      it('invokes deleteDevice without error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.DeleteDeviceRequest()
        );
        request.name = '';
        const expectedOptions = {};
        const expectedResponse = generateSampleMessage(
          new protos.google.protobuf.Empty()
        );
        client.innerApiCalls.deleteDevice = stubSimpleCall(expectedResponse);
        const [response] = await client.deleteDevice(request);
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.deleteDevice as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      it('invokes deleteDevice without error using callback', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.DeleteDeviceRequest()
        );
        request.name = '';
        const expectedOptions = {};
        const expectedResponse = generateSampleMessage(
          new protos.google.protobuf.Empty()
        );
        client.innerApiCalls.deleteDevice =
          stubSimpleCallWithCallback(expectedResponse);
        const promise = new Promise((resolve, reject) => {
          client.deleteDevice(
            request,
            (
              err?: Error | null,
              result?: protos.google.protobuf.IEmpty | null
            ) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
        const response = await promise;
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.deleteDevice as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions /*, callback defined above */)
        );
      });

      it('invokes deleteDevice with error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.DeleteDeviceRequest()
        );
        request.name = '';
        const expectedOptions = {};
        const expectedError = new Error('expected');
        client.innerApiCalls.deleteDevice = stubSimpleCall(
          undefined,
          expectedError
        );
        await assert.rejects(client.deleteDevice(request), expectedError);
        assert(
          (client.innerApiCalls.deleteDevice as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      // it('invokes deleteDevice with closed client', async () => {
      //   const client = new devicemanagerModule.v1.DeviceManagerClient({
      //     credentials: {client_email: 'bogus', private_key: 'bogus'},
      //     projectId: 'bogus',
      //   });
      //   client.initialize();
      //   const request = generateSampleMessage(
      //     new protos.google.cloud.iot.v1.DeleteDeviceRequest()
      //   );
      //   request.name = '';
      //   const expectedError = new Error('The client has already been closed.');
      //   client.close();
      //   await assert.rejects(client.deleteDevice(request), expectedError);
      // });
    });

    describe('modifyCloudToDeviceConfig', () => {
      it('invokes modifyCloudToDeviceConfig without error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.ModifyCloudToDeviceConfigRequest()
        );
        request.name = '';
        const expectedOptions = {};
        const expectedResponse = generateSampleMessage(
          new protos.google.cloud.iot.v1.DeviceConfig()
        );
        client.innerApiCalls.modifyCloudToDeviceConfig =
          stubSimpleCall(expectedResponse);
        const [response] = await client.modifyCloudToDeviceConfig(request);
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.modifyCloudToDeviceConfig as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      it('invokes modifyCloudToDeviceConfig without error using callback', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.ModifyCloudToDeviceConfigRequest()
        );
        request.name = '';
        const expectedOptions = {};
        const expectedResponse = generateSampleMessage(
          new protos.google.cloud.iot.v1.DeviceConfig()
        );
        client.innerApiCalls.modifyCloudToDeviceConfig =
          stubSimpleCallWithCallback(expectedResponse);
        const promise = new Promise((resolve, reject) => {
          client.modifyCloudToDeviceConfig(
            request,
            (
              err?: Error | null,
              result?: protos.google.cloud.iot.v1.IDeviceConfig | null
            ) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
        const response = await promise;
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.modifyCloudToDeviceConfig as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions /*, callback defined above */)
        );
      });

      it('invokes modifyCloudToDeviceConfig with error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.ModifyCloudToDeviceConfigRequest()
        );
        request.name = '';
        const expectedOptions = {};
        const expectedError = new Error('expected');
        client.innerApiCalls.modifyCloudToDeviceConfig = stubSimpleCall(
          undefined,
          expectedError
        );
        await assert.rejects(
          client.modifyCloudToDeviceConfig(request),
          expectedError
        );
        assert(
          (client.innerApiCalls.modifyCloudToDeviceConfig as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      // it('invokes modifyCloudToDeviceConfig with closed client', async () => {
      //   const client = new devicemanagerModule.v1.DeviceManagerClient({
      //     credentials: {client_email: 'bogus', private_key: 'bogus'},
      //     projectId: 'bogus',
      //   });
      //   client.initialize();
      //   const request = generateSampleMessage(
      //     new protos.google.cloud.iot.v1.ModifyCloudToDeviceConfigRequest()
      //   );
      //   request.name = '';
      //   const expectedError = new Error('The client has already been closed.');
      //   client.close();
      //   await assert.rejects(
      //     client.modifyCloudToDeviceConfig(request),
      //     expectedError
      //   );
      // });
    });

    describe('listDeviceConfigVersions', () => {
      it('invokes listDeviceConfigVersions without error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.ListDeviceConfigVersionsRequest()
        );
        request.name = '';
        const expectedOptions = {};
        const expectedResponse = generateSampleMessage(
          new protos.google.cloud.iot.v1.ListDeviceConfigVersionsResponse()
        );
        client.innerApiCalls.listDeviceConfigVersions =
          stubSimpleCall(expectedResponse);
        const [response] = await client.listDeviceConfigVersions(request);
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.listDeviceConfigVersions as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      it('invokes listDeviceConfigVersions without error using callback', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.ListDeviceConfigVersionsRequest()
        );
        request.name = '';
        const expectedOptions = {};
        const expectedResponse = generateSampleMessage(
          new protos.google.cloud.iot.v1.ListDeviceConfigVersionsResponse()
        );
        client.innerApiCalls.listDeviceConfigVersions =
          stubSimpleCallWithCallback(expectedResponse);
        const promise = new Promise((resolve, reject) => {
          client.listDeviceConfigVersions(
            request,
            (
              err?: Error | null,
              result?: protos.google.cloud.iot.v1.IListDeviceConfigVersionsResponse | null
            ) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
        const response = await promise;
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.listDeviceConfigVersions as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions /*, callback defined above */)
        );
      });

      it('invokes listDeviceConfigVersions with error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.ListDeviceConfigVersionsRequest()
        );
        request.name = '';
        const expectedOptions = {};
        const expectedError = new Error('expected');
        client.innerApiCalls.listDeviceConfigVersions = stubSimpleCall(
          undefined,
          expectedError
        );
        await assert.rejects(
          client.listDeviceConfigVersions(request),
          expectedError
        );
        assert(
          (client.innerApiCalls.listDeviceConfigVersions as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      // it('invokes listDeviceConfigVersions with closed client', async () => {
      //   const client = new devicemanagerModule.v1.DeviceManagerClient({
      //     credentials: {client_email: 'bogus', private_key: 'bogus'},
      //     projectId: 'bogus',
      //   });
      //   client.initialize();
      //   const request = generateSampleMessage(
      //     new protos.google.cloud.iot.v1.ListDeviceConfigVersionsRequest()
      //   );
      //   request.name = '';
      //   const expectedError = new Error('The client has already been closed.');
      //   client.close();
      //   await assert.rejects(
      //     client.listDeviceConfigVersions(request),
      //     expectedError
      //   );
      // });
    });

    describe('listDeviceStates', () => {
      it('invokes listDeviceStates without error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.ListDeviceStatesRequest()
        );
        request.name = '';
        const expectedOptions = {};
        const expectedResponse = generateSampleMessage(
          new protos.google.cloud.iot.v1.ListDeviceStatesResponse()
        );
        client.innerApiCalls.listDeviceStates =
          stubSimpleCall(expectedResponse);
        const [response] = await client.listDeviceStates(request);
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.listDeviceStates as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      it('invokes listDeviceStates without error using callback', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.ListDeviceStatesRequest()
        );
        request.name = '';
        const expectedOptions = {};
        const expectedResponse = generateSampleMessage(
          new protos.google.cloud.iot.v1.ListDeviceStatesResponse()
        );
        client.innerApiCalls.listDeviceStates =
          stubSimpleCallWithCallback(expectedResponse);
        const promise = new Promise((resolve, reject) => {
          client.listDeviceStates(
            request,
            (
              err?: Error | null,
              result?: protos.google.cloud.iot.v1.IListDeviceStatesResponse | null
            ) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
        const response = await promise;
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.listDeviceStates as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions /*, callback defined above */)
        );
      });

      it('invokes listDeviceStates with error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.ListDeviceStatesRequest()
        );
        request.name = '';
        const expectedOptions = {};
        const expectedError = new Error('expected');
        client.innerApiCalls.listDeviceStates = stubSimpleCall(
          undefined,
          expectedError
        );
        await assert.rejects(client.listDeviceStates(request), expectedError);
        assert(
          (client.innerApiCalls.listDeviceStates as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      // it('invokes listDeviceStates with closed client', async () => {
      //   const client = new devicemanagerModule.v1.DeviceManagerClient({
      //     credentials: {client_email: 'bogus', private_key: 'bogus'},
      //     projectId: 'bogus',
      //   });
      //   client.initialize();
      //   const request = generateSampleMessage(
      //     new protos.google.cloud.iot.v1.ListDeviceStatesRequest()
      //   );
      //   request.name = '';
      //   const expectedError = new Error('The client has already been closed.');
      //   client.close();
      //   await assert.rejects(client.listDeviceStates(request), expectedError);
      // });
    });

    // describe('setIamPolicy', () => {
    //   it('invokes setIamPolicy without error', async () => {
    //     const client = new devicemanagerModule.v1.DeviceManagerClient({
    //       credentials: {client_email: 'bogus', private_key: 'bogus'},
    //       projectId: 'bogus',
    //     });
    //     client.initialize();
    //     const request = generateSampleMessage(
    //       new protos.google.iam.v1.SetIamPolicyRequest()
    //     );
    //     request.resource = '';
    //     const expectedHeaderRequestParams = 'resource=';
    //     const expectedOptions = {
    //       otherArgs: {
    //         headers: {
    //           'x-goog-request-params': expectedHeaderRequestParams,
    //         },
    //       },
    //     };
    //     const expectedResponse = generateSampleMessage(
    //       new protos.google.iam.v1.Policy()
    //     );
    //     client.innerApiCalls.setIamPolicy = stubSimpleCall(expectedResponse);
    //     const [response] = await client.setIamPolicy(request);
    //     assert.deepStrictEqual(response, expectedResponse);
    //     assert(
    //       (client.innerApiCalls.setIamPolicy as SinonStub)
    //         .getCall(0)
    //         .calledWith(request, expectedOptions, undefined)
    //     );
    //   });

    //   it('invokes setIamPolicy without error using callback', async () => {
    //     const client = new devicemanagerModule.v1.DeviceManagerClient({
    //       credentials: {client_email: 'bogus', private_key: 'bogus'},
    //       projectId: 'bogus',
    //     });
    //     client.initialize();
    //     const request = generateSampleMessage(
    //       new protos.google.iam.v1.SetIamPolicyRequest()
    //     );
    //     request.resource = '';
    //     const expectedHeaderRequestParams = 'resource=';
    //     const expectedOptions = {
    //       otherArgs: {
    //         headers: {
    //           'x-goog-request-params': expectedHeaderRequestParams,
    //         },
    //       },
    //     };
    //     const expectedResponse = generateSampleMessage(
    //       new protos.google.iam.v1.Policy()
    //     );
    //     client.innerApiCalls.setIamPolicy =
    //       stubSimpleCallWithCallback(expectedResponse);
    //     const promise = new Promise((resolve, reject) => {
    //       client.setIamPolicy(
    //         request,
    //         (
    //           err?: Error | null,
    //           result?: protos.google.iam.v1.IPolicy | null
    //         ) => {
    //           if (err) {
    //             reject(err);
    //           } else {
    //             resolve(result);
    //           }
    //         }
    //       );
    //     });
    //     const response = await promise;
    //     assert.deepStrictEqual(response, expectedResponse);
    //     assert(
    //       (client.innerApiCalls.setIamPolicy as SinonStub)
    //         .getCall(0)
    //         .calledWith(request, expectedOptions /*, callback defined above */)
    //     );
    //   });

    //   it('invokes setIamPolicy with error', async () => {
    //     const client = new devicemanagerModule.v1.DeviceManagerClient({
    //       credentials: {client_email: 'bogus', private_key: 'bogus'},
    //       projectId: 'bogus',
    //     });
    //     client.initialize();
    //     const request = generateSampleMessage(
    //       new protos.google.iam.v1.SetIamPolicyRequest()
    //     );
    //     request.resource = '';
    //     const expectedHeaderRequestParams = 'resource=';
    //     const expectedOptions = {
    //       otherArgs: {
    //         headers: {
    //           'x-goog-request-params': expectedHeaderRequestParams,
    //         },
    //       },
    //     };
    //     const expectedError = new Error('expected');
    //     client.innerApiCalls.setIamPolicy = stubSimpleCall(
    //       undefined,
    //       expectedError
    //     );
    //     await assert.rejects(client.setIamPolicy(request), expectedError);
    //     assert(
    //       (client.innerApiCalls.setIamPolicy as SinonStub)
    //         .getCall(0)
    //         .calledWith(request, expectedOptions, undefined)
    //     );
    //   });

    //   it('invokes setIamPolicy with closed client', async () => {
    //     const client = new devicemanagerModule.v1.DeviceManagerClient({
    //       credentials: {client_email: 'bogus', private_key: 'bogus'},
    //       projectId: 'bogus',
    //     });
    //     client.initialize();
    //     const request = generateSampleMessage(
    //       new protos.google.iam.v1.SetIamPolicyRequest()
    //     );
    //     request.resource = '';
    //     const expectedError = new Error('The client has already been closed.');
    //     client.close();
    //     await assert.rejects(client.setIamPolicy(request), expectedError);
    //   });
    // });

    // describe('getIamPolicy', () => {
    //   it('invokes getIamPolicy without error', async () => {
    //     const client = new devicemanagerModule.v1.DeviceManagerClient({
    //       credentials: {client_email: 'bogus', private_key: 'bogus'},
    //       projectId: 'bogus',
    //     });
    //     client.initialize();
    //     const request = generateSampleMessage(
    //       new protos.google.iam.v1.GetIamPolicyRequest()
    //     );
    //     request.resource = '';
    //     const expectedHeaderRequestParams = 'resource=';
    //     const expectedOptions = {
    //       otherArgs: {
    //         headers: {
    //           'x-goog-request-params': expectedHeaderRequestParams,
    //         },
    //       },
    //     };
    //     const expectedResponse = generateSampleMessage(
    //       new protos.google.iam.v1.Policy()
    //     );
    //     client.innerApiCalls.getIamPolicy = stubSimpleCall(expectedResponse);
    //     const [response] = await client.getIamPolicy(request);
    //     assert.deepStrictEqual(response, expectedResponse);
    //     assert(
    //       (client.innerApiCalls.getIamPolicy as SinonStub)
    //         .getCall(0)
    //         .calledWith(request, expectedOptions, undefined)
    //     );
    //   });

    //   it('invokes getIamPolicy without error using callback', async () => {
    //     const client = new devicemanagerModule.v1.DeviceManagerClient({
    //       credentials: {client_email: 'bogus', private_key: 'bogus'},
    //       projectId: 'bogus',
    //     });
    //     client.initialize();
    //     const request = generateSampleMessage(
    //       new protos.google.iam.v1.GetIamPolicyRequest()
    //     );
    //     request.resource = '';
    //     const expectedHeaderRequestParams = 'resource=';
    //     const expectedOptions = {
    //       otherArgs: {
    //         headers: {
    //           'x-goog-request-params': expectedHeaderRequestParams,
    //         },
    //       },
    //     };
    //     const expectedResponse = generateSampleMessage(
    //       new protos.google.iam.v1.Policy()
    //     );
    //     client.innerApiCalls.getIamPolicy =
    //       stubSimpleCallWithCallback(expectedResponse);
    //     const promise = new Promise((resolve, reject) => {
    //       client.getIamPolicy(
    //         request,
    //         (
    //           err?: Error | null,
    //           result?: protos.google.iam.v1.IPolicy | null
    //         ) => {
    //           if (err) {
    //             reject(err);
    //           } else {
    //             resolve(result);
    //           }
    //         }
    //       );
    //     });
    //     const response = await promise;
    //     assert.deepStrictEqual(response, expectedResponse);
    //     assert(
    //       (client.innerApiCalls.getIamPolicy as SinonStub)
    //         .getCall(0)
    //         .calledWith(request, expectedOptions /*, callback defined above */)
    //     );
    //   });

    //   it('invokes getIamPolicy with error', async () => {
    //     const client = new devicemanagerModule.v1.DeviceManagerClient({
    //       credentials: {client_email: 'bogus', private_key: 'bogus'},
    //       projectId: 'bogus',
    //     });
    //     client.initialize();
    //     const request = generateSampleMessage(
    //       new protos.google.iam.v1.GetIamPolicyRequest()
    //     );
    //     request.resource = '';
    //     const expectedHeaderRequestParams = 'resource=';
    //     const expectedOptions = {
    //       otherArgs: {
    //         headers: {
    //           'x-goog-request-params': expectedHeaderRequestParams,
    //         },
    //       },
    //     };
    //     const expectedError = new Error('expected');
    //     client.innerApiCalls.getIamPolicy = stubSimpleCall(
    //       undefined,
    //       expectedError
    //     );
    //     await assert.rejects(client.getIamPolicy(request), expectedError);
    //     assert(
    //       (client.innerApiCalls.getIamPolicy as SinonStub)
    //         .getCall(0)
    //         .calledWith(request, expectedOptions, undefined)
    //     );
    //   });

    //   it('invokes getIamPolicy with closed client', async () => {
    //     const client = new devicemanagerModule.v1.DeviceManagerClient({
    //       credentials: {client_email: 'bogus', private_key: 'bogus'},
    //       projectId: 'bogus',
    //     });
    //     client.initialize();
    //     const request = generateSampleMessage(
    //       new protos.google.iam.v1.GetIamPolicyRequest()
    //     );
    //     request.resource = '';
    //     const expectedError = new Error('The client has already been closed.');
    //     client.close();
    //     await assert.rejects(client.getIamPolicy(request), expectedError);
    //   });
    // });

    // describe('testIamPermissions', () => {
    //   it('invokes testIamPermissions without error', async () => {
    //     const client = new devicemanagerModule.v1.DeviceManagerClient({
    //       credentials: {client_email: 'bogus', private_key: 'bogus'},
    //       projectId: 'bogus',
    //     });
    //     client.initialize();
    //     const request = generateSampleMessage(
    //       new protos.google.iam.v1.TestIamPermissionsRequest()
    //     );
    //     request.resource = '';
    //     const expectedHeaderRequestParams = 'resource=';
    //     const expectedOptions = {
    //       otherArgs: {
    //         headers: {
    //           'x-goog-request-params': expectedHeaderRequestParams,
    //         },
    //       },
    //     };
    //     const expectedResponse = generateSampleMessage(
    //       new protos.google.iam.v1.TestIamPermissionsResponse()
    //     );
    //     client.innerApiCalls.testIamPermissions =
    //       stubSimpleCall(expectedResponse);
    //     const [response] = await client.testIamPermissions(request);
    //     assert.deepStrictEqual(response, expectedResponse);
    //     assert(
    //       (client.innerApiCalls.testIamPermissions as SinonStub)
    //         .getCall(0)
    //         .calledWith(request, expectedOptions, undefined)
    //     );
    //   });

    //   it('invokes testIamPermissions without error using callback', async () => {
    //     const client = new devicemanagerModule.v1.DeviceManagerClient({
    //       credentials: {client_email: 'bogus', private_key: 'bogus'},
    //       projectId: 'bogus',
    //     });
    //     client.initialize();
    //     const request = generateSampleMessage(
    //       new protos.google.iam.v1.TestIamPermissionsRequest()
    //     );
    //     request.resource = '';
    //     const expectedHeaderRequestParams = 'resource=';
    //     const expectedOptions = {
    //       otherArgs: {
    //         headers: {
    //           'x-goog-request-params': expectedHeaderRequestParams,
    //         },
    //       },
    //     };
    //     const expectedResponse = generateSampleMessage(
    //       new protos.google.iam.v1.TestIamPermissionsResponse()
    //     );
    //     client.innerApiCalls.testIamPermissions =
    //       stubSimpleCallWithCallback(expectedResponse);
    //     const promise = new Promise((resolve, reject) => {
    //       client.testIamPermissions(
    //         request,
    //         (
    //           err?: Error | null,
    //           result?: protos.google.iam.v1.ITestIamPermissionsResponse | null
    //         ) => {
    //           if (err) {
    //             reject(err);
    //           } else {
    //             resolve(result);
    //           }
    //         }
    //       );
    //     });
    //     const response = await promise;
    //     assert.deepStrictEqual(response, expectedResponse);
    //     assert(
    //       (client.innerApiCalls.testIamPermissions as SinonStub)
    //         .getCall(0)
    //         .calledWith(request, expectedOptions /*, callback defined above */)
    //     );
    //   });

    //   it('invokes testIamPermissions with error', async () => {
    //     const client = new devicemanagerModule.v1.DeviceManagerClient({
    //       credentials: {client_email: 'bogus', private_key: 'bogus'},
    //       projectId: 'bogus',
    //     });
    //     client.initialize();
    //     const request = generateSampleMessage(
    //       new protos.google.iam.v1.TestIamPermissionsRequest()
    //     );
    //     request.resource = '';
    //     const expectedHeaderRequestParams = 'resource=';
    //     const expectedOptions = {
    //       otherArgs: {
    //         headers: {
    //           'x-goog-request-params': expectedHeaderRequestParams,
    //         },
    //       },
    //     };
    //     const expectedError = new Error('expected');
    //     client.innerApiCalls.testIamPermissions = stubSimpleCall(
    //       undefined,
    //       expectedError
    //     );
    //     await assert.rejects(client.testIamPermissions(request), expectedError);
    //     assert(
    //       (client.innerApiCalls.testIamPermissions as SinonStub)
    //         .getCall(0)
    //         .calledWith(request, expectedOptions, undefined)
    //     );
    //   });

    //   it('invokes testIamPermissions with closed client', async () => {
    //     const client = new devicemanagerModule.v1.DeviceManagerClient({
    //       credentials: {client_email: 'bogus', private_key: 'bogus'},
    //       projectId: 'bogus',
    //     });
    //     client.initialize();
    //     const request = generateSampleMessage(
    //       new protos.google.iam.v1.TestIamPermissionsRequest()
    //     );
    //     request.resource = '';
    //     const expectedError = new Error('The client has already been closed.');
    //     client.close();
    //     await assert.rejects(client.testIamPermissions(request), expectedError);
    //   });
    // });

    describe('sendCommandToDevice', () => {
      it('invokes sendCommandToDevice without error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.SendCommandToDeviceRequest()
        );
        request.name = '';
        const expectedOptions = {};
        const expectedResponse = generateSampleMessage(
          new protos.google.cloud.iot.v1.SendCommandToDeviceResponse()
        );
        client.innerApiCalls.sendCommandToDevice =
          stubSimpleCall(expectedResponse);
        const [response] = await client.sendCommandToDevice(request);
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.sendCommandToDevice as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      it('invokes sendCommandToDevice without error using callback', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.SendCommandToDeviceRequest()
        );
        request.name = '';
        const expectedOptions = {};
        const expectedResponse = generateSampleMessage(
          new protos.google.cloud.iot.v1.SendCommandToDeviceResponse()
        );
        client.innerApiCalls.sendCommandToDevice =
          stubSimpleCallWithCallback(expectedResponse);
        const promise = new Promise((resolve, reject) => {
          client.sendCommandToDevice(
            request,
            (
              err?: Error | null,
              result?: protos.google.cloud.iot.v1.ISendCommandToDeviceResponse | null
            ) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
        const response = await promise;
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.sendCommandToDevice as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions /*, callback defined above */)
        );
      });

      it('invokes sendCommandToDevice with error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.SendCommandToDeviceRequest()
        );
        request.name = '';
        const expectedOptions = {};
        const expectedError = new Error('expected');
        client.innerApiCalls.sendCommandToDevice = stubSimpleCall(
          undefined,
          expectedError
        );
        await assert.rejects(
          client.sendCommandToDevice(request),
          expectedError
        );
        assert(
          (client.innerApiCalls.sendCommandToDevice as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      // it('invokes sendCommandToDevice with closed client', async () => {
      //   const client = new devicemanagerModule.v1.DeviceManagerClient({
      //     credentials: {client_email: 'bogus', private_key: 'bogus'},
      //     projectId: 'bogus',
      //   });
      //   client.initialize();
      //   const request = generateSampleMessage(
      //     new protos.google.cloud.iot.v1.SendCommandToDeviceRequest()
      //   );
      //   request.name = '';
      //   const expectedError = new Error('The client has already been closed.');
      //   client.close();
      //   await assert.rejects(client.sendCommandToDevice(request), expectedError);
      // });
    });

    describe('bindDeviceToGateway', () => {
      it('invokes bindDeviceToGateway without error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.BindDeviceToGatewayRequest()
        );
        request.parent = '';
        const expectedOptions = {};
        const expectedResponse = generateSampleMessage(
          new protos.google.cloud.iot.v1.BindDeviceToGatewayResponse()
        );
        client.innerApiCalls.bindDeviceToGateway =
          stubSimpleCall(expectedResponse);
        const [response] = await client.bindDeviceToGateway(request);
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.bindDeviceToGateway as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      it('invokes bindDeviceToGateway without error using callback', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.BindDeviceToGatewayRequest()
        );
        request.parent = '';
        const expectedOptions = {};
        const expectedResponse = generateSampleMessage(
          new protos.google.cloud.iot.v1.BindDeviceToGatewayResponse()
        );
        client.innerApiCalls.bindDeviceToGateway =
          stubSimpleCallWithCallback(expectedResponse);
        const promise = new Promise((resolve, reject) => {
          client.bindDeviceToGateway(
            request,
            (
              err?: Error | null,
              result?: protos.google.cloud.iot.v1.IBindDeviceToGatewayResponse | null
            ) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
        const response = await promise;
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.bindDeviceToGateway as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions /*, callback defined above */)
        );
      });

      it('invokes bindDeviceToGateway with error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.BindDeviceToGatewayRequest()
        );
        request.parent = '';
        const expectedOptions = {};
        const expectedError = new Error('expected');
        client.innerApiCalls.bindDeviceToGateway = stubSimpleCall(
          undefined,
          expectedError
        );
        await assert.rejects(
          client.bindDeviceToGateway(request),
          expectedError
        );
        assert(
          (client.innerApiCalls.bindDeviceToGateway as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      // it('invokes bindDeviceToGateway with closed client', async () => {
      //   const client = new devicemanagerModule.v1.DeviceManagerClient({
      //     credentials: {client_email: 'bogus', private_key: 'bogus'},
      //     projectId: 'bogus',
      //   });
      //   client.initialize();
      //   const request = generateSampleMessage(
      //     new protos.google.cloud.iot.v1.BindDeviceToGatewayRequest()
      //   );
      //   request.parent = '';
      //   const expectedError = new Error('The client has already been closed.');
      //   client.close();
      //   await assert.rejects(client.bindDeviceToGateway(request), expectedError);
      // });
    });

    describe('unbindDeviceFromGateway', () => {
      it('invokes unbindDeviceFromGateway without error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.UnbindDeviceFromGatewayRequest()
        );
        request.parent = '';
        const expectedOptions = {};
        const expectedResponse = generateSampleMessage(
          new protos.google.cloud.iot.v1.UnbindDeviceFromGatewayResponse()
        );
        client.innerApiCalls.unbindDeviceFromGateway =
          stubSimpleCall(expectedResponse);
        const [response] = await client.unbindDeviceFromGateway(request);
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.unbindDeviceFromGateway as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      it('invokes unbindDeviceFromGateway without error using callback', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.UnbindDeviceFromGatewayRequest()
        );
        request.parent = '';
        const expectedOptions = {};
        const expectedResponse = generateSampleMessage(
          new protos.google.cloud.iot.v1.UnbindDeviceFromGatewayResponse()
        );
        client.innerApiCalls.unbindDeviceFromGateway =
          stubSimpleCallWithCallback(expectedResponse);
        const promise = new Promise((resolve, reject) => {
          client.unbindDeviceFromGateway(
            request,
            (
              err?: Error | null,
              result?: protos.google.cloud.iot.v1.IUnbindDeviceFromGatewayResponse | null
            ) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
        const response = await promise;
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.unbindDeviceFromGateway as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions /*, callback defined above */)
        );
      });

      it('invokes unbindDeviceFromGateway with error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.UnbindDeviceFromGatewayRequest()
        );
        request.parent = '';
        const expectedOptions = {};
        const expectedError = new Error('expected');
        client.innerApiCalls.unbindDeviceFromGateway = stubSimpleCall(
          undefined,
          expectedError
        );
        await assert.rejects(
          client.unbindDeviceFromGateway(request),
          expectedError
        );
        assert(
          (client.innerApiCalls.unbindDeviceFromGateway as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      // it('invokes unbindDeviceFromGateway with closed client', async () => {
      //   const client = new devicemanagerModule.v1.DeviceManagerClient({
      //     credentials: {client_email: 'bogus', private_key: 'bogus'},
      //     projectId: 'bogus',
      //   });
      //   client.initialize();
      //   const request = generateSampleMessage(
      //     new protos.google.cloud.iot.v1.UnbindDeviceFromGatewayRequest()
      //   );
      //   request.parent = '';
      //   const expectedError = new Error('The client has already been closed.');
      //   client.close();
      //   await assert.rejects(
      //     client.unbindDeviceFromGateway(request),
      //     expectedError
      //   );
      // });
    });

    describe('listDeviceRegistries', () => {
      it('invokes listDeviceRegistries without error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.ListDeviceRegistriesRequest()
        );
        request.parent = '';

        const expectedOptions = {};
        const expectedResponse = [
          generateSampleMessage(
            new protos.google.cloud.iot.v1.DeviceRegistry()
          ),
          generateSampleMessage(
            new protos.google.cloud.iot.v1.DeviceRegistry()
          ),
          generateSampleMessage(
            new protos.google.cloud.iot.v1.DeviceRegistry()
          ),
        ];
        client.innerApiCalls.listDeviceRegistries =
          stubSimpleCall(expectedResponse);
        const [response] = await client.listDeviceRegistries(request);
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.listDeviceRegistries as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      it('invokes listDeviceRegistries without error using callback', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.ListDeviceRegistriesRequest()
        );
        request.parent = '';

        const expectedOptions = {};
        const expectedResponse = [
          generateSampleMessage(
            new protos.google.cloud.iot.v1.DeviceRegistry()
          ),
          generateSampleMessage(
            new protos.google.cloud.iot.v1.DeviceRegistry()
          ),
          generateSampleMessage(
            new protos.google.cloud.iot.v1.DeviceRegistry()
          ),
        ];
        client.innerApiCalls.listDeviceRegistries =
          stubSimpleCallWithCallback(expectedResponse);
        const promise = new Promise((resolve, reject) => {
          client.listDeviceRegistries(
            request,
            (
              err?: Error | null,
              result?: protos.google.cloud.iot.v1.IDeviceRegistry[] | null
            ) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
        const response = await promise;
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.listDeviceRegistries as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions /*, callback defined above */)
        );
      });

      it('invokes listDeviceRegistries with error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.ListDeviceRegistriesRequest()
        );
        request.parent = '';

        const expectedOptions = {};
        const expectedError = new Error('expected');
        client.innerApiCalls.listDeviceRegistries = stubSimpleCall(
          undefined,
          expectedError
        );
        await assert.rejects(
          client.listDeviceRegistries(request),
          expectedError
        );
        assert(
          (client.innerApiCalls.listDeviceRegistries as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      //   it('invokes listDeviceRegistriesStream without error', async () => {
      //     const client = new devicemanagerModule.v1.DeviceManagerClient({
      //       credentials: {client_email: 'bogus', private_key: 'bogus'},
      //       projectId: 'bogus',
      //     });
      //     client.initialize();
      //     const request = generateSampleMessage(
      //       new protos.google.cloud.iot.v1.ListDeviceRegistriesRequest()
      //     );
      //     request.parent = '';
      //     const expectedHeaderRequestParams = 'parent=';
      //     const expectedResponse = [
      //       generateSampleMessage(new protos.google.cloud.iot.v1.DeviceRegistry()),
      //       generateSampleMessage(new protos.google.cloud.iot.v1.DeviceRegistry()),
      //       generateSampleMessage(new protos.google.cloud.iot.v1.DeviceRegistry()),
      //     ];
      //     client.descriptors.page.listDeviceRegistries.createStream =
      //       stubPageStreamingCall(expectedResponse);
      //     const stream = client.listDeviceRegistriesStream(request);
      //     const promise = new Promise((resolve, reject) => {
      //       const responses: protos.google.cloud.iot.v1.DeviceRegistry[] = [];
      //       stream.on(
      //         'data',
      //         (response: protos.google.cloud.iot.v1.DeviceRegistry) => {
      //           responses.push(response);
      //         }
      //       );
      //       stream.on('end', () => {
      //         resolve(responses);
      //       });
      //       stream.on('error', (err: Error) => {
      //         reject(err);
      //       });
      //     });
      //     const responses = await promise;
      //     assert.deepStrictEqual(responses, expectedResponse);
      //     assert(
      //       (client.descriptors.page.listDeviceRegistries.createStream as SinonStub)
      //         .getCall(0)
      //         .calledWith(client.innerApiCalls.listDeviceRegistries, request)
      //     );
      //     assert.strictEqual(
      //       (
      //         client.descriptors.page.listDeviceRegistries.createStream as SinonStub
      //       ).getCall(0).args[2].otherArgs.headers['x-goog-request-params'],
      //       expectedHeaderRequestParams
      //     );
      //   });

      //   it('invokes listDeviceRegistriesStream with error', async () => {
      //     const client = new devicemanagerModule.v1.DeviceManagerClient({
      //       credentials: {client_email: 'bogus', private_key: 'bogus'},
      //       projectId: 'bogus',
      //     });
      //     client.initialize();
      //     const request = generateSampleMessage(
      //       new protos.google.cloud.iot.v1.ListDeviceRegistriesRequest()
      //     );
      //     request.parent = '';
      //     const expectedHeaderRequestParams = 'parent=';
      //     const expectedError = new Error('expected');
      //     client.descriptors.page.listDeviceRegistries.createStream =
      //       stubPageStreamingCall(undefined, expectedError);
      //     const stream = client.listDeviceRegistriesStream(request);
      //     const promise = new Promise((resolve, reject) => {
      //       const responses: protos.google.cloud.iot.v1.DeviceRegistry[] = [];
      //       stream.on(
      //         'data',
      //         (response: protos.google.cloud.iot.v1.DeviceRegistry) => {
      //           responses.push(response);
      //         }
      //       );
      //       stream.on('end', () => {
      //         resolve(responses);
      //       });
      //       stream.on('error', (err: Error) => {
      //         reject(err);
      //       });
      //     });
      //     await assert.rejects(promise, expectedError);
      //     assert(
      //       (client.descriptors.page.listDeviceRegistries.createStream as SinonStub)
      //         .getCall(0)
      //         .calledWith(client.innerApiCalls.listDeviceRegistries, request)
      //     );
      //     assert.strictEqual(
      //       (
      //         client.descriptors.page.listDeviceRegistries.createStream as SinonStub
      //       ).getCall(0).args[2].otherArgs.headers['x-goog-request-params'],
      //       expectedHeaderRequestParams
      //     );
      //   });

      //   it('uses async iteration with listDeviceRegistries without error', async () => {
      //     const client = new devicemanagerModule.v1.DeviceManagerClient({
      //       credentials: {client_email: 'bogus', private_key: 'bogus'},
      //       projectId: 'bogus',
      //     });
      //     client.initialize();
      //     const request = generateSampleMessage(
      //       new protos.google.cloud.iot.v1.ListDeviceRegistriesRequest()
      //     );
      //     request.parent = '';
      //     const expectedHeaderRequestParams = 'parent=';
      //     const expectedResponse = [
      //       generateSampleMessage(new protos.google.cloud.iot.v1.DeviceRegistry()),
      //       generateSampleMessage(new protos.google.cloud.iot.v1.DeviceRegistry()),
      //       generateSampleMessage(new protos.google.cloud.iot.v1.DeviceRegistry()),
      //     ];
      //     client.descriptors.page.listDeviceRegistries.asyncIterate =
      //       stubAsyncIterationCall(expectedResponse);
      //     const responses: protos.google.cloud.iot.v1.IDeviceRegistry[] = [];
      //     const iterable = client.listDeviceRegistriesAsync(request);
      //     for await (const resource of iterable) {
      //       responses.push(resource!);
      //     }
      //     assert.deepStrictEqual(responses, expectedResponse);
      //     assert.deepStrictEqual(
      //       (
      //         client.descriptors.page.listDeviceRegistries.asyncIterate as SinonStub
      //       ).getCall(0).args[1],
      //       request
      //     );
      //     assert.strictEqual(
      //       (
      //         client.descriptors.page.listDeviceRegistries.asyncIterate as SinonStub
      //       ).getCall(0).args[2].otherArgs.headers['x-goog-request-params'],
      //       expectedHeaderRequestParams
      //     );
      //   });

      //   it('uses async iteration with listDeviceRegistries with error', async () => {
      //     const client = new devicemanagerModule.v1.DeviceManagerClient({
      //       credentials: {client_email: 'bogus', private_key: 'bogus'},
      //       projectId: 'bogus',
      //     });
      //     client.initialize();
      //     const request = generateSampleMessage(
      //       new protos.google.cloud.iot.v1.ListDeviceRegistriesRequest()
      //     );
      //     request.parent = '';
      //     const expectedHeaderRequestParams = 'parent=';
      //     const expectedError = new Error('expected');
      //     client.descriptors.page.listDeviceRegistries.asyncIterate =
      //       stubAsyncIterationCall(undefined, expectedError);
      //     const iterable = client.listDeviceRegistriesAsync(request);
      //     await assert.rejects(async () => {
      //       const responses: protos.google.cloud.iot.v1.IDeviceRegistry[] = [];
      //       for await (const resource of iterable) {
      //         responses.push(resource!);
      //       }
      //     });
      //     assert.deepStrictEqual(
      //       (
      //         client.descriptors.page.listDeviceRegistries.asyncIterate as SinonStub
      //       ).getCall(0).args[1],
      //       request
      //     );
      //     assert.strictEqual(
      //       (
      //         client.descriptors.page.listDeviceRegistries.asyncIterate as SinonStub
      //       ).getCall(0).args[2].otherArgs.headers['x-goog-request-params'],
      //       expectedHeaderRequestParams
      //     );
      //   });
    });

    describe('listDevices', () => {
      it('invokes listDevices without error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.ListDevicesRequest()
        );
        request.parent = '';
        const expectedOptions = {};
        const expectedResponse = [
          generateSampleMessage(new protos.google.cloud.iot.v1.Device()),
          generateSampleMessage(new protos.google.cloud.iot.v1.Device()),
          generateSampleMessage(new protos.google.cloud.iot.v1.Device()),
        ];
        client.innerApiCalls.listDevices = stubSimpleCall(expectedResponse);
        const [response] = await client.listDevices(request);
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.listDevices as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      it('invokes listDevices without error using callback', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.ListDevicesRequest()
        );
        request.parent = '';
        const expectedOptions = {};
        const expectedResponse = [
          generateSampleMessage(new protos.google.cloud.iot.v1.Device()),
          generateSampleMessage(new protos.google.cloud.iot.v1.Device()),
          generateSampleMessage(new protos.google.cloud.iot.v1.Device()),
        ];
        client.innerApiCalls.listDevices =
          stubSimpleCallWithCallback(expectedResponse);
        const promise = new Promise((resolve, reject) => {
          client.listDevices(
            request,
            (
              err?: Error | null,
              result?: protos.google.cloud.iot.v1.IDevice[] | null
            ) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
        const response = await promise;
        assert.deepStrictEqual(response, expectedResponse);
        assert(
          (client.innerApiCalls.listDevices as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions /*, callback defined above */)
        );
      });

      it('invokes listDevices with error', async () => {
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();
        const request = generateSampleMessage(
          new protos.google.cloud.iot.v1.ListDevicesRequest()
        );
        request.parent = '';
        const expectedOptions = {};
        const expectedError = new Error('expected');
        client.innerApiCalls.listDevices = stubSimpleCall(
          undefined,
          expectedError
        );
        await assert.rejects(client.listDevices(request), expectedError);
        assert(
          (client.innerApiCalls.listDevices as SinonStub)
            .getCall(0)
            .calledWith(request, expectedOptions, undefined)
        );
      });

      // it('invokes listDevicesStream without error', async () => {
      //   const client = new devicemanagerModule.v1.DeviceManagerClient({
      //     credentials: {client_email: 'bogus', private_key: 'bogus'},
      //     projectId: 'bogus',
      //   });
      //   client.initialize();
      //   const request = generateSampleMessage(
      //     new protos.google.cloud.iot.v1.ListDevicesRequest()
      //   );
      //   request.parent = '';
      //   const expectedHeaderRequestParams = 'parent=';
      //   const expectedResponse = [
      //     generateSampleMessage(new protos.google.cloud.iot.v1.Device()),
      //     generateSampleMessage(new protos.google.cloud.iot.v1.Device()),
      //     generateSampleMessage(new protos.google.cloud.iot.v1.Device()),
      //   ];
      //   client.descriptors.page.listDevices.createStream =
      //     stubPageStreamingCall(expectedResponse);
      //   const stream = client.listDevicesStream(request);
      //   const promise = new Promise((resolve, reject) => {
      //     const responses: protos.google.cloud.iot.v1.Device[] = [];
      //     stream.on('data', (response: protos.google.cloud.iot.v1.Device) => {
      //       responses.push(response);
      //     });
      //     stream.on('end', () => {
      //       resolve(responses);
      //     });
      //     stream.on('error', (err: Error) => {
      //       reject(err);
      //     });
      //   });
      //   const responses = await promise;
      //   assert.deepStrictEqual(responses, expectedResponse);
      //   assert(
      //     (client.descriptors.page.listDevices.createStream as SinonStub)
      //       .getCall(0)
      //       .calledWith(client.innerApiCalls.listDevices, request)
      //   );
      //   assert.strictEqual(
      //     (client.descriptors.page.listDevices.createStream as SinonStub).getCall(
      //       0
      //     ).args[2].otherArgs.headers['x-goog-request-params'],
      //     expectedHeaderRequestParams
      //   );
      // });

      // it('invokes listDevicesStream with error', async () => {
      //   const client = new devicemanagerModule.v1.DeviceManagerClient({
      //     credentials: {client_email: 'bogus', private_key: 'bogus'},
      //     projectId: 'bogus',
      //   });
      //   client.initialize();
      //   const request = generateSampleMessage(
      //     new protos.google.cloud.iot.v1.ListDevicesRequest()
      //   );
      //   request.parent = '';
      //   const expectedHeaderRequestParams = 'parent=';
      //   const expectedError = new Error('expected');
      //   client.descriptors.page.listDevices.createStream = stubPageStreamingCall(
      //     undefined,
      //     expectedError
      //   );
      //   const stream = client.listDevicesStream(request);
      //   const promise = new Promise((resolve, reject) => {
      //     const responses: protos.google.cloud.iot.v1.Device[] = [];
      //     stream.on('data', (response: protos.google.cloud.iot.v1.Device) => {
      //       responses.push(response);
      //     });
      //     stream.on('end', () => {
      //       resolve(responses);
      //     });
      //     stream.on('error', (err: Error) => {
      //       reject(err);
      //     });
      //   });
      //   await assert.rejects(promise, expectedError);
      //   assert(
      //     (client.descriptors.page.listDevices.createStream as SinonStub)
      //       .getCall(0)
      //       .calledWith(client.innerApiCalls.listDevices, request)
      //   );
      //   assert.strictEqual(
      //     (client.descriptors.page.listDevices.createStream as SinonStub).getCall(
      //       0
      //     ).args[2].otherArgs.headers['x-goog-request-params'],
      //     expectedHeaderRequestParams
      //   );
      // });

      // it('uses async iteration with listDevices without error', async () => {
      //   const client = new devicemanagerModule.v1.DeviceManagerClient({
      //     credentials: {client_email: 'bogus', private_key: 'bogus'},
      //     projectId: 'bogus',
      //   });
      //   client.initialize();
      //   const request = generateSampleMessage(
      //     new protos.google.cloud.iot.v1.ListDevicesRequest()
      //   );
      //   request.parent = '';
      //   const expectedHeaderRequestParams = 'parent=';
      //   const expectedResponse = [
      //     generateSampleMessage(new protos.google.cloud.iot.v1.Device()),
      //     generateSampleMessage(new protos.google.cloud.iot.v1.Device()),
      //     generateSampleMessage(new protos.google.cloud.iot.v1.Device()),
      //   ];
      //   client.descriptors.page.listDevices.asyncIterate =
      //     stubAsyncIterationCall(expectedResponse);
      //   const responses: protos.google.cloud.iot.v1.IDevice[] = [];
      //   const iterable = client.listDevicesAsync(request);
      //   for await (const resource of iterable) {
      //     responses.push(resource!);
      //   }
      //   assert.deepStrictEqual(responses, expectedResponse);
      //   assert.deepStrictEqual(
      //     (client.descriptors.page.listDevices.asyncIterate as SinonStub).getCall(
      //       0
      //     ).args[1],
      //     request
      //   );
      //   assert.strictEqual(
      //     (client.descriptors.page.listDevices.asyncIterate as SinonStub).getCall(
      //       0
      //     ).args[2].otherArgs.headers['x-goog-request-params'],
      //     expectedHeaderRequestParams
      //   );
      // });

      // it('uses async iteration with listDevices with error', async () => {
      //   const client = new devicemanagerModule.v1.DeviceManagerClient({
      //     credentials: {client_email: 'bogus', private_key: 'bogus'},
      //     projectId: 'bogus',
      //   });
      //   client.initialize();
      //   const request = generateSampleMessage(
      //     new protos.google.cloud.iot.v1.ListDevicesRequest()
      //   );
      //   request.parent = '';
      //   const expectedHeaderRequestParams = 'parent=';
      //   const expectedError = new Error('expected');
      //   client.descriptors.page.listDevices.asyncIterate = stubAsyncIterationCall(
      //     undefined,
      //     expectedError
      //   );
      //   const iterable = client.listDevicesAsync(request);
      //   await assert.rejects(async () => {
      //     const responses: protos.google.cloud.iot.v1.IDevice[] = [];
      //     for await (const resource of iterable) {
      //       responses.push(resource!);
      //     }
      //   });
      //   assert.deepStrictEqual(
      //     (client.descriptors.page.listDevices.asyncIterate as SinonStub).getCall(
      //       0
      //     ).args[1],
      //     request
      //   );
      //   assert.strictEqual(
      //     (client.descriptors.page.listDevices.asyncIterate as SinonStub).getCall(
      //       0
      //     ).args[2].otherArgs.headers['x-goog-request-params'],
      //     expectedHeaderRequestParams
      //   );
      // });
    });

    describe('Path templates', () => {
      describe('device', () => {
        const expectedParameters = {
          project: 'projectValue',
          location: 'locationValue',
          registry: 'registryValue',
          device: 'deviceValue',
        };
        const fakePath = `projects/${expectedParameters.project}/locations/${expectedParameters.location}/registries/${expectedParameters.registry}/devices/${expectedParameters.device}`;
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();

        it('devicePath', () => {
          const result = client.devicePath(
            'projectValue',
            'locationValue',
            'registryValue',
            'deviceValue'
          );
          assert.strictEqual(
            result,
            'projects/projectValue/locations/locationValue/registries/registryValue/devices/deviceValue'
          );
        });

        it('matchProjectFromDeviceName', () => {
          const result = client.matchProjectFromDeviceName(fakePath);
          assert.strictEqual(result, expectedParameters.project);
        });

        it('matchLocationFromDeviceName', () => {
          const result = client.matchLocationFromDeviceName(fakePath);
          assert.strictEqual(result, expectedParameters.location);
        });

        it('matchRegistryFromDeviceName', () => {
          const result = client.matchRegistryFromDeviceName(fakePath);
          assert.strictEqual(result, expectedParameters.registry);
        });

        it('matchDeviceFromDeviceName', () => {
          const result = client.matchDeviceFromDeviceName(fakePath);
          assert.strictEqual(result, expectedParameters.device);
        });
      });

      describe('location', () => {
        const expectedParameters = {
          project: 'projectValue',
          location: 'locationValue',
        };
        const fakePath = `projects/${expectedParameters.project}/locations/${expectedParameters.location}`;
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();

        it('locationPath', () => {
          const result = client.locationPath(
            expectedParameters.project,
            expectedParameters.location
          );
          assert.strictEqual(result, fakePath);
        });

        it('matchProjectFromLocationName', () => {
          const result = client.matchProjectFromLocationName(fakePath);
          assert.strictEqual(result, expectedParameters.project);
        });

        it('matchLocationFromLocationName', () => {
          const result = client.matchLocationFromLocationName(fakePath);
          assert.strictEqual(result, expectedParameters.location);
        });
      });

      describe('registry', () => {
        const expectedParameters = {
          project: 'projectValue',
          location: 'locationValue',
          registry: 'registryValue',
        };
        const fakePath = `projects/${expectedParameters.project}/locations/${expectedParameters.location}/registries/${expectedParameters.registry}`;
        const client = new devicemanagerModule.v1.DeviceManagerClient({
          credentials: {
            systemKey: 'bogus',
            project: 'bogus',
            token: 'bogus',
            url: 'https://bogus.com',
          },
        });
        client.initialize();

        it('registryPath', () => {
          const result = client.registryPath(
            expectedParameters.project,
            expectedParameters.location,
            expectedParameters.registry
          );
          assert.strictEqual(result, fakePath);
        });

        it('matchProjectFromRegistryName', () => {
          const result = client.matchProjectFromRegistryName(fakePath);
          assert.strictEqual(result, expectedParameters.project);
        });

        it('matchLocationFromRegistryName', () => {
          const result = client.matchLocationFromRegistryName(fakePath);
          assert.strictEqual(result, expectedParameters.location);
        });

        it('matchRegistryFromRegistryName', () => {
          const result = client.matchRegistryFromRegistryName(fakePath);
          assert.strictEqual(result, expectedParameters.registry);
        });
      });
    });
  });

  describe('retry logic', () => {
    it('rejects with error', async () => {
      const client = getClientStub();

      client.apiCallers.sendCommandToDevice.do = requestFactory(
        () =>
          Promise.reject(
            new IoTCoreError({
              error: {
                code: 400,
                message: 'Device d is not connected',
                status: 'FAILED_PRECONDITION',
              },
            })
          ),
        {
          getNextRequestObject: () => {
            return;
          },
          getResponseObject: d => d,
        }
      );
      await assert.rejects(
        () =>
          client.sendCommandToDevice({
            name: client.devicePath('p', 'l', 'r', 'd'),
            binaryData: 'foo',
          }),
        err => {
          assert.strictEqual(
            (err as Error).message,
            'Device d is not connected'
          );
          return true;
        }
      );
    });

    it('rejects with deadline exceeded', async () => {
      const client = getClientStub();

      const mock = sinon.stub().rejects(
        new IoTCoreError({
          error: {
            code: 400,
            message: 'Device d is not connected',
            status: 'FAILED_PRECONDITION',
          },
        })
      );

      client.apiCallers.sendCommandToDevice.do = requestFactory(mock, {
        getNextRequestObject: () => {
          return;
        },
        getResponseObject: d => d,
      });
      await assert.rejects(
        () =>
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          client.sendCommandToDevice(
            {
              name: client.devicePath('p', 'l', 'r', 'd'),
              binaryData: 'foo',
            },
            {
              maxRetries: 5,
              retry: {
                retryCodes: [9],
                backoffSettings: {
                  maxRetries: 3,
                },
              },
            }
          ),
        err => {
          assert.strictEqual(
            (err as Error).message,
            'Exceeded maximum number of retries before any response was received'
          );
          assert.strictEqual(mock.callCount, 5);
          return true;
        }
      );
    });
  });

  describe('util functions', () => {
    describe('timeSecondsNanos', () => {
      it('formats date into nanos and seconds properly', () => {
        const val = timeSecondsNanos('2023-03-28T19:55:00.927Z');
        assert.equal(val.nanos, 927000000);
        assert.equal(val.seconds, '1680033300');
      });

      it('returns an empty object if no value for time is passed', () => {
        const val = timeSecondsNanos('');
        assert.equal(Object.keys(val).length, 0);
      });
    });
  });
});

function getClientStub() {
  const client = new devicemanagerModule.v1.DeviceManagerClient({
    credentials: {
      systemKey: 'bogus',
      project: 'bogus',
      token: 'bogus',
      url: 'https://bogus.com',
    },
  });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  client.getRegistryToken = () =>
    Promise.resolve({
      systemKey: 'systemKey',
      serviceAccountToken: 'serviceAccountToken',
      url: 'https://bogus.com',
      host: 'bogus.com',
    });
  return client;
}
