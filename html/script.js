// The API key will be fetched securely from the backend
let Key = "cb73835bea1e37653162d1f091527478"; // Placeholder for the API key
async function fetchApiKey() {
    try {
        const response = await fetch('/getApiKey'); // Endpoint to fetch the API key
        const data = await response.json();
        Key = data.apiKey;
    } catch (error) {
        console.error("Erro ao buscar a chave da API:", error);
    }
}
fetchApiKey();

function colocarDadosNaTela(dados) {
    const cidadeElement = document.querySelector(".cidade");
    const temperaturaElement = document.querySelector(".temp");
    const descricaoElement = document.querySelector(".texto-previsao");
    const umidadeElement = document.querySelector(".umidade");
    const imgPrevisaoElement = document.querySelector(".img-previsao");

    if (!cidadeElement || !temperaturaElement || !descricaoElement || !umidadeElement || !imgPrevisaoElement) {
        console.error("Erro: Elementos do DOM não encontrados. Verifique os nomes das classes no HTML.");
        return;
    }

    if (dados.cod === "404") {
        cidadeElement.innerText = "Cidade não encontrada.";
        temperaturaElement.innerText = "";
        descricaoElement.innerText = "";
        umidadeElement.innerText = "";
        imgPrevisaoElement.src = ""; // Limpa a imagem
        return;
    }

    const cidade = dados.name;
    const temperatura = dados.main.temp;
    const descricao = (dados.weather && dados.weather.length > 0) ? dados.weather[0].description : "Descrição indisponível";
    const umidade = dados.main.humidity;
    const icone = dados.weather[0].icon; // Obtém o ícone do clima

    console.info(`Cidade: ${cidade}, Temperatura: ${temperatura}°C, Descrição: ${descricao}, Umidade: ${umidade}%`);

    cidadeElement.innerText = `Cidade: ${cidade}`;
    temperaturaElement.innerText = `${temperatura}°C`;
    descricaoElement.innerText = descricao;
    umidadeElement.innerText = `Umidade: ${umidade}%`;
    imgPrevisaoElement.src = `https://openweathermap.org/img/wn/${icone}@2x.png`; // Atualiza a imagem do clima
}

let intervaloImagens; // Variável para armazenar o intervalo de troca de imagens

function alterarImagemDeFundo() {
    const imagens = [
        'https://cdn.pixabay.com/photo/2016/02/10/21/59/landscape-1192669_1280.jpg',
        'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg',
        'https://cdn.pixabay.com/photo/2016/11/29/03/53/mountains-1867276_1280.jpg',
        'https://cdn.pixabay.com/photo/2015/03/26/09/54/sunset-690293_1280.jpg',
        'https://cdn.pixabay.com/photo/2014/02/27/16/10/sunset-276556_1280.jpg',
        'https://cdn.pixabay.com/photo/2013/10/02/23/03/mountains-190055_1280.jpg',
        'https://cdn.pixabay.com/photo/2016/03/09/09/17/sunrise-1246629_1280.jpg',
        'https://cdn.pixabay.com/photo/2015/09/18/20/20/sky-949712_1280.jpg'
    ]; // Lista de URLs das imagens de fundo

    let indiceAtual = 0;

    // Pré-carregar todas as imagens
    const imagensPrecarregadas = imagens.map((url) => {
        const img = new Image();
        img.src = url;
        return img;
    });

    // Inicia o intervalo para alternar as imagens
    intervaloImagens = setInterval(() => {
        document.body.style.backgroundImage = `url('${imagensPrecarregadas[indiceAtual].src}')`;
        indiceAtual = (indiceAtual + 1) % imagens.length; // Alterna para a próxima imagem
    }, 30000); // Troca a imagem a cada 30 segundos
}

async function buscarImagemDaCidade(cidade) {
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${cidade}&client_id=4ZNWl9Blus2FEUOUHfKdKfXQ9wVpvdY3CmOKEobqNDo&orientation=landscape`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            // Seleciona uma imagem aleatória entre os resultados
            const imagemAleatoria = data.results[Math.floor(Math.random() * data.results.length)].urls.full;

            // Para a troca automática de imagens
            clearInterval(intervaloImagens);

            // Define uma imagem de fallback enquanto a nova imagem carrega
            const img = new Image();
            img.src = imagemAleatoria;

            // Exibe a imagem de fundo somente após o carregamento
            img.onload = () => {
                document.body.style.backgroundImage = `url('${imagemAleatoria}')`;
            };

            // Define uma imagem de fallback temporária
            document.body.style.backgroundImage = `url('https://cdn.pixabay.com/photo/2016/02/10/21/59/landscape-1192669_1280.jpg')`;
        } else {
            console.warn("Nenhuma imagem encontrada para a cidade:", cidade);
        }
    } catch (error) {
        console.error("Erro ao buscar a imagem da cidade:", error);
    }
}

async function buscarCidade(cidade) {
    try {
        const resposta = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${Key}&lang=pt_br&units=metric`);
        const dados = await resposta.json();

        colocarDadosNaTela(dados);

        // Chama a função para buscar a imagem da cidade
        buscarImagemDaCidade(cidade);
    } catch (error) {
        console.error("Erro ao buscar os dados:", error);
        const cidadeElement = document.querySelector(".cidade");
        const temperaturaElement = document.querySelector(".temp");
        const descricaoElement = document.querySelector(".texto-previsao");
        const umidadeElement = document.querySelector(".umidade");
        const imgPrevisaoElement = document.querySelector(".img-previsao");

        if (!cidadeElement || !temperaturaElement || !descricaoElement || !umidadeElement || !imgPrevisaoElement) {
            console.error("Erro: Elementos do DOM não encontrados. Verifique os nomes das classes no HTML.");
            return;
        }

        cidadeElement.innerText = "Erro ao buscar os dados.";
        temperaturaElement.innerText = "";
        descricaoElement.innerText = "";
        umidadeElement.innerText = "";
        imgPrevisaoElement.src = ""; // Limpa a imagem
    }
}

const cidadeInput = document.querySelector(".input-cidade");

function cliqueiNoBotao() {
    const cidade = cidadeInput.value.trim();

    if (cidade === "") {
        const cidadeElement = document.querySelector(".cidade");
        const descricaoElement = document.querySelector(".texto-previsao");

        if (!cidadeElement || !descricaoElement) {
            console.error("Erro: Elementos do DOM não encontrados. Verifique os nomes das classes no HTML.");
            return;
        }

        cidadeElement.innerText = "Por favor, insira o nome de uma cidade.";
        descricaoElement.innerText = "";
        return;
    }

    buscarCidade(cidade);
}

// Inicia a troca automática de imagens ao carregar a página
alterarImagemDeFundo();