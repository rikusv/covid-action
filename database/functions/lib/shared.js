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
exports.db = admin.firestore();
exports.sendError = (response, code, type, details) => {
    response.status(code).send(Object.assign({ "type": `error/${type}` }, details));
};
//# sourceMappingURL=shared.js.map