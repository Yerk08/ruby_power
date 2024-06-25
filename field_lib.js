var score_rules = {"move": 0, "pop_shield": 20, "stone_fall": 200, "bomb_fall": 300, "bomb_boom": -7000, "bonus_1": 400, "bonus_2": 700, "bonus_3": 1200, "ruby_get": 1000, "ruby_fall": -1000, "ruby_break": 5000}; // bonus_1 - for 4 connected, removes available 3x3; bonus_2 - for 5 connected, removes available row and column; bonus_3 - for 3000+ score - removes some cells with gems; ruby - for 6-7 connected, like a stone can fall and can destroy like a gems; ruby has -1 number;
function get_empty_field(n, m, gems_number = 4, shield_number = 0, stones_number = 1, stones_random = 5, has_bombs = true) {
    var field = [];
    var shield = [];
    for (var i = 0; i < n; ++i) {
        field.push([]);
        shield.push([]);
        for (var j = 0; j < m; ++j) {
            field[i].push("gem");
            shield[i].push(shield_number);
        }
    }
    return {"gems_field": field, "shield_field": shield, "n": n, "m": m, "gems_number": gems_number, "shield_number": shield_number, "stones_number": stones_number, "stones_random": stones_random, "has_bombs": has_bombs};
}

function check_field_is_possible(field) {
    field = JSON.parse(JSON.stringify(field));
    var possible_field = [];
    for (var i = 0; i < field["n"]; ++i) {
        possible_field.push([]);
        for (var j = 0; j < field["m"]; ++j) {
            possible_field[i].push(0);
        }
    }
    for (var i = 0; i < field["n"]; ++i) {
        for (var j = 0; j < field["m"] - 2; ++j) {
            if (field["gems_field"][i][j] != "empty" && field["gems_field"][i][j + 1] != "empty" && field["gems_field"][i][j + 2] != "empty") {
                possible_field[i][j] = 1;
                possible_field[i][j + 1] = 1;
                possible_field[i][j + 2] = 1;
            }
        }
    }
    for (var i = 0; i < field["n"] - 2; ++i) {
        for (var j = 0; j < field["m"]; ++j) {
            if (field["gems_field"][i][j] != "empty" && field["gems_field"][i + 1][j] != "empty" && field["gems_field"][i + 2][j] != "empty") {
                possible_field[i][j] = 1;
                possible_field[i + 1][j] = 1;
                possible_field[i + 2][j] = 1;
            }
        }
    }
    for (var i = 0; i < field["n"]; ++i) {
        for (var j = 0; j < field["m"]; ++j) {
            if (field["gems_field"][i][j] != "empty" && possible_field[i][j] == 0) {
                return false;
            }
        }
    }
    return true;
}

function run_field(field) {
    field = JSON.parse(JSON.stringify(field));
    for (var i = 0; i < field["n"]; ++i) {
        for (var j = 0; j < field["m"]; ++j) {
            if (field["gems_field"][i][j] == "gem") {
                field["gems_field"][i][j] = Math.floor(Math.random() * field["gems_number"]) % field["gems_number"];
            } else if (field["gems_field"][i][j] == "empty"){
                field["shield_field"][i][j] = 0;
            }
        }
    }
    field["score"] = 0;
    return field;
}

