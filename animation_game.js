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
    "7": "images/gem_black_diamond.png",
    "-1": "images/ruby.png",
    "gem": "images/gem.png",
    "bonus_1": "images/bonus_1.png",
    "bonus_2": "images/bonus_2.png",
    "bonus_3": "images/bonus_3.png",
    "empty": "images/empty.jpg"
};
const elms_shield_to_picture = ["images/shield_0.jpg","images/shield_1.jpg","images/shield_2.jpg","images/shield_3.jpg"];

const shield_field_div = document.getElementById("shield_field");
const shield_field_was_div = document.getElementById("shield_field_was");
const gems_field_div = document.getElementById("gems_field");
const animation_field_div = document.getElementById("animation_field");
const score_div = document.getElementById("score");
var field = {};

var shield_elms = [], gems_elms = [], black_paper = undefined, left_paper = undefined, right_paper = undefined;
var tile_size = 0;
const wait_time = 300;

var can_play = false;


var last_click = [-1, -1];
var is_touch_pad = false;
var margin_left = 0, margin_top = 0;
function _review_field() {
    last_click = [-1, -1];
    is_touch_pad = false;
    for (var i = 0; i < field["n"]; ++i) {
        for (var j = 0; j < field["m"]; ++j) {
            if (shield_elms[i][j] != undefined) {
                shield_field_div.removeChild(shield_elms[i][j]);
            }
            if (gems_elms[i][j] != undefined) {
                gems_field_div.removeChild(gems_elms[i][j]);
            }
            if (black_paper != undefined) {
                animation_field_div.removeChild(black_paper);
            }
            black_paper = document.createElement("div");
            black_paper.style.top = `${margin_top}px`;
            black_paper.style.left = `${margin_left}px`;
            black_paper.style.width = `${field['m'] * tile_size + 1}px`;
            black_paper.style.height = `${field['n'] * tile_size + 1}px`;
            black_paper.style.backgroundColor = "black";
            animation_field_div.appendChild(black_paper);

            if (left_paper != undefined) {
                animation_field_div.removeChild(left_paper);
            }
            if (right_paper != undefined) {
                animation_field_div.removeChild(right_paper);
            }
            if (margin_top == 0) {
                left_paper = document.createElement("div");
                left_paper.style.top = `${margin_top}px`;
                left_paper.style.left = `${0}px`;
                left_paper.style.width = `${margin_left + 1}px`;
                left_paper.style.height = `${window.innerHeight}px`;
                left_paper.style.backgroundColor = "black";
                animation_field_div.appendChild(left_paper);

                right_paper = document.createElement("div");
                right_paper.style.top = `${0}px`;
                right_paper.style.left = `${field['m'] * tile_size + margin_left}px`;
                right_paper.style.width = `${window.innerWidth}px`;
                right_paper.style.height = `${window.innerHeight}px`;
                right_paper.style.backgroundColor = "black";
                animation_field_div.appendChild(right_paper);
            } else {
                left_paper = document.createElement("div");
                left_paper.style.top = `${0}px`;
                left_paper.style.left = `${margin_left}px`;
                left_paper.style.width = `${window.innerWidth}px`;
                left_paper.style.height = `${margin_top + 1}px`;
                left_paper.style.backgroundColor = "black";
                animation_field_div.appendChild(left_paper);

                right_paper = document.createElement("div");
                right_paper.style.top = `${field['n'] * tile_size + margin_top}px`;
                right_paper.style.left = `${0}px`;
                right_paper.style.width = `${window.innerWidth}px`;
                right_paper.style.height = `${window.innerHeight}px`;
                right_paper.style.backgroundColor = "black";
                animation_field_div.appendChild(right_paper);
            }

            if (field["gems_field"][i][j] != "empty") {
                var elm2 = document.createElement("img");
                elm2.src = elms_to_picture[field["gems_field"][i][j]];
                elm2.style.width = `${tile_size - 6}px`;
                elm2.style.height = `${tile_size - 6}px`;
                elm2.style.top = `${i * tile_size + 3 + margin_top}px`;
                elm2.style.left = `${j * tile_size + 3 + margin_left}px`;
                gems_field_div.appendChild(elm2);
                gems_elms[i][j] = elm2;

                var elm = document.createElement("img");
                elm.src = elms_shield_to_picture[field["shield_field"][i][j]];
                elm.style.width = `${tile_size + 1}px`;
                elm.style.height = `${tile_size + 1}px`;
                elm.style.top = `${i * tile_size + margin_top}px`;
                elm.style.left = `${j * tile_size + margin_left}px`;
                shield_field_div.appendChild(elm);
                shield_elms[i][j] = elm;
            } else {
                gems_elms[i][j] = undefined;
                var elm = document.createElement("img");
                elm.src = elms_to_picture[field["gems_field"][i][j]];
                elm.style.width = `${tile_size + 1}px`;
                elm.style.height = `${tile_size + 1}px`;
                elm.style.top = `${i * tile_size + margin_top}px`;
                elm.style.left = `${j * tile_size + margin_left}px`;
                shield_field_div.appendChild(elm);
                shield_elms[i][j] = elm;
            }
        }
    }
    setTimeout(() => black_paper.style.backgroundColor = "transparent", 10);
}
function update_all_field() {
    if (field["gems_field"] != undefined) {
        margin_left = 0;
        margin_top = 0;
        tile_size = Math.min(window.innerHeight / field["n"], window.innerWidth / field["m"]);
        if (window.innerHeight / field["n"] < window.innerWidth / field["m"]) {
            margin_left = 100;
            tile_size = Math.min(window.innerHeight / field["n"], (window.innerWidth - margin_left) / field["m"]);
        } else {
            margin_top = 100;
            tile_size = Math.min((window.innerHeight - margin_top) / field["n"], window.innerWidth / field["m"]);
        }
        _review_field();
    }
}


