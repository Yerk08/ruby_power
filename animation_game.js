const elms_to_picture = {
    "bomb": "images/bomb.jpg",
    "stone": "images/stone.jpg",
    "0": "images/gem0.png",
    "1": "images/gem1.png",
    "2": "images/gem2.png",
    "3": "images/gem3.png",
    "4": "images/gem4.png",
    "5": "images/gem_silver.png",
    "6": "images/gem_gold.png",
    "-1": "images/ruby.png",
    "gem": "images/gem.png"
};
const elms_shield_to_picture = ["images/shield_0.jpg","images/shield_1.jpg","images/shield_2.jpg","images/shield_3.jpg"];

const shield_field_div = document.getElementById("shield_field");
const gems_field_div = document.getElementById("gems_field");
const animation_field_div = document.getElementById("animation_field");
var field = {};
var gems_field_show = [];
var shield_field_show = [];
var tile_size = 0;
var can_play = false;

function update_tile_size() {
    if (field["gems_field"] != undefined) {
        tile_size = Math.min(window.innerHeight / field["n"], window.innerWidth / field["m"]);
        for (var i = 0; i < gems_field_show.length; ++i) {
            for (var j = 0; j < gems_field_show[0].length; ++j) {
                gems_field_show[i][j].style.width = `${tile_size}px`;
                gems_field_show[i][j].style.height = `${tile_size}px`;
                gems_field_show[i][j].style.top = `${i * tile_size}px`;
                gems_field_show[i][j].style.left = `${j * tile_size}px`;
                shield_field_show[i][j].style.width = `${tile_size}px`;
                shield_field_show[i][j].style.height = `${tile_size}px`;
                shield_field_show[i][j].style.top = `${i * tile_size}px`;
                shield_field_show[i][j].style.left = `${j * tile_size}px`;
            }
        }
    }
}

function _add_picture_from_empty_help(elm, i, j) {
    elm.style.width = `${tile_size}px`;
    elm.style.height = `${tile_size}px`;
    elm.style.top = `${i * tile_size}px`;
    elm.style.left = `${j * tile_size}px`;
}
function add_picture_from_empty(image, i, j, where) {
    elm = document.createElement("img");
    elm.src = image;
    elm.style.width = `${0}px`;
    elm.style.height = `${0}px`;
    elm.style.top = `${i * tile_size + tile_size / 2}px`;
    elm.style.left = `${j * tile_size + tile_size / 2}px`;
    where.appendChild(elm);
    return elm;
}

function _add_picture_from_top_help(elm, i) {
    elm.style.top = `${i * tile_size}px`;
}
function add_picture_from_top(image, i, j, where) {
    elm = document.createElement("img");
    elm.src = image;
    elm.style.width = `${tile_size}px`;
    elm.style.height = `${tile_size}px`;
    elm.style.top = `${-(tile_size * (field["n"] - i))}px`;
    elm.style.left = `${j * tile_size}px`;
    where.appendChild(elm);
    return elm;
}

function _remove_picture(elm, where) {
    where.removeChild(elm);
}
function remove_picture_to_empty(elm, i, j, where) {
    elm.style.width = `${0}px`;
    elm.style.height = `${0}px`;
    elm.style.top = `${i * tile_size + tile_size / 2}px`;
    elm.style.left = `${j * tile_size + tile_size / 2}px`;
    setTimeout(() => _remove_picture(elm, where), 10000);
}
function remove_picture_to_bottom(elm, where) {
    elm.style.top = `${field['n'] * tile_size}px`;
    setTimeout(() => _remove_picture(elm, where), 10000);
}

function update_field() {
    var crt = recount_field(field);
    if (crt["triple_flag"] == 1) {
        move_list = crt["move_list"];
        score_list = crt["score_add"];
        field = crt["field"];
        for (var i = 0; i < move_list.length; ++i) {
            if (move_list[i][1][0] == -1 && move_list[i][1][1] == -1) {
                remove_picture_to_empty(gems_field_show[move_list[i][0][0]][move_list[i][0][1]], move_list[i][0][0], move_list[i][0][1], gems_field_div);
            } else if (move_list[i][1][0] <= -1) {
                remove_picture_to_bottom(gems_field_show[move_list[i][0][0]][move_list[i][0][1]], gems_field_div);
            } else if (move_list[i][0][0] <= -1) {
                console.log(crt["field"]["gems_field"][move_list[i][1][0]][move_list[i][1][1]]);
                gems_field_show[move_list[i][1][0]][move_list[i][1][1]] = add_picture_from_top(elms_to_picture[crt["field"]["gems_field"][move_list[i][1][0]][move_list[i][1][1]].toString()], move_list[i][1][0], move_list[i][1][1], gems_field_div);
            } else {
                gems_field_show[move_list[i][0][0]][move_list[i][0][1]].top = `${(move_list[i][1][0] * tile_size)}px`;
                gems_field_show[move_list[i][1][0]][move_list[i][1][1]] = gems_field_show[move_list[i][0][0]][move_list[i][0][1]];
                gems_field_show[move_list[i][0][0]][move_list[i][0][1]] = undefined;
            }
        }
        field = crt["field"];
        setTimeout(() => update_field(), 400);
    } else if (crt["triple_flag"] == 0) {
        can_play = true;
    } else if (crt["triple_flag"] == -1) {
        field_2 = update_field_from_impossible_to_playable(field);
        for (var i = 0; i < field["n"]; ++i) {
            for (var j = 0; j < field["m"]; ++j) {
                if (field["gems_field"][i][j] != field_2["gems_field"][i][j]) {
                    remove_picture_to_empty(gems_field_show[i][j], i, j, gems_field_div);
                    gems_field_show[i][j] = add_picture_from_empty(elms_to_picture[field_2["gems_field"][i][j].toString()], i, j, gems_field_div);
                }
            }
        }
        field = field_2;
    }
}

function run_game(field_get) {
    field = run_field(field_get);
    update_tile_size();
    gems_field_show = [];
    shield_field_show = [];
    for (var i = 0; i < field["n"]; ++i) {
        gems_field_show.push([]);
        shield_field_show.push([]);
        for (var j = 0; j < field["m"]; ++j) {
            if (field["gems_field"][i][j] != "empty") {
                shield_field_show[i].push(add_picture_from_empty(elms_shield_to_picture[field["shield_field"][i][j]], i, j, shield_field_div));
                gems_field_show[i].push(add_picture_from_top(elms_to_picture[field["gems_field"][i][j].toString()], i, j, gems_field_div));
            } else {
                gems_field_show[i].push(null);
            }
        }
    }
    setTimeout(() => {
        for (var i = 0; i < field["n"]; ++i) {
            for (var j = 0; j < field["m"]; ++j) {
                if (field["gems_field"][i][j] != "empty") {
                    _add_picture_from_empty_help(shield_field_show[i][j], i, j);
                }
            }
        }
    }, 100);
    setTimeout(() => {
        for (var i = 0; i < field["n"]; ++i) {
            for (var j = 0; j < field["m"]; ++j) {
                if (field["gems_field"][i][j] != "empty") {
                    _add_picture_from_top_help(gems_field_show[i][j], i);
                }
            }
        }
        setTimeout(() => update_field(), 400);
    }, 500);
}

run_game(get_empty_field(7, 7, 4));
addEventListener("resize", update_tile_size);