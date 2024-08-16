$(document).ready(function(){
    cardapio.eventos.init();
})

var cardapio = {};

var MEU_CARRINHO = [];
var MEU_ENDERECO = null;

var CELULAR_EMPRESA = '5584991347327';

cardapio.eventos = {

    init: () => {
        cardapio.metodos.obterItensCardapio();
        cardapio.metodos.carregarBotaoLigar();
    }
}

cardapio.metodos = {

    //Obtendo listas de itens incluidas no cardápio
    obterItensCardapio: (categoria = 'burgers', mostrarmais = false) => {

        var filtro = MENU[categoria];
        console.log(filtro);

        if (!mostrarmais) {
            $("#itensCardapio").html('');
            $("#btnMostrarMais").removerClass('hidden')
        }

        $.each(filtro, (i, e) => {

            let temp = cardapio.templates.item.replace(/\${img}/g, e.img)
            .replace(/\${nome}/g, e.name)
            .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
            .replace(/\${id}/g, e.id)

            //Botão mostrar mais foi clicado (12 itens)
            if (mostrarmais && i >= 8 && i < 12){
                $("#itensCardapio").append(temp)
            }

            //Paginação inicial com (8 itens)
            if (!mostrarmais && i < 8){
                $("#itensCardapio").append(temp)
            }
        })

        //Remove o ativo
        $(".container-menu a").removeClass('active');

        //Seta para ativar o menu
        $("#menu-" + categoria).addClass('active')
    },

    
}