function get_empty_field(n, m, gems_number = 4, shield_number = 0, boxes_number = 1, boxes_random = 5) {
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
    return JSON.stringify({"gems_field": field, "shield_field": shield, "n": n, "m": m, "gems_number": gems_number, "shield_number": shield_number, "boxes_number": boxes_number, "boxes_random": boxes_random});
}

function check_field_is_possible(field) {
    field = JSON.parse(field);
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
    field = JSON.parse(field);
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
    return JSON.stringify(field);
}

const _dmove = [[0, 1], [1, 0], [0, -1], [-1, 0]];
function _count_triple_field(field) {
    field = JSON.parse(field);
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
        return JSON.stringify({"triple_flag": triple_flag, "field": to_delete_field});
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
                                    field["gems_field"][i][j] == field["gems_field"][i + _dmove[k][0] * 2 + _dmove[k2][0]][j + _dmove[k][1] * 2 + _dmove[k2][1]]) {
                                    triple_flag = 0;
                                    return JSON.stringify({"triple_flag": triple_flag});
                                }
                            }
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
                                    field["gems_field"][i][j] == field["gems_field"][i + _dmove[k][0] + _dmove[k2][0]][j + _dmove[k][1] + _dmove[k2][1]]) {
                                    triple_flag = 0;
                                    return JSON.stringify({"triple_flag": triple_flag});
                                }
                            }
                        }
                    }
                }
            }
        }
        triple_flag = -1;
        return JSON.stringify({"triple_flag": triple_flag});
    }
}

function update_field_from_impossible_to_playable(field, tryies = -1) {
    field = JSON.parse(field);
    for (var t = 0; t < tryies || tryies == -1; ++t) {
        for (var i = 0; i < field["n"]; ++i) {
            for (var j = 0; j < field["m"]; ++j) {
                if (typeof(field["gems_field"][i][j]) == "number" || field["gems_field"][i][j] == "gem") {
                    field["gems_field"][i][j] = Math.floor(Math.random() * field["gems_number"]) % field["gems_number"];
                }
            }
        }
        var is_good = JSON.parse(_count_triple_field(JSON.stringify(field)))["triple_flag"];
        if (is_good == 0) {
            return JSON.stringify(field);
        }
    }
    return JSON.stringify(field);
}

function recount_field(field) {
    field = JSON.parse(field);
    var move_list = [];
    for (var j = 0; j < field["m"]; ++j) {
        if (field["shield_field"][0][j] == "box") {
            move_list.push([[0, j], [-1, j]]);
            field["gems_field"][0][j] = "removed";
        }
    }
    var ct = JSON.parse(_count_triple_field(JSON.stringify(field)));
    if (ct["triple_flag"] == 1) {
        for (var i = 0; i < field["n"]; ++i) {
            for (var j = 0; j < field["m"]; ++j) {
                if (ct["field"][i][j]) {
                    move_list.push([[i, j], [-1, j]]);
                    field["gems_field"][i][j] = "removed";
                    if (field["shield_field"][i][j] > 0) {
                        field["shield_field"][i][j] -= 1;
                    }
                }
            }
        }
        for (var j = 0; j < field["m"]; ++j) {
            var last_not_empty = [];
            for (var i = 0; i < field["n"]; ++i) {
                if (typeof(field["gems_field"][i][j]) == "number") {
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
                move_list.push([[-1, j], [last_not_empty[i], j]]);
                if (Math.random() * field["boxes_random"] < 1 && field["boxes_number"] > 0) {
                    field["gems_field"][last_not_empty[i]][j] = "box";
                    --field["boxes_number"];
                } else {
                    field["gems_field"][last_not_empty[i]][j] = Math.floor(Math.random() * field["gems_number"]) % field["gems_number"];
                }
            }
        }
        return JSON.stringify({"triple_flag": ct["triple_flag"], "field": field, "move_list": move_list});
    }
    return JSON.stringify({"triple_flag": ct["triple_flag"], "field": field});
}

function swap_two_elems_on_field(field, pos1, pos2) {
    field = JSON.parse(field);
    var move_list = [];
    if (typeof(field["gems_field"][pos1[0]][pos1[1]]) == "number" && typeof(field["gems_field"][pos2[0]][pos2[1]]) == "number" && Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]) == 1) {
        field["gems_field"][pos1[0]][pos1[1]] += field["gems_field"][pos2[0]][pos2[1]];
        field["gems_field"][pos2[0]][pos2[1]] = field["gems_field"][pos1[0]][pos1[1]] - field["gems_field"][pos2[0]][pos2[1]];
        field["gems_field"][pos1[0]][pos1[1]] = field["gems_field"][pos1[0]][pos1[1]] - field["gems_field"][pos2[0]][pos2[1]];
        var is_good = JSON.parse(_count_triple_field(JSON.stringify(field)))["triple_flag"];
        if (is_good == 1) {
            return JSON.stringify({"good": true, "field": field});
        } else {
            field["gems_field"][pos1[0]][pos1[1]] += field["gems_field"][pos2[0]][pos2[1]];
            field["gems_field"][pos2[0]][pos2[1]] = field["gems_field"][pos1[0]][pos1[1]] - field["gems_field"][pos2[0]][pos2[1]];
            field["gems_field"][pos1[0]][pos1[1]] = field["gems_field"][pos1[0]][pos1[1]] - field["gems_field"][pos2[0]][pos2[1]];
            return JSON.stringify({"good": false, "field": field});
        }
    } else {
        return JSON.stringify({"good": false, "field": field});
    }
}

a = get_empty_field(3, 3);
console.log(check_field_is_possible(a));
console.log(a);
a = run_field(a);
console.log(a);
console.log(recount_field(a));