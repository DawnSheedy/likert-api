"use strict";
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var crypto_1 = __importDefault(require("crypto"));
var User = /** @class */ (function (_super) {
  __extends(User, _super);
  function User() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  User.prototype.setPassword = function (password) {
    this.salt = crypto_1.default.randomBytes(16).toString("hex");
    this.hash = crypto_1.default
      .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
      .toString("hex");
  };
  User.prototype.verifyPassword = function (password) {
    var hash = crypto_1.default
      .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
      .toString("hex");
    return hash === this.hash;
  };
  __decorate(
    [
      typeorm_1.PrimaryGeneratedColumn("uuid"),
      __metadata("design:type", String),
    ],
    User.prototype,
    "id",
    void 0
  );
  __decorate(
    [typeorm_1.Column(), __metadata("design:type", String)],
    User.prototype,
    "firstName",
    void 0
  );
  __decorate(
    [typeorm_1.Column(), __metadata("design:type", String)],
    User.prototype,
    "lastName",
    void 0
  );
  __decorate(
    [typeorm_1.Column({ unique: true }), __metadata("design:type", String)],
    User.prototype,
    "email",
    void 0
  );
  __decorate(
    [typeorm_1.Column(), __metadata("design:type", String)],
    User.prototype,
    "hash",
    void 0
  );
  __decorate(
    [typeorm_1.Column(), __metadata("design:type", String)],
    User.prototype,
    "salt",
    void 0
  );
  __decorate(
    [typeorm_1.Column(), __metadata("design:type", Boolean)],
    User.prototype,
    "isAdmin",
    void 0
  );
  __decorate(
    [typeorm_1.Column(), __metadata("design:type", Number)],
    User.prototype,
    "age",
    void 0
  );
  User = __decorate([typeorm_1.Entity()], User);
  return User;
})(typeorm_1.BaseEntity);
exports.default = User;
//# sourceMappingURL=entity.js.map
