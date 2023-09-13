# Changelog

## [1.2.1](https://github.com/clearblade/nodejs-iot/compare/v1.2.0..v1.2.1) (2023-09-12)

- Fix content length header on device create and device patch

## [1.2.0](https://github.com/clearblade/nodejs-iot/compare/v1.1.1..v1.2.0) (2023-08-25)

- Add serverError to error object

## [1.1.1](https://github.com/clearblade/nodejs-iot/compare/v1.1.0..v1.1.1) (2023-05-16)

- Add error handling to internal method

## [1.1.0](https://github.com/clearblade/nodejs-iot/compare/v1.0.9..v1.1.0) (2023-04-10)

- Add support for retrying requests on error

## [1.0.9](https://github.com/clearblade/nodejs-iot/compare/v1.0.8..v1.0.9) (2023-04-06)

- Fix incorrect decoding of state binaryData when using `BINARYDATA_AND_TIME_GOOGLE_FORMAT` flag

## [1.0.8](https://github.com/clearblade/nodejs-iot/compare/v1.0.7..v1.0.8) (2023-04-04)

- Fix incorrect timestamp format when using `BINARYDATA_AND_TIME_GOOGLE_FORMAT` flag
- Fix issue with binaryData when using `BINARYDATA_AND_TIME_GOOGLE_FORMAT` flag

## [1.0.7](https://github.com/clearblade/nodejs-iot/compare/v1.0.4..v1.0.7) (2023-03-13)

- Add support for `BINARYDATA_AND_TIME_GOOGLE_FORMAT` flag

## [1.0.4](https://github.com/clearblade/nodejs-iot/compare/v1.0.3..v1.0.4) (2022-11-10)

- fix binaryData Buffer not encoded for sendCommandToDevice and modifyCloudToDeviceConfig
- add error handling for HTTP requests
- fix fieldMasks not encoded for multiple methods
- Miscellaneous bug fixes

## [1.0.3](https://github.com/clearblade/nodejs-iot/compare/v1.0.2..v1.0.3) (2022-11-04)

- Bug fix for regional URLs

## [1.0.2](https://github.com/clearblade/nodejs-iot/compare/v1.0.1..v1.0.2) (2022-11-04)

- Bug fix for unbindDeviceFromGateway
- non-200 status code handling for `sendCommandToDevice` and modify `modifyCloudToDeviceConfig`

## 1.0.1

- Minor fixes

## 1.0.0

- Initial release of @clearblade/iot