function update_shield_field(field, field_new) {
    var todelete = [];
    for (var i = 0; i < field["n"]; ++i) {
        for (var j = 0; j < field["m"]; ++j) {
            if (field["shield_field"][i][j] != field_new["shield_field"][i][j]) {
                var elm = document.createElement("img");
                elm.src = elms_shield_to_picture[field_new["shield_field"][i][j]];
                elm.style.width = `${tile_size + 1}px`;
                elm.style.height = `${tile_size + 1}px`;
                elm.style.top = `${i * tile_size + margin_top}px`;
                elm.style.left = `${j * tile_size + margin_left}px`;
                shield_field_was_div.appendChild(elm);

                shield_elms[i][j].style.opacity = "0";
                // shield_elms[i][j].style.height = "0px";
                // shield_elms[i][j].style.top = `${i * tile_size + margin_top + tile_size / 2}px`;
                todelete.push(shield_elms[i][j]);
                shield_elms[i][j] = elm;
            }
        }
    }
    setTimeout(() => {
        for (var i = 0; i < field["n"]; ++i) {
            for (var j = 0; j < field["m"]; ++j) {
                if (field["shield_field"][i][j] != field_new["shield_field"][i][j]) {
                    shield_field_was_div.removeChild(shield_elms[i][j]);
                    shield_field_div.appendChild(shield_elms[i][j]);
                }
            }
        }
        todelete.forEach(todel => {
            shield_field_div.removeChild(todel);
        });
    }, wait_time);
}


function show_score_field(score_add) {
    var todelete = [];
    for (var i = 0; i < score_add.length; ++i) {
        if (score_add[i][2] != 0) {
            var elm = document.createElement("div");
            elm.innerText = score_add[i][2];
            elm.style.fontSize = `${(tile_size * 1.5) / score_add[i][2].toString().length}px`;
            elm.style.width = `${tile_size}px`;
            elm.style.height = `${tile_size}px`;
            elm.style.top = `${score_add[i][0] * tile_size + margin_top}px`;
            elm.style.left = `${score_add[i][1] * tile_size + margin_left}px`;
            elm.style.color = "transparent";
            elm.style.textShadow = "";
            animation_field_div.appendChild(elm);
            todelete.push(elm);
        }
    }
    setTimeout(() => {
        todelete.forEach(todel => {
            todel.style.color = "white";
            todel.style.textShadow = "black 3px 3px";
        });
    }, wait_time);
    setTimeout(() => {
        todelete.forEach(todel => {
            todel.style.color = "transparent";
            todel.style.textShadow = "";
        });
    }, wait_time * 3);
    setTimeout(() => {
        todelete.forEach(todel => {
            animation_field_div.removeChild(todel);
        });
    }, wait_time * 4);
}

