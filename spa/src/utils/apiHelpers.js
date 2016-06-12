import request from 'superagent';

import { getCsrfToken } from '../utils/cookieHandling';

export function authenticatedGet(url, successCb, errorCb) {
    return new Promise((resolve, reject) => {
        const csrfToken = getCsrfToken();

        if(csrfToken===null) {
            if(errorCb) errorCb();
            reject();
            return;
        }

        request
            .get(url)
            .set('X-Csrf-token', csrfToken)
            .end(function (err, res) {
                if (err || !res.ok) {
                    if(errorCb) errorCb(err);
                    reject(err);
                } else {
                    if(successCb) successCb(res);
                    resolve(res);
                }
            });
    });
}

export function authenticatedPost(url, data, successCb, errorCb) {
    return new Promise((resolve, reject) => {
        const csrfToken = getCsrfToken();

        if(csrfToken===null) {
            if(errorCb) errorCb();
            reject();
            return;
        }
        
        request
            .post(url)
            .set('X-Csrf-token', csrfToken)
            .send(data)
            .end(function (err, res) {
                if (err || !res.ok) {
                    if(errorCb) errorCb(err);
                    reject(err);
                } else {
                    if(successCb) successCb(res);
                    resolve(res);
                }
            });
    });
}

export function checkIfUserNameIsTaken(userName) {
    return authenticatedGet('/api/getUser?userName=' + userName);
}
