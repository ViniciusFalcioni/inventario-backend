"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
sqlite3_1.default.verbose();
const db = new sqlite3_1.default.Database('./inventario.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados', err.message);
    }
    else {
        console.log('Conectado ao banco de dados SQLite');
    }
});
exports.default = db;
