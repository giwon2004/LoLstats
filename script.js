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

document.addEventListener("DOMContentLoaded", function () {
    const table = document.querySelector("table");
    const tbody = table.querySelector("tbody");
    const ths = table.querySelectorAll("th");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    let currentSort = {
        col: undefined,
        dir: 1
    };

    function sortTable(col) {
        const dataType = col.getAttribute("data-type");

        rows.sort((a, b) => {
            const aValue = a.cells[col.cellIndex].textContent;
            const bValue = b.cells[col.cellIndex].textContent;

            if (dataType === "number") {
                return currentSort.dir * (parseFloat(aValue) - parseFloat(bValue));
            } else {
                return currentSort.dir * aValue.localeCompare(bValue);
            }
        });

        tbody.innerHTML = "";
        rows.forEach(row => tbody.appendChild(row));
    }

	ths.forEach(th => {
		th.addEventListener("click", () => {
			th.classList.remove("asc", "desc");
			if (th !== currentSort.col) {
				currentSort.col = th;
				currentSort.dir = 1;
				th.classList.add("asc");
				currentSort.col.remove("desc");
				currentSort.col.add("asc");
			} else {
				currentSort.dir *= -1;
				if (currentSort.dir === 1) {
					th.classList.add("asc");
				} else {
					th.classList.add("desc");
				}
			}
			sortTable(th);
	    });
	});

	ths.forEach(th => th.classList.add("asc"));
});

function make_list(data) {
    var html = `
	<table class="sortable-table">
		<thead>
			<tr>
				<th data-type="text">이름</th>
				<th data-type="number">승</th>
				<th data-type="number">패</th>
				<th data-type="number">승률</th>
			</tr>
		</thead>
		<tbody>
	`;

    var playerList = get_player_list();

    for (let name in playerList) {
        pstat = player_statistics(name, data);

	    const progressBar = `<progress value="${pstat.win}" max="${pstat.total}"></progress>`;

        const winPercentage = pstat.total == 0 ? 0 : ((pstat.win / pstat.total) * 100);
        const formattedPercentage = winPercentage === 100 ? winPercentage.toFixed(1) : winPercentage.toFixed(2).padStart(5, '0');

        html += `
			<tr>
				<td>${name}</td>
				<td>${pstat.win}</td>
				<td>${pstat.lose}</td>
				<td>${formattedPercentage}% ${progressBar}</td>
			</tr>
		`;
    }

    html += `
		</tbody>
	</table>
	`;

    return html;
}

function updatePlayerDisplay() {
    const playerDisplay = document.getElementById("player_display");
    const html = make_list(read_data());
    playerDisplay.innerHTML = html;
}

updatePlayerDisplay();
}