var operacao = '';

        function setOperacao(op) {
            operacao = op;
        }

        function calcular() {
            var numero1 = parseFloat(document.formCal.opcao1.value);
            var numero2 = parseFloat(document.formCal.opcao2.value);
            var result = 0;

            if (operacao === '+') {
                result = numero1 + numero2;
                document.formCal.resultado.value = result;

            } else if (operacao === '-') {
                result = numero1 - numero2;
                document.formCal.resultado.value = result;

            } else if (operacao === '*') {
                result = numero1 * numero2;
                document.formCal.resultado.value = result;

            } else if (operacao === '/') {
                result = numero1 / numero2;
                document.formCal.resultado.value = result;
            }
        }