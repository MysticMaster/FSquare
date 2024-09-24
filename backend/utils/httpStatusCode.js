const successResponse = {
    "code": 200,
    "status": 'Success'
}

const createdResponse = {
    "code": 201,
    "status": "Created"
}

const noContentResponse = {
    code: 204,
    status: 'No Content'
};

const badRequestResponse = {
    code: 400,
    status: 'Bad Request'
};

const unauthorizedResponse = {
    code: 401,
    status: 'Unauthorized'
};

const forbiddenResponse = {
    code: 403,
    status: 'Forbidden'
};

const notFoundResponse = {
    code: 404,
    status: 'Not Found'
};

const requestTimeoutResponse = {
    code: 408,
    status: 'Request Timeout'
};

const conflictResponse = {
    code: 409,
    status: 'Conflict'
};

const internalServerErrorResponse = {
    code: 500,
    status: 'Internal Server Error'
};

const serviceUnavailableResponse = {
    code: 503,
    status: 'Service Unavailable'
};

export {
    successResponse,
    createdResponse,
    noContentResponse,
    badRequestResponse,
    unauthorizedResponse,
    forbiddenResponse,
    notFoundResponse,
    requestTimeoutResponse,
    conflictResponse,
    internalServerErrorResponse,
    serviceUnavailableResponse,
};
