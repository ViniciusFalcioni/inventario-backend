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
exports.getDashboardStats = void 0;
const db_1 = __importDefault(require("../database/db"));
const getDashboardStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queries = {
            totalProducts: 'SELECT COUNT(*) as total FROM Produto',
            totalSuppliers: 'SELECT COUNT(*) as total FROM Fornecedor',
            totalOrders: 'SELECT COUNT(*) as total FROM Pedido',
        };
        const results = yield Promise.all(Object.values(queries).map(query => new Promise((resolve, reject) => {
            db_1.default.get(query, (err, row) => {
                if (err)
                    reject(err);
                else
                    resolve((row === null || row === void 0 ? void 0 : row.total) || 0); // Garantimos que `total` existe
            });
        })));
        res.json({
            totalProducts: results[0],
            totalSuppliers: results[1],
            totalOrders: results[2],
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar estatísticas do dashboard' });
    }
});
exports.getDashboardStats = getDashboardStats;
