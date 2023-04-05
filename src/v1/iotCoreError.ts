import {GoogleError, Status} from 'google-gax';

export class IoTCoreError extends Error {
  code: number;
  status: string;
  details?: unknown;
  constructor(info: {
    code: number;
    message: string;
    status: string;
    details?: unknown;
  }) {
    super(info.message);
    this.code = info.code;
    this.status = info.status;
    this.details = info.details;
  }

  static parseHttpError = (error: unknown): IoTCoreError => {
    if (error instanceof IoTCoreError) {
      return error;
    } else if (typeof error === 'string') {
      try {
        const parsedError = JSON.parse(error);
        if (isServerError(parsedError)) {
          return new IoTCoreError(parsedError.error);
        }
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }
    return new UnknownError(error);
  };

  static toGoogleError = (error: unknown): GoogleError => {
    const iotError = IoTCoreError.parseHttpError(error);
    const googleError = new GoogleError(iotError.message);
    googleError.code = getGoogleErrorCodeFromStatus(iotError.status);
    return googleError;
  };
}

export function getGoogleErrorCodeFromStatus(status: string): Status {
  switch (status) {
    case 'CANCELLED':
      return Status.CANCELLED;
    case 'INVALID_ARGUMENT':
      return Status.INVALID_ARGUMENT;
    case 'DEADLINE_EXCEEDED':
      return Status.DEADLINE_EXCEEDED;
    case 'NOT_FOUND':
      return Status.NOT_FOUND;
    case 'ALREADY_EXISTS':
      return Status.ALREADY_EXISTS;
    case 'PERMISSION_DENIED':
      return Status.PERMISSION_DENIED;
    case 'RESOURCE_EXHAUSTED':
      return Status.RESOURCE_EXHAUSTED;
    case 'FAILED_PRECONDITION':
      return Status.FAILED_PRECONDITION;
    case 'ABORTED':
      return Status.ABORTED;
    case 'OUT_OF_RANGE':
      return Status.OUT_OF_RANGE;
    case 'UNIMPLEMENTED':
      return Status.UNIMPLEMENTED;
    case 'INTERNAL':
      return Status.INTERNAL;
    case 'UNAVAILABLE':
      return Status.UNAVAILABLE;
    case 'DATA_LOSS':
      return Status.DATA_LOSS;
    case 'UNAUTHENTICATED':
      return Status.UNAUTHENTICATED;
    case 'UNKNOWN':
    default:
      return Status.UNKNOWN;
  }
}

export class UnknownError extends IoTCoreError {
  constructor(error: unknown) {
    super({
      code: 2,
      message: 'An unknown error occurred',
      status: 'UNKNOWN_ERROR',
      details: error,
    });
  }
}

export class NetworkingError extends IoTCoreError {
  constructor() {
    super({
      code: -2,
      message: 'Networking error. No status code was returned',
      status: 'NETWORKING_ERROR',
    });
  }
}

function isServerError(value: unknown): value is ServerError {
  if (
    value &&
    typeof value === 'object' &&
    'error' in value &&
    (value as ServerError).error &&
    typeof (value as ServerError).error === 'object' &&
    'code' in (value as ServerError).error
  ) {
    return true;
  }
  return false;
}

interface ServerError {
  error: {
    code: number;
    message: string;
    status: string;
  };
}
