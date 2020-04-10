"use strict";
// TODO: Refactor the below to be less ugly.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = require("@google-cloud/firestore");
const functions = __importStar(require("firebase-functions"));
const crypto_1 = require("crypto");
const ajv_1 = __importDefault(require("ajv"));
const locations_json_1 = __importDefault(require("./schema/locations.json"));
const shared_1 = require("./shared");
const locationCollection = shared_1.db.collection('locations');
const logCollection = shared_1.db.collection('logs');
const ajv = new ajv_1.default();
const validateLocations = ajv.compile(locations_json_1.default);
exports.locations = functions.region('europe-west1').https.onRequest(async (request, response) => {
    switch (request.method) {
        case 'GET':
            if (request.query.hasOwnProperty('schema')) {
                response.status(200).send(locations_json_1.default);
            }
            else {
                shared_1.sendError(response, 405, 'not-implemented');
            }
            break;
        case 'PATCH':
            const apiKey = request.headers.authorization;
            if (!apiKey) {
                shared_1.sendError(response, 403, 'not-authorized');
            }
            else {
                const hash = crypto_1.createHash('sha256').update(apiKey).digest('hex');
                const client = await shared_1.db.collection('clients').doc(hash).get();
                if (!client.exists) {
                    shared_1.sendError(response, 403, 'not-authorized');
                }
                else {
                    const patchedLocations = request.body;
                    const valid = validateLocations(patchedLocations);
                    if (!valid) {
                        shared_1.sendError(response, 400, 'validation-failed', {
                            "validaton-errors": validateLocations.errors
                        });
                    }
                    else {
                        patchLocations(response, patchedLocations, client);
                    }
                }
            }
            break;
        default:
            shared_1.sendError(response, 405, 'unsupported-method');
    }
});
const patchLocations = (response, patchedLocations, client) => {
    let createCount = 0;
    let updateCount = 0;
    let noChangeCount = 0;
    const resultsPromises = patchedLocations.map(async (patchedLocation) => {
        patchedLocation.coordinates = new firestore_1.GeoPoint(patchedLocation.coordinates.latitude, patchedLocation.coordinates.longitude);
        const existing = locationCollection
            .where('category', '==', patchedLocation.category)
            .where('coordinates', '==', patchedLocation.coordinates);
        return existing.get()
            .then(async (snapshot) => {
            if (snapshot.empty) {
                return locationCollection.add(patchedLocation)
                    .then(async () => {
                    await writeLog('info', 'New data written.', patchedLocation, client);
                    createCount += 1;
                    return 0;
                })
                    .catch(async (error) => {
                    await writeLog('error', 'New data failed to write.', {
                        error: JSON.stringify(error),
                        data: patchedLocation
                    }, client);
                    return 1;
                });
            }
            else if (snapshot.size === 1) {
                const existingSnapshot = snapshot.docs[0];
                const existingLocation = existingSnapshot.data();
                const same = Object.keys(patchedLocation).reduce((result, field) => {
                    return JSON.stringify(patchedLocation[field]) === JSON.stringify(existingLocation[field]) && result;
                }, true);
                if (same) {
                    await writeLog('info', 'New data same as current. No update.', {
                        new: patchedLocation,
                        old: existingLocation
                    }, client);
                    noChangeCount += 1;
                    return 0;
                }
                else {
                    return existingSnapshot.ref.update(patchedLocation)
                        .then(async () => {
                        await writeLog('info', 'Existing data updated.', {
                            new: patchedLocation,
                            old: existingLocation
                        }, client);
                        updateCount += 1;
                        return 0;
                    })
                        .catch(async (error) => {
                        await writeLog('error', 'Failed to update existing data.', {
                            error: JSON.stringify(error),
                            data: patchedLocation
                        }, client);
                        return 1;
                    });
                }
            }
            else {
                await writeLog('error', 'Existing duplicates found in database. New data not written.', {
                    duplicates: snapshot.docs,
                    new: patchedLocation
                }, client);
                return 1;
            }
        })
            .catch(async (error) => {
            await writeLog('error', 'Unexpected error.', {
                error: JSON.stringify(error),
                data: patchedLocation
            }, client);
            return 1;
        });
    });
    Promise.all(resultsPromises)
        .then(results => {
        const errorCount = results.reduce((previous, current) => previous + current, 0);
        response.status(200).send({
            type: "success/processed",
            locationCounts: {
                sent: patchedLocations.length,
                errors: errorCount,
                created: createCount,
                updated: updateCount,
                noChange: noChangeCount
            }
        });
    })
        .catch(error => {
        shared_1.sendError(response, 500, 'unknown', { error: JSON.stringify(error) });
    });
};
const writeLog = async (severity, description, detail, client) => {
    return logCollection.add({
        clientId: client.id,
        description,
        detail,
        severity,
        source: 'api-functions',
        timestamp: new Date().toISOString()
    }).then(() => null).catch(error => {
        console.error('Could not write to log', error);
        return 1;
    });
};
//# sourceMappingURL=locations.js.map