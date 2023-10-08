window.onload = function(){
function read_files(dirname, process) {
	fs.readdir(dirname, function(err, filenames) {
		if (err) return;
		filenames.forEach(function(filename) {
			fs.readFile(dirname + filename, 'utf-8', function(err, content) {
				if (err) return;
				process(filename, content);
			});
		});
	});
}

function player_statistics(name){
	var win = 0;
	var lose = 0;
	var position = {"top": 0, "jgl": 0, "mid": 0, "bot": 0, "sup": 0};
	read_files('data/', (filename, content) => {
		if (name in content["teamA"]) {
			if (content["teamA"]["status"] == "WIN") win++;
			else lose++;
			position[content["teamA"][name]["position"]]++;
		}
		else if (name in content["teamB"]) {
			if (content["teamB"]["status"] == "WIN") win++;
			else lose++;
			position[content["teamA"][name]["position"]]++;
		}
	});
	return {"win": win, "lose": lose, "total": win + lose, "position": position};
}

function make_list(data) {
	var html = "<ul>"
	for (name in Object.keys(data)) {
		console.log(name);
		pstat = player_statistics(name);
		html += "\n\t<li>" + name + ":" + pstat[win] + "</li>"
	}
	html += "\n</ul>";
	return html
}

var names = [];
fetch("https://giwon2004.github.io/LoLstats/player_info.json")
.then(response => response.json())
.then(data => document.getElementById("main").innerHTML = make_list(data));
}