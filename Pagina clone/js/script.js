/*COORDENADAS ATUAL*/

latitudeAtual = "";

longitudeAtual = "";

$(document).ready(function () {

    geolocalizacao();

    menu();

    menuScrolling();

    ativarMenuCategorias();

    agruparAcoesProdutos();

    ativarMascaraInput();

    agruparAcoesCarrinho();

    agruparAcoesCliente();

    fixarMenu();

    menuScrollingPage();

    horarioFuncionamento();

    loadDetalheProdutosMarketplaceLink();

});

$(window).scroll(function () {

    fixarMenu();

    menuScrollingPage();

});

var EFI_SANDBOX_INPUT = false;

function menu() {

    $(".menu-principal .box-menu .botao-menu").click(function () {

        if ($(this).parent().hasClass("ativo")) {

            $(this).parent().removeClass("ativo");

        } else {

            $(this).parent().addClass("ativo");

        }

    });

}

function menuScrolling() {

    /*BANNER SCROLLER*/

    if ($(".carousel-banner .items").length > 0) {

        $(".carousel-banner .items").gScrollingCarousel();

    }

    /*MENU SCROLLER*/

    if ($(".carousel-menu .items").length > 0) {

        $(".carousel-menu .items").gScrollingCarousel();

    }

}

function menuScrollingPage() {

    var height_pagina = $(window).height();

    var position_start = parseInt(height_pagina / 2);

    var position_pagina = $(window).scrollTop();

    $(".widget-listagem-produtos .box-categoria-produto").each(function () {

        var position_box = $(this).offset().top;

        if (position_pagina >= parseInt(position_box - position_start)) {

            var position = $(this).index();

            $(".carousel-menu .items a.ativo").removeClass("ativo");

            $(".carousel-menu .items a:eq(" + position + ")").addClass("ativo");

            var posicao = 0;

            $(".carousel-menu .items a").each(function () {

                if (!$(this).hasClass("ativo")) {

                    posicao += $(this).width() + 55;

                } else {

                    return false;

                }

            });

            $(".carousel-menu .items").scrollLeft(posicao);

        }

    });
}


function fixarMenu() {

    if ($(".widget-listagem-produtos").length > 0) {

        var posicaoPagina = parseInt($(window).scrollTop());

        var posicaoCategorias = parseInt($(".widget-listagem-produtos").offset().top);

        if ($("body").hasClass("bodyBanner")) {

            if ($("body").hasClass("ocultarBanner")) {

                var adicional = 155;

            } else {

                var adicional = 255;

            }

        } else {

            var adicional = 155;

        }

        if ($("main").is(":visible") && posicaoPagina >= (posicaoCategorias - adicional)) {

            if (!$(".widget-categorias").hasClass("fixar-categorias")) {

                $(".widget-categorias").addClass("fixar-categorias");

                $(".menu-principal .navbar-brand").addClass("menu-fixed");

            }

            if ($("body").hasClass("bodyBanner") && !$("body").hasClass("ocultarBanner")) {

                $("body").addClass("ocultarBanner");

            }

        } else if (
            $("main").is(":hidden") &&
            $(".box-conteudo-produtos").length > 0 &&
            $(".box-conteudo-produtos").is(":visible") &&
            posicaoPagina >= 300
        ) {

            if ($("body").hasClass("bodyBanner") && !$("body").hasClass("ocultarBanner")) {

                $("body").addClass("ocultarBanner");

            }

        } else {

            $(".widget-categorias.fixar-categorias").removeClass("fixar-categorias");

            $(".menu-principal .navbar-brand").removeClass("menu-fixed");

            $("body.ocultarBanner").removeClass("ocultarBanner");

        }

    } else {

        var posicaoPagina = parseInt($(window).scrollTop());

        if (posicaoPagina >= 300) {

            if ($("body").hasClass("bodyBanner") && !$("body").hasClass("ocultarBanner")) {

                $("body").addClass("ocultarBanner");

            }

        } else {

            $("body.ocultarBanner").removeClass("ocultarBanner");

        }

    }

}


function ativarMenuCategorias() {
    /*MENU ATIVO CATEGORIA*/

    $(".menu-categorias .items a").click(function (evt) {

        evt.stopImmediatePropagation();

        var valor = $(this).attr("href");

        $(".menu-categorias .items a.ativo").not($(this)).removeClass("ativo");

        if (!$(this).hasClass("ativo")) {

            $(this).addClass("ativo");

        }

        var position_box = $(".widget-listagem-produtos .box-categoria-produto" + valor).offset().top;

        $('html, body').animate({
            scrollTop: position_box - 140
        }, 500);

        return false;

    });

}

function agruparAcoesProdutos() {

    loadDetalheProdutos();

    buscarProdutos();

    acaoOpcoesproduto();

    acaoOpcoesprodutoCheckbox();

    acaoAdicional();

    addCarrinho();

}

function loadDetalheProdutos() {

    $(".widget-listagem-produtos .box-produto, .carousel-banner .items a").click(function () {

        var id_prato = $(this).attr("id_prato");

        $("main").fadeOut(
            "fast",
            function () {

                $(".box-busca").hide();

                $(".box-conteudo-produtos").html('<div class="loading-detalhe"></div>').fadeIn("fast");

            }

        );

        $("body").scrollTop(0);

        $.post(
            "pg/detalhes-produto.php",
            { idProduto: id_prato },
            function (response, status) {

                if (status == "success") {

                    $(".box-conteudo-produtos").html(response);

                    $("body").scrollTop(0);

                } else {

                    $("main").show();

                    $(".box-busca").show();

                }

            }
        );

        return false;

    });

    /*VOLTAR PARA INICIAL - SAIR DE DETALHE DE PRODUTOS*/

    $(".box-conteudo-produtos").on("click", ".menu-secundario a", function () {

        $(".box-conteudo-produtos").fadeOut(

            function () {

                $(".box-conteudo-produtos").html("");

                $("main").fadeIn();

                $(".box-busca").show();

            }

        );

        return false;

    });

}

function loadDetalheProdutosMarketplaceLink() {


    const idPrato = getURLParameter('idPrato');

    if (!idPrato) {
        return;
    }

    console.log(idPrato);

    var id_prato = idPrato;

    $("main").fadeOut(
        "fast",
        function () {

            $(".box-busca").hide();

            $(".box-conteudo-produtos").html('<div class="loading-detalhe"></div>').fadeIn("fast");

        }

    );

    $("body").scrollTop(0);

    $.post(
        "pg/detalhes-produto.php",
        { idProduto: id_prato },
        function (response, status) {

            if (status == "success") {

                $(".box-conteudo-produtos").html(response);

                $("body").scrollTop(0);

            } else {

                $("main").show();

                $(".box-busca").show();

            }

        }
    );

    /*VOLTAR PARA INICIAL - SAIR DE DETALHE DE PRODUTOS*/

    $(".box-conteudo-produtos").on("click", ".menu-secundario a", function () {

        $(".box-conteudo-produtos").fadeOut(

            function () {

                $(".box-conteudo-produtos").html("");

                $("main").fadeIn();

                $(".box-busca").show();

            }

        );

        return false;

    });

}

function buscarProdutos() {

    $(".header-site .box-busca a").click(function () {

        var box = $(this).parent();

        if (!box.hasClass("ativo")) {

            box.addClass("ativo");

            $(this).html('<i class="fa fa-close" aria-hidden="true"></i>');

            $(this).parent().find("input[name='busca']").focus();

        } else {

            box.removeClass("ativo");

            box.find("input").val("");

            $(this).html('<i class="fa fa-search" aria-hidden="true"></i>');

            $(".widget-listagem-produtos .box-categoria-produto").show();

            $(".widget-listagem-produtos .box-categoria-produto a").show();

        }

    });

    $(".header-site .box-busca input[name='busca']").keyup(function () {

        var busca = removeAcento($(this).val());

        if (busca.length > 2) {

            $(".widget-listagem-produtos .box-categoria-produto").hide();

            $(".widget-listagem-produtos .box-categoria-produto a").hide();

            $(".widget-listagem-produtos .box-categoria-produto a").each(function () {

                var nome = removeAcento($(this).text());

                if (nome.indexOf(busca) !== -1) {

                    $(this).show();

                    $(this).parents(".box-categoria-produto").show();

                    var position_box = $(".widget-listagem-produtos").offset().top;

                    $('html, body').scrollTop(position_box - 110);

                }

            });

        } else {

            $(".widget-listagem-produtos .box-categoria-produto").show();

            $(".widget-listagem-produtos .box-categoria-produto a").show();

        }
    });

}

function acaoOpcoesproduto() {

    /*LISTA SELEÇÃO*/

    $(".box-conteudo-produtos").on("click", "form[name='addCarrinho'] .lista-de-opcoes .opcoes", function () {

        if ($(this).find("input[type='radio']").length > 0 || $(this).find("input[type='checkbox']").length > 0) {

            if ($(this).find("input[type='radio']").length > 0) {/*OPÇÃO TYPE RADIO*/

                $(this).find("input[type='radio']").prop("checked", true);

                if (!$(this).parents('.box-opcoes').find('span').hasClass("ativo")) {

                    $(this).parents('.box-opcoes').find('span').addClass("ativo");

                    $(this).parents('.box-opcoes').find('span').html("<i class='fa fa-check'></i>");

                }

                $(this).parents(".box-opcoes.erro").removeClass("erro");


                /*ROLAR PARA O PRÓXIMO GRUPO*/

                var position_box = $(this).parents('.row').next($('.row')).find('.box-opcoes').offset().top;

                setTimeout(
                    function () {

                        topElementoPagina(position_box);

                    }, 500
                );

            } else if ($(this).find("input[type='checkbox']").length > 0) { /*OPÇÃO TYPE CHECKBOX*/


                var obrigatorio = false;

                if ($(this).parents(".lista-de-opcoes").hasClass("obrigatorio")) {

                    var obrigatorio = true;
                }

                var limite = $(this).parents(".lista-de-opcoes").attr("limite");


                if ($(this).find("input[type='checkbox']").is(":checked")) {

                    $(this).find("input[type='checkbox']").prop("checked", false);

                    var selecionados = $(this).parents(".lista-de-opcoes").find("input[type='checkbox']:checked").length;

                    if (obrigatorio == true && selecionados == 0) {

                        $(this).parents(".box-opcoes").children(".titulo").children("h5").find("span.badge").removeClass("ativo");

                        $(this).parents(".box-opcoes").children(".titulo").children("h5").find("span.badge").html("Obrigatório");
                    }

                    $(this).parents(".box-opcoes.erro").removeClass("erro");

                    $(this).parents(".box-opcoes.erroLimite").removeClass("erroLimite");

                } else {

                    var selecionados = $(this).parents(".lista-de-opcoes").find("input[type='checkbox']:checked").length;

                    if (limite != "" && limite == selecionados) {

                        $(this).parents(".box-opcoes").addClass("erro").addClass("erroLimite");

                    } else {

                        $(this).find("input[type='checkbox']").prop("checked", true);

                        if (!$(this).parents('.box-opcoes').find('span').hasClass("ativo")) {

                            $(this).parents('.box-opcoes').find('span').addClass("ativo");

                            $(this).parents('.box-opcoes').find('span').html("<i class='fa fa-check'></i>");

                        }

                        $(this).parents(".box-opcoes.erro").removeClass("erro");

                        $(this).parents(".box-opcoes.erroLimite").removeClass("erroLimite");

                    }

                }

            }


            calculoValorprodutoAdd();

        }

    });


}

function acaoOpcoesprodutoCheckbox() {

    $(".box-conteudo-produtos").on("change", "form[name='addCarrinho'] .lista-de-opcoes .opcoes input[type='checkbox']", function () {

        $(this).parents(".opcoes").click();

    });

}

function ativarMascaraInput() {

    $("input.numero").mask('000', { reverse: true });

    $("input.valor").mask('000.000.000.000,00', { reverse: true });

    $('input.telefone').mask('(00) 00000-0000', { clearIfNotMatch: true });

    $("input.cep").mask('00.000-000', { clearIfNotMatch: true });

    $("input.data").mask('00/00/0000', { clearIfNotMatch: true });


    $("input.numero-cartao").mask('0000 0000 0000 0000', { clearIfNotMatch: true });

    $("input.validade").mask('00/0000', { clearIfNotMatch: true });

    $("input.cpf").mask('000.000.000-00', { clearIfNotMatch: true });

    $("input.cvv").mask('000', { reverse: true });

}

function acaoAdicional() {

    /*ADICIONAL ITEM - DETALHE*/

    $(".box-conteudo-produtos").on("click", "form[name='addCarrinho'] .lista-de-opcoes .opcoes button.item-adicional", function () {

        var limite = $(this).parents(".lista-de-opcoes").attr("limite");

        var minimo = $(this).parents(".lista-de-opcoes").attr("minimo");

        var box_lista_opcoes = $(this).parents(".lista-de-opcoes.adicional:not('.item-principal')").find("input[type='text']");

        var quantidadeTotal = 0;

        box_lista_opcoes.each(function () {

            quantidadeTotal = quantidadeTotal + parseInt($(this).val());

        });

        var valor = $(this).parents('.opcoes').find('input[type="text"]').val();

        if (valor == "") {

            valor = 0;

        }

        if ($(this).hasClass("remove") && valor > 0) {

            valor = parseInt(valor) - 1;

            $(this).parents('.box-opcoes').removeClass("erro").removeClass("erroLimite");

            if ($(this).parents('.box-opcoes').find('.titulo').find('span').hasClass("ativo")) {

                $(this).parents('.box-opcoes').find('.titulo').find('span').removeClass("ativo");

            }

            if (limite > 0) {

                if (limite == '1') {

                    var textoLimite = "Escolha " + limite + " item";

                } else if (limite > 0) {

                    if (minimo > 0 && minimo < limite) {

                        var texto = "Selecione de " + minimo + " a " + limite + " itens";

                    } else if (minimo > 0 && minimo == limite) {

                        var texto = "Selecione " + limite + " itens";

                    } else {

                        var texto = "Selecione até " + limite + " itens";

                    }

                }

                $(this).parents('.box-opcoes').find('.titulo').find('span').html(texto);

            }

        } else if ($(this).hasClass("add")) {

            if (limite == 0 || limite > 0 && (quantidadeTotal + 1) <= limite) {

                valor = parseInt(valor) + 1;

                if (limite > 0 && (quantidadeTotal + 1) == limite) {

                    if (!$(this).parents('.box-opcoes').find('.titulo').find('span').hasClass("ativo")) {

                        $(this).parents('.box-opcoes').find('.titulo').find('span').addClass("ativo");

                    }

                    $(this).parents('.box-opcoes').find('.titulo').find('span').html("<i class='fa fa-check'></i>");

                }

            } else if (limite > 0 && (quantidadeTotal + 1) > limite) {

                if (!$(this).parents('.box-opcoes').hasClass("erro")) {

                    $(this).parents('.box-opcoes').addClass("erro").addClass("erroLimite");

                }

            }

        }

        $(this).parents('.opcoes').find('input[type="text"]').val(valor);

        calculoValorprodutoAdd();

        return false;

    });



    /*ADICIONAL PRODUTO - DETALHE*/
    $(".box-conteudo-produtos").on("click", "form[name='addCarrinho'] .box-add-carrinho a.item-adicional", function () {

        var valor = $("form[name='addCarrinho'] .box-add-carrinho .display-quantidade span").text();

        if (valor == "" || valor == "0") {

            valor = 1;

        }

        if ($(this).hasClass("remove") && valor > 1) {

            valor = parseInt(valor) - 1;

        } else if ($(this).hasClass("add")) {

            valor = parseInt(valor) + 1;

        }

        $("form[name='addCarrinho'] .box-add-carrinho .display-quantidade span").text(valor);

        calculoValorprodutoAdd();

    });

}

function calculoValorprodutoAdd() {

    var erro = false;

    var valorTotal = 0;
    var valorMaior = 0;

    /*VALOR DO PRODUTO*/

    if ($("form[name='addCarrinho'] .lista-de-opcoes.obrigatorio.item-principal input[type='radio']:checked").length > 0) {

        var valorProduto = $("form[name='addCarrinho'] .lista-de-opcoes.obrigatorio.item-principal input[type='radio']:checked").val();

    } else {

        erro = true;

    }

    if (erro == false) {

        /*ADICIONAIS*/

        var valorAdicional = 0;

        /*ARMAZENDA VARIAVEL DE 2 METADES PARA ADICIONAR MAIOR VALOR*/

        var valorMetade1 = 0;

        var valorMetade2 = 0;

        $("form[name='addCarrinho'] .lista-de-opcoes.adicional:not('.item-principal') input[type='radio']:checked, form[name='addCarrinho'] .lista-de-opcoes.adicional:not('.item-principal') input[type='checkbox']:checked, form[name='addCarrinho'] .lista-de-opcoes.adicional:not('.item-principal') input[type='text']").each(function () {


            if ($(this).attr("type") == "radio" || $(this).attr("type") == "checkbox") {

                if ($(this).parents(".lista-de-opcoes").hasClass("preco-meio-ativo")) {

                    if (valorMetade1 == 0) {

                        valorMetade1 = $(this).val();

                    } else if (valorMetade1 > 0 && valorMetade2 == 0) {

                        valorMetade2 = $(this).val();

                    }

                } else {

                    var valor = $(this).val();

                }

            } else {

                if ($(".lista-de-opcoes.adicional:not('.item-principal')").hasClass('pizza-item')) {
                    if ($(".lista-de-opcoes.adicional:not('.item-principal').pizza-item").attr('pizza_calc_type') == 1) {
                        $("form[name='addCarrinho'] .lista-de-opcoes.adicional:not('.item-principal') input[type='radio']:checked, form[name='addCarrinho'] .lista-de-opcoes.adicional:not('.item-principal') input[type='checkbox']:checked, form[name='addCarrinho'] .lista-de-opcoes.adicional:not('.item-principal') input[type='text']").each(function () {
                            var quantidade_item = parseInt($("form[name='addCarrinho'] .box-add-carrinho .display-quantidade span").text());
                            if ($(this).attr("valor") > valorMaior && $(this).val() > 0 && $(this).attr('pizza-sabor') == 1) {
                                valorMaior = $(this).attr("valor");
                            }
                        });

                        var valor = valorMaior;//$(this).attr("valor");
                    } else {
                        var valor = $(this).attr("valor");
                    }
                } else {
                    var valor = $(this).attr("valor");
                }

            }


            if (typeof valor !== typeof undefined && valor > 0) {

                if ($(this).attr("type") == "text") {

                    if ($(this).val() > 0) {

                        if ($(this).attr('pizza-sabor') == 1) {
                            var valor3 = valor;
                        } else {
                            var valor3 = $(this).attr('valor');
                        }

                        valor3 = valor3 * $(this).val();

                        valorAdicional = valorAdicional + parseFloat(valor3);

                    }

                } else {

                    valorAdicional = valorAdicional + parseFloat(valor);
                }

            }

        });

        if (valorMetade1 > 0 && valorMetade2 == 0) {

            valorAdicional = valorAdicional + parseFloat(valorMetade1);

        } else if (valorMetade2 > 0 && valorMetade1 == 0) {

            valorAdicional = valorAdicional + parseFloat(valorMetade2);

        } else if (valorMetade1 > 0 && valorMetade2 > 0) {

            valorAdicional = valorAdicional + (Math.max(valorMetade1, valorMetade2) * 2);

        }



        valorTotal = parseFloat(valorProduto) + valorAdicional;


        var quantidade_item = parseInt($("form[name='addCarrinho'] .box-add-carrinho .display-quantidade span").text());

        if (quantidade_item > 1) {

            valorTotal = (valorTotal * quantidade_item).toFixed(2);

        } else {

            valorTotal = (valorTotal).toFixed(2);

        }

        valorTotalView = mascaraValorReal(valorTotal);

        $("form[name='addCarrinho'] .box-add-carrinho a.selecione").addClass("btn-add-produto").removeClass("selecione");

        $("form[name='addCarrinho'] .box-add-carrinho a.btn-add-produto").attr("valor", valorTotal).html("<span>Adicionar</span> <span>" + valorTotalView + "</span>");

    } else {

        $("form[name='addCarrinho'] .lista-de-opcoes.obrigatorio.item-principal").parents(".box-opcoes").addClass("erro");

        var position_box = $("form[name='addCarrinho'] .lista-de-opcoes.obrigatorio.item-principal").parents(".box-opcoes").offset().top;

        topElementoPagina(position_box);

    }

}

