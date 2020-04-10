"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
const functions = __importStar(require("firebase-functions"));
const shared_1 = require("./shared");
const client = new google_maps_services_js_1.Client();
// TODO: refactor the below to avoid all the duplicate code (constuct request -> run request (single function) -> process request)
exports.placeDetails = functions.region('europe-west1').https.onRequest(async (request, response) => {
    var _a, _b;
    if (relevant(request, response)) {
        const placeId = request.query.placeId;
        if (!placeId) {
            shared_1.sendError(response, 400, 'missing-query-parameter');
        }
        else {
            try {
                const placeDetailsRequest = {
                    params: {
                        key: functions.config().googlemaps.apikey,
                        place_id: placeId
                    }
                };
                const rawResponse = await client.placeDetails(placeDetailsRequest);
                if (rawResponse.status === 200 && !rawResponse.data.error_message) {
                    const result = {
                        latitude: (_a = rawResponse.data.result.geometry) === null || _a === void 0 ? void 0 : _a.location.lat,
                        longitude: (_b = rawResponse.data.result.geometry) === null || _b === void 0 ? void 0 : _b.location.lng
                    };
                    response.status(200).send(result);
                }
                else {
                    shared_1.sendError(response, 500, 'google-maps-places-autocomplete', {
                        error: JSON.stringify(rawResponse.data.error_message)
                    });
                }
            }
            catch (error) {
                shared_1.sendError(response, 500, 'unknown', {
                    error: JSON.stringify(error)
                });
            }
        }
    }
});
exports.placeAutocomplete = functions.region('europe-west1').https.onRequest(async (request, response) => {
    if (relevant(request, response)) {
        const input = request.query.input;
        if (!input) {
            shared_1.sendError(response, 400, 'missing-query-parameter');
        }
        else {
            try {
                const autoCompleteRequest = {
                    params: {
                        components: ['country:za'],
                        input,
                        key: functions.config().googlemaps.apikey
                    }
                };
                const rawResponse = await client.placeAutocomplete(autoCompleteRequest);
                if (rawResponse.status === 200 && !rawResponse.data.error_message) {
                    const results = rawResponse.data.predictions.map(rawResult => ({
                        address: rawResult.description,
                        placeId: rawResult.place_id
                    }));
                    response.status(200).send(results);
                }
                else {
                    shared_1.sendError(response, 500, 'google-maps-places-autocomplete', {
                        error: JSON.stringify(rawResponse.data.error_message)
                    });
                }
            }
            catch (error) {
                shared_1.sendError(response, 500, 'unknown', {
                    error: JSON.stringify(error)
                });
            }
        }
    }
});
const relevant = (request, response) => {
    // TODO: restrict origins
    response.set('Access-Control-Allow-Origin', '*');
    if (request.method === 'OPTIONS') {
        response.set('Access-Control-Allow-Methods', 'GET');
        response.set('Access-Control-Allow-Headers', ['Content-Type', 'Authorization']);
        response.set('Access-Control-Max-Age', '3600');
        response.status(204).send('');
        return false;
    }
    else if (request.method !== 'GET') {
        shared_1.sendError(response, 405, 'unsupported-method');
        return false;
    }
    else {
        return true;
    }
};
//# sourceMappingURL=map.js.map