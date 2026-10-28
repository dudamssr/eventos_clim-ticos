const prisma = require('../data/prisma');

async function login(req, res) {
    console.log("DADOS RECEBIDOS:", req.body);
    
    const { email, senha } = req.body;

    try {
        const emailFormatado = email ? email.trim().toLowerCase() : '';
        const senhaFormatada = senha ? senha.trim() : '';

        const usuario = await prisma.usuario.findUnique({
            where: { email: emailFormatado }
        });

        if (!usuario) {
            console.log("Usuário não encontrado para o e-mail:", emailFormatado);
            return res.status(401).json({ erro: "E-mail ou senha inválidos!" });
        }

        if (usuario.senha !== senhaFormatada) {
            console.log("Senha incorreta. Digitada:", senhaFormatada, "| Salva no banco:", usuario.senha);
            return res.status(401).json({ erro: "E-mail ou senha inválidos!" });
        }

        return res.json(usuario);
    } catch (error) {
        console.error("Erro no login:", error);
        return res.status(500).json({ erro: "Erro interno no servidor" });
    }
}

async function listar(req, res) {
    try {
        const usuarios = await prisma.usuario.findMany();
        return res.json(usuarios);
    } catch (error) {
        console.error("Erro ao listar usuários:", error);
        return res.status(500).json({ erro: "Erro interno no servidor" });
    }
}

module.exports = {
    login,
    listar
};