function mascaraValorReal(valor) {
    valor = valor.toString().replace(/\D/g, "");
    valor = valor.toString().replace(/(\d)(\d{8})$/, "$1.$2");
    valor = valor.toString().replace(/(\d)(\d{5})$/, "$1.$2");
    valor = valor.toString().replace(/(\d)(\d{2})$/, "$1,$2");
    return "R$ " + valor
}

function removermascaraValor(valor) {
    valor = valor.toString().replace(/\D/g, "");
    valor = valor.toString().replace(/(\d)(\d{8})$/, "$1$2");
    valor = valor.toString().replace(/(\d)(\d{5})$/, "$1$2");
    valor = valor.toString().replace(/(\d)(\d{2})$/, "$1.$2");
    return valor
}

/*VALIDAR CARRINHO*/

function validarProdutoAddCarrinho() {

    var erro = false;

    $("form[name='addCarrinho'] .lista-de-opcoes.obrigatorio").each(function () {

        var tipo = $(this).find("input").attr("type");

        if (tipo == "text") {

            var erroinputText = 0;

            var totalInputsText = $(this).find("input").length;

            var minimo = $(this).attr("minimo");

            var quantidadeSelecionada = 0;

            $(this).find("input").each(function () {

                if ($(this).val() == "" || $(this).val() != "" && $(this).val() == "0") {

                    erroinputText++;

                } else {

                    quantidadeSelecionada += parseInt($(this).val());

                }

            });

            if (
                (erroinputText == totalInputsText) ||
                (typeof minimo !== typeof undefined && minimo > 0 && minimo > quantidadeSelecionada)
            ) {

                erro = true;

                var obj = $(this);

                obj.parents(".box-opcoes").addClass("erro");

                var position_box = obj.parents(".box-opcoes").offset().top;

                topElementoPagina(position_box);

                /*LIMPAR ALERTA ERRO*/

                setTimeout(
                    function () {

                        obj.parents(".box-opcoes.erro").removeClass("erro");

                    }, 2000
                )

                return false;
            }

        } else {

            if ($(this).find("input:checked").length == '0') {

                erro = true;

                var obj = $(this);

                obj.parents(".box-opcoes").addClass("erro");

                var position_box = obj.parents(".box-opcoes").offset().top;

                topElementoPagina(position_box);

                /*LIMPAR ALERTA ERRO*/

                setTimeout(
                    function () {

                        obj.parents(".box-opcoes.erro").removeClass("erro");

                    }, 2000
                )

                return false;

            }

        }

    });

    if (erro == false) {

        return true;

    } else {

        return false;

    }

}

function topElementoPagina(position_box) {

    $('html, body').animate({
        scrollTop: position_box - 140
    }, 500);

}

/*ADICIONAR ITEM AO CARRINHO*/

function addCarrinho() {

    $(".box-conteudo-produtos").on("click", "form[name='addCarrinho'] .box-add-carrinho a.btn-add-produto:not('.adicionando')", function () {

        var obj = $(this);

        obj.addClass("adicionando");

        if (validarProdutoAddCarrinho() == true) {

            var id_prato = $(this).attr("id_prato");

            var verificar_preco = $("form[name='addCarrinho'] .lista-de-opcoes.obrigatorio.item-principal input:checked").attr("id_item");

            if (typeof verificar_preco !== typeof undefined) {

                var preco = verificar_preco;

            } else {

                var preco = "";

            }

            var quantidade = $(this).parents(".box-add-carrinho").find('.display-quantidade').text();

            var ingredientes = "";

            var adicionais = "";

            var metade1 = "";

            var valorMetade1 = 0;

            var metade2 = "";

            var valorMetade2 = 0;

            $("form[name='addCarrinho'] .lista-de-opcoes.adicional:not('.item-principal') input[type='radio']:checked, form[name='addCarrinho'] .lista-de-opcoes.adicional:not('.item-principal') input[type='checkbox']:checked, form[name='addCarrinho'] .lista-de-opcoes.adicional:not('.item-principal') input[type='text'].item-grupo").each(function () {

                var nome = $(this).attr("name");

                var id = $(this).attr("id_item");

                if ($(this).parents(".lista-de-opcoes").hasClass("preco-meio-ativo")) {

                    var valor = $(this).val();

                    if ($(this).hasClass("item-grupo")) {

                        var qtd_item_grupo = $(this).val();

                    } else {

                        var qtd_item_grupo = 1;


                    }

                    if (metade1 == "") {

                        metade1 = nome + "%:%" + id + "%:%" + qtd_item_grupo;

                        valorMetade1 = valor;

                    } else if (metade1 != "" && metade2 == "") {

                        metade2 = nome + "%:%" + id + "%:%" + qtd_item_grupo;

                        valorMetade2 = valor;

                    }

                } else {

                    if ($(this).hasClass("item-grupo")) {

                        var qtd_item_grupo = $(this).val();

                    } else {

                        var qtd_item_grupo = 1;


                    }

                    if (($(this).hasClass("item-grupo") && $(this).val() > 0) || (!$(this).hasClass("item-grupo"))) {

                        adicionais += nome + "%:%" + id + "%:%" + qtd_item_grupo + "%:%valornormal%,%";

                    }

                }

            });

            if (metade1 != "" && metade2 != "") {

                if (parseFloat(valorMetade1) > parseFloat(valorMetade2)) {

                    adicionais += metade1 + "%:%maior%,%";

                    adicionais += metade2 + "%:%menor%,%";

                } else {

                    adicionais += metade1 + "%:%menor%,%";

                    adicionais += metade2 + "%:%maior%,%";

                }

            }

            adicionais = adicionais.substring(0, (adicionais.length - 3));

            $("form[name='addCarrinho'] .lista-de-opcoes.adicional:not('.item-principal') input[type='text']:not('.item-grupo')").each(function () {

                if ($(this).val() > 0) {

                    var valor = $(this).val();

                    var id = $(this).attr("id_item");

                    ingredientes += valor + "%:%" + id + "%,%";

                }

            });

            ingredientes = ingredientes.substring(0, (ingredientes.length - 3));

            var observacao = $("form[name='addCarrinho']  textarea#observacao").val();

            $.post(
                SITE_URL_BASE + "/php/addCarrinho.php",
                {
                    id_prato: id_prato,
                    preco: preco,
                    quantidade: quantidade,
                    adicionais: adicionais,
                    ingredientes: ingredientes,
                    observacao: observacao,
                    action: "addCarrinho"
                }, function (response) {

                    if (response.erro) {

                        obj.parents(".box-add-carrinho").prepend("<div class='alerta bg-danger'><span class='fa fa-exclamation-circle icon-alerta'></span>Não foi possível adicionar o item.</div>");

                        obj.parents(".box-add-carrinho").find(".alerta").fadeIn();

                        setTimeout(
                            function () {

                                obj.parents(".box-add-carrinho").find(".alerta").fadeOut(

                                    function () {

                                        obj.parents(".box-add-carrinho").find(".alerta").remove();

                                    }

                                );

                                obj.removeClass("adicionando");

                            }, 3000
                        );

                    } else if (response.salvo) {

                        obj.parents(".box-add-carrinho").prepend("<div class='alerta bg-success text-white'><span class='fa fa-check-circle icon-alerta'></span> Item adicionado com sucesso!</div>");

                        obj.parents(".box-add-carrinho").find(".alerta").fadeIn();

                        $(".box-add-carrinho .quantidade-total").html(response.quantidadeTotal);

                        $(".box-add-carrinho .valor-total").html(response.valorTotal);

                        setTimeout(
                            function () {

                                $(".menu-secundario a").click();

                            }, 1000
                        );

                    }

                }, "json"

            );

        } else {

            obj.removeClass("adicionando");

        }

    });

}



function agruparAcoesCarrinho() {

    acaoOpcoesCarrinho();

    validarTrocoCarrinho();

    validarPagamentoOnLine();

    //validarTelefone();

    aplicarCupom();

    atualizarCarrinho();

    finalizarPedido();

    aplicarCupomFidelidade();

    bandeiraCartao();

    selecionarCartao();

}

$("#close-modal-retirada").on("click", function (e) {

    $('.lista-de-opcoes .entrega').trigger('click');
});


function acaoOpcoesCarrinho() {

    /*LISTA SELEÇÃO*/

    $("#carrinho").on("click", ".lista-de-opcoes .opcoes", function (e) {

        if (e.target.id == "") {

            if ($(this).find("input[type='radio']").length > 0) {

                if ($(this).find("input[type='radio']").length > 0) {/*OPÇÃO TYPE RADIO*/

                    $(this).find("input[type='radio']").prop("checked", true);

                    if ($(this).find("input[type='radio']").attr("name") == "tipoRetirada" && $(this).find("input[type='radio']").val() == 1) {

                        //$('#box-retirada').addClass('ativo');
                        //$('#modal-retirada').addClass('ativo');

                        $("#box-retirada").addClass("ativo");
                        $("#box-retirada").show();

                        var modal = $("#box-retirada");

                        setTimeout(

                            function () {

                                modal.find("#modal-retirada").addClass("ativo");

                            }, 500

                        );

                        if ($("#carrinho .lista-de-opcoes .opcoes.form-cliente input[name='idEndereco']").length > 0) {

                            $("#carrinho .lista-de-opcoes .opcoes.form-cliente").parents(".box-opcoes:not('.desabilitar')").addClass("desabilitar");

                            if ($("#carrinho .lista-de-opcoes .opcoes.form-cliente input[name='idEndereco']:checked").length > 0) {

                                $("#carrinho .lista-de-opcoes .opcoes.form-cliente input[name='idEndereco']:checked").prop("checked", false);

                            }

                        }

                    } else {

                        if ($(this).find("input[type='radio']").attr("name") == "tipoRetirada" && $(this).find("input[type='radio']").val() == 0) {

                            $("#carrinho .box-opcoes.desabilitar").removeClass("desabilitar");

                        }

                    }

                }

                if ($(this).find("input[type='hidden'][name='troco']").length > 0) {/*ATIVAR TROCO*/

                    $(this).find("input[type='hidden'][name='troco']").prop("disabled", false);

                    $(this).find(".box-troco:not(.ativo)").addClass("ativo");

                    var modal = $(this).find(".box-troco");

                    setTimeout(

                        function () {

                            modal.find(".modal-troco").addClass("ativo");

                        }, 500

                    );

                } else {

                    $(this).parents('.lista-de-opcoes').find("input[type='hidden'][name='troco']").prop("disabled", true);

                    $(this).parents('.lista-de-opcoes').find("input[type='hidden'][name='troco']").val("");

                    $(this).parents('.lista-de-opcoes').find(".troco-selecionado").remove();

                    if ($(this).parents(".lista-de-opcoes").find(".box-troco.ativo").length > 0) {

                        $(this).parents(".lista-de-opcoes").find(".box-troco.ativo").removeClass("ativo");

                        $(this).parents(".lista-de-opcoes").find(".box-troco").find(".modal-troco.ativo").removeClass("ativo");

                    }

                }

                if ($(this).find(".modal-pagamento-online").length > 0) {/*ATIVAR PAGAMENTO ONLINE*/

                    /*VERIFICAR FRETE*/

                    var tipoEntrega = $("#carrinho input[name='tipoRetirada']:checked").val();

                    if (
                        tipoEntrega == 0 && $("#carrinho input[name='idEndereco']:checked").length > 0 ||
                        tipoEntrega == 1
                    ) {

                        $(this).find(".modal-pagamento-online").find("input, select").prop("disabled", false);

                        $(this).find(".box-pagamento-online:not(.ativo)").addClass("ativo");

                        var modal = $(this).find(".box-pagamento-online");

                        var valorPedido = $(".box-add-carrinho a.valor-total span").text();

                        setTimeout(

                            function () {

                                modal.find(".modal-pagamento-online").addClass("ativo");

                                modal.find(".form-pagamento-online").find(".valor-pedido").html(valorPedido);

                                if (modal.is(":hidden")) {

                                    modal.fadeIn();

                                }

                                scrollModal();

                            }, 500

                        );

                    } else if (tipoEntrega == 0 && $("#carrinho input[name='idEndereco']:checked").length == 0) {

                        var obj = $(this);

                        setTimeout(

                            function () {

                                /*LIMPAR RADIO ATIVO FORMA DE PAGAMENTO*/

                                obj.find("input[name='formaPagamento']").prop("checked", false);

                                /*LIMPAR CONFIRMAÇÃO BOX PAGAMENTO*/

                                obj.parents(".box-opcoes").find(".titulo").find("span").removeClass("ativo").html("obrigatório");

                                if (!$("#carrinho input[name='idEndereco']").parents(".box-opcoes").hasClass("erro")) {

                                    $("#carrinho input[name='idEndereco']").parents(".box-opcoes").addClass("erro");

                                    var position_box = $("#carrinho input[name='idEndereco']").parents(".box-opcoes").offset().top;

                                    topElementoPagina(position_box);

                                    setTimeout(
                                        function () {

                                            $("#carrinho input[name='idEndereco']").parents(".box-opcoes").removeClass("erro");

                                        }, 2000
                                    )

                                }

                            }, 500
                        );

                    }

                } else {

                    $(this).parents(".lista-de-opcoes").find(".modal-pagamento-online").find("input, select").prop("disabled", true);

                    $(this).parents(".lista-de-opcoes").find(".modal-pagamento-online").find("input, select").val("");

                    $(this).parents(".lista-de-opcoes").find(".modal-pagamento-online").find(".form-pagamento-online").find(".valor-pedido").html("");

                    if ($(this).parents(".lista-de-opcoes").find(".box-pagamento-online.ativo").length > 0) {

                        $(this).parents(".lista-de-opcoes").find(".cartao-selecionado").remove();

                        $(this).parents(".lista-de-opcoes").find("#div_logos_bandeiras").find(".img_bandeira").find("img").removeClass("active");

                        $(this).parents(".lista-de-opcoes").find(".box-pagamento-online.ativo").removeClass("ativo");

                        $(this).parents(".lista-de-opcoes").find(".box-pagamento-online").find(".modal-pagamento-online.ativo").removeClass("ativo");

                        scrollModal();

                    }

                }

                if ($(this).find(".box-pix").length > 0) {/*ATIVAR PIX*/

                    $(this).find(".box-pix:not(.ativo)").addClass("ativo");

                } else {

                    if ($(this).parents(".lista-de-opcoes").find(".box-pix.ativo").length > 0) {

                        $(this).parents(".lista-de-opcoes").find(".box-pix.ativo").removeClass("ativo");

                    }

                }

                if (!$(this).parents('.box-opcoes').find('span').hasClass("ativo")) {

                    $(this).parents('.box-opcoes').find('span').addClass("ativo");

                }


                $(this).parents('.box-opcoes').find('span').html("<i class='fa fa-check'></i>");

                $(this).parents(".box-opcoes.erro").removeClass("erro").removeClass("erroTroco");

            }

        }

        calcularCarrinho();

    });


}


