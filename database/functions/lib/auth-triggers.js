"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = __importStar(require("firebase-functions"));
const shared_1 = require("./shared");
exports.onAuthUserCreate = functions.region('europe-west1').auth.user().onCreate(authUser => {
    const uid = authUser.uid;
    const user = {
        email: authUser.email,
        name: authUser.displayName,
        phone: authUser.phoneNumber
    };
    return shared_1.db.collection('users').doc(uid).set(user, { merge: true })
        .then(() => console.log(`User ${uid} written.`))
        .catch(error => console.error(`Could not write user ${uid}`, error));
});
//# sourceMappingURL=auth-triggers.js.map