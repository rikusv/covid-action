"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = (response, code, type, details) => {
    response.status(code).send(Object.assign({ "type": `error/${type}` }, details));
};
//# sourceMappingURL=utils.js.map