function validarTrocoCarrinho() {


    $("#carrinho .box-troco .modal-troco .modal-troco-footer button.close-modal-troco").click(function () {

        var obj = $(this);

        obj.parents(".modal-troco").removeClass("ativo");

        var boxTroco = obj.parents(".box-troco");

        setTimeout(

            function () {

                boxTroco.removeClass("ativo");

                boxTroco.find(".modal-troco").find(".info-troco").show();

                boxTroco.find(".modal-troco").find(".form-troco").hide();

                boxTroco.find(".modal-troco").find(".form-troco").find(".campo-valor-troco.erro").removeClass("erro");

                boxTroco.find(".modal-troco").find(".form-troco").find(".campo-valor-troco").find("input[name='troco_modal']").val("");

                obj.parent().children("button.confirmar-modal-troco").show();

                obj.parent().children("button.concluir-modal-troco").hide();

                boxTroco.children("input[name='troco']").val("");

                boxTroco.children("input[name='troco']").prop("disabled", true);

                boxTroco.parent().find(".troco-selecionado").remove();

            }, 500

        );

    });

    $("#carrinho .box-troco .modal-troco .modal-troco-footer button.confirmar-modal-troco").click(function () {

        var obj = $(this);

        var modalTroco = obj.parents(".modal-troco").find(".modal-troco-body");

        var valorPedido = $(".box-add-carrinho a.valor-total span").text();

        modalTroco.children(".info-troco").fadeOut(function () {

            modalTroco.children(".form-troco").find(".valor-pedido").html(valorPedido);

            modalTroco.children(".form-troco").fadeIn();

            obj.hide();

            obj.parent().children("button.concluir-modal-troco").show();

        });

    });


    $("#carrinho .box-troco .modal-troco .modal-troco-footer button.concluir-modal-troco").click(function () {

        var obj = $(this);

        var boxTroco = obj.parents(".modal-troco-content").find(".modal-troco-body").find(".campo-valor-troco");

        var campoValor = boxTroco.find("input[name='troco_modal']").val();

        var valor = removermascaraValor(campoValor);

        var valorTotal = removermascaraValor($(".box-add-carrinho a.valor-total span").text());

        if (parseFloat(valorTotal) >= parseFloat(valor)) {

            boxTroco.addClass("erro");

        } else {

            boxTroco.parents(".box-troco").children("input[name='troco']").val(campoValor);

            boxTroco.parents(".box-troco").children("input[name='troco']").prop("disabled", false);

            boxTroco.parents(".box-troco").parent().append("<div class='col-sm-12 troco-selecionado'><div class='alert alert-warning' role='alert'>Troco para R$ " + campoValor + "</div></div>");

            obj.parents(".modal-troco").removeClass("ativo");

            var boxmodalTroco = obj.parents(".box-troco");

            setTimeout(

                function () {

                    boxmodalTroco.removeClass("ativo");

                    boxmodalTroco.find(".modal-troco").find(".info-troco").show();

                    boxmodalTroco.find(".modal-troco").find(".form-troco").hide();

                    boxmodalTroco.find(".modal-troco").find(".form-troco").find(".campo-valor-troco.erro").removeClass("erro");

                    boxmodalTroco.find(".modal-troco").find(".form-troco").find(".campo-valor-troco").find("input[name='troco_modal']").val("");

                    obj.parent().children("button.confirmar-modal-troco").show();

                    obj.parent().children("button.concluir-modal-troco").hide();

                }, 500

            );



        }

    });

}

function validarPagamentoOnLine() {


    $("#carrinho .box-pagamento-online .modal-pagamento-online .modal-pagamento-online-footer button.close-modal-pagamento-online").click(function () {

        var obj = $(this);

        obj.parents(".modal-pagamento-online").removeClass("ativo");

        var boxPagamentoOnline = obj.parents(".box-pagamento-online");

        /*LIMPAR RADIO ATIVO FORMA DE PAGAMENTO*/

        boxPagamentoOnline.parents(".opcoes").find("input[name='formaPagamento']").prop("checked", false);

        /*LIMPAR CONFIRMAÇÃO BOX PAGAMENTO*/

        boxPagamentoOnline.parents(".box-opcoes").find(".titulo").find("span").removeClass("ativo").html("obrigatório");

        setTimeout(

            function () {

                boxPagamentoOnline.removeClass("ativo");

                boxPagamentoOnline.find("input, select").val("");

                boxPagamentoOnline.find("input.is-invalid, select.is-invalid").removeClass("is-invalid");

                boxPagamentoOnline.find("input, select").prop("disabled", true);

                boxPagamentoOnline.find("#div_logos_bandeiras").find(".img_bandeira").find("img").removeClass("active");

                scrollModal();

            }, 500

        );

    });

    /**LIMPAR ERRO */

    $("#carrinho .box-pagamento-online .modal-pagamento-online .modal-pagamento-online-body .form-pagamento-online").on("click", "input.is-invalid, select.is-invalid", function () {

        $(this).removeClass("is-invalid");

    });

    /*SALVAR FORMAS DE PAGAMENTO*/

    $("#carrinho .box-pagamento-online .modal-pagamento-online .modal-pagamento-online-footer button.concluir-modal-pagamento-online").click(function () {

        console.log("SALVAR FORMAS DE PAGAMENTO");

        var obj = $(this);

        var boxPagamentoOnline = obj.parents(".modal-pagamento-online-content").find(".modal-pagamento-online-body").find(".form-pagamento-online");

        var erro = 0;

        var campos = "";

        var arrayLabel = new Array();

        arrayLabel["cartao_nome"] = "Nome do titular";
        arrayLabel["cartao_celular"] = "Celular do titular";
        arrayLabel["cartao_cpf"] = "CPF do titular";
        arrayLabel["cartao_data_nascimento"] = "Nascimento";
        arrayLabel["cartao_numero"] = "Número do cartão";
        arrayLabel["cartao_validade"] = "Validade do cartão";
        arrayLabel["cartao_cvv"] = "CVV";
        arrayLabel["cartao_bandeira"] = "Bandeira";
        arrayLabel["cartao_parcelas"] = "Parcelas";

        boxPagamentoOnline.find("input:not(input[type='hidden']:not(input[name='cartao_bandeira']):not(input[name='cartao_parcelas']))").each(function () {

            console.log("cartão x01");

            if ($(this).val() == "") {

                erro++;

                $(this).addClass("is-invalid");

                console.log("cartão x02");

            } else {

                if ($(this).attr("name") == "cartao_cvv") {

                    $valor = "***";

                    console.log("cartão x03");

                } else if ($(this).attr("name") == "cartao_numero") {

                    $valor = mascararNumeroCartao($(this).val());

                    console.log("cartão x04");
                } else {

                    $valor = $(this).val();
                    console.log("cartão x05");
                }

                campos += "<div><strong>" + arrayLabel[$(this).attr("name")] + ":</strong> " + $valor + "</div>";
                console.log("cartão x06");
            }

        });

        $("#concluir-modal-pagamento-online").attr('disabled', 'disabled');
        $("#concluir-modal-pagamento-online").html(`
            <div class="sk-wave sk-primary">
                <div class="sk-wave-rect"></div>
                <div class="sk-wave-rect"></div>
                <div class="sk-wave-rect"></div>
                <div class="sk-wave-rect"></div>
                <div class="sk-wave-rect"></div>
            </div>
        `);

        var cartaoNome = $("#cartao_nome").val();
        var cartaoCelular = $("#cartao_celular").val();
        var cartaoCpf = $("#cartao_cpf").val();
        var cartaoDtNasc = $("#cartao_data_nascimento").val();
        var cartaoNumero = $("#cartao_numero").val();
        var cartaoValidade = $("#cartao_validade").val();
        var cartaoCvv = $("#cartao_cvv").val();

        cartaoNumero = cartaoNumero.replace(/[^0-9]/g, '');
        cartaoValidade = cartaoValidade.split('/');

        var cartaoBandeira = detectCreditCardBrand(cartaoNumero).toLocaleLowerCase();

        if (EFI_SANDBOX_INPUT){
            console.log("SANDBOX ATIVO!");
            var s = document.createElement('script'); s.type = 'text/javascript'; var v = parseInt(Math.random() * 1000000); s.src = 'https://sandbox.gerencianet.com.br/v1/cdn/6a9d489178abae0b14c9bc54ae7365e2/' + v; s.async = false; s.id = '6a9d489178abae0b14c9bc54ae7365e2'; if (!document.getElementById('6a9d489178abae0b14c9bc54ae7365e2')) { document.getElementsByTagName('head')[0].appendChild(s); }; $gn = { validForm: true, processed: false, done: {}, ready: function (fn) { $gn.done = fn; } };
        }else{
            var s=document.createElement('script');s.type='text/javascript';var v=parseInt(Math.random()*1000000);s.src='https://api.gerencianet.com.br/v1/cdn/6a9d489178abae0b14c9bc54ae7365e2/'+v;s.async=false;s.id='6a9d489178abae0b14c9bc54ae7365e2';if(!document.getElementById('6a9d489178abae0b14c9bc54ae7365e2')){document.getElementsByTagName('head')[0].appendChild(s);};$gn={validForm:true,processed:false,done:{},ready:function(fn){$gn.done=fn;}};
        }

        $gn.ready(function (checkout) {

            checkout.getPaymentToken(
                {
                    brand: cartaoBandeira, // bandeira do cartão
                    number: cartaoNumero, // número do cartão
                    cvv: cartaoCvv, // código de segurança
                    expiration_month: cartaoValidade[0], // mês de vencimento
                    expiration_year: cartaoValidade[1], // ano de vencimento
                    reuse: true // tokenização/reutilização do payment_token
                },
                function (error, response) {
                    if (error) {
                        // Trata o erro ocorrido
                        console.error(error);
                    } else {
                        // Trata a resposta
                        console.log(response);

                        $.ajax({
                            type: "POST",
                            url: window.location.origin + "/php/efi/efi_adicionar_cartao.php",
                            dataType: "json",
                            data: {
                                ptoken: response.data.payment_token,
                                brand: cartaoBandeira,
                                number: cartaoNumero,
                                //cvv: cartaoCvv,
                                expiration_month: cartaoValidade[0],
                                expiration_year: cartaoValidade[1],
                                cardHolderName: cartaoNome,
                                cardHolderCpf: cartaoCpf,
                                cardHolderBirth: cartaoDtNasc,
                                cardHolderPhone: cartaoCelular
                            },
                            success: function (data) {
                                $('#id_cartao').val(data.id_cartao);

                                $("#concluir-modal-pagamento-online").removeAttr('disabled');
                                $("#concluir-modal-pagamento-online").html(`Continuar`);

                                console.log("cartão x07");

                                var botao = "<div><br><a href='javascript:void(0)' class='btn-warning btn-sm btn alterar-dados-cartao'>Alterar cartão selecionado</a></div>";

                                boxPagamentoOnline.parents(".box-pagamento-online").parent().find(".cartao-selecionado").remove();

                                boxPagamentoOnline.parents(".box-pagamento-online").parent().append("<div class='col-sm-12 cartao-selecionado'><div class='alert alert-warning' role='alert'>" + campos + botao + "</div></div>");

                                obj.parents(".box-pagamento-online").fadeOut(function () {

                                    scrollModal();

                                });

                                console.log("cartão x08");

                            },
                            error: function (data) {
                                console.log(data);
                                $("#concluir-modal-pagamento-online").removeAttr('disabled');
                                $("#concluir-modal-pagamento-online").html(`Continuar`);
                            }
                        });

                    }
                }
            );

            checkout.getInstallments(
                1000, // valor total da cobrança
                cartaoBandeira, // bandeira do cartão
                function (error, response) {
                    if (error) {
                        // Trata o erro ocorrido
                        console.log(error);
                    } else {
                        // Trata a respostae
                        console.log(response);
                    }
                }
            );

        });



        if (erro == 0) {

            /*console.log("cartão x07");
            var botao = "<div><br><a href='javascript:void(0)' class='btn-warning btn-sm btn alterar-dados-cartao'>Alterar dados do cartão</a></div>";

            boxPagamentoOnline.parents(".box-pagamento-online").parent().find(".cartao-selecionado").remove();
            
            boxPagamentoOnline.parents(".box-pagamento-online").parent().append("<div class='col-sm-12 cartao-selecionado'><div class='alert alert-warning' role='alert'>"+campos+botao+"</div></div>");

            obj.parents(".box-pagamento-online").fadeOut(function(){

                scrollModal();

            });

            console.log("cartão x08");*/

        }

        console.log("cartão x09");

    });

    /*EDITAR DADOS DE PAGAMENTO ONLINE*/

    $("#carrinho").on("click", ".cartao-selecionado .alterar-dados-cartao", function () {

        $(this).parents(".cartao-selecionado").remove();

        $(".box-pagamento-online:not(.ativo)").addClass("ativo");

        var modal = $(".box-pagamento-online");

        $(".box-pagamento-online.ativo").show(

            function () {

                setTimeout(

                    function () {

                        modal.find(".modal-pagamento-online").addClass("ativo");

                        scrollModal();

                    }, 500

                );

            }

        );

    });

}

function scrollModal() {

    if ($(".box-pagamento-online").length > 0 && $(".box-pagamento-online").is(":visible")) {

        $("body").css({ "overflow": "hidden" });

    } else {

        $("body").css({ "overflow": "auto" });

    }

}

function mascararNumeroCartao(numero) {

    var separar = numero.split(" ");

    retornoNumero = separar[0] + " **** **** " + separar[3];

    return retornoNumero;

}

/*function validarTelefone(){

    $("#carrinho .lista-de-opcoes").on("blur",".opcoes input[name='telefone']", function(){

        var valor = $(this).val();

        if(valor == ""){/*ERRO*/

/*$(this).parents(".box-opcoes").addClass("erro").addClass("erroTelefone");

if($(this).parents('.box-opcoes').find('span').hasClass("ativo")){

     $(this).parents('.box-opcoes').find('span').removeClass("ativo");

 }

 $(this).parents('.box-opcoes').find('span').html("Obrigatório");

 $(this).parents('.lista-de-opcoes').find(".opcoes.form-cliente").remove();

}else{

 $(this).parents(".box-opcoes.erro").removeClass("erro").removeClass("erroTelefone"); 

 if(!$(this).parents('.box-opcoes').find('span').hasClass("ativo")){

     $(this).parents('.box-opcoes').find('span').addClass("ativo");

 }

 $(this).parents('.box-opcoes').find('span').html("<i class='fa fa-check'></i>"); 

 verificarClienteCadastrado(valor);

}

});


$("#carrinho .lista-de-opcoes .opcoes input[name='telefone']").keyup(function(){

var valor = $(this).val();

if(valor.length  == 15){

if(!$(this).parents('.box-opcoes').find('span').hasClass("ativo")){

     $(this).parents('.box-opcoes').find('span').addClass("ativo");

 }

 $(this).parents('.box-opcoes').find('span').html("<i class='fa fa-check'></i>"); 

verificarClienteCadastrado(valor); 

}else{

 if($(this).parents('.box-opcoes').find('span').hasClass("ativo")){

     $(this).parents('.box-opcoes').find('span').removeClass("ativo");

 }

 $(this).parents('.box-opcoes').find('span').html("Obrigatório");

 $(this).parents('.lista-de-opcoes').find(".opcoes.form-cliente").remove();

}

});

}*/

function verificarClienteCadastrado(telefone) {

    //VERIFICAR SE O CLIENTE ESTÁ CADASTRADO

    $.post(
        SITE_URL_BASE + "/php/actionCliente.php",
        { telefone: telefone, action: "verificarCliente" },
        function (response) {

            if (!response.erro) {

                $("#carrinho .lista-de-opcoes .opcoes.form-cliente").remove();

                if ($("#carrinho .lista-de-opcoes .opcoes.form-cliente").length == 0) {

                    $("#carrinho .lista-de-opcoes .opcoes input[name='telefone']").parents(".lista-de-opcoes").append(response.clienteForm);

                    var position_box = $("#carrinho .lista-de-opcoes .opcoes input[name='telefone']").parents(".box-opcoes").offset().top;

                    topElementoPagina(position_box);

                    if (response.clienteExiste) {

                        $("#carrinho .lista-de-opcoes .opcoes.form-cliente input[name='senha']").focus();

                    }

                }

            }

        }, "json"

    );

}

function aplicarCupom() {

    /*APLICAR CUPOM DE DESCONTO*/
    $("#carrinho .box-opcoes .lista-de-opcoes a.aplicar-cupom").click(function () {

        var obj = $(this);

        var cupom = obj.parents(".opcoes").find("input[name='cupomDesconto']").val();

        $.post(
            SITE_URL_BASE + "/php/validarCupomdeDesconto.php",
            { cupom: cupom, action: "validarCupomdeDesconto" },
            function (response) {

                obj.parents(".opcoes").find("input[name='cupomDesconto']").val("");

                if (response.erro) {

                    obj.parents(".box-opcoes").addClass("erro").addClass(response.msgErro);

                    setTimeout(
                        function () {

                            obj.parents(".box-opcoes").removeClass("erro").removeClass(response.msgErro);

                        }, 3000
                    )

                } else if (response.salvo) {

                    if (obj.parents(".box-opcoes").find("input[name='idcupomDesconto']").length > 0) {


                        obj.parents(".box-opcoes").find("input[name='idcupomDesconto']").parents(".opcoes").remove();

                    }

                    obj.parents(".lista-de-opcoes").append(response.cupom);

                    var position_box = obj.parents(".box-opcoes").offset().top;

                    topElementoPagina(position_box);

                    calcularCarrinho();

                }

            }, "json"
        );

    });


    /*EXCLUIR CUPOM ATIVO*/

    $("#carrinho .box-opcoes .lista-de-opcoes").on("click", ".opcoes a.excluir-cupom", function () {

        var obj = $(this).parents(".opcoes");

        $.post(
            SITE_URL_BASE + "/php/validarCupomdeDesconto.php",
            { action: "excluirCupomdeDesconto" },
            function (response) {

                if (response.erro) {

                    obj.parents(".box-opcoes").addClass("erro").addClass("erroExcluirCupom");

                    setTimeout(
                        function () {

                            obj.parents(".box-opcoes").removeClass("erro").removeClass("erroExcluirCupom");

                        }, 3000
                    )

                } else if (response.salvo) {

                    obj.fadeOut(function () {

                        obj.remove();

                        calcularCarrinho();

                    });

                }

            }, "json"
        );

    });

}

function aplicarCupomFidelidade() {

    if ($(".boxCupomFidelidade").length > 0) {

        var obj = $(".boxCupomFidelidade");

        $.post(
            SITE_URL_BASE + "/php/validarCupomFidelidade.php",
            { action: "validarCupomFidelidade" },
            function (response) {

                if (response.salvo) {

                    if (response.itemCarrinho != "") {

                        if ($(".row.itens-carrinho").eq(0).find(".col-12").find(".item-fidelidade").length == 0) {

                            $(".row.itens-carrinho").eq(0).find(".col-12").append(response.itemCarrinho);
                        }

                    }

                    obj.html(response.cupom);

                    var position_box = obj.find(".box-opcoes").offset().top;

                    topElementoPagina(position_box);

                    calcularCarrinho();

                }

            }, "json"
        );

    }

}