function show_move_gems(field_new, move_list) {
    var update_animation_list_1 = [], update_animation_list_2 = [];
    for (var ind = 0; ind < move_list.length; ++ind) {
        var r1 = move_list[ind][0][0], c1 = move_list[ind][0][1],
        r2 = move_list[ind][1][0], c2 = move_list[ind][1][1];
        if (c1 == -1) {
            var elm2 = document.createElement("img");
            elm2.src = elms_to_picture[move_list[ind][2]];
            elm2.style.width = "0px";
            elm2.style.height = "0px";
            elm2.style.top = `${r2 * tile_size + margin_top + tile_size / 2}px`;
            elm2.style.left = `${c2 * tile_size + margin_left + tile_size / 2}px`;
            gems_field_div.appendChild(elm2);
            gems_elms[r2][c2] = elm2;
            update_animation_list_1.push(elm2);
            ((elm2) => {setTimeout(() => {
                elm2.style.width = `${tile_size + 6}px`;
                elm2.style.height = `${tile_size + 6}px`;
                elm2.style.top = `${parseFloat(elm2.style.top.slice(0, -2)) - tile_size / 2 - 3}px`;
                elm2.style.left = `${parseFloat(elm2.style.left.slice(0, -2)) - tile_size / 2 - 3}px`;
            }, 30)})(elm2);
            ((elm2) => {setTimeout(() => {
                elm2.style.width = `${tile_size - 6}px`;
                elm2.style.height = `${tile_size - 6}px`;
                elm2.style.top = `${parseFloat(elm2.style.top.slice(0, -2)) + 6}px`;
                elm2.style.left = `${parseFloat(elm2.style.left.slice(0, -2)) + 6}px`;
            }, wait_time)})(elm2);
        } else if (c2 == -1) {
            gems_elms[r1][c1].style.width = "0px";
            gems_elms[r1][c1].style.height = "0px";
            gems_elms[r1][c1].style.top = `${r1 * tile_size + margin_top + tile_size / 2}px`;
            gems_elms[r1][c1].style.left = `${c1 * tile_size + margin_left + tile_size / 2}px`;
            ((elm2) => {setTimeout(() => {
                gems_field_div.removeChild(elm2);
            }, wait_time)})(gems_elms[r1][c1]);
        } else if (r1 < 0) {
            var elm2 = document.createElement("img");
            elm2.src = elms_to_picture[move_list[ind][2]];
            elm2.style.width = `${tile_size - 6}px`;
            elm2.style.height = `${tile_size - 6}px`;
            elm2.style.top = `${r1 * tile_size + 3 + margin_top}px`;
            elm2.style.left = `${c2 * tile_size + 3 + margin_left}px`;
            gems_field_div.appendChild(elm2);
            gems_elms[r2][c2] = elm2;
            update_animation_list_2.push([r2, elm2]);
        } else if (r2 < 0) {
            gems_elms[r1][c1].style.top = `${field["n"] * tile_size + margin_top}px`;
            ((elm2) => {setTimeout(() => {
                gems_field_div.removeChild(elm2);
            }, wait_time)})(gems_elms[r1][c1]);
        } else {
            gems_elms[r1][c1].style.top = `${parseFloat(gems_elms[r1][c1].style.top.slice(0, -2)) + (r2 - r1) * tile_size}px`;
            gems_elms[r2][c2] = gems_elms[r1][c1];
            gems_elms[r1][c1] = undefined;
        }
    }
    setTimeout(() => update_animation_list_2.forEach(element => {
        element[1].style.top = `${element[0] * tile_size + 3 + margin_top}px`;
    }), 30);
}

function swap_two_elems(pos1, pos2) {
    var x1 = gems_elms[pos1[0]][pos1[1]].style.left;
    var y1 = gems_elms[pos1[0]][pos1[1]].style.top;
    gems_elms[pos1[0]][pos1[1]].style.left = gems_elms[pos2[0]][pos2[1]].style.left;
    gems_elms[pos1[0]][pos1[1]].style.top = gems_elms[pos2[0]][pos2[1]].style.top;
    gems_elms[pos2[0]][pos2[1]].style.left = x1;
    gems_elms[pos2[0]][pos2[1]].style.top = y1;
    var elm = gems_elms[pos1[0]][pos1[1]];
    gems_elms[pos1[0]][pos1[1]] = gems_elms[pos2[0]][pos2[1]];
    gems_elms[pos2[0]][pos2[1]] = elm;
}


var was_bad = false;
var help_move;
function after_move() {
    ct = recount_field(field);
    if (ct["triple_flag"] == 1) {
        was_bad = false;
        show_score_field(ct["score_add"]);
        show_move_gems(ct["field"], ct["move_list"])
        update_shield_field(field, ct["field"]);
        field = ct["field"];
        setTimeout(() => after_move(), wait_time * 2);
    } else if (ct["triple_flag"] == -1) {
        if (was_bad) {
            was_bad = true;
            field = update_field_from_impossible_to_playable(field, field["n"] * field["m"] * 20);
            update_all_field();
            setTimeout(() => after_move(), wait_time + 100);
        } else {
            for (var i = 0; i < field["n"]; ++i) {
                for (var j = 0; j < field["m"]; ++j) {
                    if (typeof(field["gems_field"][i][j]) == "number") {
                        field["gems_field"][i][j] = "gem";
                    }
                }
            }
            update_all_field();
        }
    } else {
        was_bad = false;
        can_play = true;
    }
}

