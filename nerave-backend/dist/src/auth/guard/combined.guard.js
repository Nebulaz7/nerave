"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombinedGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("./jwt.guard");
const api_key_guard_1 = require("./api-key.guard");
let CombinedGuard = class CombinedGuard {
    jwtGuard;
    apiKeyGuard;
    constructor(jwtGuard, apiKeyGuard) {
        this.jwtGuard = jwtGuard;
        this.apiKeyGuard = apiKeyGuard;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        if (request.headers['x-api-key']) {
            return this.apiKeyGuard.canActivate(context);
        }
        return this.jwtGuard.canActivate(context);
    }
};
exports.CombinedGuard = CombinedGuard;
exports.CombinedGuard = CombinedGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_guard_1.JwtGuard,
        api_key_guard_1.ApiKeyGuard])
], CombinedGuard);
//# sourceMappingURL=combined.guard.js.map