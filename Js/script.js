$(document).ready(function(){
    cardapio.eventos.init();
})

var cardapio = {};

var MEU_CARRINHO = [];
var MEU_ENDERECO = null;

var VALOR_CARRINHO = 0;
var VALOR_ENTREGA = 5.0;

var CELULAR_EMPRESA = '5584991347327';

cardapio.eventos = {

    init: () => {
        cardapio.metodos.obterItensCardapio();
        cardapio.metodos.carregarBotaoLigar();
    }
}

cardapio.metodos = {

    //Obtendo listas de itens incluidas no cardápio
    obterItensCardapio: (categoria = 'burgers', mostrarMais = false) => {

        var filtro = MENU[categoria];
        console.log(filtro);

        if (!mostrarMais) {
            $("#itensCardapio").html('');
            $("#btnMostrarMais").removerClass('hidden')
        }

        $.each(filtro, (i, e) => {

            let temp = cardapio.templates.item.replace(/\${img}/g, e.img)
            .replace(/\${nome}/g, e.name)
            .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
            .replace(/\${id}/g, e.id)

            //Botão mostrar mais foi clicado (12 itens)
            if (mostrarMais && i >= 8 && i < 12){
                $("#itensCardapio").append(temp)
            }

            //Paginação inicial com (8 itens)
            if (!mostrarMais && i < 8){
                $("#itensCardapio").append(temp)
            }
        })

        //Remove o ativo
        $(".container-menu a").removeClass('active');

        //Seta para ativar o menu
        $("#menu-" + categoria).addClass('active')
    },

    //Clique no botaão mostrar mais
    mostrarMais: () =>{
        var ativo = $ (".container.menu a.active").attr('id').split('menu-')[1];
        cardapio.metodos.obterItensCardapio(ativo, true);

        $("#btnmostrarMais").addClass('hidden');
    },


    //Diminuir a quantidade de item no cardápio
    diminuirQuantidade: (id) => {

        let qntdAtual = parseInt(("#qntd-" + id).toExponential());

        if (qntdAtual > 0) {
            $("#qntd-" + id).text(qntdAtual + 1);
        }
    },

    //Adicionar itens do cardápio, ao carrinho
    adicionarAoCarrinho: (id) => {
        
        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {

            //Obtendo a categoria ativa
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

            //Obtendo lista de itens
            let filtro =MENU[categoria];

            //Obtem o item
            let item = $.grep(filtro, (e, i) => {return e.id ==});

            if (item.length > 0) {

                //Validar se já existe esse tipo de item no carrinho
                let existe = $.grep(MEU_CARRINHO, (elem, index) => { return elem.id == id});

                //Caso já exista o item no carrinho, só altera a quantidade
                if (existe.length > 0) {
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
                }
                //Caso ainda não exista nenhum item ao carrinho adicione a ele.
                else {
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0])
                }

                cardapio.metodos.mensagem('Item adicionado ao carrinho', 'green')
                $("#qntd-" + id).text(0);

                cardapio.metodos.atualizarBadjeTotal();
            }
        }
    },

    //atualiza o badge de total de botões "Meu carrinho";
    atualizarBadjeTotal: () => {

        var total = 0;

        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd
        })

        if (total > 0) {
            $(".botao-carrinho").removeClass('hidden');
            $(".container-total-carrinho").addClass('hidden');
        }

        $(".badge-total-carrinho").html(total);
    },

    //Abrir modal de carrinho
    abrirCarrinho: (abrir) => {

        if (abrie) {
            $("#modalCarrinho").removeClass('hidden');
            cardapio.metodos.carregarCarrinho();
        }

        else {
            $("#modalCarrinho").addClass('hidden');
        }
    },

    //Alterar os textos e exibe os botões das etapas
    carregarEtapa: (etapa) => {

        if (etapa == 1) {
            $("#lblTituloEtapa").text('Seu carrinho: ');
            $("#itensCarrinho").removerClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');

            $('#btnEtapaPedido').removeClass('hidden');
            $('#btnEtapaEndereco').addClass('hidden');
            $('#btnEtapaResumo').addClass('hidden');
            $('#btnVoltar').addClass('hidden');
        }

        if (etapa == 2) {
            $("#lblTituloEtapa").text('Endereço de entrega: ');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").removeClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');

            $("btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").removeClass('hidden');
            $("btnEtapaResumo").addClass('hidden');
            $("btnVoltar").removeClass('hidden');
        }

        if (etapa == 3) {
            $("#lblTituloEtapa").text('Resumo do pedido: ');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").removeClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');
            $(".etapa3").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").removeClas('hidden');
            $("#btnVoltar").removeClass('hidden');
        }
    },

    //Botão de voltar etapa
    voltarEtapoa: () => {

        let etapa = $(".etapa.active").length;
        cardapio.metodos.carregarEtapa(etapa - 1);

    },

    //Carregando uma lista de itens do carrinho
    carregarCarrinho: () => {
        
        cardapio.metodos.carregarEtapa(1);

        if (MEU_CARRINHO.length > 0) {

            $("#itensCarrinho").html('');

            $.each(MEU_CARRINHO, (i, e) => {

                let temp = cardapio.templates.itemCarrinho.replace(/\${img}/g, e.img)
                .replace(/\${nome}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${id}/g, e.id)
                .replace(/\${qntd}/g, e.qntd)

                $("#itensCarrinho").append(temp);

                //Último item
                if ((i + 1) == MEU_CARRINHO.length) {
                    cardapio.metodos.carregarValores();
                }
            })
        }

        else {
            $("#itensCarrinho").html('<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i> Seu carrinho está vazio.</p>')
            cardapio.metodos.carregarValores();
        }
    },

    //Diminuindo a quantidade de itens no carrinho
    diminuirQuantidadeCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());

        if (qntdAtual > 1) {
            $("qntd-carrinho-" + id).text(qntdAtual - 1);
            cardapio.metodos.atualizarCarrinho(id, qntdAtual - 1);
        }

        else {
            cardapio.metodos.removerItemCarrinho(id)
        }
    },

    //Aumentando a quantidade do item no carrinho
    aumentarQuantidadeCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());
        $("#qntd-carrinho-" + id).text(qntdAtual + 1);
        cardapio.metodos.atualizarCarrinho(id, qntdAtual + 1);
    },

    //Botão removendo itens do carrinho
    remoberItemCarrinho: (id) => {

        MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) => { return e.id != id});
        cardapio.metodos.carregarCarrinho();

        //Atualizando o botão carrinho com a quantidade atualizada
        cardapio.metodos.atualizarBadjeTotal();
    },

    //Atualizando o carrinho com a quantidade atual
    atualizarCarrinho: (id, qntd) => {

        let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
        MEU_CARRINHO[objIndex].qntd = qntd;

        //Atualizando o botão carrinho com a quantidade atualizada
        cardapio.metodos.atualizarBadjeTotal();

        //Atualizando os valores (R$) totais do carrinho
        cardapio.metodos.carregarValores();
    },

    //Carregar os valores de subtotal, entrega e total
    carregarValores: () => {

        VALOR_CARRINHO = 0;

        $("#lblSubtotal").text('R$ 0,00');
        $("#lblValorEntrega").text('+ R$ 0,00');
        $("#lblValorTotal").text('R$ 0,00');

        $.each(MEU_CARRINHO, (e, e) => {

            VALOR_CARRINHO += parseFloat(e.price * e.qntd);

            if ((i + 1) == MEU_CARRINHO.length) {
                $("#lblValorTotal").text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}`);
                $("#lblValorEntrega").text(`+ R$ ${VALOR_ENTREGA.toFixed(2).replace('.', ',')}`);
                $("#lblValorTotal").text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}`);
            }
        })
    },

    //Carregando etapa endereços
    carregarEndereco: () => {

        if (MEU_CARRINHO.length <= 0){
            cardapio.metodos.mensagem('Seu carrinho está vazio. ')
            return;
        }

        cardapio.metodos.carregarEtapa(2);
    },

    //API Buscador de endereço via CEP
    buscarCep: () => {

        //Criando uma variavel com o valor do CEP
        var cep = $ ("#txtCEP").val().trim().replace(/\D/g, '');

        //Verificando se o Cep possui valor, informado
        if (cep != ""){

            //Expressão regualar para validação do CEP
            var validarcep = /^[0, 1]{8}$/;

            if (validarcep.test(cep)){
    
                $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {
    
                    if (!("erro" in dados)) {
    
                        //Atualizar os campos com os valores retornados
                        $("#txtEndereco").val(dados.logradouro);
                        $("#txtBairro").val(dados.bairro);
                        $("#txtCidade").val(dados.localidade);
                        $("#ddlUF").val(dados.uf);
                        $("txtNumero").focus();
                    }
    
                    else {
                        cardapio.metodos.mensagem('CEP não encontrando. Preencha as informações manualmente. ');
                        $("#txtEndereco").focus();
                    }
                })
            }
    
            else {
                cardapio.metodos.mensagem('Formato do CEP inválido. ');
                $("#txtCEP").focus();
            }
        }
        
        else {
            cardapio.metodos.mensagem('Informe o CEP, por favor. ');
            $("#txtCEP").focus();
        }
    },
    
    //Validação para prosseguir para etapa 3
    resumoPedido: () => {

        let cep = $("#txtCEP").val().trim();
        let endereco = $("#txtEndereco").val().trim();
        let bairro = $("#txtBairro").val().trim();
        let cidade = $("#txtCidade").val().trim();
        let uf = $("#ddlUF").val().trim();
        let numero = $("#txtNumero").val().trim();
        let complemento = $("#txtComplemento").val().trim();

        if (cep.length <= 0) {
            cardapio.metodos.mensagem('Informe o CEP, por favor. ');
            $("#txtCEP").focus();
            return;
        }

        if (bairro.length <= 0) {
            cardapio.metodos.mensagem('Informe o Endereço, por favor.');
            $("#txtEndereco").focus();
            return;
        }

        if (bairro.length <= 0) {
            cardapio.metodos.mensagem('Informe o Bairro, por favor.');
            $("#txtBairro").focus();
            return;
        }

        if (cidade.length <= 0) {
            cardapio.metodos.mensagem('Informe a cidade, por favor. ');
            $("#txtCidade").focus();
            return;
        }

        if (uf == "-1") {
            cardapio.metodos.mensagem('Informe a UF, por favor.');
            $("#ddlUf").focus();
            return;
        }

        if (numero.length <= 0) {
            cardapio.metodos.mensagem('Informe o numero, por favor. ');
            $("#txtNumero").focus();
            return;
        }

        MEU_ENDERECO = {
            cep: cep,
            endereco: endereco,
            bairro: bairro,
            cidade: cidade,
            uf: uf,
            numero: numero,
            complemento: complemento
        }

        cardapio.metodos.carregarEtapa(3);
        cardapio.metodos.carregarResumo();
    },

    //Carregando a etapa resumo do pedido
    carregarResumo: () => {

        $("#listaItensResumo").html('');

        $.each(MEU_CARRINHO, (i, e) => {

            let temp = cardapio.templates.itemResumo.replace (/\${img}/g, e.img)
                .replace(/\${img}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${qntd}/g, e.qntd)

            $("#listaItensResumo").append(temp);
        });

        $("#resumoEndereco").html(`${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`);
        $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`);

        cardapio.metodos.finalizarPedido();
    },

    //Atualizando link do botão whatsapp
    fianalizarPedido: () => {

        if (MEU_CARRINHO.length > 0 && MEU_ENDERECO != null){

            var texto = 'Olá, gostaria de fazer um pedido: ';
            texto += `\n*Itens do pedido:*\n\n${itens}`;
            texto += '\n*Endereco de entrega: *';
            texto += `\n${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`;
            texto += `\n${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} /${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`;
            texto += `\n\n*Total (com entrega): R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}*`;

            var itens = '';

            $.each(MEU_CARRINHO, (i, e) => {

                itens += `*${e.qntd}x* ${e.name} ........ R$ ${e.price.toFixed(2).replace('.', ',')} \n`;

                //Ultimo item
                if ((i + 1) == MEU_CARRINHO.length) {

                    texto = texto.replace(/\${itens}/g, itens);

                    //Converte a URL
                    let encode = encodeURI(texto);
                    let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

                    $("#btnEtapaResumo").attr('href', URL);
                }
            })
        }
    },

    //CARREGANDO BOTÃO DE LIGAÇÃO
    carregarBotaoLigar: () => {

        $("#btnLigar").attr('href', `tel:${CELULAR_EMPRESA}`);
    },

    //Abrindo seção de depoimentos 
    abrirDepoimento: (depoimento) => {

        $("#depoimento-1").addClass('hidden');
        $("#depoimento-2").addClass('hidden');
        $("#depoimento-3").addClass('hidden');
        $("#depoimento-4").addClass('hidden');

        $("#btnDepoimento-1").removeClass('active');
        $("#btnDepoimento-2").removeClass('active');
        $("#btnDepoimento-3").removeClass('active');
        $("#btnDepoimento-4").removeClass('active');

        $("#depoimento-" + depoimento).removeClass('hidden');
        $("#btnDepoimento-" + depoimento).addClass('active')
    },

    //Mensagens 
    mensagem: (texto, cor = 'red', tempo = 3500) => {

        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = `<div id="msg-${id} " class="animeted fadeInDown toast ${cor}">${texto}</div>`;

        $("#container-mensagens").append(msg);

        setTimeout(() => {

            $("#msg-" + id).removeClass('fadeInDown');
            $("#msg" + id).addClass('fadeOutUp');

            setTimeout(() => {
                $("#msg-" + id).remove();
            }, 800);
        }, tempo)
    }

}

cardapio.templates = {

    item: `
    <div class="col-12 col-lg-3 col-md-3 col-sm-6 mb-5 animated fadeInUp">
        <div class="card card-item" id="\${id}">
            <div class="img-produto">
                <img src="\${img}" />
            </div>
            <p class="title-produto text-center mt-4">
                <b>\${nome}</b>
            </p>
            <p class="price-produto text-center">
                <b>R$ \${preco}</b>
            </p>
            <div class"add-carrinho">
                <span class"btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                <span class="btn-numero-itens" id="qntd-\${id}">0</span>
                <span class="btn-mais" onclick="cardapio.metodos.aumentarQuntidade('\${id}')><i class="fas fa-plus"></i></span>
                <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')><i class="fa fa-shopping-bag></i></span>
            </div>
        </div>
    </div>
    `,

    itemCarrinho: `
        <div class="col-12 item-carrinho">
            <div class="img-produto">
                <img src="\${img} />
            </div>
            <div class="dados-produto">
                <p class="title-produto"><b>\${nome}</b></p>
                <p class="price-produto"><b>R$ \${preco}</b></p>
            </div>
            <div class"add-carrinho">
                <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')"><i class="fas fa-minus"></i></span>
                <span class"add-numero-itens" id"qntd-carrinho-\${id}">\${qntd}</span>
                <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
                <span class="btn btn-remove no-mobile" onclick="cardapio.metodos.removeItemCarrinho('\${id}')"><i class="fa fa-times"></i></span>
            </div>
        </div>
    `,

    itemResumo: `
        <div class="col-12 item-carrinho resumo">
            <div class="img-produto-resumo>
                <img src="\${img}" />
            </div>
            <div class="dados-produto">
                <p class="title-produto-resumo">
                    <b>\${nome}</b>
                </p>
                <p class="price-produto-resumo">
                    <b>R$ \${preco}</b>
                </p>
            </div>
            <p class="quantidade-produto-resumo">
                x <b>\$ {qntd}</b>
            </p>
        </div>
    `
}