const _dmove = [[0, 1], [1, 0], [0, -1], [-1, 0]];
function _count_triple_field(field) {
    field = JSON.parse(JSON.stringify(field));
    var to_delete_field = [];
    for (var i = 0; i < field["n"]; ++i) {
        to_delete_field.push([]);
        for (var j = 0; j < field["m"]; ++j) {
            to_delete_field[i].push(0);
        }
    }
    var triple_flag = 0; // 1 - has triple; 0 - hasn't triple, but can swap 2 elements to has; -1 - impossible continue game
    for (var i = 0; i < field["n"]; ++i) {
        for (var j = 0; j < field["m"] - 2; ++j) {
            if (typeof(field["gems_field"][i][j]) == "number" && field["gems_field"][i][j] == field["gems_field"][i][j + 1]
            && field["gems_field"][i][j] == field["gems_field"][i][j + 2]) {
                to_delete_field[i][j] = 1;
                to_delete_field[i][j + 1] = 1;
                to_delete_field[i][j + 2] = 1;
                triple_flag = 1;
            }
        }
    }
    for (var i = 0; i < field["n"] - 2; ++i) {
        for (var j = 0; j < field["m"]; ++j) {
            if (typeof(field["gems_field"][i][j]) == "number" && field["gems_field"][i][j] == field["gems_field"][i + 1][j]
            && field["gems_field"][i][j] == field["gems_field"][i + 2][j]) {
                to_delete_field[i][j] = 1;
                to_delete_field[i + 1][j] = 1;
                to_delete_field[i + 2][j] = 1;
                triple_flag = 1;
            }
        }
    }
    if (triple_flag == 1) {
        return {"triple_flag": triple_flag, "field": to_delete_field};
    } else {
        for (var i = 0; i < field["n"]; ++i) {
            for (var j = 0; j < field["m"]; ++j) {
                if (typeof(field["gems_field"][i][j]) == "number") {
                    for (var k = 0; k < 4; ++k) {
                        if (0 <= i + _dmove[k][0] && i + _dmove[k][0] < field["n"] &&
                            0 <= j + _dmove[k][1] && j + _dmove[k][1] < field["m"] && 
                            field["gems_field"][i][j] == field["gems_field"][i + _dmove[k][0]][j + _dmove[k][1]]) {
                            for (var k_point = -1; k_point <= 1; ++k_point) {
                                var k2 = (k + k_point + 4) % 4;
                                if (0 <= i + _dmove[k][0] * 2 + _dmove[k2][0] && i + _dmove[k][0] * 2 + _dmove[k2][0] < field["n"] &&
                                    0 <= j + _dmove[k][1] * 2 + _dmove[k2][1] && j + _dmove[k][1] * 2 + _dmove[k2][1] < field["m"] &&
                                    field["gems_field"][i][j] == field["gems_field"][i + _dmove[k][0] * 2 + _dmove[k2][0]][j + _dmove[k][1] * 2 + _dmove[k2][1]] &&
                                    typeof(field["gems_field"][i + _dmove[k][0] * 2][j + _dmove[k][1] * 2]) == "number") {
                                    triple_flag = 0;
                                    return {"triple_flag": triple_flag, "help_move": [i + _dmove[k][0] * 2 + _dmove[k2][0], j + _dmove[k][1] * 2 + _dmove[k2][1]]};
                                }
                            }
                        } else if (0 <= i + _dmove[k][0] && i + _dmove[k][0] < field["n"] &&
                        0 <= j + _dmove[k][1] && j + _dmove[k][1] < field["m"] &&
                        (field["gems_field"][i + _dmove[k][0]][j + _dmove[k][1]] == "bonus_1" ||
                        field["gems_field"][i + _dmove[k][0]][j + _dmove[k][1]] == "bonus_2" ||
                        field["gems_field"][i + _dmove[k][0]][j + _dmove[k][1]] == "bonus_3")) {
                            triple_flag = 0;
                            return {"triple_flag": triple_flag, "help_move": [i + _dmove[k][0], j + _dmove[k][1]]};
                        }
                    }
                }
            }
        }
        for (var i = 0; i < field["n"]; ++i) {
            for (var j = 0; j < field["m"]; ++j) {
                if (typeof(field["gems_field"][i][j]) == "number") {
                    for (var k = 0; k < 4; ++k) {
                        if (0 <= i + _dmove[k][0] * 2 && i + _dmove[k][0] * 2 < field["n"] &&
                            0 <= j + _dmove[k][1] * 2 && j + _dmove[k][1] * 2 < field["m"] &&
                            field["gems_field"][i][j] == field["gems_field"][i + _dmove[k][0] * 2][j + _dmove[k][1] * 2]) {
                            for (var k_point = 0; k_point < 2; ++k_point) {
                                var k2 = (k + (k_point * 2 - 1) + 4) % 4;
                                if (0 <= i + _dmove[k][0] + _dmove[k2][0] && i + _dmove[k][0] + _dmove[k2][0] < field['n'] &&
                                    0 <= j + _dmove[k][1] + _dmove[k2][1] && j + _dmove[k][1] + _dmove[k2][1] < field['m'] &&
                                    field["gems_field"][i][j] == field["gems_field"][i + _dmove[k][0] + _dmove[k2][0]][j + _dmove[k][1] + _dmove[k2][1]] &&
                                    typeof(field["gems_field"][i + _dmove[k][0]][j + _dmove[k][1]]) == "number") {
                                    triple_flag = 0;
                                    return {"triple_flag": triple_flag, "help_move": [i + _dmove[k][0] + _dmove[k2][0], j + _dmove[k][1] + _dmove[k2][1]]};
                                }
                            }
                        }
                    }
                }
            }
        }
        triple_flag = -1;
        return {"triple_flag": triple_flag};
    }
}

