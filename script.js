// Configuração do Prazo de Locação (7 dias em milissegundos)
const LOCACAO_DIAS = 7;
const TEMPO_LIMITE_MS = LOCACAO_DIAS * 24 * 60 * 60 * 1000;

// Captura o ID do cartucho na URL (Ex: ?id=sintel-project)
const urlParams = new URLSearchParams(window.location.search);
const cartuchoId = urlParams.get('id') || 'big-buck-bunny';

// Chave única no navegador baseada no ID do cartucho
const storageKey = `qrd_locacao_${cartuchoId}`;

// Função principal que busca o JSON e inicializa o player
async function carregarSistemaQRD() {
    try {
        // Faz a requisição para ler o arquivo catalogo.json
        const resposta = await fetch('catalogo.json');
        if (!resposta.ok) {
            throw new Error('Não foi possível carregar o catálogo de filmes.');
        }
        
        const catalogoQRD = await resposta.json();

        // Busca os dados do filme atual ou usa um padrão caso o ID não exista
        const filmeAtual = catalogoQRD[cartuchoId] || {
            titulo: "Cartucho Desconhecido",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        };

        // Atualiza a interface com os dados do filme
        document.getElementById('cartTitle').innerText = filmeAtual.titulo;
        document.getElementById('cartIdDisplay').innerText = `ID: ${cartuchoId}`;

        // Executa a lógica de locação e exibição
        iniciarLogicaLocacao(filmeAtual);

    } catch (erro) {
        console.error("Erro ao carregar o QRD:", erro);
        document.getElementById('cartTitle').innerText = "Erro no Sistema";
        document.getElementById('playerContainer').innerHTML = `
            <div class="expired-message">
                <h2>FALHA DE CARREGAMENTO</h2>
                <p>Não foi possível ler o banco de dados dos cartuchos.</p>
            </div>
        `;
    }
}

function iniciarLogicaLocacao(filmeAtual) {
    let dadosLocacao = localStorage.getItem(storageKey);

    if (!dadosLocacao) {
        const inicio = new Date().getTime();
        dadosLocacao = { inicio: inicio };
        localStorage.setItem(storageKey, JSON.stringify(dadosLocacao));
    } else {
        dadosLocacao = JSON.parse(dadosLocacao);
    }

    const inicioLocacao = dadosLocacao.inicio;
    const agora = new Date().getTime();
    const decorrido = agora - inicioLocacao;
    const restante = TEMPO_LIMITE_MS - decorrido;

    const playerContainer = document.getElementById('playerContainer');
    const statusBadge = document.getElementById('statusBadge');
    const locacaoStatus = document.getElementById('locacaoStatus');
    const timeRemainingEl = document.getElementById('timeRemaining');

    if (restante > 0) {
        statusBadge.innerText = "STATUS: ATIVO";
        statusBadge.classList.add('active');
        locacaoStatus.innerText = "Cartucho em uso (Locado)";

        playerContainer.innerHTML = `
            <video controls autoplay>
                <source src="${filmeAtual.videoUrl}" type="video/mp4">
                Seu navegador não suporta a tag de vídeo.
            </video>
        `;

        atualizarContador(restante);
        setInterval(() => {
            const tempoAtualizado = TEMPO_LIMITE_MS - (new Date().getTime() - inicioLocacao);
            if (tempoAtualizado > 0) {
                atualizarContador(tempoAtualizado);
            } else {
                location.reload();
            }
        }, 1000);

    } else {
        statusBadge.innerText = "STATUS: EXPIRADO";
        statusBadge.classList.remove('active');
        locacaoStatus.innerText = "Prazo de locação encerrado";
        timeRemainingEl.innerText = "0d 0h 0m 0s";

        playerContainer.innerHTML = `
            <div class="expired-message">
                <h2>LOCAÇÃO EXPIRADA</h2>
                <p>O prazo de ${LOCACAO_DIAS} dias deste cartucho QRD chegou ao fim.</p>
                <p>O estojo precisa ser 'devolvido' ou renovado.</p>
            </div>
        `;
    }
}

function atualizarContador(milissegundos) {
    const segundos = Math.floor((milissegundos / 1000) % 60);
    const minutos = Math.floor((milissegundos / (1000 * 60)) % 60);
    const horas = Math.floor((milissegundos / (1000 * 60 * 60)) % 24);
    const dias = Math.floor(milissegundos / (1000 * 60 * 60 * 24));

    document.getElementById('timeRemaining').innerText = 
        `${dias}d ${horas}h ${minutos}m ${segundos}s`;
}

function devolverCartucho() {
    if (confirm("Deseja realmente 'devolver' este cartucho QRD à prateleira? O histórico de acesso deste ciclo será encerrado.")) {
        localStorage.removeItem(storageKey);
        alert("Cartucho devolvido com sucesso! A prateleira está pronta para uma nova locação.");
        location.reload();
    }
}

// Inicializa o sistema buscando o JSON ao abrir a página
carregarSistemaQRD();
