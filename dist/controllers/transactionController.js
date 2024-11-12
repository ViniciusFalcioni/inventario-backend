"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactions = void 0;
const db_1 = __importDefault(require("../database/db"));
const getTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tipo, dataInicio, dataFim } = req.query;
        let query = 'SELECT * FROM Transacao WHERE 1=1';
        const params = [];
        if (tipo) {
            query += ' AND tipo = ?';
            params.push(tipo);
        }
        if (dataInicio) {
            query += ' AND data >= ?';
            params.push(dataInicio);
        }
        if (dataFim) {
            query += ' AND data <= ?';
            params.push(dataFim);
        }
        db_1.default.all(query, params, (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ transacoes: rows });
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao obter transações' });
    }
});
exports.getTransactions = getTransactions;