function calcularDescontoPromo(valorTotal, taxaEntrega, desconto) {

    var formaPagamento = $("#carrinho .box-opcoes .lista-de-opcoes .opcoes input[name='formaPagamento']:checked").val();

    if (!formaPagamento)
        return;

    if (desconto > 0) {
        console.log('Não é possível aplicar o desconto do método de pagamento, pois já há um cupom em uso.')
    }

    $.post(
        SITE_URL_BASE + "/php/calculoDesconto.php",
        { formaPagamento: formaPagamento, valorTotal: valorTotal },
        function (response) {

            if (response.status) {
                resPromo = response.res;

                if (resPromo) {
                    console.log('retornou positivo: ' + resPromo.valor)

                    if (resPromo.tipoDesconto == 0) {
                        desconto = resPromo.valor;
                    }
                    else if (resPromo.tipoDesconto == 1) {
                        desconto = (valorTotal * (resPromo.valor / 100));
                    }

                    $(".box-add-carrinho a.valor-total span").text(mascaraValorReal((valorTotal + taxaEntrega - desconto).toFixed(2)));

                    //return resPromo.valor;
                } else {
                    console.log('falha ao validar resPromo');
                    //return 98;

                }
            } else {
                console.log('99');
                return 99;
            }

        }, "json"

    );
}

function atualizarCarrinho() {

    /*ATUALIZAR QUANTIDADE ITENS CARRINHO*/
    $("#carrinho .lista-de-opcoes .box-item-pedido .item-adicional").click(function () {

        var quantidade = $(this).parent().children(".quantidade-item").text();

        var id_pedido_itens = $(this).parent().attr("id_item_pedido");

        var obj = $(this);

        if ($(this).hasClass("remove")) {

            novaQuantidade = parseInt(quantidade) - 1;

        } else if ($(this).hasClass("add")) {

            novaQuantidade = parseInt(quantidade) + 1;

        }

        $(this).parent().children(".quantidade-item").text(novaQuantidade);

        if (novaQuantidade <= 0) {

            $(this).parents('.opcoes').fadeOut();

        }

        $.post(
            SITE_URL_BASE + "/php/atualizarCarrinho.php",
            { id_pedido_itens: id_pedido_itens, quantidade: novaQuantidade, action: "atualizarCarrinho" },
            function (response) {

                if (response.erro) {

                    obj.parent().children(".quantidade-item").text(quantidade);

                    if (obj.parents('.opcoes').is(":hide")) {

                        obj.parents('.opcoes:hidden').show();

                    }

                } else if (response.salvo) {

                    obj.parents('.opcoes:hidden').remove();

                    calcularCarrinho();

                    aplicarCupomFidelidade();

                }

            }, "json"
        );

    });

    /*EXCLUIR ITENS CARRINHO*/
    $("#carrinho .lista-de-opcoes .box-item-pedido .excluir-item-pedido").click(function () {

        var id_pedido_itens = $(this).parent().attr("id_item_pedido");

        var obj = $(this).parents(".opcoes");

        obj.fadeOut();

        $.post(
            SITE_URL_BASE + "/php/atualizarCarrinho.php",
            { id_pedido_itens: id_pedido_itens, action: "excluirItemCarrinho" },
            function (response) {
                if (response.erro) {

                    obj.fadeIn();

                } else if (response.salvo) {

                    obj.remove();

                    calcularCarrinho();

                    aplicarCupomFidelidade();

                }

            }, "json"
        );

    });

}

function calcularCarrinho() {

    var valorTotal = 0;

    var taxaEntrega = 0;

    var desconto = 0;

    $("#carrinho .itens-carrinho .box-opcoes").each(function () {

        if ($(this).find("input[name='idEndereco']:checked").length > 0) {

            taxaEntrega = parseFloat($(this).find("input[name='idEndereco']:checked").attr("valor"));

        } else if ($(this).find(".quantidade-item").length > 0) {

            var valor = parseFloat(removermascaraValor($(this).find(".valor-item").text()));

            var quantidade = parseInt($(this).find(".quantidade-item").text());

            valorTotal = valorTotal + (valor * quantidade);

        } else if ($(this).find("input[name='valorDesconto']").length > 0) {

            desconto = parseFloat($(this).find("input[name='valorDesconto']").val());

        }

    });

    //Calcula se o pedido tem promoção de frete grátis acima de um valor específico
    if ($('[name="promo_tax"]').length > 0) {
        var DescontoTaxaMinEntrega = $('[name="promo_tax"]').val();
        if (valorTotal >= DescontoTaxaMinEntrega){
            taxaEntrega = 0;
        }
    }

    $(".box-valor-total p.valor-total strong").text(mascaraValorReal(valorTotal.toFixed(2)));

    $(".box-add-carrinho a.valor-total span").text(mascaraValorReal((valorTotal + taxaEntrega - desconto).toFixed(2)));

    calcularDescontoPromo(valorTotal, taxaEntrega, desconto);

}

function finalizarPedido() {

    $("#carrinho").on("click", ".box-add-carrinho:not('.box-add-carrinho-mesa') a.btn.valor-total:not('.finalizando')", function () {

        var obj = $(this);

        obj.addClass("finalizando");

        var textoBotao = obj.html();

        textoBotao = textoBotao.replace("Enviar Pedido", "Enviando Pedido...");

        obj.html(textoBotao);

        var tipoRetirada = "";

        var formaPagamento = "";

        var trocoPara = "";

        var idEndereco = "";

        var erro = 0;

        if ($("#carrinho .box-opcoes .lista-de-opcoes .opcoes input[name='tipoRetirada']:checked").length > 0) {

            tipoRetirada = $("#carrinho .box-opcoes .lista-de-opcoes .opcoes input[name='tipoRetirada']:checked").val();

        } else {

            $("#carrinho .box-opcoes .lista-de-opcoes .opcoes input[name='tipoRetirada']").parents(".box-opcoes").addClass("erro");

            /*LIMPAR ALERTA ERRO */

            setTimeout(
                function () {
                    $("#carrinho .box-opcoes .lista-de-opcoes .opcoes input[name='tipoRetirada']").parents(".box-opcoes.erro").removeClass("erro");
                }, 2000
            );

            erro++;

        }

        if (
            $("#carrinho .box-opcoes .lista-de-opcoes .opcoes input[name='tipoRetirada']:checked").length > 0 &&
            $("#carrinho .box-opcoes .lista-de-opcoes .opcoes input[name='tipoRetirada']:checked").val() == '0' &&
            $("#carrinho .box-opcoes .lista-de-opcoes .opcoes.form-cliente input[name='idEndereco']:checked").length > 0

        ) {

            idEndereco = $("#carrinho .box-opcoes .lista-de-opcoes .opcoes.form-cliente input[name='idEndereco']:checked").val();

        } else if (
            $("#carrinho .box-opcoes .lista-de-opcoes .opcoes input[name='tipoRetirada']:checked").length > 0 &&
            $("#carrinho .box-opcoes .lista-de-opcoes .opcoes input[name='tipoRetirada']:checked").val() != '0' &&
            $("#carrinho .box-opcoes .lista-de-opcoes .opcoes.form-cliente input[name='idEndereco']:checked").length >= 0

        ) {

        } else {

            if ($("#carrinho .box-opcoes .lista-de-opcoes .opcoes.form-cliente input[name='idEndereco']").length > 0) {

                $("#carrinho .box-opcoes .lista-de-opcoes .opcoes.form-cliente input[name='idEndereco']").parents(".box-opcoes").addClass("erro");

                /*LIMPAR ALERTA ERRO */

                setTimeout(
                    function () {
                        $("#carrinho .box-opcoes .lista-de-opcoes .opcoes.form-cliente input[name='idEndereco']").parents(".box-opcoes.erro").removeClass("erro");
                    }, 2000
                );

            } else if ($("#carrinho .box-opcoes .lista-de-opcoes .opcoes.form-cliente a.btn.cadastrar-enderecos").length > 0) {

                $("#carrinho .box-opcoes .lista-de-opcoes .opcoes.form-cliente a.btn.cadastrar-enderecos").parents(".box-opcoes").addClass("erro");

                /*LIMPAR ALERTA ERRO */

                setTimeout(
                    function () {
                        $("#carrinho .box-opcoes .lista-de-opcoes .opcoes.form-cliente a.btn.cadastrar-enderecos").parents(".box-opcoes.erro").removeClass("erro");
                    }, 2000
                );

            }

            erro++;

        }

        if ($("#carrinho .box-opcoes .lista-de-opcoes .opcoes input[name='formaPagamento']:checked").length > 0) {

            if (
                $("#carrinho .box-opcoes .lista-de-opcoes .opcoes input[name='formaPagamento']:checked").parents(".opcoes").find("input[name='troco']:not(:disabled)").length > 0 &&
                $("#carrinho .box-opcoes .lista-de-opcoes .opcoes input[name='formaPagamento']:checked").parents(".opcoes").find("input[name='troco']:not(:disabled)").val() != ""
            ) {

                var troco = parseFloat(removermascaraValor($("#carrinho .box-opcoes .lista-de-opcoes .opcoes input[name='formaPagamento']:checked").parents(".opcoes").find("input[name='troco']:not(:disabled)").val()));

                var valorTotal = parseFloat(removermascaraValor($(this).children("span").text()));

                if (troco < valorTotal) {

                    $("#carrinho .box-opcoes .lista-de-opcoes .opcoes input[name='formaPagamento']").parents(".box-opcoes").addClass("erro").addClass("erroTroco");

                    /*LIMPAR ALERTA ERRO */

                    setTimeout(
                        function () {
                            $("#carrinho .box-opcoes .lista-de-opcoes .opcoes input[name='formaPagamento']").parents(".box-opcoes.erro").removeClass("erro").removeClass("erroTroco");
                        }, 2000
                    );

                    erro++;

                } else {

                    trocoPara = troco;

                }

            }

            formaPagamento = $("#carrinho .box-opcoes .lista-de-opcoes .opcoes input[name='formaPagamento']:checked").val();

        } else {

            $("#carrinho .box-opcoes .lista-de-opcoes .opcoes input[name='formaPagamento']").parents(".box-opcoes").addClass("erro");

            /*LIMPAR ALERTA ERRO */

            setTimeout(
                function () {
                    $("#carrinho .box-opcoes .lista-de-opcoes .opcoes input[name='formaPagamento']").parents(".box-opcoes.erro").removeClass("erro");
                }, 2000
            );

            erro++;

        }


        if (erro == 0) {

            $.post(
                SITE_URL_BASE + '/php/finalizarPedido.php',
                {
                    tipoRetirada: tipoRetirada,
                    formaPagamento: formaPagamento,
                    trocoPara: trocoPara,
                    idEndereco: idEndereco,
                    action: 'finalizarPedido'
                }, function (response) {

                    if (response.erro) {

                        obj.parents(".box-add-carrinho").prepend("<div class='alerta bg-danger'><span class='fa fa-exclamation-circle icon-alerta'></span>" + response.msgErro + "</div>");

                        obj.parents(".box-add-carrinho").find(".alerta").fadeIn();

                        setTimeout(
                            function () {

                                obj.parents(".box-add-carrinho").find(".alerta").fadeOut(

                                    function () {

                                        obj.parents(".box-add-carrinho").find(".alerta").remove();

                                    }

                                );

                                obj.removeClass("finalizando");

                                textoBotao = textoBotao.replace("Enviando Pedido...", "Enviar Pedido");

                                obj.html(textoBotao);

                            }, 3000
                        );

                    } else if (response.salvo) {

                        if (response.whatsapp != undefined && response.whatsapp != "") {

                            obj.parents(".box-add-carrinho").prepend("<div class='alerta bg-success text-white'><span class='fa fa-check-circle icon-alerta'></span> Pedido finalizado com sucesso! Enviando seu pedido via Whatsapp <i class='fa fa-whatsapp'></i></div>");

                        } else {

                            obj.parents(".box-add-carrinho").prepend("<div class='alerta bg-success text-white'><span class='fa fa-check-circle icon-alerta'></span> Pedido finalizado com sucesso!</div>");

                        }

                        /*EFETUAR PAGAMENTO ONLINE*/

                        if (formaPagamento == "7" && $(".cartao-selecionado").length > 0 && $(".cartao-selecionado").is(":visible")) {

                            if (response.whatsapp != undefined && response.whatsapp != "") {

                                setTimeout(
                                    function () {
                                        window.open(response.whatsapp, '_blank');
                                        window.location.href = SITE_URL_BASE + "/pedidos";
                                    }, 5000
                                );

                            } else {

                                setTimeout(
                                    function () {
                                        window.location.href = SITE_URL_BASE + "/pedidos";
                                    }, 1000
                                );

                            }

                            /*acaoPagamentoOnline(response.total);

                            if(response.whatsapp != undefined && response.whatsapp != ""){

                                obj.parents(".box-add-carrinho").find(".alerta").attr("whatsapp", response.whatsapp);

                            }*/

                        } else {

                            obj.parents(".box-add-carrinho").find(".alerta").fadeIn();

                            if (response.whatsapp != undefined && response.whatsapp != "") {

                                setTimeout(
                                    function () {

                                        window.open(response.whatsapp, '_blank');

                                        window.location.href = SITE_URL_BASE + "/pedidos";

                                    }, 5000
                                );

                            } else {

                                setTimeout(
                                    function () {

                                        window.location.href = SITE_URL_BASE + "/pedidos";

                                    }, 1000
                                );

                            }

                        }

                    }

                }, "json"
            );

        } else {

            obj.removeClass("finalizando");

            textoBotao = textoBotao.replace("Enviando Pedido...", "Enviar Pedido");

            obj.html(textoBotao);

            var position_box = $("#carrinho .lista-de-opcoes .opcoes").parents(".box-opcoes.erro:eq(0)").offset().top;

            topElementoPagina(position_box);

        }

    });

    $("#carrinho").on("click", ".box-add-carrinho-mesa a.btn.valor-total:not('.finalizando')", function () {
        if ($(this).hasClass('mesa-auth-bypass')) {
            runFinalizarPedidoMesa($('.mesa-finalizar-pedido'));
        } else {
            $("#box-retirada").addClass("ativo");
            $("#modal-authentication").addClass("ativo");
        }

    });

    $("#confirmar-modal-retirada").on("click", function () {
        runFinalizarPedidoMesa($('.mesa-finalizar-pedido'));
    });

}

function runFinalizarPedidoMesa(objElement) {
    var obj = objElement;

    obj.addClass("finalizando");



    var textoBotao = obj.html();

    textoBotao = textoBotao.replace("Enviar Pedido", "Enviando Pedido...");

    obj.html(textoBotao);

    var tipoRetirada = "";

    var formaPagamento = "";

    var trocoPara = "";

    var idEndereco = "";

    var erro = 0;

    //passwd_protected

    $.post(
        SITE_URL_BASE + '/php/autenticarMesa.php',
        {
            passwd: $('#passwd_protected').val(),
        }, function (autenticacao) {

            if (autenticacao.erro) {
                erro++;
                obj.parents(".box-add-carrinho").prepend("<div class='alerta bg-danger'><span class='fa fa-exclamation-circle icon-alerta'></span>Senha de segurança incorreta</div>");

                obj.parents(".box-add-carrinho").find(".alerta").fadeIn();

                setTimeout(
                    function () {

                        obj.parents(".box-add-carrinho").find(".alerta").fadeOut(

                            function () {

                                obj.parents(".box-add-carrinho").find(".alerta").remove();

                            }

                        );

                        obj.removeClass("finalizando");

                        textoBotao = textoBotao.replace("Enviando Pedido...", "Enviar Pedido");

                        obj.html(textoBotao);

                    }, 3000
                );
            }


            if ($("#carrinho .box-opcoes .lista-de-opcoes .opcoes input[name='tipoRetirada']:checked").length > 0) {

                tipoRetirada = $("#carrinho .box-opcoes .lista-de-opcoes .opcoes input[name='tipoRetirada']:checked").val();

            }

            if (
                $("#carrinho .box-opcoes .lista-de-opcoes .opcoes input[name='tipoRetirada']:checked").length > 0 &&
                $("#carrinho .box-opcoes .lista-de-opcoes .opcoes input[name='tipoRetirada']:checked").val() == '0' &&
                $("#carrinho .box-opcoes .lista-de-opcoes .opcoes.form-cliente input[name='idEndereco']:checked").length > 0

            ) {

                idEndereco = $("#carrinho .box-opcoes .lista-de-opcoes .opcoes.form-cliente input[name='idEndereco']:checked").val();

            } else if (
                $("#carrinho .box-opcoes .lista-de-opcoes .opcoes input[name='tipoRetirada']:checked").length > 0 &&
                $("#carrinho .box-opcoes .lista-de-opcoes .opcoes input[name='tipoRetirada']:checked").val() != '0' &&
                $("#carrinho .box-opcoes .lista-de-opcoes .opcoes.form-cliente input[name='idEndereco']:checked").length >= 0

            ) {

            }

            if ($("#carrinho .box-opcoes .lista-de-opcoes .opcoes input[name='formaPagamento']:checked").length > 0) {

                if (
                    $("#carrinho .box-opcoes .lista-de-opcoes .opcoes input[name='formaPagamento']:checked").parents(".opcoes").find("input[name='troco']:not(:disabled)").length > 0 &&
                    $("#carrinho .box-opcoes .lista-de-opcoes .opcoes input[name='formaPagamento']:checked").parents(".opcoes").find("input[name='troco']:not(:disabled)").val() != ""
                ) {

                    var troco = parseFloat(removermascaraValor($("#carrinho .box-opcoes .lista-de-opcoes .opcoes input[name='formaPagamento']:checked").parents(".opcoes").find("input[name='troco']:not(:disabled)").val()));

                    var valorTotal = parseFloat(removermascaraValor($(this).children("span").text()));

                    if (troco < valorTotal) {

                        $("#carrinho .box-opcoes .lista-de-opcoes .opcoes input[name='formaPagamento']").parents(".box-opcoes").addClass("erro").addClass("erroTroco");

                        /*LIMPAR ALERTA ERRO */

                        setTimeout(
                            function () {
                                $("#carrinho .box-opcoes .lista-de-opcoes .opcoes input[name='formaPagamento']").parents(".box-opcoes.erro").removeClass("erro").removeClass("erroTroco");
                            }, 2000
                        );

                        erro++;

                    } else {

                        trocoPara = troco;

                    }

                }

                formaPagamento = $("#carrinho .box-opcoes .lista-de-opcoes .opcoes input[name='formaPagamento']:checked").val();

            }


            if (erro == 0) {

                $.post(
                    SITE_URL_BASE + '/php/finalizarPedidoMesa.php',
                    {
                        tipoRetirada: tipoRetirada,
                        formaPagamento: formaPagamento,
                        trocoPara: trocoPara,
                        idEndereco: idEndereco,
                        action: 'finalizarPedido'
                    }, function (response) {

                        if (response.erro) {

                            obj.parents(".box-add-carrinho").prepend("<div class='alerta bg-danger'><span class='fa fa-exclamation-circle icon-alerta'></span>" + response.msgErro + "</div>");

                            obj.parents(".box-add-carrinho").find(".alerta").fadeIn();

                            setTimeout(
                                function () {

                                    obj.parents(".box-add-carrinho").find(".alerta").fadeOut(

                                        function () {

                                            obj.parents(".box-add-carrinho").find(".alerta").remove();

                                        }

                                    );

                                    obj.removeClass("finalizando");

                                    textoBotao = textoBotao.replace("Enviando Pedido...", "Enviar Pedido");

                                    obj.html(textoBotao);

                                }, 3000
                            );

                        } else if (response.salvo) {

                            if (response.whatsapp != undefined && response.whatsapp != "") {

                                obj.parents(".box-add-carrinho").prepend("<div class='alerta bg-success text-white'><span class='fa fa-check-circle icon-alerta'></span> Pedido finalizado com sucesso! Enviando seu pedido via Whatsapp <i class='fa fa-whatsapp'></i></div>");

                            } else {

                                obj.parents(".box-add-carrinho").prepend("<div class='alerta bg-success text-white'><span class='fa fa-check-circle icon-alerta'></span> Pedido finalizado com sucesso!</div>");

                            }

                            /*EFETUAR PAGAMENTO ONLINE*/

                            if (formaPagamento == "7" && $(".cartao-selecionado").length > 0 && $(".cartao-selecionado").is(":visible")) {

                                acaoPagamentoOnline(response.total);

                                if (response.whatsapp != undefined && response.whatsapp != "") {

                                    obj.parents(".box-add-carrinho").find(".alerta").attr("whatsapp", response.whatsapp);

                                }

                            } else {

                                obj.parents(".box-add-carrinho").find(".alerta").fadeIn();

                                if (response.whatsapp != undefined && response.whatsapp != "") {

                                    setTimeout(
                                        function () {

                                            window.open(response.whatsapp, '_blank');

                                            window.location.href = SITE_URL_BASE + "/pedidos";

                                        }, 5000
                                    );

                                } else {

                                    setTimeout(
                                        function () {

                                            window.location.href = SITE_URL_BASE + "/pedidos";

                                        }, 1000
                                    );

                                }

                            }

                        }

                    }, "json"
                );

            } else {

                obj.removeClass("finalizando");

                textoBotao = textoBotao.replace("Enviando Pedido...", "Enviar Pedido");

                obj.html(textoBotao);

                //var position_box = $("#carrinho .lista-de-opcoes .opcoes").parents(".box-opcoes.erro:eq(0)").offset().top;

                //topElementoPagina(position_box);

            }

        }, "json"
    );
}

