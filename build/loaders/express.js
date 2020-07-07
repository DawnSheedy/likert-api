"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
var body_parser_1 = __importDefault(require("body-parser"));
var api_1 = __importDefault(require("../api"));
exports.default = function (app) {
  /*
     TODO:
     error handling
     security
    */
  app.get("/status", function (req, res) {
    res.status(200).end();
  });
  app.head("/status", function (req, res) {
    res.status(200).end();
  });
  app.use(body_parser_1.default.json());
  app.use("/api", api_1.default());
  return;
};
//# sourceMappingURL=express.js.map
