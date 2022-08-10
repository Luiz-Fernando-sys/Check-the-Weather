document.querySelector('.search').addEventListener('submit', async (event) => { //Indicamos que essa função não é ordenada, ou seja, ela é assíncrona.
    event.preventDefault(); //Prevenindo que o JavaScript pegue as informações do formulário e mande envie elas ao clicar no botão de 'Buscar'. Essa função basicamente tira as informações padrão do formulário 
    //Este comando acima, permite que quando o usuário digitar algo no input apertar para buscar, não iremos perder o que o usuário digitou.
    let input = document.querySelector('#research_field').value; //Pegando o valor que o usuário digitou no campo de input e guardando para dentro desta variável
    
    if(input !== '') {//Caso o usuário não tenha digitado nada mas tenha apertado para pesquisar, procederá as seguintes linhas abaixo
        clearResultArea(); //Chamando a função que limpa a tela. Ela basicamente limpa os dados, aparece o carregando, e depois exibe novamente a área com os dados.
        showWarningLoading(
            `<div class="loading">
                <div class="ball"></div>
                <div class="ball"></div>
                <div class="ball"></div>
                <div class="ball"></div>
                <div class="ball"></div>
            </div>`
        );

        // Através da linha abaixo, nós montamos a URL responsável por buscar os dados climáticos da cidade que o usuário solicitou.
        let requisition_result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(input)}&appid=3e785499edb309c15eea68b96f0fca73&units=metric&lang=pt_br`); //Usamos o encodeURI para que essa função encode corrija o nome da cidade que o usuário passar, pois este encodeURI é responsável por pegar as informações e tirar os espaços e substituir pelos caracteres especiais conforme tem que ser passado para uma URL. ||| Também foi adicionado alguns parâmetros na URL que são opcionais, porém foram adicionados, como por exemplo o units metric que converte a temporatura para graus, e o lang que faz a conversão para a linguagem português brasil.
        let result_in_json = await requisition_result.json(); //Comando responsável por transformar o resultado emum objeto do javascript. Ele transformará em JSON.

        if(result_in_json.cod === 200) { //Se o código da requisição que o OpenWeather retornar for 200, significa que ele achou a cidade.
            showInfo({ //Montamos o bjeto com as informações que queremos, que no já iremos puxar as informações diretamente do JSON retornado pelo Open Weather. Depois chamamos a função e passamos todos estes objetos para ela.
                name: result_in_json.name,
                country: result_in_json.sys.country,
                temp: result_in_json.main.temp,
                tempIcon: result_in_json.weather[0].icon,
                windSpeed: result_in_json.wind.speed,
                windAngle: result_in_json.wind.deg
            });
        } else { //Se ele não encontrar o cod 200, e for outro qualquer código, significa que ele não encontrou a cidade, então pedimos par ele exibir a mensagem dizendo que não encontrou a localização desta cidade.
            clearResultArea(); // Se o que a pessoa pesquisou não xistir, primeiramente ela limpará a tela
            showWarningLoading('Não encontramos esta localização.');
        }
    } else { //Caso o usuário não digitar nada e apertar para pesquisar, ele limpa a tela a área de resultados e não exibe nada, pois ele não fez pesquisa nenhuma.
        clearResultArea();
    }
});

function showInfo(object) {
    showWarningLoading(''); //Comando para tirar o "Carregando" após o usuário ter pesquisado uma cidade.

    //Substituindo as informações do HTML de acordo com a cidade escolhida
    document.querySelector('.title').innerHTML = `${object.name}, ${object.country}`;    
    document.querySelector('.tempInfo').innerHTML = `${object.temp} <sup>ºC</sup>`;
    document.querySelector('.ventoInfo').innerHTML = `${object.windSpeed} <span>km/h</span>`;
    document.querySelector('.temp img').setAttribute('src', `http://openweathermap.org/img/wn/${object.tempIcon}@2x.png`);    
    document.querySelector('.windDirection').style.transform = `rotate(${object.windAngle-90}deg)`; //movimentando a direção do vento e já compensando 90 graus 
    //Depois de preenchermos todos os dados, aí sim depois nós exibimos na tela a área já com os dados preenchidos.
    document.querySelector('.result_area').style.display = 'block';
}

function clearResultArea() { //Função responsável por limpar a tela.
    showWarningLoading(''); //Limpará o warning
    document.querySelector('.result_area').style.display = 'none'; //Ocultará a área que contém os resultados das buscas.
}

function showWarningLoading(msg) {
    document.querySelector('.warning_message').innerHTML = msg;
}