function agruparAcoesCliente() {

    autenticarClienteCarrinho();

    autenticarCliente();

    carregarEstadosCidadesBairros();

    cadastroCliente();

    edicaoCadastroCliente();

    salvarNovoEnderecoClienteLocalizacaoAtual();

}

function autenticarClienteCarrinho() {

    $("#carrinho").on("click", " .opcoes.form-cliente a.btn.autenticacao:not('.autenticando')", function () {

        var obj = $(this);

        obj.addClass("autenticando");

        obj.html(`
        <div class="spinner-border spinner-border-sm" role="status">
            <span class="sr-only"></span>
        </div>
        Autenticando...`);

        var telefone = $("#carrinho .lista-de-opcoes .opcoes input[name='telefone']").val();

        if (telefone != "") {

            $.post(
                SITE_URL_BASE + '/php/autenticacao.php',
                { telefone: telefone, action: "autenticacao" },
                function (response) {

                    if (response.erro) {

                        /*obj.parents(".box-opcoes").addClass("erro").addClass("erroAutenticacao");

                        obj.removeClass("autenticando");

                        obj.html("Autenticar");

                        setTimeout(
                            function(){

                                obj.parents(".box-opcoes").removeClass("erro").removeClass("erroAutenticacao");

                            },"3000"
                        );*/

                        $.post(
                            SITE_URL_BASE + '/php/autenticacao.php',
                            { telefone: telefone, action: "salvarTelefoneCadastro" },
                            function (response) {
                                window.location.href = SITE_URL_BASE + "/cadastro";
                            }
                        )

                    } else if (response.salvo) {

                        $("#carrinho").append("<div class='box-add-carrinho position-fixed' style='height:70px;'><div class='alerta bg-success text-white'><span class='fa fa-check-circle icon-alerta'></span> Autenticação realizada com sucesso!</div></div>");

                        $("#carrinho .box-add-carrinho .alerta").fadeIn();

                        setTimeout(
                            function () {

                                window.location.href = SITE_URL_BASE + "/carrinho";

                            }, 3000
                        );

                    }

                }, "json"
            );

        } else {

            obj.parents(".box-opcoes").addClass("erro").addClass("erroAutenticacao");

            obj.removeClass("autenticando");

            obj.html("Autenticar");

            setTimeout(
                function () {

                    obj.parents(".box-opcoes").removeClass("erro").removeClass("erroAutenticacao");

                }, "3000"
            );

        }

    });

}

function autenticarCliente() {

    $("#autenticacao").on("click", " .opcoes.form-cliente a.btn.autenticacao:not('.autenticando')", function () {

        var obj = $(this);

        obj.addClass("autenticando");

        obj.html("Autenticando...");

        var telefone = $("#autenticacao .lista-de-opcoes .opcoes input[name='telefone']").val();

        if (telefone != "") {

            $.post(
                SITE_URL_BASE + '/php/autenticacao.php',
                { telefone: telefone, action: "autenticacao" },
                function (response) {

                    if (response.erro) {

                        obj.parents(".box-opcoes").addClass("erro").addClass("erroAutenticacao");

                        obj.removeClass("autenticando");

                        obj.html("Autenticar");

                        setTimeout(
                            function () {

                                obj.parents(".box-opcoes").removeClass("erro").removeClass("erroAutenticacao");

                            }, "3000"
                        );

                    } else if (response.salvo) {

                        $("#autenticacao").append("<div class='box-add-carrinho position-fixed' style='height:70px;'><div class='alerta bg-success text-white'><span class='fa fa-check-circle icon-alerta'></span> Autenticação realizada com sucesso!</div></div>");

                        $("#autenticacao .box-add-carrinho .alerta").fadeIn();

                        setTimeout(
                            function () {

                                if (response.retorno != undefined) {

                                    window.location.href = response.retorno;

                                } else {

                                    window.location.href = SITE_URL_BASE;

                                }

                            }, 3000
                        );

                    }

                }, "json"
            );

        } else {

            obj.parents(".box-opcoes").addClass("erro").addClass("erroAutenticacao");

            obj.removeClass("autenticando");

            obj.html("Autenticar");

            setTimeout(
                function () {

                    obj.parents(".box-opcoes").removeClass("erro").removeClass("erroAutenticacao");

                }, "3000"
            );

        }


    });

}

function carregarEstadosCidadesBairros() {

    /*CARREGAR ENDEREÇO POR CEP*/

    $("#cadastroCliente").on("blur", " input[name='cep']", function () {

        var obj = $(this);

        var valor = obj.val();

        if (valor != "") {

            $.post(
                SITE_URL_BASE + "/php/listarCidadesBairros.php",
                { cep: valor, action: "listarEnderecoCep" },
                function (response) {

                    if (!response.erro) {
                        $("#cadastroCliente select[name='estado'] option[value='" + response.estado + "'").prop("selected", true);
                        $("#cadastroCliente input[name='cidade']").val(response.cidade);
                        $("#cadastroCliente input[name='endereco']").val(response.endereco);
                    } else {

                        obj.next(".invalid-feedback").fadeIn();

                        setTimeout(function () {

                            obj.next(".invalid-feedback").fadeOut();

                        }, 3000);

                    }
                }, "json"
            );

        } else {

            $("#cadastroCliente input[name='endereco']").val('');

        }

    });

}

function cadastroCliente() {

    $("#cadastroCliente input, #cadastroCliente select, #cadastroCliente textarea").click(function () {

        if ($(this).next($('.invalid-feedback:visible')).length > 0) {

            $(this).next($('.invalid-feedback')).fadeOut();

        }

        if ($(this).parents(".box-opcoes.erro").length > 0) {

            $(this).parents(".box-opcoes.erro").removeClass("erro").removeClass("cadastroCliente");

        }

    });

    /*ATIVAR OU DESATIVAR ENDEREÇO*/

    $("#cadastroCliente input.desabilitarEndereco").change(function () {


        if ($(this).is(":checked")) {

            $("#cadastroCliente .box-endereco").fadeOut();

        } else {

            $("#cadastroCliente .box-endereco").fadeIn();

        }

    });


    $("#cadastroCliente button.btn.cadastrar-cliente:not('.salvando')").click(function () {

        var obj = $(this);

        obj.addClass("salvando");

        obj.html("Enviando...");


        var dadosPessoais = "";

        var infoEndereco = "";

        var totalCamposCadastroCliente = $("#cadastroCliente .dados-pessoais input").length;

        var totalCamposEnderecoCliente = $("#cadastroCliente .info-endereco input, #cadastroCliente .info-endereco select, #cadastroCliente .info-endereco textarea").length;

        var erro = 0;

        $("#cadastroCliente .dados-pessoais input").each(function () {

            if ($(this).val() != "") {

                var nomeCampo = $(this).attr("name");

                var valor = $(this).val();

                dadosPessoais += nomeCampo + '%:%' + valor + '%,%';

            } else {

                $(this).next($('.invalid-feedback')).fadeIn();

                erro++;

            }

        });

        dadosPessoais = dadosPessoais.substring(0, (dadosPessoais.length - 3));

        if (!$("#cadastroCliente input.desabilitarEndereco").is(":checked")) {


            $("#cadastroCliente .info-endereco input:not(input[name='cep']):not('.desabilitarEndereco'), #cadastroCliente .info-endereco select, #cadastroCliente .info-endereco textarea").each(function () {

                if ($(this).val() != "") {

                    var nomeCampo = $(this).attr("name");

                    var valor = $(this).val();

                    infoEndereco += nomeCampo + '%:%' + valor + '%,%';

                } else {

                    if ($(this).attr("name") != "telefone" && $(this).attr("name") != "complemento") {

                        $(this).next($('.invalid-feedback')).html("Campo obrigatório").fadeIn();

                        erro++;

                    }

                }

            });

            infoEndereco = infoEndereco.substring(0, (infoEndereco.length - 3));

        }

        if (erro == 0) {

            $.post(
                SITE_URL_BASE + '/php/actionCliente.php',
                { dadosPessoais: dadosPessoais, infoEndereco: infoEndereco, action: "cadastrarCliente" },
                function (response) {

                    if (response.erro) {

                        if (response.camposErro != undefined) {

                            var separarCampos = response.camposErro.split(",");

                            var separarMsgErro = response.msgErro.split(",");

                            for (i = 0; i < separarCampos.length; i++) {

                                if ($("#cadastroCliente input[name='" + separarCampos[i] + "']").length > 0) {

                                    $("#cadastroCliente input[name='" + separarCampos[i] + "']").next($('.invalid-feedback')).html(separarMsgErro[i]).fadeIn();

                                } else if ($("#cadastroCliente select[name='" + separarCampos[i] + "']").length > 0) {

                                    $("#cadastroCliente select[name='" + separarCampos[i] + "']").next($('.invalid-feedback')).html(separarMsgErro[i]).fadeIn();

                                } else if ($("#cadastroCliente textarea[name='" + separarCampos[i] + "']").length > 0) {

                                    $("#cadastroCliente textarea[name='" + separarCampos[i] + "']").next($('.invalid-feedback')).html(separarMsgErro[i]).fadeIn();

                                }

                            }

                        }

                        if (response.erroBox != undefined) {

                            $("#cadastroCliente .box-opcoes." + response.erroBox).addClass("erro").addClass("cadastroCliente");

                        }

                        $("#cadastroCliente").append("<div class='box-add-carrinho position-fixed' style='height:70px;'><div class='alerta bg-danger text-white'><span class='fa fa-exclamation-circle icon-alerta'></span> Não foi possível realizar seu cadastro.</div></div>");

                        $("#cadastroCliente .box-add-carrinho .alerta").fadeIn();

                        setTimeout(
                            function () {

                                obj.removeClass("salvando");

                                obj.html("Cadastrar meus dados");

                                $("#cadastroCliente .box-add-carrinho").fadeOut(function () {

                                    $("#cadastroCliente .box-add-carrinho").remove();

                                });

                            }, 3000
                        );

                    } else if (response.salvo) {

                        $("#cadastroCliente").append("<div class='box-add-carrinho position-fixed' style='height:70px;'><div class='alerta bg-success text-white'><span class='fa fa-check-circle icon-alerta'></span> Cadastro realizado com sucesso!</div></div>");

                        $("#cadastroCliente .box-add-carrinho .alerta").fadeIn();

                        setTimeout(
                            function () {

                                if (response.retorno != undefined) {

                                    window.location.href = response.retorno;

                                } else {

                                    window.location.href = SITE_URL_BASE;

                                }

                            }, 3000
                        );

                    }

                }, "json"
            );

        } else {

            obj.removeClass("salvando");

            obj.html("Cadastrar meus dados");

        }


    });

}

/*ATUALIZAR DADOS PESSOAIS*/

