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
const admin = __importStar(require("firebase-admin"));
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
exports.authUserCreateTrigger = functions.auth.user().onCreate(authUser => {
    const uid = authUser.uid;
    const user = {
        email: authUser.email,
        name: authUser.displayName,
        phone: authUser.phoneNumber
    };
    return db.collection('users').doc(uid).set(user, { merge: true })
        .then(() => console.log(`User ${uid} written.`))
        .catch(error => console.error(`Could not write user ${uid}`, error));
});
//# sourceMappingURL=auth.js.map