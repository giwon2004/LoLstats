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
	}
	else {
		return null; 
	}
}

function read_data() {
	var num = 1;
	var res = {};
	var data = {};
	while (true) {
		data = read_file(num);
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
		content = data.data[i];
		if (name in content.teamA)
			team = content.teamA;
		else if (name in content.teamB)
			team = content.teamB;
		else
			continue;
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
	const url = 'https://giwon2004.github.io/LoLstats/player_info.json';
	const xhr = new XMLHttpRequest();
	xhr.open('GET', url, false); // Use synchronous request
	xhr.send();
	if (xhr.status === 200) {
		const jsonData = JSON.parse(xhr.responseText);
		return jsonData;
	}
	else {
		return null; 
	}
}

function make_list(data) {
    var html = `
	<table>
		<thead>
			<tr>
				<th>이름</th>
				<th>승</th>
				<th>패</th>
				<th>승률</th>
			</tr>
		</thead>
		<tbody>
	`;

    var playerList = get_player_list();

    const progressBar = `
			<progress value="${pstat.win}" max="${pstat.total}}"></progress>
		`;

    for (let name of playerList) {
        pstat = player_statistics(name, data);

        const winPercentage = ((pstat.win / pstat.total) * 100).toFixed(2);

        html += `
			<tr>
				<td>${name}</td>
				<td>${pstat.win}</td>
				<td>${pstat.lose}</td>
				<td>${winPercentage}% ${progressBar}</td>
			</tr>
		`;
    }

    html += `
		</tbody>
	</table>
	`;

    return html;
}

function make_list(data) {
	var html = "<ul>";

	for (let name in get_player_list()) {
		pstat = player_statistics(name, data);

		// Calculate winning probability as a percentage
		const winPercentage = (pstat.win / pstat.total) * 100;

		// Create a <progress> element for the progress bar
		

		html += `
			<li>
				<span>${name}: ${winPercentage}%</span>
				${progressBar}
			</li>
		`;
	}

	html += "</ul>";
	return html;
}

function updatePlayerDisplay() {
    const playerDisplay = document.getElementById("player_display");
    const html = make_list(read_data());
    playerDisplay.innerHTML = html;
}

updatePlayerDisplay();
}