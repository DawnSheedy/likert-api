"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
var typedi_1 = require("typedi");
var winston_1 = __importDefault(require("./winston"));
exports.default = function () {
  typedi_1.Container.set("logger", winston_1.default);
};
//# sourceMappingURL=dependencyInjection.js.map