function edicaoCadastroCliente() {

    $("#cadastroCliente").on("click", " .dados-pessoais .opcoes a.btn.editar-dados-pessoais:not('.adicionando')", function () {

        var obj = $(this);

        obj.addClass('adicionando');

        $.post(
            SITE_URL_BASE + "/php/actionCliente.php",
            { action: "montarFormDadosPessoais" },
            function (response) {

                if (!response.erro) {

                    $("#cadastroCliente .box-opcoes.dados-pessoais .lista-de-opcoes").fadeOut(function () {

                        $("#cadastroCliente .box-opcoes.dados-pessoais").append(response.formDadosPessoais);

                        obj.removeClass('adicionando');

                    });

                }

            }, "json"
        );

    });

    $("#cadastroCliente").on("click", " .dados-pessoais .opcoes a.btn.cancelar-atualizacao", function () {

        $("#cadastroCliente .box-opcoes.dados-pessoais .lista-de-opcoes.box-edicao").fadeOut(function () {

            $("#cadastroCliente .box-opcoes.dados-pessoais .lista-de-opcoes.box-edicao").remove();

            $("#cadastroCliente .box-opcoes.dados-pessoais .lista-de-opcoes").fadeIn();

        });

    });

    $("#cadastroCliente").on("click", " .dados-pessoais .opcoes a.btn.habilitar-senha", function () {

        if ($(this).next($(".box-senha")).is(":visible")) {

            $(this).next($(".box-senha:visible")).find("input").prop("disabled", true);

            $(this).next($(".box-senha:visible")).fadeOut();

            $(this).html('<i class="fa fa-eye"></i> Clique aqui para habilitar a alteração de senha');

        } else {

            $(this).next($(".box-senha:visible")).find("input").prop("disabled", false);

            $(this).next($(".box-senha:visible")).fadeIn();

            $(this).html('<i class="fa fa-eye-slash"></i> Clique aqui para desabilitar a alteração de senha');

        }

    });

    $("#cadastroCliente").on("click", " .dados-pessoais .opcoes a.btn.atualizar-dados-pessoais:not('.salvando')", function () {

        var obj = $(this);

        obj.addClass("salvando");

        obj.html("Enviando...");


        var dadosPessoais = "";

        var totalCamposCadastroCliente = $("#cadastroCliente .dados-pessoais .lista-de-opcoes.box-edicao input").length;

        var erro = 0;

        $("#cadastroCliente .dados-pessoais .lista-de-opcoes.box-edicao input:not(':disabled')").each(function () {

            if ($(this).val() != "") {

                var nomeCampo = $(this).attr("name");

                var valor = $(this).val();

                dadosPessoais += nomeCampo + '%:%' + valor + '%,%';

            } else {

                $(this).next($('.invalid-feedback')).fadeIn();

                erro++;

            }

        });

        dadosPessoais = dadosPessoais.substring(0, (dadosPessoais.length - 3));

        if (erro == 0) {

            $.post(
                SITE_URL_BASE + '/php/actionCliente.php',
                { dadosPessoais: dadosPessoais, action: "atualizarCadastroCliente" },
                function (response) {

                    if (response.erro) {

                        if (response.camposErro != undefined) {

                            var separarCampos = response.camposErro.split(",");

                            var separarMsgErro = response.msgErro.split(",");

                            for (i = 0; i < separarCampos.length; i++) {

                                if ($("#cadastroCliente .dados-pessoais .lista-de-opcoes.box-edicao input[name='" + separarCampos[i] + "']").length > 0) {

                                    $("#cadastroCliente .dados-pessoais .lista-de-opcoes.box-edicao input[name='" + separarCampos[i] + "']").next($('.invalid-feedback')).html(separarMsgErro[i]).fadeIn();

                                } else if ($("#cadastroCliente .dados-pessoais .lista-de-opcoes.box-edicao select[name='" + separarCampos[i] + "']").length > 0) {

                                    $("#cadastroCliente .dados-pessoais .lista-de-opcoes.box-edicao select[name='" + separarCampos[i] + "']").next($('.invalid-feedback')).html(separarMsgErro[i]).fadeIn();

                                } else if ($("#cadastroCliente .dados-pessoais .lista-de-opcoes.box-edicao textarea[name='" + separarCampos[i] + "']").length > 0) {

                                    $("#cadastroCliente .dados-pessoais .lista-de-opcoes.box-edicao textarea[name='" + separarCampos[i] + "']").next($('.invalid-feedback')).html(separarMsgErro[i]).fadeIn();

                                }

                            }

                        }

                        if (response.erroBox != undefined) {

                            $("#cadastroCliente .box-opcoes." + response.erroBox).addClass("erro").addClass("cadastroCliente");

                        }

                        $("#cadastroCliente").append("<div class='box-add-carrinho position-fixed' style='height:70px;'><div class='alerta bg-danger text-white'><span class='fa fa-exclamation-circle icon-alerta'></span> Não foi possível atualizar seu cadastro.</div></div>");

                        $("#cadastroCliente .box-add-carrinho .alerta").fadeIn();

                        setTimeout(
                            function () {

                                obj.removeClass("salvando");

                                obj.html("Atualizar Cadastro");

                                $("#cadastroCliente .box-add-carrinho").fadeOut(function () {

                                    $("#cadastroCliente .box-add-carrinho").remove();

                                });

                            }, 3000
                        );

                    } else if (response.salvo) {

                        $("#cadastroCliente .dados-pessoais .lista-de-opcoes.box-edicao input:not(input[name='senha'])").each(function () {

                            var valor = $(this).val();

                            var campo = $(this).attr("name");

                            $("#cadastroCliente .dados-pessoais .lista-de-opcoes:not('.box-edicao') ." + campo + "-cliente em").html(valor);

                        });

                        $("#cadastroCliente .dados-pessoais .lista-de-opcoes.box-edicao .opcoes a.btn.cancelar-atualizacao").click();

                        if ($("#cadastroCliente .dados-pessoais .lista-de-opcoes:not('.box-edicao') .opcoes .alert").length == 0) {

                            $("#cadastroCliente .dados-pessoais .lista-de-opcoes:not('.box-edicao') .opcoes .nome-cliente").parents('.opcoes').append('<div class="alert alert-warning" role="alert">É necessário autenticar-se novamente, pra efetivar as alterações</div>');

                        }

                        $("#cadastroCliente").append("<div class='box-add-carrinho position-fixed' style='height:70px;'><div class='alerta bg-success text-white'><span class='fa fa-check-circle icon-alerta'></span> Cadastro atualizado com sucesso!</div></div>");

                        $("#cadastroCliente .box-add-carrinho .alerta").fadeIn();

                        setTimeout(
                            function () {

                                $("#cadastroCliente .box-add-carrinho").fadeOut(function () {

                                    $("#cadastroCliente .box-add-carrinho").remove();

                                });

                            }, 3000
                        );

                    }

                }, "json"
            );

        } else {

            obj.removeClass("salvando");

            obj.html("Atualizar Cadastro");

        }

    });

    /*ATUALIZAR ENDERECOS*/

    $("#cadastroCliente").on("click", " .info-endereco .opcoes a.editar-endereco:not('.adicionando')", function () {

        var obj = $(this);

        obj.addClass("adicionando");

        $("#cadastroCliente .info-endereco .opcoes .box-endereco-edicao a.btn.cancelar-atualizacao").click();


        var idEndereco = $(this).attr("id_endereco");

        $.post(
            SITE_URL_BASE + "/php/actionCliente.php",
            { idEndereco: idEndereco, action: "montarFormInfoEditarEndereco" },
            function (response) {

                if (!response.erro) {

                    obj.parents(".box-endereco-view").fadeOut(function () {

                        obj.parents(".opcoes").append(response.formInfoEditarEndereco);

                        obj.removeClass("adicionando");
                        console.log('requested!');

                        $('[entregatype="bairro"]').on('change', function () {
                            $('#bairro').html(`<option value="">Selecione um Bairro</option>`);
                            $.post(
                                SITE_URL_BASE + '/php/_bairrosByCidadeId.php',
                                { idCidade: this.value },
                                function (response) {
                                    response.forEach(bairro => {
                                        $('#bairro').append(`<option value="${bairro.idBairro}">${bairro.nomeBairro}</option>`);
                                    });

                                }, "json"
                            );

                        });
                        if ($('#cidadeList option').length > 0) {
                            console.log(response);
                            $('#cidadeList').val(response.selectedCidade);//.change();
                            $('#cidadeList option[value=val2]').attr('selected', 'selected');
                            //$('#cidadeList').change();
                        }

                    });

                }

            }, "json"
        );

    });

    /*ATUALIZAR ENDERECOS CARRINHO*/

    $("#carrinho").on("click", " .info-endereco .opcoes a.editar-endereco:not('.adicionando')", function () {

        var obj = $(this);

        obj.addClass("adicionando");

        $("#carrinho .info-endereco .opcoes .box-endereco-edicao a.btn.cancelar-atualizacao").click();

        var idEndereco = $(this).attr("id_endereco");

        $.post(
            SITE_URL_BASE + "/php/actionCliente.php",
            { idEndereco: idEndereco, action: "montarFormInfoEditarEndereco" },
            function (response) {

                if (!response.erro) {

                    obj.parents(".box-endereco-view").fadeOut(function () {

                        obj.parents(".opcoes").append(response.formInfoEditarEndereco);

                        obj.removeClass("adicionando");

                    });

                }

            }, "json"
        );

    });

    /*CANCELAR EDIÇÃO DE ENDERECO - CADASTRO */

    $("#cadastroCliente").on("click", " .info-endereco .opcoes .box-endereco-edicao a.btn.cancelar-atualizacao", function () {

        $("#cadastroCliente .box-opcoes.info-endereco .opcoes .box-endereco-edicao").fadeOut(function () {

            $("#cadastroCliente .box-opcoes.info-endereco .opcoes .box-endereco-edicao").remove();

            $("#cadastroCliente .box-opcoes.info-endereco .opcoes .box-endereco-view").fadeIn();

        });

    });

    /*CANCELAR EDIÇÃO DE ENDERECO - CARRINHO */

    $("#carrinho").on("click", " .info-endereco .opcoes .box-endereco-edicao a.btn.cancelar-atualizacao", function () {

        $("#carrinho .box-opcoes.info-endereco .opcoes .box-endereco-edicao").fadeOut(function () {

            $("#carrinho .box-opcoes.info-endereco .opcoes .box-endereco-edicao").remove();

            $("#carrinho .box-opcoes.info-endereco .opcoes .box-endereco-view").fadeIn();

        });

    });

    /*FINALIZAR EDIÇÃO DE ENDERECO - CADASTRO */

    $("#cadastroCliente").on("click", " .info-endereco .opcoes .box-endereco-edicao a.btn.atualizar-endereco-cliente:not('.salvando')", function () {

        var obj = $(this);

        obj.addClass("salvando");

        obj.html("Enviando...");


        var infoEndereco = "";

        var totalCamposEnderecoCliente = $("#cadastroCliente .info-endereco .opcoes .box-endereco-edicao input, #cadastroCliente .info-endereco .opcoes .box-endereco-edicao select, #cadastroCliente .info-endereco .opcoes .box-endereco-edicao textarea").length;


        var erro = 0;

        $("#cadastroCliente .info-endereco .opcoes .box-endereco-edicao input:not(input[name='cep']), #cadastroCliente .info-endereco .opcoes .box-endereco-edicao select, #cadastroCliente .info-endereco .opcoes .box-endereco-edicao textarea").each(function () {

            if ($(this).val() != "") {

                var nomeCampo = $(this).attr("name");

                var valor = $(this).val();

                infoEndereco += nomeCampo + '%:%' + valor + '%,%';

            } else {

                if ($(this).attr("name") != "telefone" && $(this).attr("name") != "complemento") {

                    $(this).next($('.invalid-feedback')).html("Campo obrigatório").fadeIn();

                    erro++;

                }

            }

        });

        infoEndereco = infoEndereco.substring(0, (infoEndereco.length - 3));

        if (erro == 0) {

            var idEndereco = $(this).attr("id_endereco");

            $.post(
                SITE_URL_BASE + '/php/actionCliente.php',
                { idEndereco: idEndereco, infoEndereco: infoEndereco, action: "atualizarEnderecoCliente" },
                function (response) {

                    if (response.erro) {

                        if (response.camposErro != undefined) {

                            var separarCampos = response.camposErro.split(",");

                            var separarMsgErro = response.msgErro.split(",");

                            for (i = 0; i < separarCampos.length; i++) {

                                if ($("#cadastroCliente .info-endereco .opcoes .box-endereco-edicao input[name='" + separarCampos[i] + "']").length > 0) {

                                    $("#cadastroCliente .info-endereco .opcoes .box-endereco-edicao input[name='" + separarCampos[i] + "']").next($('.invalid-feedback')).html(separarMsgErro[i]).fadeIn();

                                } else if ($("#cadastroCliente .info-endereco .opcoes .box-endereco-edicao select[name='" + separarCampos[i] + "']").length > 0) {

                                    $("#cadastroCliente .info-endereco .opcoes .box-endereco-edicao select[name='" + separarCampos[i] + "']").next($('.invalid-feedback')).html(separarMsgErro[i]).fadeIn();

                                } else if ($("#cadastroCliente .info-endereco .opcoes .box-endereco-edicao textarea[name='" + separarCampos[i] + "']").length > 0) {

                                    $("#cadastroCliente .info-endereco .opcoes .box-endereco-edicao textarea[name='" + separarCampos[i] + "']").next($('.invalid-feedback')).html(separarMsgErro[i]).fadeIn();

                                }

                            }

                        }

                        if (response.erroBox != undefined) {

                            $("#cadastroCliente .box-opcoes." + response.erroBox).addClass("erro").addClass("cadastroCliente");

                        }

                        $("#cadastroCliente").append("<div class='box-add-carrinho position-fixed' style='height:70px;'><div class='alerta bg-danger text-white'><span class='fa fa-exclamation-circle icon-alerta'></span> Não foi possível atualizar seu endereço.</div></div>");

                        $("#cadastroCliente .box-add-carrinho .alerta").fadeIn();

                        setTimeout(
                            function () {

                                obj.removeClass("salvando");

                                obj.html("Atualizar Endereço");

                                $("#cadastroCliente .box-add-carrinho").fadeOut(function () {

                                    $("#cadastroCliente .box-add-carrinho").remove();

                                });

                            }, 3000
                        );

                    } else if (response.salvo) {

                        obj.parents('.opcoes').find('.box-endereco-view').find('.descricao-endereco').next($('small')).html(response.novoEndereco);

                        obj.parents('.opcoes').find('.box-endereco-view').find('.rounded-pill.text-white.bg-danger').parent().remove();

                        $("#cadastroCliente .info-endereco .opcoes .box-endereco-edicao a.btn.cancelar-atualizacao").click();

                        $("#cadastroCliente").append("<div class='box-add-carrinho position-fixed' style='height:70px;'><div class='alerta bg-success text-white'><span class='fa fa-check-circle icon-alerta'></span> Endereço atualizado com sucesso!</div></div>");

                        $("#cadastroCliente .box-add-carrinho .alerta").fadeIn();

                        setTimeout(
                            function () {

                                $("#cadastroCliente .box-add-carrinho").fadeOut(function () {

                                    $("#cadastroCliente .box-add-carrinho").remove();

                                });

                            }, 3000
                        );

                    }

                }, "json"
            );

        } else {

            obj.removeClass("salvando");

            obj.html("Atualizar Endereço");

        }

    });

    /*FINALIZAR EDIÇÃO DE ENDERECO - CARRINHO */

    $("#carrinho").on("click", " .info-endereco .opcoes .box-endereco-edicao a.btn.atualizar-endereco-cliente:not('.salvando')", function () {

        var obj = $(this);

        obj.addClass("salvando");

        obj.html("Enviando...");


        var infoEndereco = "";

        var totalCamposEnderecoCliente = $("#carrinho .info-endereco .opcoes .box-endereco-edicao input, #carrinho .info-endereco .opcoes .box-endereco-edicao select, #carrinho .info-endereco .opcoes .box-endereco-edicao textarea").length;


        var erro = 0;

        $("#carrinho .info-endereco .opcoes .box-endereco-edicao input:not(input[name='cep']), #carrinho .info-endereco .opcoes .box-endereco-edicao select, #carrinho .info-endereco .opcoes .box-endereco-edicao textarea").each(function () {

            if ($(this).val() != "") {

                var nomeCampo = $(this).attr("name");

                var valor = $(this).val();

                infoEndereco += nomeCampo + '%:%' + valor + '%,%';

            } else {

                if ($(this).attr("name") != "telefone" && $(this).attr("name") != "complemento") {

                    $(this).next($('.invalid-feedback')).html("Campo obrigatório").fadeIn();

                    erro++;

                }

            }

        });

        infoEndereco = infoEndereco.substring(0, (infoEndereco.length - 3));

        if (erro == 0) {

            var idEndereco = $(this).attr("id_endereco");

            $.post(
                SITE_URL_BASE + '/php/actionCliente.php',
                { idEndereco: idEndereco, infoEndereco: infoEndereco, action: "atualizarEnderecoCliente" },
                function (response) {

                    if (response.erro) {

                        if (response.camposErro != undefined) {

                            var separarCampos = response.camposErro.split(",");

                            var separarMsgErro = response.msgErro.split(",");

                            for (i = 0; i < separarCampos.length; i++) {

                                if ($("#carrinho .info-endereco .opcoes .box-endereco-edicao input[name='" + separarCampos[i] + "']").length > 0) {

                                    $("#carrinho .info-endereco .opcoes .box-endereco-edicao input[name='" + separarCampos[i] + "']").next($('.invalid-feedback')).html(separarMsgErro[i]).fadeIn();

                                } else if ($("#carrinho .info-endereco .opcoes .box-endereco-edicao select[name='" + separarCampos[i] + "']").length > 0) {

                                    $("#carrinho .info-endereco .opcoes .box-endereco-edicao select[name='" + separarCampos[i] + "']").next($('.invalid-feedback')).html(separarMsgErro[i]).fadeIn();

                                } else if ($("#carrinho .info-endereco .opcoes .box-endereco-edicao textarea[name='" + separarCampos[i] + "']").length > 0) {

                                    $("#carrinho .info-endereco .opcoes .box-endereco-edicao textarea[name='" + separarCampos[i] + "']").next($('.invalid-feedback')).html(separarMsgErro[i]).fadeIn();

                                }

                            }

                        }

                        if (response.erroBox != undefined) {

                            $("#carrinho .box-opcoes." + response.erroBox).addClass("erro").addClass("cadastroCliente");

                        }

                        $("#carrinho").append("<div class='box-add-carrinho position-fixed' style='height:70px;'><div class='alerta bg-danger text-white'><span class='fa fa-exclamation-circle icon-alerta'></span> Não foi possível atualizar seu endereço.</div></div>");

                        $("#carrinho .box-add-carrinho .alerta").fadeIn();

                        setTimeout(
                            function () {

                                obj.removeClass("salvando");

                                obj.html("Atualizar Endereço");

                                $("#carrinho .box-add-carrinho").fadeOut(function () {

                                    $("#carrinho .box-add-carrinho").remove();

                                });

                            }, 3000
                        );

                    } else if (response.salvo) {

                        $("#carrinho .info-endereco .opcoes .box-endereco-edicao a.btn.cancelar-atualizacao").click();

                        $("#carrinho").append("<div class='box-add-carrinho position-fixed' style='height:70px;'><div class='alerta bg-success text-white'><span class='fa fa-check-circle icon-alerta'></span> Endereço atualizado com sucesso!</div></div>");

                        location.reload();

                    }

                }, "json"
            );

        } else {

            obj.removeClass("salvando");

            obj.html("Atualizar Endereço");

        }

    });

    $("#cadastroCliente").on("click", " .info-endereco .opcoes a.adicionar-novo-endereco:not('.adicionando')", function () {

        var obj = $(this);

        obj.addClass("adicionando");

        $("#cadastroCliente .info-endereco .opcoes .box-endereco-edicao a.btn.cancelar-atualizacao").click();

        $.post(
            SITE_URL_BASE + "/php/actionCliente.php",
            { action: "montarFormNovoEndereco" },
            function (response) {

                if (!response.erro) {

                    obj.parents(".box-endereco-view").fadeOut(function () {

                        obj.parents(".opcoes").append(response.formInfoNovoEndereco);

                        obj.removeClass("adicionando");

                        var cidadesObj = $('#cidadeList');



                        $.post(
                            SITE_URL_BASE + "/php/_cidadesAtivas.php",
                            { action: "" },
                            function (response) {

                                response.forEach(element => {
                                    cidadesObj.append(`
                                <option value="${element.id}">${element.nome}</option>
                                `);
                                })

                                $('#cidadeList').on('change', function () {
                                    $('#bairro').html(`<option selected disabled>-- Selecione um Bairro --</option>`);
                                    $.post(
                                        SITE_URL_BASE + '/php/_bairrosByCidadeId.php',
                                        { idCidade: this.value },
                                        function (response) {
                                            response.forEach(bairro => {
                                                $('#bairro').append(`<option value="${bairro.idBairro}">${bairro.nomeBairro}</option>`);
                                            });

                                        }, "json"
                                    );

                                });
                                if ($('#cidadeList option').length > 0) {
                                    $('#cidadeList option')[0].selected = true;
                                    $('#cidadeList').change();
                                }


                            }, "json"
                        );

                    });

                }

            }, "json"
        );

    });

    $("#cadastroCliente").on("click", " .info-endereco .opcoes .box-endereco-edicao a.btn.salvar-endereco-cliente:not('.salvando')", function () {

        var obj = $(this);

        obj.addClass("salvando");

        obj.html("Enviando...");




        var infoEndereco = "";

        var totalCamposEnderecoCliente = $("#cadastroCliente .info-endereco .opcoes .box-endereco-edicao input, #cadastroCliente .info-endereco .opcoes .box-endereco-edicao select, #cadastroCliente .info-endereco .opcoes .box-endereco-edicao textarea").length;


        var erro = 0;

        $("#cadastroCliente .info-endereco .opcoes .box-endereco-edicao input:not(input[name='cep']), #cadastroCliente .info-endereco .opcoes .box-endereco-edicao select, #cadastroCliente .info-endereco .opcoes .box-endereco-edicao textarea").each(function () {

            if ($(this).val() != "") {

                var nomeCampo = $(this).attr("name");

                if (nomeCampo == "cidade") {
                    if ($(this).attr("entregatype") == "bairro") {
                        var valor = $('select[name="cidade"] option[value="' + $(this).val() + '"]').text();//$(this).text();
                    } else {
                        var valor = $(this).val();
                    }
                    //var valor = $(this).val();
                    console.log(nomeCampo + ': ' + valor);
                } else {
                    var valor = $(this).val();
                }

                infoEndereco += nomeCampo + '%:%' + valor + '%,%';

            } else {

                if ($(this).attr("name") != "telefone") {

                    $(this).next($('.invalid-feedback')).html("Campo obrigatório").fadeIn();

                    erro++;

                }

            }

        });

        infoEndereco = infoEndereco.substring(0, (infoEndereco.length - 3));

        if (erro == 0) {

            $.post(
                SITE_URL_BASE + '/php/actionCliente.php',
                { infoEndereco: infoEndereco, action: "salvarNovoEnderecoCliente" },
                function (response) {

                    if (response.erro) {

                        if (response.camposErro != undefined) {

                            var separarCampos = response.camposErro.split(",");

                            var separarMsgErro = response.msgErro.split(",");

                            for (i = 0; i < separarCampos.length; i++) {

                                if ($("#cadastroCliente .info-endereco .opcoes .box-endereco-edicao input[name='" + separarCampos[i] + "']").length > 0) {

                                    $("#cadastroCliente .info-endereco .opcoes .box-endereco-edicao input[name='" + separarCampos[i] + "']").next($('.invalid-feedback')).html(separarMsgErro[i]).fadeIn();

                                } else if ($("#cadastroCliente .info-endereco .opcoes .box-endereco-edicao select[name='" + separarCampos[i] + "']").length > 0) {

                                    $("#cadastroCliente .info-endereco .opcoes .box-endereco-edicao select[name='" + separarCampos[i] + "']").next($('.invalid-feedback')).html(separarMsgErro[i]).fadeIn();

                                } else if ($("#cadastroCliente .info-endereco .opcoes .box-endereco-edicao textarea[name='" + separarCampos[i] + "']").length > 0) {

                                    $("#cadastroCliente .info-endereco .opcoes .box-endereco-edicao textarea[name='" + separarCampos[i] + "']").next($('.invalid-feedback')).html(separarMsgErro[i]).fadeIn();

                                }

                            }

                        }

                        if (response.erroBox != undefined) {

                            $("#cadastroCliente .box-opcoes." + response.erroBox).addClass("erro").addClass("cadastroCliente");

                        }

                        $("#cadastroCliente").append("<div class='box-add-carrinho position-fixed' style='height:70px;'><div class='alerta bg-danger text-white'><span class='fa fa-exclamation-circle icon-alerta'></span> Não foi possível cadastrar seu novo endereço.</div></div>");

                        $("#cadastroCliente .box-add-carrinho .alerta").fadeIn();

                        setTimeout(
                            function () {

                                obj.removeClass("salvando");

                                obj.html("Salvar Novo Endereço");

                                $("#cadastroCliente .box-add-carrinho").fadeOut(function () {

                                    $("#cadastroCliente .box-add-carrinho").remove();

                                });

                            }, 3000
                        );

                    } else if (response.salvo) {

                        $("#cadastroCliente").append("<div class='box-add-carrinho position-fixed' style='height:70px;'><div class='alerta bg-success text-white'><span class='fa fa-check-circle icon-alerta'></span> Novo endereço cadastrado com sucesso!</div></div>");

                        $("#cadastroCliente .box-add-carrinho .alerta").fadeIn();

                        setTimeout(
                            function () {

                                $("#cadastroCliente .box-add-carrinho").fadeOut(function () {

                                    $("#cadastroCliente .box-add-carrinho").remove();

                                    window.location.href = SITE_URL_BASE + "/cadastro";

                                });

                            }, 3000
                        );

                    }

                }, "json"
            );

        } else {

            obj.removeClass("salvando");

            obj.html("Salvar Novo Endereço");

        }

    });

    $("#cadastroCliente").on("click", ".info-endereco .opcoes a.excluir-endereco:not('.excluindo')", function () {

        var obj = $(this);

        obj.addClass('excluindo');

        var idEndereco = $(this).attr("id_endereco");

        $.post(
            SITE_URL_BASE + "/php/actionCliente.php",
            { idEndereco: idEndereco, action: "excluirEndereco" },
            function (response) {

                if (response.erro) {

                    $("#cadastroCliente").append("<div class='box-add-carrinho position-fixed' style='height:70px;'><div class='alerta bg-danger text-white'><span class='fa fa-exclamation-circle icon-alerta'></span> Não foi possível excluir endereço selecionado.</div></div>");

                    $("#cadastroCliente .box-add-carrinho .alerta").fadeIn();

                    setTimeout(
                        function () {

                            obj.removeClass("excluindo");

                            $("#cadastroCliente .box-add-carrinho").fadeOut(function () {

                                $("#cadastroCliente .box-add-carrinho").remove();

                            });

                        }, 3000
                    );

                } else if (response.salvo) {

                    $("#cadastroCliente").append("<div class='box-add-carrinho position-fixed' style='height:70px;'><div class='alerta bg-success text-white'><span class='fa fa-check-circle icon-alerta'></span> Endereço excluido com sucesso!</div></div>");

                    $("#cadastroCliente .box-add-carrinho .alerta").fadeIn();

                    obj.parents(".opcoes").fadeOut(function () {

                        obj.parents(".opcoes").remove();

                    });

                    var totalEnderecos = parseInt($("#cadastroCliente .box-opcoes.info-endereco .total-enderecos").text());

                    $("#cadastroCliente .box-opcoes.info-endereco .total-enderecos").text(totalEnderecos - 1)

                    setTimeout(
                        function () {

                            $("#cadastroCliente .box-add-carrinho").fadeOut(function () {

                                $("#cadastroCliente .box-add-carrinho").remove();

                            });

                        }, 3000
                    );

                }

            }, "json"
        );

    });

    console.log('ready to save endereco');

    $('#cidadeList').on('change', function () {
        $('#bairro').html(`<option value="">Selecione um Bairro</option>`);
        $.post(
            SITE_URL_BASE + '/php/_bairrosByCidadeId.php',
            { idCidade: this.value },
            function (response) {
                response.forEach(bairro => {
                    $('#bairro').append(`<option value="${bairro.idBairro}">${bairro.nomeBairro}</option>`);
                });

            }, "json"
        );

    });
    if ($('#cidadeList option').length > 0) {
        $('#cidadeList option')[0].selected = true;
        $('#cidadeList').change();
    }

}

