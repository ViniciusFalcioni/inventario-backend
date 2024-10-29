import { Request, Response } from 'express';
import db from '../database/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_super_secure_secret';

// Define the User interface to specify the expected structure
interface User {
    id: number;
    nome: string;
    email: string;
    senha: string;   // 'senha' is the hashed password
    tipo_usuario: string;
}

// Register function to create a new user
export const register = async (req: Request, res: Response) => {
    const { nome, email, senha, tipo_usuario } = req.body;

    // Check if the user already exists
    db.get('SELECT * FROM Usuario WHERE email = ?', [email], async (err, row) => {
        if (row) return res.status(400).json({ message: 'Usuário já existe' });

        // Hash the password
        const hashedPassword = await bcrypt.hash(senha, 10);
        db.run(
            'INSERT INTO Usuario (nome, email, senha, tipo_usuario) VALUES (?, ?, ?, ?)',
            [nome, email, hashedPassword, tipo_usuario || 'Usuario'],
            function (err) {
                if (err) return res.status(500).json({ message: 'Erro ao criar usuário' });
                res.status(201).json({ message: 'Usuário registrado com sucesso' });
            }
        );
    });
};

// Login function to authenticate the user
export const login = (req: Request, res: Response) => {
    const { email, senha } = req.body;

    db.get('SELECT * FROM Usuario WHERE email = ?', [email], async (err, userRow) => {
        // Cast the result to the User interface type
        const user = userRow as User;

        // Check if the user exists
        if (!user) return res.status(400).json({ message: 'Usuário não encontrado' });

        // Verify the password
        const isPasswordValid = await bcrypt.compare(senha, user.senha);
        if (!isPasswordValid) return res.status(401).json({ message: 'Senha incorreta' });

        // Generate JWT token
        const token = jwt.sign({ id: user.id, tipo_usuario: user.tipo_usuario }, JWT_SECRET, {
            expiresIn: '1h',
        });
        res.json({ token });
    });
};
