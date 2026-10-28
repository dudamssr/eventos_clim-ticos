
const prisma = require('../data/prisma');

async function cadastrar(req, res) {
    try {
        const {
            usuarioId,
            cidade,
            tipoEvento,
            temperaturaMaxima,
            nivelImpacto
        } = req.body;

        const idUsuario = Number(usuarioId);
        const temperatura = Number(temperaturaMaxima);

        if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
            return res.status(400).json({
                erro: 'ID do usuário inválido. Faça login novamente.'
            });
        }

        if (
            !cidade?.trim() ||
            !tipoEvento ||
            !nivelImpacto
        ) {
            return res.status(400).json({
                erro: 'Preencha todos os campos do evento.'
            });
        }

        if (
            temperaturaMaxima === undefined ||
            temperaturaMaxima === null ||
            String(temperaturaMaxima).trim() === '' ||
            !Number.isFinite(temperatura)
        ) {
            return res.status(400).json({
                erro: 'Informe uma temperatura máxima válida.'
            });
        }

        const evento = await prisma.evento.create({
            data: {
                usuarioId: idUsuario,
                cidade: cidade.trim(),
                tipoEvento,
                temperaturaMaxima: temperatura,
                nivelImpacto
            }
        });

        return res.status(201).json(evento);
    } catch (error) {
        console.error(
            'DETALHE DO ERRO AO CADASTRAR EVENTO:',
            error
        );

        return res.status(500).json({
            erro: 'Erro ao cadastrar evento.'
        });
    }
}

async function listar(req, res) {
    try {
        const eventos = await prisma.evento.findMany();

        return res.json(eventos);
    } catch (error) {
        console.error('ERRO DETALHADO AO LISTAR:', error);

        return res.status(500).json({
            erro: 'Erro ao listar eventos.'
        });
    }
}

async function buscar(req, res) {
    try {
        const { id } = req.params;
        const idEvento = Number(id);

        if (!Number.isInteger(idEvento) || idEvento <= 0) {
            return res.status(400).json({
                erro: 'ID do evento inválido.'
            });
        }

        const evento = await prisma.evento.findUnique({
            where: { id: idEvento }
        });

        if (!evento) {
            return res.status(404).json({
                erro: 'Evento não encontrado.'
            });
        }

        return res.json(evento);
    } catch (error) {
        console.error('ERRO AO BUSCAR EVENTO:', error);

        return res.status(500).json({
            erro: 'Erro ao buscar evento.'
        });
    }
}

async function atualizar(req, res) {
    try {
        const { id } = req.params;
        const idEvento = Number(id);

        const {
            cidade,
            tipoEvento,
            temperaturaMaxima,
            nivelImpacto
        } = req.body;

        if (!Number.isInteger(idEvento) || idEvento <= 0) {
            return res.status(400).json({
                erro: 'ID do evento inválido.'
            });
        }

        const dadosAtualizados = {};

        if (cidade !== undefined) {
            if (typeof cidade !== 'string' || !cidade.trim()) {
                return res.status(400).json({
                    erro: 'Informe uma cidade válida.'
                });
            }

            dadosAtualizados.cidade = cidade.trim();
        }

        if (tipoEvento !== undefined) {
            dadosAtualizados.tipoEvento = tipoEvento;
        }

        if (nivelImpacto !== undefined) {
            dadosAtualizados.nivelImpacto = nivelImpacto;
        }

        if (temperaturaMaxima !== undefined) {
            const temperatura = Number(temperaturaMaxima);

            if (
                String(temperaturaMaxima).trim() === '' ||
                !Number.isFinite(temperatura)
            ) {
                return res.status(400).json({
                    erro: 'Informe uma temperatura válida.'
                });
            }

            dadosAtualizados.temperaturaMaxima = temperatura;
        }

        const evento = await prisma.evento.update({
            where: { id: idEvento },
            data: dadosAtualizados
        });

        return res.json(evento);
    } catch (error) {
        console.error('ERRO AO ATUALIZAR EVENTO:', error);

        return res.status(500).json({
            erro: 'Erro ao atualizar evento.'
        });
    }
}

async function excluir(req, res) {
    try {
        const { id } = req.params;
        const idEvento = Number(id);

        if (!Number.isInteger(idEvento) || idEvento <= 0) {
            return res.status(400).json({
                erro: 'ID do evento inválido.'
            });
        }

        await prisma.evento.delete({
            where: { id: idEvento }
        });

        return res.status(204).send();
    } catch (error) {
        console.error('ERRO AO EXCLUIR EVENTO:', error);

        return res.status(500).json({
            erro: 'Erro ao excluir evento.'
        });
    }
}

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
};