function removeAcento(strToReplace) {
    str_acento = ".-/";
    str_sem_acento = "";
    var nova = "";
    for (var i = 0; i < strToReplace.length; i++) {
        if (str_acento.indexOf(strToReplace.charAt(i)) != -1) {
            nova += str_sem_acento.substr(str_acento.search(strToReplace.substr(i, 1)), 1);
        } else {
            nova += strToReplace.substr(i, 1);
        }
    }
    return nova.toLowerCase();
}

/**PAGAMENTO PAGSEGURO */

function blockEl(el, br, txt) {
    if (br) {
        var border_radius = br
    } else {
        var border_radius = "0px"
    }
    if (txt) {
        var txto = txt
    } else {
        var txto = ""
    }
    if (el != "body") {
        $(el).block({
            message: '<i class="icon-spinner2 spinner"></i><br /><span class="txtBlockEl">' + txto + '</span>',
            overlayCSS: {
                backgroundColor: '#fff',
                borderRadius: border_radius,
                opacity: 0.8,
                cursor: ''
            },
            css: {
                border: 0,
                padding: 0,
                backgroundColor: 'none',
            }
        })
    } else {
        $.blockUI({
            message: '<i class="icon-spinner2 spinner"></i><br /><span class="txtBlockEl">' + txto + '</span>',
            overlayCSS: {
                backgroundColor: '#fff',
                opacity: 0.8,
                cursor: ''
            },
            css: {
                border: 0,
                padding: 0,
                backgroundColor: 'none'
            }
        })
    }
}

function unblockEl(el) {
    $(el).unblock();
}

function bandeiraCartao() {

    if ($(".box-pagamento-online").length > 0) {

        //CRIA UMA SESSION PAGSEGURO

        $.ajax({
            url: SITE_URL_BASE + '/checkout-pagamento/sessao.php',
            type: 'POST',
            dataType: 'json',
            timeout: 30000,
            error: function (xhr, ajaxOptions, errorThrown) {
                unblockEl("body");
                if (errorThrown == "timeout") {
                    alerta("error", "Timeout!", "Tempo limite excedido. Se você está usando o modo Sandbox esse erro é natual, pois em alguns momentos do dia o Sandbox PagSeguro apresenta lentidão ou completa indisponibilidade.");
                }
                if (xhr.status == 404) {
                    alerta("error", "404", "Página não encontrada.");
                }
            },
            success: function (data) {
                var id_sessao = data.id;
                PagSeguroDirectPayment.setSessionId(id_sessao);

            }
        });

        //VERIFICA A BANDEIRA DO CARTÃO DIGITADO

        $("#cartao_numero").keyup(function () {

            var valor = $(this).val();

            valor = valor.replace(/[^0-9]/g, '');

            if (valor.length >= 6 && $(".box-pagamento-online .img_bandeira").html() == "") {

                var cartaoBandeira = detectCreditCardBrand(valor).toLocaleLowerCase();

                $(".box-pagamento-online .img_bandeira").html("<img src='https://stc.pagseguro.uol.com.br/public/img/payment-methods-flags/68x30/" + cartaoBandeira + ".png'>");
                $(".box-pagamento-online #cartao_bandeira").val(cartaoBandeira);

                /*PagSeguroDirectPayment.getBrand({
                    cardBin: valor,
                    success: function(response) {
                        $(".box-pagamento-online .img_bandeira").html("<img src='https://stc.pagseguro.uol.com.br/public/img/payment-methods-flags/68x30/"+response.brand.name+".png'>");
                        $(".box-pagamento-online #cartao_bandeira").val(response.brand.name);
                    },
                    error:function(err){
                        $(".box-pagamento-online .img_bandeira").html("");
                        $(".box-pagamento-online #cartao_bandeira").val("");

                    },
                    complete(response){

                    }
                });*/

            } else {

                $(".box-pagamento-online .img_bandeira").html("");
                $(".box-pagamento-online #cartao_bandeira").val("");

            }

        });

    }

}

function acaoPagamentoOnline(total) {



    return;

    blockEl("body", "0px", "Processando pagamento...");

    var hash = PagSeguroDirectPayment.getSenderHash();

    var nome = $('#cartao_nome').val();
    var cpf = $('#cartao_cpf').val();
    var data_nascimento = $('#cartao_data_nascimento').val();
    var celular = $('#cartao_celular').val();

    var numeroView = $('#cartao_numero').val();
    numero = numeroView.replace(/\s/g, '');
    var bandeira = $('#cartao_bandeira').val();
    var cvv = $('#cartao_cvv').val();
    var validade = $('#cartao_validade').val();
    var val = validade.split("/");
    var validade_mes = val[0];
    var validade_ano = val[1];

    var bin = numero.substring(0, 6);
    bin = parseInt(bin);

    PagSeguroDirectPayment.getBrand({
        cardBin: bin,
        success: function (response) {
            var bandeira = response.brand.name;
            gerar_token(numero, bandeira, cvv, validade_mes, validade_ano, hash, total);
        },
        error: function (response) {
            unblockEl("body");

            mostrar_erros(response.errors);

            atualizarPagamentoCartao('Erro no pagamento', 'Ocorreu um erro ao tentar pagar com cartão: ' + mascararNumeroCartao(numeroView), '0', '0', '0', '0');

            console.log("Erro no processamento");

        }
    });
}

function gerar_token(numero, bandeira, cvv, validade_mes, validade_ano, hash, total) {

    blockEl("body", "0px", "Gerando token...");
    PagSeguroDirectPayment.createCardToken({
        cardNumber: numero,
        brand: bandeira,
        cvv: cvv,
        expirationMonth: validade_mes,
        expirationYear: validade_ano,
        success: function (response) {
            var token = response.card.token;

            var cartao_parcelas = $("#cartao_parcelas").val();
            var parcelas = (cartao_parcelas == 1) ? 1 : cartao_parcelas;
            processar_pagamento_via_cartao(total, parcelas, bandeira, token, hash);

        },
        error: function (response) {
            unblockEl("body");

            mostrar_erros(response.errors);

            atualizarPagamentoCartao('Erro no pagamento', 'Cartão inválido. Não foi possível efetivar o pagamento', '0', '0', '0', '0');

            console.log("Erro ao gerar token");
        }
    })
}

function processar_pagamento_via_cartao(total, parcelas, bandeira, token, hash) {

    blockEl("body", "0px", "Autorizando...");
    PagSeguroDirectPayment.getInstallments({
        amount: total,
        brand: bandeira,
        success: function (response) {

            var valor_parcela = response.installments[bandeira][parcelas - 1]['installmentAmount'];
            var nome = $('#cartao_nome').val();
            var cpf = $('#cartao_cpf').val();
            cpf = cpf.replace(/\D/g, '');
            var data_nascimento = $('#cartao_data_nascimento').val();
            var numero_celular = $('#cartao_celular').val();
            var cel = numero_celular.split(")");
            var ddd = cel[0];
            ddd = ddd.replace(/\D/g, '');
            var celular = cel[1];
            celular = celular.replace(/\D/g, '');
            var forma_de_pagamento = $('#forma_de_pagamento').val();
            var id_transacao = $('#id_transacao').val();
            var descricao = $('#descricao').val();

            var id_endereco = $("input[name='idEndereco']:checked").val();

            var postdata = { id_transacao: id_transacao, token: token, bandeira: bandeira, parcelas: parcelas, descricao: descricao, hash: hash, valor_parcela: valor_parcela, total: total, forma_de_pagamento: forma_de_pagamento, nome_titular: nome, cpf_titular: cpf, data_nascimento_titular: data_nascimento, ddd_titular: ddd, celular_titular: celular, id_endereco: id_endereco };

            $.ajax({
                url: SITE_URL_BASE + '/checkout-pagamento/script.php',
                type: 'POST',
                data: postdata,
                timeout: 30000,
                error: function (xhr, ajaxOptions, errorThrown) {
                    unblockEl("body");
                    if (errorThrown == "timeout") {
                        alert("Tempo limite excedido. Se você está usando o modo Sandbox esse erro é natural, pois em alguns momentos do dia o Sandbox PagSeguro apresenta lentidão ou completa indisponibilidade.")
                    }
                    if (xhr.status == 404) {
                        alert("Página não encontrada.");
                    }
                },
                success: function (data) {

                    var r = $.parseJSON(data);
                    var status = r.estatus;
                    var statusView = r.estatusView;
                    var mensagem = r.estatusTexto;
                    var codigo = r.codigo;
                    var valor_total = r.valor_total;
                    var taxa_pagseguro = r.taxa_pagseguro;
                    var saldo_liquido = r.saldo_liquido;
                    if (status == "sucesso") {
                        unblockEl("body");

                        atualizarPagamentoCartao(statusView, mensagem, codigo, valor_total, taxa_pagseguro, saldo_liquido);

                    } else {
                        unblockEl("body");

                        atualizarPagamentoCartao('Erro no pagamento', 'Pagamento não autorizado', '0', '0', '0', '0');

                        console.log("Pagamento não autorizado 1");
                    }
                }
            })
        },
        error: function (response) {
            unblockEl("body");

            var mensagem = mostrar_erros(response.errors);

            atualizarPagamentoCartao('Erro no pagamento', 'Pagamento não autorizado', '0', '0', '0', '0');

            console.log("Pagamento não autorizado 2");

        }
    })
}

function mensagemPagamentoPedidoFinalizado(mensagem) {

    $(".box-add-carrinho .alerta").append("<div class='alertaPagamento bg-warning text-dark'>" + mensagem + "</div>");

    $(".box-add-carrinho .alerta").fadeIn();

    var whatsapp = $(".box-add-carrinho .alerta").attr("whatsapp");

    if (typeof whatsapp != typeof undefined && whatsapp != "") {

        setTimeout(
            function () {

                window.open(whatsapp, '_blank');

                window.location.href = SITE_URL_BASE + "/pedidos";

            }, 5000
        );

    } else {

        setTimeout(
            function () {

                window.location.href = SITE_URL_BASE + "/pedidos";

            }, 3000
        );

    }

}

function mostrar_erros(response) {
    var errosCartao = '';
    var promises = [];
    $.each(response, function (key, value) {
        promises.push(errosCartao += "<li>" + value + "</li>");
    });
    $.when.apply($, promises).then(function () {
        console.log("Erro:" + errosCartao);
    });
}

function atualizarPagamentoCartao(status, mensagem, codigo, valor_total, taxa_pagseguro, saldo_liquido) {

    var nome = $('#cartao_nome').val();
    var cpf = $('#cartao_cpf').val();
    var data_nascimento = $('#cartao_data_nascimento').val();
    var numero_celular = $('#cartao_celular').val();
    var id_pedido = $('#id_transacao').val();

    var cartao_numero = $('#cartao_numero').val();
    var cartao_validade = $('#cartao_validade').val();
    var cartao_bandeira = $('#cartao_bandeira').val();
    var cartao_parcelas = $('#cartao_parcelas').val();

    var campos =
        "id_pedido%:%" + id_pedido + "%,%" +
        "codigo%:%" + codigo + "%,%" +
        "nome_titular%:%" + nome + "%,%" +
        "celular_titular%:%" + numero_celular + "%,%" +
        "cpf_titular%:%" + cpf + "%,%" +
        "nascimento_titular%:%" + data_nascimento + "%,%" +
        "numero_cartao%:%" + cartao_numero + "%,%" +
        "validade_cartao%:%" + cartao_validade + "%,%" +
        "bandeira_cartao%:%" + cartao_bandeira + "%,%" +
        "parcelas%:%" + cartao_parcelas + "%,%" +
        "valor_total%:%" + valor_total + "%,%" +
        "taxa_pagseguro%:%" + taxa_pagseguro + "%,%" +
        "saldo_liquido%:%" + saldo_liquido + "%,%" +
        "status%:%" + status;


    $.post(
        SITE_URL_BASE + '/php/atualizar-pagamento-cartao.php',
        { campos: campos, action: "atualizarPagamentoCartao" },
        function (response) {

            if (!response.erro) {

                mensagemPagamentoPedidoFinalizado(mensagem);

            }

        }, "json"

    );

}


function selecionarCartao() {

    $(".box-pagamento-online .box-lista-cartoes .lista-cartoes .linha-cartao").off('click');

    $(".box-pagamento-online .box-lista-cartoes .lista-cartoes .linha-cartao").click(function () {

        var id_cartao = $(this).attr("id_cartao");

        $("#box-confirmar-cpf").addClass("ativo");
        $("#box-confirmar-cpf").show();

        var modal = $("#box-confirmar-cpf");

        setTimeout(

            function () {
                modal.find("#modal-confirmar-cpf").addClass("ativo");
                var loaded_cpf = sessionStorage.getItem("last_card_cpf");

                if (loaded_cpf){
                    $("#confirm_cartao_cpf").val(loaded_cpf);
                }
            }, 500

        );

        $("#confirmar-modal-confirmar-cpf").off('click');

        $("#confirmar-modal-confirmar-cpf").click(function(){
            loadCartaoById();
        });

    });


}

