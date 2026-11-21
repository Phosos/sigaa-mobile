# SIGAA Mobile

Protótipo acadêmico desenvolvido por um grupo de Sistemas de Informação para a disciplina de IHC (Interação Humano-Computador). O projeto explora melhorias na interface de módulos da plataforma SIGAA.

## Contexto

A escolha dos módulos foi orientada por questionários respondidos por quase 50 pessoas. Os participantes apontaram estes entre os módulos que mais desagradaram na plataforma oficial. O protótipo explora possibilidades de reorganização e melhoria da experiência nesses fluxos.

A interface é demonstrativa: dados, tarefas e interações são fictícios e não se conectam ao SIGAA oficial.

## Integrantes

- Gustavo Gevú
- Lucas Francisco
- Nicolas Moreno
- Pedro Costa

## Como abrir

Abra `index.html` em um navegador moderno. O protótipo roda localmente e não exige instalação ou etapa de build. A fonte Inter é carregada do Google Fonts quando há conexão com a internet.

## Estrutura

- `index.html`: estrutura da aplicação e ponto de entrada.
- `assets/css/app.css`: estilos e layout responsivo.
- `assets/js/app.js`: navegação, estado e interações do protótipo.

## Envio das respostas para Google Sheets

A integração usa Google Apps Script como ponte entre a página estática e a planilha. As respostas só são enviadas quando a pessoa clica em **Enviar para planilha** na tela de resultados.

1. Crie uma planilha Google e abra **Extensões > Apps Script**.
2. Copie `apps-script/Code.gs` para o editor. Substitua `COLE_AQUI_O_ID_DA_PLANILHA` pelo ID entre `/d/` e `/edit` na URL da planilha.
3. Implante o script como **App da Web**, executando como você. Para participantes sem login, o acesso precisa aceitar qualquer pessoa. Isso permite que qualquer pessoa com a URL envie dados; não torna a planilha pública para leitura, mas pode receber envios indevidos. Colete apenas os dados necessários e monitore a planilha.
4. Copie a URL implantada, terminada em `/exec`, para `assets/js/sheets-config.js` em `SIGAA_SHEETS_ENDPOINT`.
5. Publique a atualização da página. Cada tarefa será uma linha da aba `Respostas`; o `session_id` agrupa as tarefas da mesma sessão.

O navegador não consegue ler a confirmação de resposta do Apps Script neste modo. A tela informa que a solicitação foi feita, mas é necessário conferir a planilha para confirmar a gravação. Sem URL configurada, os resultados continuam apenas no armazenamento local do navegador e podem ser copiados manualmente.