function update_field_from_impossible_to_playable(field, tryies = -1) {
    field = JSON.parse(JSON.stringify(field));
    for (var t = 0; t < tryies || tryies == -1; ++t) {
        for (var i = 0; i < field["n"]; ++i) {
            for (var j = 0; j < field["m"]; ++j) {
                if ((typeof(field["gems_field"][i][j]) == "number" || field["gems_field"][i][j] == "gem") && field["gems_field"][i][j] != -1) {
                    field["gems_field"][i][j] = Math.floor(Math.random() * field["gems_number"]) % field["gems_number"];
                }
            }
        }
        var is_good = _count_triple_field(field)["triple_flag"];
        if (is_good == 0) {
            return field;
        }
    }
    return field;
}

function recount_field(field) {
    field = JSON.parse(JSON.stringify(field));
    var move_list = [];
    var score_add = [];
    for (var i = 0; i < field["n"]; ++i) {
        for (var j = 0; j < field["m"]; ++j) {
            if (field["gems_field"][i][j] == "removed") {
                move_list.push([[i, j], [-1, -1]]);
            }
        }
    }
    for (var j = 0; j < field["m"]; ++j) {
        var i = field["n"] - 1;
        for (; i >= 0; --i) {
            if (field["gems_field"][i][j] != "empty") {
                break;
            }
        }
        if (i >= 0) {
            if (field["gems_field"][i][j] == "stone") {
                move_list.push([[i, j], [-1, j]]);
                field["gems_field"][i][j] = "removed";
                field["score"] += score_rules["stone_fall"];
                score_add.push([i, j, score_rules["stone_fall"]]);
            } else if (field["gems_field"][i][j] == "bomb") {
                move_list.push([[i, j], [-1, j]]);
                field["gems_field"][i][j] = "removed";
                field["score"] += score_rules["bomb_fall"];
                score_add.push([i, j, score_rules["bomb_fall"]]);
            } else if (field["gems_field"][i][j] == -1) {
                move_list.push([[i, j], [-1, j]]);
                field["gems_field"][i][j] = "removed";
                field["score"] += score_rules["ruby_fall"];
                score_add.push([i, j, score_rules["ruby_fall"]]);
            }
        }
    }
    if (move_list.length > 0) {
        for (var j = 0; j < field["m"]; ++j) {
            var last_not_empty = [];
            for (var i = field["n"] - 1; i >= 0; --i) {
                if (field["gems_field"][i][j] != "empty" && field["gems_field"][i][j] != "removed") {
                    if (last_not_empty.length != 0) {
                        move_list.push([[i, j], [last_not_empty[0], j]]);
                        field["gems_field"][last_not_empty[0]][j] = field["gems_field"][i][j];
                        last_not_empty.push(i);
                        last_not_empty.shift();
                    }
                } else if (field["gems_field"][i][j] == "removed") {
                    last_not_empty.push(i);
                }
            }
            for (var i = 0; i < last_not_empty.length; ++i) {
                if (Math.random() * field["stones_random"] < 1 && field["stones_number"] > 0) {
                    if (Math.random() * 4 < 1 && field["has_bombs"]) {
                        field["gems_field"][last_not_empty[i]][j] = "bomb";
                        --field["stones_number"];
                    } else {
                        field["gems_field"][last_not_empty[i]][j] = "stone";
                        --field["stones_number"];
                    }
                } else {
                    field["gems_field"][last_not_empty[i]][j] = Math.floor(Math.random() * field["gems_number"]) % field["gems_number"];
                }
                move_list.push([[-i - 1, j], [last_not_empty[i], j], field["gems_field"][last_not_empty[i]][j]]);
            }
        }
        return {"triple_flag": 1, "field": field, "move_list": move_list, "score_add": score_add};
    }
    var ct = _count_triple_field(field);
    if (ct["triple_flag"] == 1) {
        var stack = [];
        var setfit = JSON.parse(JSON.stringify(ct["field"]));
        for (var i = 0; i < field["n"]; ++i) {
            for (var j = 0; j < field["m"]; ++j) {
                if (setfit[i][j] == 1) {
                    stack.push([i, j]);
                    var cnt = 1;
                    while (stack.length > 0) {
                        var pos = stack.shift();
                        setfit[pos[0]][pos[1]] = 0;
                        for (var k = 0; k < 4; ++k) {
                            if (0 <= pos[0] + _dmove[k][0] && pos[0] + _dmove[k][0] < field["n"] &&
                            0 <= pos[1] + _dmove[k][1] && pos[1] + _dmove[k][1] < field["m"] &&
                            setfit[pos[0] + _dmove[k][0]][pos[1] + _dmove[k][1]] == 1 &&
                            field["gems_field"][pos[0] + _dmove[k][0]][pos[1] + _dmove[k][1]] == field["gems_field"][pos[0]][pos[1]]) {
                                stack.push([pos[0] + _dmove[k][0], pos[1] + _dmove[k][1]]);
                                cnt += 1;
                            }
                        }
                    }
                    setfit[i][j] = -cnt;
                }
            }
        }
        var rubies_scores = [];
        for (var i = 0; i < field["n"]; ++i) {
            for (var j = 0; j < field["m"]; ++j) {
                if (ct["field"][i][j]) {
                    move_list.push([[i, j], [-1, -1]]);
                    if (field["gems_field"][i][j] == -1) {
                        field["score"] += score_rules["ruby_break"];
                        score_add.push([i, j, score_rules["ruby_break"]]);
                    }
                    field["gems_field"][i][j] = "removed";
                    if (field["shield_field"][i][j] > 0) {
                        field["score"] += score_rules["pop_shield"];
                        score_add.push([i, j, score_rules["pop_shield"]]);
                        field["shield_field"][i][j] -= 1;
                    }
                }
                if (setfit[i][j] == -4) {
                    move_list.push([[-1, -1], [i, j], "bonus_1"]);
                    field["gems_field"][i][j] = "bonus_1";
                } else if (setfit[i][j] == -5) {
                    move_list.push([[-1, -1], [i, j], "bonus_2"]);
                    field["gems_field"][i][j] = "bonus_2";
                } else if (setfit[i][j] <= -6) {
                    move_list.push([[-1, -1], [i, j], -1]);
                    field["gems_field"][i][j] = -1;
                    field["score"] += score_rules["ruby_get"];
                    rubies_scores.push(JSON.stringify([i, j]));
                } else if (ct["field"][i][j] && field["was_bonus_3"] == undefined && field["score"] > 3000) {
                    move_list.push([[-1, -1], [i, j], "bonus_3"]);
                    field["gems_field"][i][j] = "bonus_3";
                    field["was_bonus_3"] = true;
                }
            }
        }
        for (var j = 0; j < field["m"]; ++j) {
            var last_not_empty = [];
            for (var i = field["n"] - 1; i >= 0; --i) {
                if (field["gems_field"][i][j] != "empty" && field["gems_field"][i][j] != "removed") {
                    if (last_not_empty.length != 0) {
                        move_list.push([[i, j], [last_not_empty[0], j]]);
                        if (rubies_scores.includes(JSON.stringify([i, j]))) {
                            score_add.push([last_not_empty[0], j, score_rules["ruby_get"]]);
                        }
                        field["gems_field"][last_not_empty[0]][j] = field["gems_field"][i][j];
                        last_not_empty.push(i);
                        last_not_empty.shift();
                    } else if (rubies_scores.includes(JSON.stringify([i, j]))) {
                        score_add.push([i, j, score_rules["ruby_get"]]);
                    }
                } else if (field["gems_field"][i][j] == "removed") {
                    last_not_empty.push(i);
                }
            }
            for (var i = 0; i < last_not_empty.length; ++i) {
                if (Math.random() * field["stones_random"] < 1 && field["stones_number"] > 0) {
                    if (Math.random() * 4 < 1 && field["has_bombs"]) {
                        field["gems_field"][last_not_empty[i]][j] = "bomb";
                        --field["stones_number"];
                    } else {
                        field["gems_field"][last_not_empty[i]][j] = "stone";
                        --field["stones_number"];
                    }
                } else {
                    field["gems_field"][last_not_empty[i]][j] = Math.floor(Math.random() * field["gems_number"]) % field["gems_number"];
                }
                move_list.push([[-i - 1, j], [last_not_empty[i], j], field["gems_field"][last_not_empty[i]][j]]);
            }
        }
        return {"triple_flag": ct["triple_flag"], "field": field, "move_list": move_list, "score_add": score_add};
    }
    return {"triple_flag": ct["triple_flag"], "field": field, "help_move": ct["help_move"]};
}