function loadCartaoById(){
    var id_cartao = $(".box-pagamento-online .box-lista-cartoes .lista-cartoes .linha-cartao").attr("id_cartao");
    var input_cpf = $('#confirm_cartao_cpf').val();

    $("#confirmar-modal-confirmar-cpf").prop('disabled', true);
    $("#confirmar-modal-confirmar-cpf").html(`
        <div class="sk-wave sk-primary">
            <div class="sk-wave-rect"></div>
            <div class="sk-wave-rect"></div>
            <div class="sk-wave-rect"></div>
            <div class="sk-wave-rect"></div>
            <div class="sk-wave-rect"></div>
        </div>
    `);
    
    $.post(
        "php/atualizar-pagamento-cartao.php",
        { id_cartao: id_cartao, action: "carregarInfoCartao", cartao_cpf:  input_cpf},
        function (response) {

            if (!response.erro) {
                sessionStorage.setItem("last_card_cpf",input_cpf);
                $('#confirm_cartao_cpf').val('');
                
                var campos = "";
                var botao = "";

                var arrayLabel = new Array();

                arrayLabel["cartao_nome"] = "Nome do titular";
                arrayLabel["cartao_celular"] = "Celular do titular";
                arrayLabel["cartao_cpf"] = "CPF do titular";
                arrayLabel["cartao_data_nascimento"] = "Nascimento";
                arrayLabel["cartao_numero"] = "Número do cartão";
                arrayLabel["cartao_validade"] = "Validade do cartão";
                arrayLabel["cartao_cvv"] = "CVV";
                arrayLabel["cartao_bandeira"] = "Bandeira";
                arrayLabel["cartao_parcelas"] = "Parcelas";


                var obj = $("#carrinho .box-pagamento-online .modal-pagamento-online .modal-pagamento-online-footer button.close-modal-pagamento-online");
                var boxPagamentoOnline = obj.parents(".box-pagamento-online");


                console.log("CARREGANDO CARTÃO");

                $(".box-pagamento-online input[name='cartao_nome']").val(response.nome_titular);

                $(".box-pagamento-online input[name='cartao_cpf']").val(response.cpf_titular);

                $(".box-pagamento-online input[name='cartao_data_nascimento']").val(response.nascimento_titular);

                $(".box-pagamento-online input[name='cartao_celular']").val(response.celular_titular);

                $(".box-pagamento-online input[name='cartao_numero']").val(response.numero_cartao);

                $(".box-pagamento-online input[name='cartao_validade']").val(response.validade_cartao);

                $(".box-pagamento-online input[name='cartao_bandeira']").val(response.bandeira_cartao);

                $(".box-pagamento-online .img_bandeira").html(response.bandeira_cartao_img);

                /*$("#concluir-modal-pagamento-online").attr('disabled', 'disabled');

                $("#concluir-modal-pagamento-online").html(`
                    <div class="sk-wave sk-primary">
                        <div class="sk-wave-rect"></div>
                        <div class="sk-wave-rect"></div>
                        <div class="sk-wave-rect"></div>
                        <div class="sk-wave-rect"></div>
                        <div class="sk-wave-rect"></div>
                    </div>
                `);*/

                var cartaoNome = response.nome_titular;
                var cartaoCelular = response.celular_titular;
                var cartaoCpf = response.cpf_titular;
                var cartaoDtNasc = response.nascimento_titular;
                var cartaoNumero = response.numero_cartao;
                var cartaoValidade = response.validade_cartao;
                var cartaoPToken = response.ptoken;

                cartaoNumero = cartaoNumero.replace(/[^0-9]/g, '');
                cartaoValidade = cartaoValidade.split('/');

                var cartaoBandeira = detectCreditCardBrand(cartaoNumero).toLocaleLowerCase();

                console.log(response);

                $('#id_cartao').val(id_cartao);

                $("#concluir-modal-pagamento-online").removeAttr('disabled');
                $("#concluir-modal-pagamento-online").html(`Continuar`);

                console.log("cartão x07");

                var botao = "<div><br><a href='javascript:void(0)' class='btn-warning btn-sm btn alterar-dados-cartao'>Alterar dados do cartão</a></div>";

                //boxPagamentoOnline.parents(".box-pagamento-online").parent().find(".cartao-selecionado").remove();

                $(".cartao-online-dados").append(`

                    <div class="alert alert-warning" role="alert">
                        <div><strong>Nome do titular:</strong> ${cartaoNome}</div>
                        <div><strong>Celular do titular:</strong> ${cartaoCelular}</div>
                        <div><strong>CPF do titular:</strong> ${cartaoCpf}</div>
                        <div><strong>Nascimento:</strong> ${cartaoDtNasc}</div>
                        <div><strong>Número do cartão:</strong> ${cartaoNumero}</div>
                        <div><strong>Validade do cartão:</strong> ${cartaoValidade}</div><div><strong>CVV:</strong> ***</div>
                        <div><strong>Bandeira:</strong> ${detectCreditCardBrand(cartaoNumero)}</div>
                        <!--<div><strong>Parcelas:</strong> 1</div>-->
                        <div>
                            <br>
                            <a href="javascript:void(0)" class="btn-warning btn-sm btn alterar-dados-cartao">Alterar dados do cartão</a>
                        </div>
                    </div>
                
                `);

                obj.parents(".box-pagamento-online").fadeOut(function () {

                    scrollModal();

                });


                $("#confirmar-modal-confirmar-cpf").html('Continuar');

                $("#box-confirmar-cpf").removeClass("ativo");
                $("#box-confirmar-cpf").hide();

                console.log("cartão x12");


            }else{
                $("#confirmar-modal-confirmar-cpf").prop('disabled', false);
                $("#confirmar-modal-confirmar-cpf").html('Continuar');
                alert('Verifique se digitou o seu CPF corretamente para este cartão de crédito');
            }

        }, "json"
    )
}

function horarioFuncionamento() {

    $("span.horario-funcionamento").click(function () {

        if ($(this).parent().find(".conteudo-horario-funcionamento").is(":visible")) {

            $(this).parent().find(".conteudo-horario-funcionamento").fadeOut();

        } else if ($(this).parent().find(".conteudo-horario-funcionamento").is(":hidden")
        ) {

            $(this).parent().find(".conteudo-horario-funcionamento").fadeIn();

        }

    });

}

function geolocalizacao() {
    var lat = getURLParameter('lat');
    var lng = getURLParameter('lng');
    if (lat && lng) {
        console.log('Lat:' + lat);
        console.log('Lng:' + lng);
        latitudeAtual = lat;
        longitudeAtual = lng;

        setCookie('latitude', latitudeAtual);
        setCookie('longitude', longitudeAtual);

        carregarPosicaoatualCarrinho();
    } else {
        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(armazenarLocalizacao, showErrorGelocalizacao);

        }

    }

}

function armazenarLocalizacao(position) {

    latitudeAtual = position.coords.latitude;

    longitudeAtual = position.coords.longitude;

    setCookie('latitude', latitudeAtual);
    setCookie('longitude', longitudeAtual);

    carregarPosicaoatualCarrinho();

}

function showErrorGelocalizacao(error) {
    switch (error.code) {

        case error.PERMISSION_DENIED:
            console.log("Usuário rejeitou a solicitação de Geolocalização.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Localização indisponível.");
            break;
        case error.TIMEOUT:
            console.log("O tempo da requisição expirou.");
            break;
        case error.UNKNOWN_ERROR:
            console.log("Algum erro desconhecido aconteceu.");
            break;
    }
}

function myMap() {

    if ($("#googleMap").length > 0) {

        var obj = $("#googleMap");

        var latitude = $("input#latitude").val();

        if (latitude == "") {

            latitude = "-9.31123";
        }

        var longitude = $("input#longitude").val();

        if (longitude == "") {

            longitude = "-37.60596";
        }

        var tituloEndereco = "Sua localização";

        var latlng = new google.maps.LatLng(latitude, longitude);

        var mapProp = {
            center: latlng,
            zoom: 15,
        };

        var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            draggable: true,
            title: tituloEndereco
        });

        google.maps.event.addListener(marker, 'dragend', function (evt) {

            var latitude = evt.latLng.lat();

            var longitude = evt.latLng.lng();

            $('input#latitude').val(latitude);

            $('input#longitude').val(longitude);

            $('.alertaEndereco').html("");

        });

        map.setCenter(marker.position);
        marker.setMap(map);

        var infowindow = new google.maps.InfoWindow({
            content: "<p align='center'><strong>" + tituloEndereco + "</strong></p>"
        });

        infowindow.open(map, marker);

        if ($(".box-loading-localizacao-atual").length > 0) {

            setTimeout(
                function () {

                    $(".box-loading-localizacao-atual").fadeOut(
                        function () {

                            $(".box-loading-localizacao-atual").remove();

                        }
                    )

                }, 1000
            );
        }

    }

}

function carregarCoordenadas() {

    $("main").on("blur", "input[name='endereco'], input[name='cidade']", function () {

        montarCoordenadasEndereco();

    });

    $("main").on("change", "select[name='estado'], select[name='idBairro']", function () {

        montarCoordenadasEndereco();

    });

    montarMapa();

}

function montarMapa() {

    if ($("#googleMap").length > 0) {

        if ($('input#latitude').val() != "" && $('input#longitude').val() != "") {

            myMap();

        } else {

            if (latitudeAtual != "" && longitudeAtual != "") {

                carregarPosicaoatual();

            } else {

                montarCoordenadasEndereco();

            }

        }

    }

}

function montarCoordenadasEndereco() {

    if ($("#googleMap").length > 0) {

        if (
            $("select[name='estado']").val() != "" &&
            $("input[name='cidade']").val() != ""
        ) {

            if ($("input[name='endereco']").val() != "") {

                var endereco = $("input[name='endereco']").val() + " + ";

            } else {

                var endereco = "";

            }

            if ($("input[name='numero']").val() != "") {

                var numero = $("input[name='numero']").val() + " + ";

            } else {

                var numero = "";

            }

            if ($("select[name='idBairro']").val() != "") {

                var bairro = $("select[name='idBairro'] option:selected").text() + " + ";

            } else {

                var bairro = "";

            }

            var estado = $("select[name='estado']").val();

            var cidade = $("input[name='cidade']").val() + " + ";

            var montarEndereco = numero + endereco + bairro + cidade + estado;
            $.post(
                SITE_URL_BASE + '/php/actionCliente.php',
                { endereco: montarEndereco, action: "carregarCoordenadas" },
                function (response) {

                    if (!response.erro) {

                        $('input#latitude').val(response.latitude);

                        $('input#longitude').val(response.longitude);

                        myMap();

                    }

                }, "json"
            );

        }

    }

}

function carregarPosicaoatual() {

    if ($("#googleMap").length > 0) {

        if (latitudeAtual != "" && longitudeAtual != "") {

            $("#googleMap").parent().append("<div class='box-loading-localizacao-atual'>Carregando localização atual...</div>");

            $.post(
                SITE_URL_BASE + '/php/actionCliente.php',
                { latitude: latitudeAtual, longitude: longitudeAtual, action: "carregarPosicaoAtual" },
                function (response) {

                    if (!response.erro) {

                        $('input#latitude').val(latitudeAtual);

                        $('input#longitude').val(longitudeAtual);

                        $('input[name="endereco"]').val(response.endereco);

                        $('input[name="numero"]').val(response.numero);

                        $('select[name="idBairro"] option').each(function () {

                            if ($(this).text() == response.bairro) {

                                $(this).prop("selected", true);

                                return false;

                            }

                        });

                        $('input[name="cidade"]').val(response.cidade);

                        $('select[name="estado"] option[value="' + response.uf + '"]').prop("selected", true);

                        $('input[name="cep"]').val(response.cep);

                        myMap();

                    }

                }, "json"
            );

        }

    }

}

function carregarPosicaoatualCarrinho() {

    if ($(".endereco-atual").length > 0 && latitudeAtual != "" && longitudeAtual != "") {

        $.post(
            SITE_URL_BASE + '/php/actionCliente.php',
            { latitude: latitudeAtual, longitude: longitudeAtual, action: "carregarPosicaoAtual" },
            function (response) {

                if (!response.erro) {

                    $('.endereco-atual').text(response.endereco + ", " + response.numero + ", " + response.bairro + ", " + response.cidade + "-" + response.uf);


                    $(".info-taxa-loading-localizacao").html(response.taxa);

                } else {

                    $('.endereco-atual').text("Localização atual não disponível.");

                    $(".info-taxa-loading-localizacao").html("");

                }

            }, "json"
        );

    }

}

function salvarNovoEnderecoClienteLocalizacaoAtual() {

    $("#carrinho").on("click", ".box-opcoes.info-endereco .lista-de-opcoes .opcoes-endereco-atual", function () {


        console.log("clicou");
        if (
            $(this).find(".info-taxa-loading-localizacao").find("input.salvar-endereco").length > 0 &&
            $(".endereco-atual").length > 0 &&
            latitudeAtual != "" && longitudeAtual != ""
        ) {
            var obj = $(this).find(".info-taxa-loading-localizacao").find("input.salvar-endereco");

            var numero = obj.attr("numero");
            var endereco = obj.attr("endereco");
            var bairro = obj.attr("bairro");
            var cidade = obj.attr("cidade");
            var uf = obj.attr("uf");

            $.post(
                SITE_URL_BASE + '/php/actionCliente.php',
                {
                    latitude: latitudeAtual,
                    longitude: longitudeAtual,
                    numero: numero,
                    endereco: endereco,
                    bairro: bairro,
                    cidade: cidade,
                    uf: uf,
                    action: "salvarNovoEnderecoClienteLocalizacaoAtual"
                },
                function (response) {

                    if (!response.erro) {


                        $(".info-taxa-loading-localizacao input.salvar-endereco").val(response.idEndereco);

                    } else {

                        $(".info-taxa-loading-localizacao input.salvar-endereco").parents(".opcoes").next(".opcoes").click();

                    }

                }, "json"
            );

        }

    });

}

function getURLParameter(parameter) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const uparameter_t = urlParams.get(parameter)

    if (!uparameter_t) {
        return false;
    }

    return uparameter_t;
}

function getCookie(k) {
    var cookies = " " + document.cookie;
    var key = " " + k + "=";
    var start = cookies.indexOf(key);

    if (start === -1) return null;

    var pos = start + key.length;
    var last = cookies.indexOf(";", pos);

    if (last !== -1) return cookies.substring(pos, last);

    return cookies.substring(pos);
}

function setCookie(k, v, expira, path) {
    if (!path) path = "/";

    var d = new Date();
    d.setTime(d.getTime() + (expira * 1000));

    document.cookie = encodeURIComponent(k) + "=" + encodeURIComponent(v) + "; expires=" + d.toUTCString() + "; path=" + path;
}

function checkPixPaymentStatus(idPedido) {
    $.ajax({
        type: "GET",
        url: document.location.origin + '/php/checkPagamento.php?idPedido=' + idPedido,
        dataType: "json",
        success: function (response) {
            if (response.status) {
                document.location.reload();
            } else {

            }


        },
    });
}

function runPixCheckerLoop(idPedido, seconds = 10000) {
    console.log('trigger!');
    setInterval(function () {
        checkPixPaymentStatus(idPedido)
    }, seconds);
}
function detectCreditCardBrand(cardNumber) {
    // Remove espaços em branco e traços do número do cartão
    cardNumber = cardNumber.replace(/[\s-]/g, '');

    // Expressões regulares para identificar o início do número do cartão
    const visaRegEx = /^4/;
    const mastercardRegEx = /^5[1-5]/;
    const amexRegEx = /^3[47]/;
    const discoverRegEx = /^6(?:011|5[0-9]{2})/;

    // Verificar a bandeira do cartão
    if (visaRegEx.test(cardNumber)) {
        return "Visa";
    } else if (mastercardRegEx.test(cardNumber)) {
        return "Mastercard";
    } else if (amexRegEx.test(cardNumber)) {
        return "American Express";
    } else if (discoverRegEx.test(cardNumber)) {
        return "Discover";
    } else {
        return "Bandeira não identificada";
    }
}

function initEfiCheckout(callback) {

    if (EFI_SANDBOX_INPUT){
        var s = document.createElement('script'); s.type = 'text/javascript'; var v = parseInt(Math.random() * 1000000); s.src = 'https://sandbox.gerencianet.com.br/v1/cdn/6a9d489178abae0b14c9bc54ae7365e2/' + v; s.async = false; s.id = '6a9d489178abae0b14c9bc54ae7365e2'; if (!document.getElementById('6a9d489178abae0b14c9bc54ae7365e2')) { document.getElementsByTagName('head')[0].appendChild(s); }; $gn = { validForm: true, processed: false, done: {}, ready: function (fn) { $gn.done = fn; } };
    }else{
        var s=document.createElement('script');s.type='text/javascript';var v=parseInt(Math.random()*1000000);s.src='https://api.gerencianet.com.br/v1/cdn/6a9d489178abae0b14c9bc54ae7365e2/'+v;s.async=false;s.id='6a9d489178abae0b14c9bc54ae7365e2';if(!document.getElementById('6a9d489178abae0b14c9bc54ae7365e2')){document.getElementsByTagName('head')[0].appendChild(s);};$gn={validForm:true,processed:false,done:{},ready:function(fn){$gn.done=fn;}};
    }
    
    $gn.ready(function (checkout) {

        checkout.getPaymentToken(
            {
                brand: 'visa', // bandeira do cartão
                number: '4012001038443335', // número do cartão
                cvv: '123', // código de segurança
                expiration_month: '05', // mês de vencimento
                expiration_year: '2021', // ano de vencimento
                reuse: false // tokenização/reutilização do payment_token
            },
            callback
            /*function (error, response) {
                if (error) {
                    // Trata o erro ocorrido
                    console.error(error);
                } else {
                    // Trata a resposta
                    console.log(response);
                }
            }*/
        );

        /*checkout.getInstallments(
              1000, // valor total da cobrança
              'visa', // bandeira do cartão
              function (error, response) {
                  if (error) {
                      // Trata o erro ocorrido
                      console.log(error);
                  } else {
                      // Trata a respostae
                      console.log(response);
                  }
              }
          );*/

    });
}