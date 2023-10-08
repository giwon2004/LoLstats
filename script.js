window.onload = function(){

async function read_file(num) {
	const response = await fetch("https://giwon2004.github.io/LoLstats/data/${num}.json");
	if (response.status === 200)
		return response.json;
	else
		return false;
}

function read_data() {
	var num = 1;
	var res = {};
	var data = {};
	while (true) {
		data = read_file(num);
		if(data)
			res[num] = data;
		else
			break;
		num++;
	}
	return res;
}

function player_statistics(name){
	var win = 0;
	var lose = 0;
	var team = {};
	var position = {"top": 0, "jgl": 0, "mid": 0, "bot": 0, "sup": 0};
	var champion = {};
	read_files((content) => {
		if (name in content["teamA"])
			team = content["teamA"];
		else if (name in content["teamB"])
			team = content["teamA"];
		else
			return;
		player = team[name];
		if (!(player["champion"] in champion)) {
			champion[player["champion"]] = {"win": 0, "lose": 0};
		}
		if (team["status"] == "WIN") {
			win++;
			champion[player["champion"]]["win"]++;
		}
		else {
			lose++;
			champion[player["champion"]]["lose"]++;
		}
		position[player["position"]]++;

	});
	return {"win": win, "lose": lose, "total": win + lose, "position": position, "champion": champion};
}

function get_player_list() {
	const response = fetch("https://giwon2004.github.io/LoLstats/player_info.json");
	return response.json();
}

function make_list(data) {
	var html = "<ul>"
	for (name in Object.keys(data)) {
		pstat = player_statistics(name);
		html += "\n\t<li>" + name + ":" + pstat["win"] + "</li>"
	}
	html += "\n</ul>";
	return html
}

var names = [];
var battle_history = await read_data();
console.log(battle_history);
}