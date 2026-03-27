"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgreementsModule = void 0;
const common_1 = require("@nestjs/common");
const agreement_service_1 = require("./agreement.service");
const agreement_controller_1 = require("./agreement.controller");
const blockchain_module_1 = require("../blockchain/blockchain.module");
const auth_module_1 = require("../auth/auth.module");
let AgreementsModule = class AgreementsModule {
};
exports.AgreementsModule = AgreementsModule;
exports.AgreementsModule = AgreementsModule = __decorate([
    (0, common_1.Module)({
        imports: [blockchain_module_1.BlockchainModule, auth_module_1.AuthModule],
        providers: [agreement_service_1.AgreementsService],
        controllers: [agreement_controller_1.AgreementsController],
        exports: [agreement_service_1.AgreementsService],
    })
], AgreementsModule);
//# sourceMappingURL=agreement.module.js.map