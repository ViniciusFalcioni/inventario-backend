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
exports.login = exports.register = void 0;
const db_1 = __importDefault(require("../database/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = 'your_super_secure_secret';
// Register function to create a new user
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nome, email, senha, tipo_usuario } = req.body;
    // Check if the user already exists
    db_1.default.get('SELECT * FROM Usuario WHERE email = ?', [email], (err, row) => __awaiter(void 0, void 0, void 0, function* () {
        if (row)
            return res.status(400).json({ message: 'Usuário já existe' });
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(senha, 10);
        db_1.default.run('INSERT INTO Usuario (nome, email, senha, tipo_usuario) VALUES (?, ?, ?, ?)', [nome, email, hashedPassword, tipo_usuario || 'Usuario'], function (err) {
            if (err)
                return res.status(500).json({ message: 'Erro ao criar usuário' });
            res.status(201).json({ message: 'Usuário registrado com sucesso' });
        });
    }));
});
exports.register = register;
// Login function to authenticate the user
const login = (req, res) => {
    const { email, senha } = req.body;
    db_1.default.get('SELECT * FROM Usuario WHERE email = ?', [email], (err, userRow) => __awaiter(void 0, void 0, void 0, function* () {
        // Cast the result to the User interface type
        const user = userRow;
        // Check if the user exists
        if (!user)
            return res.status(400).json({ message: 'Usuário não encontrado' });
        // Verify the password
        const isPasswordValid = yield bcrypt_1.default.compare(senha, user.senha);
        if (!isPasswordValid)
            return res.status(401).json({ message: 'Senha incorreta' });
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user.id, tipo_usuario: user.tipo_usuario }, JWT_SECRET, {
            expiresIn: '1h',
        });
        res.json({ token });
    }));
};
exports.login = login;
