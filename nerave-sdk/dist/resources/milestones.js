"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MilestonesResource = void 0;
class MilestonesResource {
    constructor(http) {
        this.http = http;
    }
    async confirm(input) {
        return this.http.post(`/agreements/${input.agreementId}/milestones/${input.milestoneId}/confirm`);
    }
}
exports.MilestonesResource = MilestonesResource;
//# sourceMappingURL=milestones.js.map