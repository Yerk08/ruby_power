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

var shield_elms = [], gems_elms = [], black_paper = undefined;
var tile_size = 0;
const wait_time = 500;

var can_play = false;


var margin_left = 0, margin_top = 0;
function _review_field() {
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
            setTimeout(() => black_paper.style.backgroundColor = "transparent", 0);

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

                shield_elms[i][j].style.height = "0px";
                shield_elms[i][j].style.top = `${i * tile_size + margin_top + tile_size / 2}px`;
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
        var elm = document.createElement("div");
        elm.innerText = score_add[i][2];
        elm.style.fontSize = `${(tile_size * 1.5) / score_add[i][2].toString().length}px`;
        elm.style.top = `${score_add[i][0] * tile_size + margin_top}px`;
        elm.style.left = `${score_add[i][1] * tile_size + margin_left}px`;
        elm.style.color = "transparent";
        elm.style.textShadow = "";
        animation_field_div.appendChild(elm);
        todelete.push(elm);
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
    for (var ind = 0; ind < move_list.length; ++ind) {
        var r1 = move_list[ind][0][0], c1 = move_list[ind][0][1],
        r2 = move_list[ind][1][0], c2 = move_list[ind][1][1];
        if (c1 == -1) {
            var elm2 = document.createElement("img");
            elm2.src = elms_to_picture[field_new["gems_field"][r2][c2]];
            elm2.style.width = "0px";
            elm2.style.height = "0px";
            elm2.style.top = `${r2 * tile_size + margin_top + tile_size / 2}px`;
            elm2.style.left = `${c2 * tile_size + margin_left + tile_size / 2}px`;
            gems_field_div.appendChild(elm2);
            gems_elms[r2][c2] = elm2;
            console.log(r1,c1,r2,c2, elm2);
            ((r2, c2, elm2) => {setTimeout(() => {
                elm2.style.width = `${tile_size - 6}px`;
                elm2.style.height = `${tile_size - 6}px`;
                elm2.style.top = `${r2 * tile_size + 3 + margin_top}px`;
                elm2.style.left = `${c2 * tile_size + 3 + margin_left}px`;
            }, 1000)})(r2, c2, elm2);
        } else if (c2 == -1) {
            gems_elms[r1][c1].style.width = "0px";
            gems_elms[r1][c1].style.height = "0px";
            gems_elms[r1][c1].style.top = `${r1 * tile_size + margin_top + tile_size / 2}px`;
            gems_elms[r1][c1].style.left = `${c1 * tile_size + margin_left + tile_size / 2}px`;
            ((elm2) => {setTimeout(() => {
                gems_field_div.removeChild(elm2);
            }, wait_time)})(gems_elms[r1][c1]);
        }
    }
}


function play_game(field_base) {
    field = run_field(field_base);
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
    setTimeout(() => {
        ct = recount_field(field);
        show_score_field(ct["score_add"]);
        show_move_gems(ct["field"], ct["move_list"])
        update_shield_field(field, ct["field"]);
        field = ct["field"];
    }, wait_time * 3);
}

// aa = update_field_from_impossible_to_playable(get_empty_field(8, 8, 4, 0), 0);
aa = get_empty_field(8, 8, 2, 3), 0;
aa["gems_field"][0][0]="empty";
aa["gems_field"][7][0]="empty";
aa["gems_field"][7][7]="empty";
aa["gems_field"][0][7]="empty";
play_game(aa);
addEventListener("resize", update_all_field);