function my_move(pos1, pos2) {
    var ct = swap_two_elems_on_field(field, pos1, pos2);
    swap_two_elems(pos1, pos2);
    setTimeout(() => {
        can_play = false;
        if (ct["good"]) {
            var score_add = ct["score_add"];
            if (ct["score_add"] == undefined) {
                score_add = [];
            }
            ct = recount_field(ct["field"]);
            was_bad = false;
            show_score_field(score_add.concat(ct["score_add"]));
            show_move_gems(ct["field"], ct["move_list"])
            update_shield_field(field, ct["field"]);
            field = ct["field"];
            setTimeout(() => after_move(), wait_time * 2);
        } else {
            swap_two_elems(pos1, pos2);
            can_play = true;
        }
    }, wait_time);
}

function start_play_game(field_base) {
    field = update_field_from_impossible_to_playable(run_field(field_base), field_base["n"] * field_base["m"] * 20);
    gems_elms = [];
    shield_elms = [];
    for (var i = 0; i < field["n"]; ++i) {
        gems_elms.push([]);
        shield_elms.push([]);
        for (var j = 0; j < field["m"]; ++j) {
            gems_elms[i].push(undefined);
            shield_elms[i].push(undefined);
        }
    }
    update_all_field();
    setTimeout(() => after_move(), wait_time);
}

addEventListener("resize", update_all_field);

function press_down_mouse(event) {
    var pos = [-1, -1];
    if (event.changedTouches == undefined && !is_touch_pad) {
        var pos = [Math.floor((event.clientY - margin_top) / tile_size), Math.floor((event.clientX - margin_left) / tile_size)];
    } else {
        is_touch_pad = true;
        var pos = [Math.floor((event.changedTouches[0].pageY - margin_top) / tile_size), Math.floor((event.changedTouches[0].pageX - margin_left) / tile_size)];
    }
    if (0 <= pos[0] && pos[0] < field["n"] && 0 <= pos[1] && pos[1] < field["m"] && can_play) {
        if (last_click[0] == -1) {
            if (typeof(field["gems_field"][pos[0]][pos[1]]) == "number" || field["gems_field"][pos[0]][pos[1]] == "bonus_1" || field["gems_field"][pos[0]][pos[1]] == "bonus_2" || field["gems_field"][pos[0]][pos[1]] == "bonus_3") {
                last_click = pos;
                gems_elms[pos[0]][pos[1]].style.transform = "scale(2.0)";
            } else {
                last_click = -1;
            }
        } else {
            gems_elms[last_click[0]][last_click[1]].style.transform = "";
            if (Math.abs(last_click[0] - pos[0]) + Math.abs(last_click[1] - pos[1]) == 1 && (typeof(field["gems_field"][pos[0]][pos[1]]) == "number" || field["gems_field"][pos[0]][pos[1]] == "bonus_1" || field["gems_field"][pos[0]][pos[1]] == "bonus_2" || field["gems_field"][pos[0]][pos[1]] == "bonus_3")) {
                my_move(last_click, pos);
            }
            last_click = [-1, -1];
        }
    }
}
function press_up_mouse(event) {
    var pos = [-1, -1];
    if (event.changedTouches == undefined && !is_touch_pad) {
        var pos = [Math.floor((event.clientY - margin_top) / tile_size), Math.floor((event.clientX - margin_left) / tile_size)];
    } else {
        is_touch_pad = true;
        var pos = [Math.floor((event.changedTouches[0].pageY - margin_top) / tile_size), Math.floor((event.changedTouches[0].pageX - margin_left) / tile_size)];
    }
    if (0 <= pos[0] && pos[0] < field["n"] && 0 <= pos[1] && pos[1] < field["m"] && can_play) {
        if (last_click[0] != -1 && (last_click[0] != pos[0] || last_click[1] != pos[1])) {
            if (last_click[0] == -1) {
                if (typeof(field["gems_field"][pos[0]][pos[1]]) == "number" || field["gems_field"][pos[0]][pos[1]] == "bonus_1" || field["gems_field"][pos[0]][pos[1]] == "bonus_2" || field["gems_field"][pos[0]][pos[1]] == "bonus_3") {
                    last_click = pos;
                    gems_elms[pos[0]][pos[1]].style.transform = "scale(2.0)";
                } else {
                    last_click = -1;
                }
            } else {
                gems_elms[last_click[0]][last_click[1]].style.transform = "";
                if (Math.abs(last_click[0] - pos[0]) + Math.abs(last_click[1] - pos[1]) == 1 && (typeof(field["gems_field"][pos[0]][pos[1]]) == "number" || field["gems_field"][pos[0]][pos[1]] == "bonus_1" || field["gems_field"][pos[0]][pos[1]] == "bonus_2" || field["gems_field"][pos[0]][pos[1]] == "bonus_3")) {
                    my_move(last_click, pos);
                }
                last_click = [-1, -1];
            }
        }
    }
}

onmousedown = press_down_mouse;
onmouseup = press_up_mouse;
window.addEventListener("touchstart", press_down_mouse);
window.addEventListener("touchend", press_up_mouse);


field_base = get_empty_field(9, 9, 4, 2, 8, 10);
start_play_game(field_base);