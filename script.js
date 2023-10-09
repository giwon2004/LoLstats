window.onload = function(){

function read_file(num) {
	const baseURL = 'https://giwon2004.github.io/LoLstats/data/';
	const url = `${baseURL}${num}.json`;

	const xhr = new XMLHttpRequest();
	xhr.open('GET', url, false); // Use synchronous request
	xhr.send();

	if (xhr.status === 200) {
		const jsonData = JSON.parse(xhr.responseText);
		return jsonData;
	} else {
		console.error(`Error fetching ${num}.json: ${xhr.status} ${xhr.statusText}`);
		return null; // Return null to indicate an error
	}
}

function read_data() {
	var num = 1;
	var res = {};
	var data = {};
	while (true) {
		data = read_file(num);
		console.log(data);
		if(data !== null)
			res[num] = data;
		else
			break;
		num++;
	}
	return {"data": res, "total": num-1};
}

function player_statistics(name, data){
	var win = 0;
	var lose = 0;
	var team = {};
	var position = {"top": 0, "jgl": 0, "mid": 0, "bot": 0, "sup": 0};
	var champion = {};
	for (var i = 1; i <= data.total; i++) {
		content = data.res[i];
		if (name in content.teamA)
			team = content.teamA;
		else if (name in content.teamB)
			team = content.teamB;
		else
			return;
		player = team[name];
		if (!(player.champion in champion)) {
			champion[player.champion] = {"win": 0, "lose": 0};
		}
		if (team.status == "WIN") {
			win++;
			champion[player.champion].win++;
		}
		else {
			lose++;
			champion[player.champion].lose++;
		}
		position[player.position]++;
	}
	return {"win": win, "lose": lose, "total": win + lose, "position": position, "champion": champion};
}

function get_player_list() {
	const response = fetch("https://giwon2004.github.io/LoLstats/player_info.json");
	return response.json();
}

function make_list(data) {
    var html = "<ul>";
    var playerList = get_player_list(); // Replace with your actual function to get the player list

    for (let name of playerList) {
        pstat = player_statistics(name, data);

        // Calculate winning probability as a percentage
        const winPercentage = (pstat.win / pstat.total) * 100;

        // Create a <progress> element for the progress bar
        const progressBar = `
            <progress value="${winPercentage}" max="100"></progress>
        `;

        html += `
            <li>
                <span>${name}: ${pstat.win} wins out of ${pstat.total}</span>
                ${progressBar}
            </li>
        `;
    }

    html += "</ul>";
    return html;
}

var names = [];
data = read_data();
console.log(get_player_list());
console.log(data);
}