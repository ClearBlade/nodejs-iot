# [ClearBlade IoT Core: Node.js Client](https://github.com/clearblade/nodejs-iot)

[![npm version](https://img.shields.io/npm/v/@clearblade/iot.svg)](https://www.npmjs.org/package/@clearblade/iot)

> Node.js idiomatic client for [ClearBlade IoT Core][product-docs].

[ClearBlade IoT Core](https://clearblade.atlassian.net/wiki/spaces/IC/overview?homepageId=2170716228) is a fully managed service for securely connecting and managing IoT devices, from a few to millions. Ingest data from connected devices and build rich applications that integrate with the other big data services of the ClearBlade Platform.

- [ClearBlade IoT Core Node.js client API reference][client-docs]
- [Clearblade IoT Core documentation][product-docs]
- [github.com/clearblade/nodejs-iot](https://github.com/clearblade/nodejs-iot)

**Table of contents:**

- [Quickstart](#quickstart)
  - [Before you begin](#before-you-begin)
  - [Installing the client library](#installing-the-client-library)
  - [Using the client library](#using-the-client-library)
- [Samples](#samples)
- [Versioning](#versioning)
- [Contributing](#contributing)
- [License](#license)

## Quickstart

### Before you begin

1.  [Select or create a Cloud Platform project][projects].
2.  [Enable billing for your project][billing].
3.  [Enable the ClearBlade IoT Core API][enable_api].
4.  [Set up authentication with a service account][auth] so you can access the API from your local workstation.

### Installing the client library

```bash
npm install @clearblade/iot
```

### Setting up service account credentials

[Create a service account](https://clearblade.atlassian.net/wiki/spaces/IC/pages/2240675843/Add+service+accounts+to+a+project) in your project and download the credentials .json file. Define an environment variable named `CLEARBLADE_CONFIGURATION`, which represents the credentials .json file's path. Example:

```
export CLEARBLADE_CONFIGURATION=/path/to/file.json
```

As an alternative to using a filepath for your service account credentials, you can take the `project`, `systemKey`, `token`, and `url` values from your service account's .json file and supply them directly to the constructor:

```javascript
const client = new DeviceManagerClient({
  credentials: {
    project: '<project>',
    systemKey: '<systemKey>',
    token: '<token>',
    url: '<url>',
  },
});
```

Use your service account credentials rather than those from the Registry API keys page. You can use one set of service account credentials to target all your project's registries.

### BINARYDATA_AND_TIME_GOOGLE_FORMAT env variable (optional)

If you'd like to receive binaryData and timestamps in the same format that the Google IoT node SDK supplies, you can define an environment variable named `BINARYDATA_AND_TIME_GOOGLE_FORMAT`. If this env variable is set as `true`, then it will give the binaryData object's response in byte array form and time in timestamp format, which will have seconds and nanos in it, following Google's structure. It's applicable on the get device state list, modify config, and device config versions methods. By default, this flag's value will be false.

```
export BINARYDATA_AND_TIME_GOOGLE_FORMAT=true
```

### Using the client library

```javascript
const iot = require('@clearblade/iot');
const client = new iot.v1.DeviceManagerClient();

async function quickstart() {
  const projectId = await client.getProjectId();
  const parent = client.locationPath(projectId, 'us-central1');
  const [resources] = await client.listDeviceRegistries({parent});
  console.log(`${resources.length} resource(s) found.`);
  for (const resource of resources) {
    console.log(resource);
  }
}
quickstart();
```

## Samples

Samples are in the [`samples/`](https://github.com/clearblade/nodejs-iot/tree/main/samples) directory. Each sample's `README.md` has instructions for running its sample.

| Sample     | Source code                                                                             | Try it                                                                                                                                                                                                     |
| ---------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Quickstart | [source code](https://github.com/clearblade/nodejs-iot/blob/main/samples/quickstart.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/clearblade/nodejs-iot&page=editor&open_in_editor=samples/quickstart.js,samples/README.md) |

The [ClearBlade IoT Core Node.js client API reference][client-docs] documentation also contains samples.

## Supported Node.js versions

Our client libraries follow the [Node.js release schedule](https://nodejs.org/en/about/releases/). Libraries are compatible with all current _active_ and _maintenance_ versions of Node.js. If you are using an end-of-life version of Node.js, we recommend that you update it as soon as possible to an actively supported LTS version.

ClearBlade's client libraries support legacy versions of Node.js runtimes on a best-efforts basis with the following warnings:

- Legacy versions are not tested in continuous integration.
- Some security patches and features cannot be backported.
- Dependencies cannot be kept up-to-date.

Client libraries targeting some end-of-life versions of Node.js are available and can be installed through npm [dist-tags](https://docs.npmjs.com/cli/dist-tag).
The dist-tags follow the naming convention `legacy-(version)`. For example, `npm install @google-cloud/iot@legacy-8` installs client libraries for versions compatible with Node.js 8.

## Versioning

This library follows [semantic versioning](http://semver.org/).

This library is considered to be **stable**. The code surface will not change in backward-incompatible ways unless necessary (e.g., because of critical security issues) or with
an extensive deprecation period. Issues and requests against **stable** libraries are addressed with the highest priority.

## Contributing

Contributions welcome! See the [Contributing guide](https://github.com/clearblade/nodejs-iot/blob/main/CONTRIBUTING.md).

## License

Apache Version 2.0

See [LICENSE](https://github.com/googleapis/nodejs-iot/blob/main/LICENSE)

[client-docs]: https://cloud.google.com/nodejs/docs/reference/iot/latest
[product-docs]: https://clearblade.atlassian.net/wiki/spaces/IC/pages/2200895497/All+concepts
[shell_img]: https://gstatic.com/cloudssh/images/open-btn.png
[projects]: https://console.cloud.google.com/project
[billing]: https://support.google.com/cloud/answer/6293499#enable-billing
[enable_api]: https://clearblade.atlassian.net/wiki/spaces/IC/pages/2230976570/Google+Cloud+Marketplace+Activation
[auth]: https://cloud.google.com/docs/authentication/getting-started
