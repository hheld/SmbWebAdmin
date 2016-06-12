export function getCsrfToken() {
    var result = /(?:^Csrf-token|;\s*Csrf-token)=(.*?)(?:;|$)/g.exec(document.cookie);
    return (result === null) ? null : result[1];
}

export function deleteCsrfToken() {
    if (getCsrfToken()) {
        deleteCsrfCookie();
    }
}

function deleteCsrfCookie() {
    let cookie = 'Csrf-token=;';

    const expires = new Date(new Date().getTime() - 1000 * 60 * 60 * 24);
    cookie += 'expires=' + expires.toGMTString() + ';';

    document.cookie = cookie;
}
