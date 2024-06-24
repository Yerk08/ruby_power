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
    "gem": "images/gem.png",
    "bonus_1": "images/bonus_1.png",
    "bonus_2": "images/bonus_2.png",
    "bonus_3": "images/bonus_3.png"
};
const elms_shield_to_picture = ["images/shield_0.jpg","images/shield_1.jpg","images/shield_2.jpg","images/shield_3.jpg"];

const shield_field_div = document.getElementById("shield_field");
const gems_field_div = document.getElementById("gems_field");
const animation_field_div = document.getElementById("animation_field");
var field = {};
var tile_size = 0;
const wait_time = 300;

var can_play = false;

function update_tile_size() {
    if (field["gems_field"] != undefined) {
        tile_size = Math.min(window.innerHeight / field["n"], window.innerWidth / field["m"]);
    }
}

function play_game(field_base) {
    field = run_field(field_base);
    update_tile_size();
    for (var i = 0; i < field["n"]; ++i) {
        for (var j = 0; j < field["m"]; ++j) {
            var elm2 = document.createElement("img");
            elm2.src = elms_to_picture[field["gems_field"][i][j]];
            elm2.style.width = `${tile_size - 6}px`;
            elm2.style.height = `${tile_size - 6}px`;
            elm2.style.top = `${i * tile_size + 3}px`;
            elm2.style.left = `${j * tile_size + 3}px`;
            gems_field_div.appendChild(elm2);

            var elm = document.createElement("img");
            elm.src = elms_shield_to_picture[field["shield_field"][i][j]];
            elm.style.width = `${tile_size}px`;
            elm.style.height = `${tile_size}px`;
            elm.style.top = `${i * tile_size}px`;
            elm.style.left = `${j * tile_size}px`;
            shield_field_div.appendChild(elm);
        }
    }
}

play_game(get_empty_field(8, 8, 7, 0));
addEventListener("resize", update_tile_size);