
const API_URL = 'http://localhost:3000';

const CHAVE_TOKEN = 'tokenEventosClimaticos';
const CHAVE_USUARIO = 'usuarioEventosClimaticos';
const CHAVE_ID_USUARIO = 'idUsuarioEventosClimaticos';

function obterToken() {
    return localStorage.getItem(CHAVE_TOKEN);
}

function escaparHTML(valor) {
    return String(valor ?? '').replace(/[&<>"']/g, caractere => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[caractere]);
}

async function requisicaoAPI(endpoint, opcoes = {}) {
    const token = obterToken();

    const cabecalhos = {
        'Content-Type': 'application/json',
        ...opcoes.headers
    };

    if (token) {
        cabecalhos.Authorization = `Bearer ${token}`;
    }

    const resposta = await fetch(`${API_URL}${endpoint}`, {
        ...opcoes,
        headers: cabecalhos
    });

    const texto = await resposta.text();
    let dados = {};

    try {
        dados = texto ? JSON.parse(texto) : {};
    } catch {
        dados = { mensagem: texto };
    }

    if (!resposta.ok) {
        throw new Error(
            dados.erro ||
            dados.mensagem ||
            dados.message ||
            `Erro na API: ${resposta.status}`
        );
    }

    return dados;
}

/* LOGIN */

const formLogin = document.getElementById('formLogin');

if (formLogin) {
    formLogin.addEventListener('submit', async evento => {
        evento.preventDefault();

        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value;
        const mensagem = document.getElementById('mensagemLogin');
        const botao = formLogin.querySelector('button[type="submit"]');

        mensagem.textContent = '';
        botao.disabled = true;

        const textoOriginal = botao.textContent;
        botao.textContent = 'Entrando...';

        try {
            const dados = await requisicaoAPI('/usuario/login', {
                method: 'POST',
                body: JSON.stringify({ email, senha })
            });

            const usuario = dados.usuario || dados.user || dados;
            const token = dados.token || dados.accessToken || dados.access_token;

            const idUsuario = usuario.id ?? usuario.usuarioId;

            if (idUsuario == null || !Number.isInteger(Number(idUsuario))) {
                throw new Error(
                    'O login não retornou o ID do usuário. Confira a resposta da API.'
                );
            }

            localStorage.setItem(CHAVE_ID_USUARIO, String(idUsuario));
            localStorage.setItem(
                CHAVE_USUARIO,
                usuario.nome || usuario.name || 'Ana Silva'
            );

            if (token) {
                localStorage.setItem(CHAVE_TOKEN, token);
            }

            window.location.href = 'index.html';
        } catch (erro) {
            mensagem.textContent = erro.message;
        } finally {
            botao.disabled = false;
            botao.textContent = textoOriginal;
        }
    });
}

/* PÁGINA INICIAL */

const listaEventos = document.getElementById('listaEventos');

if (listaEventos) {
    let eventos = [];
    let idEmEdicao = null;

    const modal = document.getElementById('modalEvento');
    const formEvento = document.getElementById('formEvento');
    const campoMunicipio = document.getElementById('municipio');
    const campoTipo = document.getElementById('tipoEvento');
    const tituloModal = document.getElementById('tituloModal');

    const nomeSalvo =
        localStorage.getItem(CHAVE_USUARIO) || 'Ana Silva';

    document.getElementById('nomeUsuario').textContent = nomeSalvo;
    document.getElementById('avatarUsuario').textContent =
        nomeSalvo.trim().charAt(0).toUpperCase() || 'A';

    function normalizarEvento(evento) {
        return {
            ...evento,
            id: evento.id,
            municipio: evento.cidade ?? evento.municipio ?? '',
            tipo: evento.tipoEvento ?? evento.tipo ?? ''
        };
    }

    async function carregarEventos() {
        const tabela = document.querySelector('.tabela-container');
        const mensagemVazia = document.getElementById('mensagemVazia');

        listaEventos.innerHTML = `
            <tr>
                <td colspan="4">Carregando eventos...</td>
            </tr>
        `;

        try {
            const dados = await requisicaoAPI('/evento');

            const registros = Array.isArray(dados)
                ? dados
                : dados.eventos ?? dados.dados ?? dados.data;

            if (!Array.isArray(registros)) {
                throw new Error(
                    'A resposta da API não contém uma lista de eventos.'
                );
            }

            eventos = registros.map(normalizarEvento);
            renderizarEventos();
        } catch (erro) {
            listaEventos.innerHTML = `
                <tr>
                    <td colspan="4" class="erro-api">
                        ${escaparHTML(erro.message)}
                    </td>
                </tr>
            `;

            document.getElementById('totalEventos').textContent = '—';
            document.getElementById('totalMunicipios').textContent = '—';
            document.getElementById('contadorEventos').textContent =
                'Erro ao carregar';

            mensagemVazia.hidden = true;
            tabela.hidden = false;
        }
    }

    function renderizarEventos() {
        listaEventos.innerHTML = '';

        eventos.forEach(evento => {
            const linha = document.createElement('tr');

            linha.innerHTML = `
                <td>
                    <div class="municipio-celula">
                        <span class="icone-municipio">⌖</span>
                        <span>${escaparHTML(evento.municipio)}</span>
                    </div>
                </td>
                <td>
                    <span class="tipo-evento">
                        ${escaparHTML(evento.tipo)}
                    </span>
                </td>
                <td><span class="status">Cadastrado</span></td>
                <td>
                    <div class="acoes">
                        <button
                            type="button"
                            class="botao-acao"
                            data-acao="editar"
                            data-id="${escaparHTML(evento.id)}"
                            aria-label="Editar evento"
                            title="Editar"
                        >✎</button>
                        <button
                            type="button"
                            class="botao-acao botao-excluir"
                            data-acao="excluir"
                            data-id="${escaparHTML(evento.id)}"
                            aria-label="Excluir evento"
                            title="Excluir"
                        >⌫</button>
                    </div>
                </td>
            `;

            listaEventos.appendChild(linha);
        });

        document.getElementById('totalEventos').textContent = eventos.length;

        const municipios = new Set(
            eventos.map(evento =>
                evento.municipio.trim().toLowerCase()
            )
        );

        document.getElementById('totalMunicipios').textContent =
            municipios.size;

        document.getElementById('contadorEventos').textContent =
            `${String(eventos.length).padStart(2, '0')} ${
                eventos.length === 1 ? 'registro' : 'registros'
            }`;

        document.getElementById('mensagemVazia').hidden =
            eventos.length !== 0;

        document.querySelector('.tabela-container').hidden =
            eventos.length === 0;
    }

    function abrirModal(evento = null) {
        idEmEdicao = evento ? evento.id : null;

        tituloModal.textContent = evento
            ? 'Editar evento'
            : 'Adicionar evento';

        campoMunicipio.value = evento ? evento.municipio : '';
        campoTipo.value = evento ? evento.tipo : '';

        const campoTemperatura =
            document.getElementById('temperaturaMaxima');

        const campoImpacto =
            document.getElementById('nivelImpacto');

        if (campoTemperatura) {
            campoTemperatura.value =
                evento?.temperaturaMaxima ?? '';
        }

        if (campoImpacto) {
            campoImpacto.value = evento?.nivelImpacto ?? '';
        }

        modal.hidden = false;
        campoMunicipio.focus();
    }

    function fecharModal() {
        modal.hidden = true;
        formEvento.reset();
        idEmEdicao = null;
    }

    document.getElementById('botaoAdicionar').addEventListener(
        'click',
        () => abrirModal()
    );

    document.getElementById('fecharModal').addEventListener(
        'click',
        fecharModal
    );

    document.getElementById('cancelarModal').addEventListener(
        'click',
        fecharModal
    );

    modal.addEventListener('click', evento => {
        if (evento.target === modal) {
            fecharModal();
        }
    });

    document.addEventListener('keydown', evento => {
        if (evento.key === 'Escape' && !modal.hidden) {
            fecharModal();
        }
    });

    /* CADASTRAR E EDITAR */

    formEvento.addEventListener('submit', async evento => {
        evento.preventDefault();

        const municipio = campoMunicipio.value.trim();
        const tipo = campoTipo.value;

        const campoTemperatura =
            document.getElementById('temperaturaMaxima');

        const campoImpacto =
            document.getElementById('nivelImpacto');

        const botaoSalvar =
            formEvento.querySelector('button[type="submit"]');

        if (!municipio || !tipo) {
            alert('Preencha a cidade e o tipo do evento.');
            return;
        }

        const corpo = {
            cidade: municipio,
            tipoEvento: tipo
        };

        if (idEmEdicao === null) {
            const usuarioId =
                localStorage.getItem(CHAVE_ID_USUARIO);

            if (!usuarioId || !Number.isInteger(Number(usuarioId))) {
                alert('Não foi possível identificar o usuário. Faça login novamente.');
                return;
            }

            if (!campoTemperatura || !campoImpacto) {
                alert(
                    'O formulário precisa ter os campos de temperatura máxima e nível de impacto.'
                );
                return;
            }

            const temperaturaTexto = campoTemperatura.value.trim();
            const temperatura = Number(temperaturaTexto);
            const nivelImpacto = campoImpacto.value;

            if (
                temperaturaTexto === '' ||
                !Number.isFinite(temperatura)
            ) {
                alert('Informe uma temperatura máxima válida.');
                return;
            }

            if (!nivelImpacto) {
                alert('Selecione o nível de impacto.');
                return;
            }

            corpo.usuarioId = Number(usuarioId);
            corpo.temperaturaMaxima = temperatura;
            corpo.nivelImpacto = nivelImpacto;
        } else {
            if (campoTemperatura && campoTemperatura.value.trim() !== '') {
                corpo.temperaturaMaxima =
                    Number(campoTemperatura.value);

                if (!Number.isFinite(corpo.temperaturaMaxima)) {
                    alert('Informe uma temperatura válida.');
                    return;
                }
            }

            if (campoImpacto && campoImpacto.value) {
                corpo.nivelImpacto = campoImpacto.value;
            }
        }

        botaoSalvar.disabled = true;
        botaoSalvar.textContent = 'Salvando...';

        try {
            if (idEmEdicao !== null) {
                await requisicaoAPI(
                    `/evento/${encodeURIComponent(idEmEdicao)}`,
                    {
                        method: 'PUT',
                        body: JSON.stringify(corpo)
                    }
                );
            } else {
                await requisicaoAPI('/evento', {
                    method: 'POST',
                    body: JSON.stringify(corpo)
                });
            }

            fecharModal();
            await carregarEventos();
        } catch (erro) {
            alert(`Não foi possível salvar o evento: ${erro.message}`);
        } finally {
            botaoSalvar.disabled = false;
            botaoSalvar.textContent = 'Salvar evento';
        }
    });

    /* EDITAR E EXCLUIR */

    listaEventos.addEventListener('click', async evento => {
        const botao = evento.target.closest('button[data-acao]');

        if (!botao) {
            return;
        }

        const id = botao.dataset.id;
        const item = eventos.find(
            evento => String(evento.id) === String(id)
        );

        if (!item) {
            return;
        }

        if (botao.dataset.acao === 'editar') {
            abrirModal(item);
            return;
        }

        if (botao.dataset.acao === 'excluir') {
            const confirmado = window.confirm(
                `Deseja excluir o evento de ${item.municipio} (${item.tipo})?`
            );

            if (!confirmado) {
                return;
            }

            botao.disabled = true;

            try {
                await requisicaoAPI(
                    `/evento/${encodeURIComponent(id)}`,
                    { method: 'DELETE' }
                );

                await carregarEventos();
            } catch (erro) {
                alert(`Não foi possível excluir o evento: ${erro.message}`);
                botao.disabled = false;
            }
        }
    });

    /* SAIR */

    document.getElementById('botaoSair').addEventListener('click', () => {
        localStorage.removeItem(CHAVE_TOKEN);
        localStorage.removeItem(CHAVE_USUARIO);
        localStorage.removeItem(CHAVE_ID_USUARIO);

        window.location.href = 'login.html';
    });

    carregarEventos();
}
