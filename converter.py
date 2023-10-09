from re import sub
import os
tab = '\t'
rb = '{'
lb = '}'

def make_team_json(status, members):
    json = f'''{tab}{tab}"status": "{status}",
'''
    for name, champion in members:
        json += \
f'''{tab}{tab}"{name}": {rb}
{tab}{tab}{tab}"position": "",
{tab}{tab}{tab}"champion": "{champion}"
{tab}{tab}{lb},
'''
    return json[:-2]

teamA = []; teamB = []
for row in range(15):
    raw = input()
    if row == 0:
        date = sub(r"\D", "", raw.split('(')[0])
        duration = raw.split('(')[1].split(')')[0]
    elif row == 2:
        stateA = "WIN" if "승" in raw else "LOSE"
    elif 3 <= row <= 7:
        teamA.append(raw.split(': '))
    elif row == 9:
        stateB = "WIN" if "승" in raw else "LOSE"
    elif 10 <= row <= 14:
        teamB.append(raw.split(': '))

nth = 1
while os.path.exists(f"data/{nth}.json"):
    nth += 1

with open(f"data/{nth}.json", "w") as f:
    f.write(f'''{rb}
{tab}"date": "{date}",
{tab}"length": "{duration}",
{tab}"teamA": {rb}
{make_team_json(stateA, teamA)}
{tab}{lb},
{tab}"teamB": {rb}
{make_team_json(stateB, teamB)}
{tab}{lb}
{lb}''')
