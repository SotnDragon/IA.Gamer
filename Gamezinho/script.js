Game = {

    RollRemainP1: 0,
    RollRemainCPU: 0,
    EnemyRout: [],
    CurrentTurn: 'player-roll',

    /// :: Mapa do jogo. P = player, E = inimigo, G = chegada.
    Mapa: [
        ['P', 1, 0, 0, 1, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 'G'],
        ['E', 1, 0, 0, 1, 0, 0, 0]
    ],

    /// :: Roll.
    Roll: function () {
        return roll();
    },
    DisableRoll: function () {
        $('.game-dice').attr("disabled", true);
        $('.game-dice').click(false);
    },

    /// :: Eventos do jogo.
    Init: function () {

        /// :: Todas as iniciações.
        //Game.Start();
        Game.Render();

        /// :: Gera o mapa.
        Game.Algoritmos.UpdateMap();

        $("#mapa").click(function (e) {

            var id_coluna = e.target.id;
            var id_linha = e.target.parentElement.id;

            x = id_coluna.replace("coluna-", "");
            y = id_linha.replace("linha-", "");

            if (Game.CurrentTurn === 'player') {

                debugger
                /// :: Verifica se nao é o click do mapa ou o player.
                if (x !== "mapa" && y !== "mapa" && x !== "player" && e.target.className !== "div-casa active") {

                    if (x === 'gold') {
                        debugger
                        var id_coluna = e.target.parentElement.id;
                        var id_linha = e.target.parentElement.parentElement.id;

                        x = id_coluna.replace("coluna-", "");
                        y = id_linha.replace("linha-", "");
                    }

                    /// :: Base.
                    var player_x = 0;
                    var player_y = 0;

                    /// :: Pega a posição do player
                    /// :: Percorre todas as linhas.
                    Game.Mapa.forEach((linhas, yy) => {

                        /// :: Percorre todas as colunas.
                        linhas.forEach((value, xx) => {

                            /// :: Se encontrou o player.
                            if (value === 'P') {
                                player_x = xx;
                                player_y = yy;
                            }

                        })
                    })

                    var totalMovimento = 0;

                    /// :: Pega a quantidade de movimento.
                    if (x > player_x) {
                        totalMovimento = totalMovimento + x - player_x;
                    } else {
                        totalMovimento = totalMovimento + player_x - x;
                    }

                    if (y > player_y) {
                        totalMovimento = totalMovimento + y - player_y;
                    } else {
                        totalMovimento = totalMovimento + player_y - y;
                    }

                    if (totalMovimento === 1) {

                        if (Game.RollRemainP1 > 1) {

                            /// :: Move o personagem.
                            Game.Move('P', x, y);
                            Game.RollRemainP1--;

                            if (!Game.FindPlayer('G')) {
                                alert('Você Ganhou');
                            }

                        } else if (Game.RollRemainP1 === 1) {

                            /// :: Move o personagem.
                            Game.Move('P', x, y);
                            Game.RollRemainP1--;

                            Game.CurrentTurn = 'enemy-roll';

                            if (!Game.FindPlayer('G')) {
                                alert('Você Ganhou');
                            } else {
                                $("#mapa").click();

                                alert("Acabou seu turno");
                            }


                        } else {
                            alert("Espere a sua vez");

                        }
                    }

                }

            } else if (Game.CurrentTurn === 'player-roll') {

                if (Game.RollRemainP1 === 0) {
                    alert('Role o dado!')
                }

            } else if (Game.CurrentTurn === 'enemy-roll') {

                Game.RollRemainCPU = Game.Roll() + 1;
                Game.CurrentTurn = 'enemy';
                Game.EnemyRout = Game.Hunt();
                $("#mapa").click();

            } else if (Game.CurrentTurn === 'enemy') {

                setTimeout(function () {

                    if (Game.RollRemainCPU > 1) {

                        /// :: Move o inimigo.
                        var currentRout = Game.EnemyRout[0];

                        Game.Move('E', currentRout[1], currentRout[0]);
                        Game.RollRemainCPU--;

                        if (Game.FindPlayer('P')) {

                            Game.EnemyRout.shift();
                            $("#mapa").click();

                        } else {
                            alert("Você Perdeu!");
                        }

                    } else if (Game.RollRemainCPU === 1) {

                        /// :: Move o inimigo.
                        var currentRout = Game.EnemyRout[0];

                        /// :: Move o inimigo.
                        Game.Move('E', currentRout[1], currentRout[0]);
                        Game.RollRemainCPU--;

                        if (Game.FindPlayer('P')) {
                            Game.EnemyRout.shift();
                            $("#mapa").click();
                            Game.CurrentTurn = 'player-roll';

                            setTimeout(function () {
                                alert('Turno do jogador');
                            }, 500);
                        } else {
                            alert("Você Perdeu!");
                        }

                    }

                }, 800);


            } else {
                alert('Error');
            }

        });

        /// :: Quando dar uma rolada.
        $("#scene").click(function () {

            /// :: Verifica se é a vez do player rolar o dado.
            if (Game.CurrentTurn === 'player-roll') {
                Game.RollRemainP1 = Game.Roll();
                Game.CurrentTurn = 'player';
            }

        });

    },

    /// :: Renderiza a matriz.
    Render: function () {

        /// :: Limpa o mapa.
        $("#mapa").empty();

        /// :: Percorre todas as linhas.
        Game.Mapa.forEach((linhas, y) => {

            /// :: Cria uma div.
            $("#mapa").append("<div id=linha-" + y + ">");

            /// :: Percorre todas as colunas.
            linhas.forEach((value, x) => {

                /// :: Pega o id da linha e da coluna.
                var id_linha = "linha-" + y;
                var id_coluna = "coluna-" + x;

                /// :: Verifica o que deve ser renderizado.
                if (value === "P") {

                    /// :: Adiciona a casa.
                    $("#" + id_linha).append("<div id=" + id_coluna + " class='div-casa' ></div>");

                    /// :: Adiciona o player na casa.
                    $("#" + id_linha).find("#" + id_coluna).append("<img class='player' id='player' src='p1.gif' />");

                } else if (value === "E") {

                    /// :: Adiciona a casa.
                    $("#" + id_linha).append("<div id=" + id_coluna + " class='div-casa' ></div>");

                    /// :: Adiciona o enemy na casa.
                    $("#" + id_linha).find("#" + id_coluna).append("<img class='player' id='player' src='enemy.gif' />");

                } else if (value === "G") {

                    /// :: Adiciona a casa.
                    $("#" + id_linha).append("<div id=" + id_coluna + " class='div-casa' ></div>");

                    /// :: Adiciona o goal na casa.
                    $("#" + id_linha).find("#" + id_coluna).append("<img class='player' id='gold' src='goal.gif' />");

                } else if (value === 1) {

                    /// :: Adiciona bloco invalido.
                    $("#" + id_linha).append("<div id=" + id_coluna + " class='div-casa active' style='background-color: red;'></div>");
                } else {

                    /// :: Adiciona a valido.
                    $("#" + id_linha).append("<div id=" + id_coluna + " class='div-casa'></div>");
                }

            });

        });

    },

    /// :: Com base no x e y vai movimentar o personagem.
    Move: function (personagem, x, y) {

        /// :: Percorre todas as linhas.
        Game.Mapa.forEach((linhas, yy) => {

            /// :: Percorre todas as colunas.
            linhas.forEach((value, xx) => {

                /// :: Se encontrou o player.
                if (value === personagem)
                    Game.Mapa[yy][xx] = 0;

            })
        })

        Game.Mapa[y][x] = personagem;
        Game.Render();
    },

    /// :: Procura o personagem.
    FindPlayer: function (player) {

        var flag = false;

        /// :: Percorre todas as linhas.
        Game.Mapa.forEach((linhas) => {

            /// :: Percorre todas as colunas.
            linhas.forEach((value) => {

                /// :: Se encontrou o player.
                if (value === player)
                    flag = true;

            })
        })

        return flag;
    },

    /// :: Procura o caminho até o jogador e vai em direção a ele.
    Hunt: function () {

        var pos_jogador = [0, 0];
        var pos_inimigo = [0, 0];

        /// :: Percorre todas as linhas.
        Game.Mapa.forEach((linhas, yy) => {

            /// :: Percorre todas as colunas.
            linhas.forEach((value, xx) => {

                /// :: Se encontrou o player.
                if (value === 'P')
                    pos_jogador = [yy, xx];

                /// :: Se encontrou o inimigo.
                if (value === 'E')
                    pos_inimigo = [yy, xx];

            })
        })

        return Game.Algoritmos.Amplitude(pos_inimigo, pos_jogador);

    },

    /// :: Funções para chamar os algoritmos.
    Algoritmos: {

        /// :: Cria uma solução.
        Solucao: new busca(),

        /// :: Atualiza o mapa.
        UpdateMap: function () {
            mapa = Game.Mapa;
        },

        /// :: Amplitude.
        Amplitude: function (origem, destino) {

            ///:: Atualiza o mapa.
            Game.Algoritmos.UpdateMap();
            return Game.Algoritmos.Solucao.amplitude(origem, destino);
        },

        /// :: Profundidade.
        Profundidade: function (origem, destino) {

            ///:: Atualiza o mapa.
            Game.Algoritmos.UpdateMap();
            return Game.Algoritmos.Solucao.profundidade(origem, destino);
        },

        /// :: Profundidade Limitada.
        ProfundidadeLimitada: function (origem, destino, limite) {

            ///:: Atualiza o mapa.
            Game.Algoritmos.UpdateMap();
            return Game.Algoritmos.Solucao.profundidade_limitada(origem, destino, limite);
        },

        /// :: Aprofundamento Iterativo.
        AprofundamentoIterativo: function (origem, destino) {

            ///:: Atualiza o mapa.
            Game.Algoritmos.UpdateMap();
            return Game.Algoritmos.Solucao.aprofundamento_iterativo(origem, destino);
        },

        /// :: Bidirecional.
        Bidirecional: function (origem, destino) {

            ///:: Atualiza o mapa.
            Game.Algoritmos.UpdateMap();
            return Game.Algoritmos.Solucao.bidirecional(origem, destino);
        },

        /// :: Custo Uniforme.
        CustoUniforme: function (origem, destino) {

            ///:: Atualiza o mapa.
            Game.Algoritmos.UpdateMap();
            return Game.Algoritmos.Solucao.custo_uniforme(origem, destino);
        },

        /// :: Greedy.
        Greedy: function (origem, destino) {

            ///:: Atualiza o mapa.
            Game.Algoritmos.UpdateMap();
            return Game.Algoritmos.Solucao.greedy(origem, destino);
        },

        /// :: Estrela.
        Estrela: function (origem, destino) {

            ///:: Atualiza o mapa.
            Game.Algoritmos.UpdateMap();
            return Game.Algoritmos.Solucao.a_estrela(origem, destino);
        },
    }
}

Game.Init();