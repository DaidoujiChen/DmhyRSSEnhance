'use strict';

const defaultMessage = {
    1001: 'Keyword Not Found',
    1002: 'Dmhy Response Format Error or Keyword Result Not Found',
    1003: 'Connect to Dmhy RSS Error'
};

const to = (res, errorCode, message) => {
    const responseError = {
        errorCode
    };
    if (message) {
        responseError['message'] = message;
    }
    else {
        responseError['message'] = defaultMessage[errorCode];
    }
    res.send(responseError);
};

module.exports = {
    to
};