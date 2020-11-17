// File: www/scripts/renderer/resources.ts

/**
 * @licstart The following is the entire license notice for the
 *  JavaScript code in this page.
 *
 * Copyright (C) 2020  Jacob Guenther
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend The above is the entire license notice
 * for the JavaScript code in this page.
 */

function isGoodResponseStatus(status: number) {
	return status > 199 && status < 300;
}
function checkFetchError(response: Response) {
	if (isGoodResponseStatus(response.status)) {
		return Promise.resolve(response);
	} else {
		throw Promise.reject(response.statusText);
	}
}
async function myFetch(url: string, method: string, credentials: RequestCredentials, body: any): Promise<any> {
	return await fetch(url, {
		method: method,
		mode: 'cors',
		credentials: credentials,
		headers: {
			'Content-Type': 'application/json'
		},
		redirect: 'follow',
		referrerPolicy: 'no-referrer',
		body: body,
	});
}
export async function fetchJson(url: string, method: string, body: any): Promise<any> {
	return await myFetch(url, method, 'same-origin', body)
		.then(checkFetchError)
		.then((response) => { return response; })
}
export async function fetchImage(name: string) {
	return await myFetch(`/assets/${name}`, 'GET', 'omit', null)
		.then(checkFetchError)
		.then((response) => {
			return response.blob();
		})
		.then((image) => {
			return Promise.resolve(URL.createObjectURL(image));
		})
}
export async function fetchShader(name: string) {
	return await myFetch(`/assets/shaders/${name}`, 'GET', 'omit', null)
		.then(checkFetchError)
		.then((response) => { return response.text(); })
}