# SIGAA Mobile v2: o que mudou e por quê

A v2 responde ao que o Seminário 3 mediu na v1: inspeção heurística (P1 a P13, seção 13), teste com 26 participantes (seção 14) e a tabela de mudanças da seção 16.2. As quatro tarefas (T1 a T4) e as métricas registradas são as mesmas da v1, para o comparativo ser direto.

A v1 continua em `v1/index.html`, sem mudança de layout. O envio ao Google Sheets agora leva uma coluna `versao` (`v1` ou `v2`) para separar as duas rodadas.

## Mudanças por origem

| Origem | Problema na v1 | Mudança na v2 |
|---|---|---|
| T1 (5 respostas incorretas, mediana 40 s) | Contagem de faltas sem o nome da disciplina; a Início mostrava as 8 faltas de Sistemas Distribuídos ao lado da turma de Redes. | A próxima aula na Início traz “Suas faltas nesta disciplina: 3 de 15”. Toda contagem aparece com o nome da disciplina (“Suas faltas em Redes de Computadores”). Aviso de que as faltas são contadas por disciplina, com o limite de cada uma. |
| T1 (“demorei para achar a matéria”) | Redes era a 3ª de 8 turmas na lista. | Turmas separa “Próxima aula, hoje às 14h” das “Outras turmas”. |
| T1 (“cliquei no perfil”) | O avatar “MD” era o único atalho sem rótulo. | A Início ganha ícone de busca ao lado do avatar; Meu perfil passa a ter “Documentos e conta”. |
| T2 (“Conteúdo” não é associado a material) | Aba “Conteúdo”; para baixar era preciso abrir a aba e rolar. | Aba renomeada para “Materiais”. O Resumo da turma mostra “Materiais recentes” com download direto (inclui a Aula 8). Botão muda para “Baixado ✓”. |
| T3 (histórico esperado no perfil) | Histórico só em Serviços. | Histórico também em Meu perfil (copiado, não movido), conforme a sugestão de testar com cartões antes de mover. |
| Toques sem resposta (19,7%) | Cartões com borda, que parecem botões, não faziam nada (faltas registradas, plano, notas, atalhos do perfil); muitos itens só mostravam o aviso “não detalhado”. | Itens que não agem viram linhas planas, sem borda e sem seta (`.item.static`). Itens que agem abrem tela: toda turma abre, avisos abrem folha, atalhos do perfil abrem tela. Telas ainda não desenhadas mostram “Esta parte do protótipo ainda não tem tela” com botão Voltar, em vez de um toque sem efeito. |
| P1 (grave) | “Enviar plano” enviava direto. | “Revisar e enviar” leva à tela de revisão, com “Confirmar envio” e “Voltar e editar”, e depois à confirmação “Plano enviado”. |
| P2 (grave) | Erro de conexão sem dizer se o rascunho foi guardado. | “Seu rascunho foi mantido neste aparelho”, “Tentar de novo” e “Voltar”. |
| P3 | Botão “25 min” sem explicação. | “Sessão: 25 min”, com ícone de relógio. |
| P4 | Critério dos estados invisível. | Frase no Resumo e na Frequência: “Atenção: você usou mais da metade das faltas permitidas.” A barra também muda de cor. |
| P5 | Botões de sessão empilhados com 8 px. | “Continuar conectado” em destaque; “Sair e manter rascunho” como texto, a 22 px de distância. |
| P6 | “Sem notas” sem explicação. | “As notas aparecem aqui quando o professor lançar” e chip “Aguardando notas”. |
| P7 | Novidade só no Resumo. | Contador na aba “Atividades”, que some depois de aberta. |
| P8 | Textos de 11 e 12 px. | Apoio a partir de 13 px, chips e rótulos a partir de 12 px, corpo de 15 px. |
| P9 | Busca só em Serviços. | Ícone de busca na Início, que abre Serviços com o campo em foco. |
| P10 | “Ajuda” prevista e inexistente. | Tela Ajuda com 5 dúvidas das tarefas T1 a T4, em Serviços e na aba Mais. |
| P11 | “Nova” (dourado) parecia o alerta “Atenção” (amarelo). | “Nova” com contorno verde e ponto; amarelo reservado a alertas. |
| P12 | Bloco “Atalhos” repetia a barra inferior. | Removido. |
| P13 | Aviso de “Copiar” sumia em 2 s. | O botão vira “Copiado ✓” por 3 s. |
| T4 (25 de 26) | Funcionava. | Mantido: aviso 2 min antes e retomada. Só o espaçamento mudou (P5). |

## O que não foi alterado

Login, visão do professor, as 24 opções reais do menu Ensino e os dados fictícios, como antes. O termo de consentimento é o mesmo (`2026-11-21-v3`).

## Caminho mínimo medido por script (não são dados de usuários)

Rodando as quatro tarefas pelo caminho mais curto, sem erros de console:

| Tarefa | v1 (teste, mediana de toques) | v2 (caminho mínimo) |
|---|---|---|
| T1 Faltas em Redes | 5 | 0 (leitura na Início) |
| T2 Baixar Aula 8 | 5 | 2 (Abrir turma, baixar) |
| T3 Onde emitir histórico | 3 | 2 (busca, Histórico) |
| T4 Sessão | 1 | 1 |

Esses números são o piso do projeto, não resultado. Para o comparativo da seção 16.3, a v2 precisa de nova rodada com participantes, com perfil coletado e ordem das tarefas variada (seção 17).
