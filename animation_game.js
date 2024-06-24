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
function add_picture_from_empty(image, i, j) {
    elm = document.createElement("img");
    elm.src = image;
    elm.style.width = `${0}px`;
    elm.style.height = `${0}px`;
    elm.style.top = `${i * tile_size + tile_size / 2}px`;
    elm.style.left = `${j * tile_size + tile_size / 2}px`;
    gems_field_div.appendChild(elm);
    return elm;
}

function _add_picture_from_top_help(elm, i) {
    elm.style.top = `${i * tile_size}px`;
}
function add_picture_from_top(image, i, j) {
    elm = document.createElement("img");
    elm.src = image;
    elm.style.width = `${tile_size}px`;
    elm.style.height = `${tile_size}px`;
    elm.style.top = `${-(tile_size * i)}px`;
    elm.style.left = `${j * tile_size}px`;
    gems_field_div.appendChild(elm);
    return elm;
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
                shield_field_show[i].push(add_picture_from_empty(elms_shield_to_picture[field["shield_field"][i][j]], i, j));
                gems_field_show[i].push(add_picture_from_top(elms_to_picture[field["gems_field"][i][j].toString()], i, j));
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
                    _add_picture_from_top_help(gems_field_show[i][j], i);
                }
            }
        }
    }, 100);
}

run_game(get_empty_field(7, 7));
addEventListener("resize", update_tile_size);