function swap_two_elems_on_field(field, pos1, pos2) {
    field = JSON.parse(JSON.stringify(field));
    var score_add = [];
    if ((typeof(field["gems_field"][pos1[0]][pos1[1]]) == "number" || typeof(field["gems_field"][pos2[0]][pos2[1]]) == "number") && Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]) == 1) {
        if (typeof(field["gems_field"][pos1[0]][pos1[1]]) == "number" && typeof(field["gems_field"][pos2[0]][pos2[1]]) == "number") {
            field["gems_field"][pos1[0]][pos1[1]] += field["gems_field"][pos2[0]][pos2[1]];
            field["gems_field"][pos2[0]][pos2[1]] = field["gems_field"][pos1[0]][pos1[1]] - field["gems_field"][pos2[0]][pos2[1]];
            field["gems_field"][pos1[0]][pos1[1]] = field["gems_field"][pos1[0]][pos1[1]] - field["gems_field"][pos2[0]][pos2[1]];
            var is_good = _count_triple_field(field)["triple_flag"];
            if (is_good == 1) {
                field["score"] += score_rules["move"];
                return {"good": true, "field": field};
            } else {
                field["gems_field"][pos1[0]][pos1[1]] += field["gems_field"][pos2[0]][pos2[1]];
                field["gems_field"][pos2[0]][pos2[1]] = field["gems_field"][pos1[0]][pos1[1]] - field["gems_field"][pos2[0]][pos2[1]];
                field["gems_field"][pos1[0]][pos1[1]] = field["gems_field"][pos1[0]][pos1[1]] - field["gems_field"][pos2[0]][pos2[1]];
                return {"good": false, "field": field};
            }
        } else {
            var x = field["gems_field"][pos2[0]][pos2[1]];
            field["gems_field"][pos2[0]][pos2[1]] = field["gems_field"][pos1[0]][pos1[1]];
            field["gems_field"][pos1[0]][pos1[1]] = x;
            if (typeof(field["gems_field"][pos1[0]][pos1[1]]) == "number") {
                pos1[0] += pos2[0];
                pos2[0] = pos1[0] - pos2[0];
                pos1[0] = pos1[0] - pos2[0];
                pos1[1] += pos2[1];
                pos2[1] = pos1[1] - pos2[1];
                pos1[1] = pos1[1] - pos2[1];
            }
            if (field["gems_field"][pos1[0]][pos1[1]] == "bonus_1") {
                for (var i = -1; i <= 1; ++i) {
                    for (var j = -1; j <= 1; ++j) {
                        if (0 <= pos1[0] + i && pos1[0] + i < field["n"] &&
                        0 <= pos1[1] + j && pos1[1] + j < field["m"]) {
                            if (typeof(field["gems_field"][pos1[0] + i][pos1[1] + j]) == "number" && field["gems_field"][pos1[0] + i][pos1[1] + j] != -1) {
                                field["gems_field"][pos1[0] + i][pos1[1] + j] = "removed";
                                field["score"] += score_rules["pop_shield"] * field["shield_field"][pos1[0] + i][pos1[1] + j];
                                score_add.push([pos1[0] + i, pos1[1] + j, score_rules["pop_shield"] * field["shield_field"][pos1[0] + i][pos1[1] + j]]);
                                field["shield_field"][pos1[0] + i][pos1[1] + j] = 0;
                            } else if (field["gems_field"][pos1[0] + i][pos1[1] + j] == -1) {
                                field["gems_field"][pos1[0] + i][pos1[1] + j] = "removed";
                                field["score"] += score_rules["pop_shield"] * field["shield_field"][pos1[0] + i][pos1[1] + j];
                                score_add.push([pos1[0] + i, pos1[1] + j, score_rules["pop_shield"] * field["shield_field"][pos1[0] + i][pos1[1] + j] + score_rules["ruby_fall"]]);
                                field["shield_field"][pos1[0] + i][pos1[1] + j] = 0;
                                field["score"] += score_rules["ruby_fall"];
                            } else if (field["gems_field"][pos1[0] + i][pos1[1] + j] == "bomb") {
                                field["gems_field"][pos1[0] + i][pos1[1] + j] = "removed";
                                field["score"] += score_rules["pop_shield"] * field["shield_field"][pos1[0] + i][pos1[1] + j];
                                score_add.push([pos1[0] + i, pos1[1] + j, score_rules["pop_shield"] * field["shield_field"][pos1[0] + i][pos1[1] + j] + score_rules["bomb_boom"]]);
                                field["shield_field"][pos1[0] + i][pos1[1] + j] = 0;
                                field["score"] += score_rules["bomb_boom"];
                            } else if (field["gems_field"][pos1[0] + i][pos1[1] + j] == "bonus_1") {
                                field["gems_field"][pos1[0] + i][pos1[1] + j] = "removed";
                                field["score"] += score_rules["pop_shield"] * field["shield_field"][pos1[0] + i][pos1[1] + j];
                                score_add.push([pos1[0] + i, pos1[1] + j, score_rules["pop_shield"] * field["shield_field"][pos1[0] + i][pos1[1] + j] + score_rules["bonus_1"]]);
                                field["shield_field"][pos1[0] + i][pos1[1] + j] = 0;
                                field["score"] += score_rules["bonus_1"];
                            } else if (field["gems_field"][pos1[0] + i][pos1[1] + j] == "bonus_2") {
                                field["gems_field"][pos1[0] + i][pos1[1] + j] = "removed";
                                field["score"] += score_rules["pop_shield"] * field["shield_field"][pos1[0] + i][pos1[1] + j];
                                score_add.push([pos1[0] + i, pos1[1] + j, score_rules["pop_shield"] * field["shield_field"][pos1[0] + i][pos1[1] + j] + score_rules["bonus_2"]]);
                                field["shield_field"][pos1[0] + i][pos1[1] + j] = 0;
                                field["score"] += score_rules["bonus_2"];
                            } else if (field["gems_field"][pos1[0] + i][pos1[1] + j] == "bonus_3") {
                                field["gems_field"][pos1[0] + i][pos1[1] + j] = "removed";
                                field["score"] += score_rules["pop_shield"] * field["shield_field"][pos1[0] + i][pos1[1] + j];
                                score_add.push([pos1[0] + i, pos1[1] + j, score_rules["pop_shield"] * field["shield_field"][pos1[0] + i][pos1[1] + j] + score_rules["bonus_3"]]);
                                field["shield_field"][pos1[0] + i][pos1[1] + j] = 0;
                                field["score"] += score_rules["bonus_3"];
                            }
                        }
                    }
                }
                return {"good": true, "field": field, "score_add": score_add};
            } else if (field["gems_field"][pos1[0]][pos1[1]] == "bonus_2") {
                field["gems_field"][pos1[0]][pos1[1]] = "removed";
                field["score"] += score_rules["bonus_2"];
                field["score"] += score_rules["pop_shield"] * field["shield_field"][pos1[0]][pos1[1]];
                score_add.push([pos1[0], pos1[1], score_rules["pop_shield"] * field["shield_field"][pos1[0]][pos1[1]] + score_rules["bonus_2"]]);
                field["shield_field"][pos1[0]][pos1[1]] = 0;
                for (var k2 = 0; k2 < 4; ++k2) {
                    for (var k = 1; k <= Math.max(field["n"], field["m"]); ++k) {
                        var i = _dmove[k2][0] * k;
                        var j = _dmove[k2][1] * k;
                        if (0 <= pos1[0] + i && pos1[0] + i < field["n"] &&
                        0 <= pos1[1] + j && pos1[1] + j < field["m"]) {
                            if (typeof(field["gems_field"][pos1[0] + i][pos1[1] + j]) == "number" && field["gems_field"][pos1[0] + i][pos1[1] + j] != -1) {
                                field["gems_field"][pos1[0] + i][pos1[1] + j] = "removed";
                                field["score"] += score_rules["pop_shield"] * field["shield_field"][pos1[0] + i][pos1[1] + j];
                                score_add.push([pos1[0] + i, pos1[1] + j, score_rules["pop_shield"] * field["shield_field"][pos1[0] + i][pos1[1] + j]]);
                                field["shield_field"][pos1[0] + i][pos1[1] + j] = 0;
                            } else if (field["gems_field"][pos1[0] + i][pos1[1] + j] == -1) {
                                field["gems_field"][pos1[0] + i][pos1[1] + j] = "removed";
                                field["score"] += score_rules["pop_shield"] * field["shield_field"][pos1[0] + i][pos1[1] + j];
                                score_add.push([pos1[0] + i, pos1[1] + j, score_rules["pop_shield"] * field["shield_field"][pos1[0] + i][pos1[1] + j] + score_rules["ruby_fall"]]);
                                field["shield_field"][pos1[0] + i][pos1[1] + j] = 0;
                                field["score"] += score_rules["ruby_fall"];
                                score_add.push([pos1[0] + i, pos1[1] + j, score_rules["ruby_fall"]]);
                            } else if (field["gems_field"][pos1[0] + i][pos1[1] + j] == "bomb") {
                                field["gems_field"][pos1[0] + i][pos1[1] + j] = "removed";
                                field["score"] += score_rules["pop_shield"] * field["shield_field"][pos1[0] + i][pos1[1] + j];
                                score_add.push([pos1[0] + i, pos1[1] + j, score_rules["pop_shield"] * field["shield_field"][pos1[0] + i][pos1[1] + j] + score_rules["bomb_boom"]]);
                                field["shield_field"][pos1[0] + i][pos1[1] + j] = 0;
                                field["score"] += score_rules["bomb_boom"];
                                score_add.push([pos1[0] + i, pos1[1] + j, score_rules["bomb_boom"]]);
                            } else if (field["gems_field"][pos1[0] + i][pos1[1] + j] == "bonus_1") {
                                field["gems_field"][pos1[0] + i][pos1[1] + j] = "removed";
                                field["score"] += score_rules["pop_shield"] * field["shield_field"][pos1[0] + i][pos1[1] + j];
                                score_add.push([pos1[0] + i, pos1[1] + j, score_rules["pop_shield"] * field["shield_field"][pos1[0] + i][pos1[1] + j] + score_rules["bonus_1"]]);
                                field["shield_field"][pos1[0] + i][pos1[1] + j] = 0;
                                field["score"] += score_rules["bonus_1"];
                                score_add.push([pos1[0] + i, pos1[1] + j, score_rules["bonus_1"]]);
                            } else if (field["gems_field"][pos1[0] + i][pos1[1] + j] == "bonus_2") {
                                field["gems_field"][pos1[0] + i][pos1[1] + j] = "removed";
                                field["score"] += score_rules["pop_shield"] * field["shield_field"][pos1[0] + i][pos1[1] + j];
                                score_add.push([pos1[0] + i, pos1[1] + j, score_rules["pop_shield"] * field["shield_field"][pos1[0] + i][pos1[1] + j] + score_rules["bonus_2"]]);
                                field["shield_field"][pos1[0] + i][pos1[1] + j] = 0;
                                field["score"] += score_rules["bonus_2"];
                                score_add.push([pos1[0] + i, pos1[1] + j, score_rules["bonus_2"]]);
                            } else if (field["gems_field"][pos1[0] + i][pos1[1] + j] == "bonus_3") {
                                field["gems_field"][pos1[0] + i][pos1[1] + j] = "removed";
                                field["score"] += score_rules["pop_shield"] * field["shield_field"][pos1[0] + i][pos1[1] + j];
                                score_add.push([pos1[0] + i, pos1[1] + j, score_rules["pop_shield"] * field["shield_field"][pos1[0] + i][pos1[1] + j] + score_rules["bonus_3"]]);
                                field["shield_field"][pos1[0] + i][pos1[1] + j] = 0;
                                field["score"] += score_rules["bonus_3"];
                                score_add.push([pos1[0] + i, pos1[1] + j, score_rules["bonus_3"]]);
                            } else {
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                }
                return {"good": true, "field": field, "score_add": score_add};
            } else if (field["gems_field"][pos1[0]][pos1[1]] == "bonus_3") {
                field["gems_field"][pos1[0]][pos1[1]] = "removed";
                field["score"] += score_rules["bonus_3"];
                field["score"] += score_rules["pop_shield"] * field["shield_field"][pos1[0]][pos1[1]];
                score_add.push([pos1[0], pos1[1], score_rules["pop_shield"] * field["shield_field"][pos1[0]][pos1[1]] + score_rules["bonus_3"]]);
                field["shield_field"][pos1[0]][pos1[1]] = 0;
                for (var i = 0; i < field["n"]; ++i) {
                    for (var j = 0; j < field["m"]; ++j) {
                        if (typeof(field["gems_field"][i][j]) == "number" && field["gems_field"][i][j] != -1 && Math.random() * 4 < 1) {
                            field["gems_field"][i][j] = "removed";
                            field["score"] += score_rules["pop_shield"] * field["shield_field"][i][j];
                            score_add.push([i, j, score_rules["pop_shield"] * field["shield_field"][i][j]]);
                            field["shield_field"][i][j] = 0;
                        }
                    }
                }
                return {"good": true, "field": field, "score_add": score_add};
            }
        }
    } else {
        return {"good": false, "field": field};
    }
}

/*
Игра сначала должна либо создать новое поле, либо использовать доработанное, созданное на основе нового
Затем проверить на возможность игры
Затем запустить через run
Затем надо анимировать каждый пересчет recount_field
как только он станет 0, то надо ждать хода swap_two_elems, а после него переносить score_add и полностью передавать в recount_field
Как только он станет -1, то надо переделать карту
*/