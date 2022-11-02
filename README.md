# [ClearBlade Internet of Things (IoT) Core: Node.js Client](https://github.com/clearblade/nodejs-iot)

[![npm version](https://img.shields.io/npm/v/@clearblade/iot.svg)](https://www.npmjs.org/package/@clearblade/iot)


> Node.js idiomatic client for [ClearBlade IoT Core][product-docs].

[ClearBlade Internet of Things (IoT) Core](https://clearblade.atlassian.net/wiki/spaces/IC/overview?homepageId=2170716228) is a fully managed service for securely connecting and managing IoT devices, from a few to millions. Ingest data from connected devices and build rich applications that integrate with the other big data services of Google Cloud Platform.



* [ClearBlade Internet of Things (IoT) Core Node.js Client API Reference][client-docs]
* [Clearblade Internet of Things (IoT) Core Documentation][product-docs]
* [github.com/clearblade/nodejs-iot](https://github.com/clearblade/nodejs-iot)



**Table of contents:**


* [Quickstart](#quickstart)
  * [Before you begin](#before-you-begin)
  * [Installing the client library](#installing-the-client-library)
  * [Using the client library](#using-the-client-library)
* [Samples](#samples)
* [Versioning](#versioning)
* [Contributing](#contributing)
* [License](#license)

## Quickstart

### Before you begin

1.  [Select or create a Cloud Platform project][projects].
1.  [Enable billing for your project][billing].
1.  [Enable the ClearBlade Internet of Things (IoT) Core API][enable_api].
1.  [Set up authentication with a service account][auth] so you can access the
    API from your local workstation.

### Installing the client library

```bash
npm install @clearblade/iot
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

| Sample                      | Source Code                       | Try it |
| --------------------------- | --------------------------------- | ------ |
| Quickstart | [source code](https://github.com/clearblade/nodejs-iot/blob/main/samples/quickstart.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/clearblade/nodejs-iot&page=editor&open_in_editor=samples/quickstart.js,samples/README.md) |



The [ClearBlade Internet of Things (IoT) Core Node.js Client API Reference][client-docs] documentation
also contains samples.

## Supported Node.js Versions

Our client libraries follow the [Node.js release schedule](https://nodejs.org/en/about/releases/).
Libraries are compatible with all current _active_ and _maintenance_ versions of
Node.js.
If you are using an end-of-life version of Node.js, we recommend that you update
as soon as possible to an actively supported LTS version.

ClearBlade's client libraries support legacy versions of Node.js runtimes on a
best-efforts basis with the following warnings:

* Legacy versions are not tested in continuous integration.
* Some security patches and features cannot be backported.
* Dependencies cannot be kept up-to-date.

Client libraries targeting some end-of-life versions of Node.js are available, and
can be installed through npm [dist-tags](https://docs.npmjs.com/cli/dist-tag).
The dist-tags follow the naming convention `legacy-(version)`.
For example, `npm install @google-cloud/iot@legacy-8` installs client libraries
for versions compatible with Node.js 8.

## Versioning

This library follows [Semantic Versioning](http://semver.org/).



This library is considered to be **stable**. The code surface will not change in backwards-incompatible ways
unless absolutely necessary (e.g. because of critical security issues) or with
an extensive deprecation period. Issues and requests against **stable** libraries
are addressed with the highest priority.




## Contributing

Contributions welcome! See the [Contributing Guide](https://github.com/clearblade/nodejs-iot/blob/main/CONTRIBUTING.md).


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
