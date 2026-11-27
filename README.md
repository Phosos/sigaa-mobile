# SIGAA Mobile

Protótipo acadêmico desenvolvido por um grupo de Sistemas de Informação para a disciplina de IHC (Interação Humano-Computador), IC824, UFRRJ. Explora melhorias na interface de módulos do SIGAA. Dados, tarefas e interações são fictícios e não se conectam ao SIGAA oficial.

## Versões

- **v2** (`index.html`, esta pasta): redesign a partir dos testes do Seminário 3. O que mudou e por quê está em [REDESIGN.md](REDESIGN.md).
- **v1** (`v1/index.html`): protótipo testado com 26 participantes, mantido para o comparativo.

## Integrantes

- Gustavo Gevú
- Lucas Francisco
- Nicolas Moreno
- Pedro Costa

## Como abrir

Abra `index.html` (v2) ou `v1/index.html` em um navegador moderno. Não exige instalação nem build. A fonte Inter vem do Google Fonts quando há conexão.

## Estrutura

- `index.html`, `assets/css/app.css`, `assets/js/app.js`: a v2.
- `assets/js/sheets-config.js`: URL do Apps Script, usada pela v2. A v1 tem a sua cópia em `v1/assets/js/`.
- `v1/`: a versão testada.
- `apps-script/Code.gs`: recebe as respostas e grava na planilha.

## Envio das respostas para Google Sheets

Funciona como antes: o participante informa nome ou apelido e dá consentimento; as respostas vão ao concluir as tarefas, com opção de tentar de novo em caso de falha. Use apelidos, restrinja o acesso à planilha e não publique os dados brutos.

1. Atualize o `apps-script/Code.gs` no editor do Apps Script. A novidade é a coluna `versao`, adicionada ao final das colunas existentes.
2. Em **Implantar > Gerenciar implantações > Editar > Nova versão > Implantar**, publique a atualização. Sem isso, a coluna `versao` não é preenchida; os envios continuam funcionando.
3. A URL `/exec` já está em `assets/js/sheets-config.js` (e em `v1/assets/js/`).

O navegador não lê a confirmação do Apps Script. Confira a planilha para ter certeza da gravação. Sem URL configurada, os resultados ficam no navegador e podem ser copiados.

A v1 grava com `versao = v1` e a v2 com `versao = v2`. Use essa coluna para separar as duas rodadas na análise.
