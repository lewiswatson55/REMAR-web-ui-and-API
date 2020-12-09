from app.tables import blueprint
from flask import render_template

from flask_login import login_required

from datetime import datetime, timedelta
from pathlib import Path

import csv
import json
import sys #for print
import requests
import datetime as dt
from collections import OrderedDict

def julian(year, month, day):
    a = (14-month)/12.0
    y = year+4800-a
    m = (12*a)-3+month
    return day + (153*m+2)/5.0 + (365*y) + y/4.0 - y/100.0 + y/400.0 - 32045


def phase(dateString):

    splitDate = dateString.split("/")

    day = int(splitDate[0])
    month = int(splitDate[1])
    year = int(splitDate[2])

    p = (julian(year, month, day) - julian(2000, 1, 6)) % 29.530588853

    if   p < 1.84566:  return [0, 0, 1, 0, 0, 1]
    elif p < 5.53699:  return [0, 0, 0, 1, 0, 1]
    elif p < 9.22831:  return [0, 0, 0, 0, 1, 1]
    elif p < 12.91963: return [0, 0, 0, 0, 1, 1]
    elif p < 16.61096: return [1, 0, 0, 0, 0, 1]
    elif p < 20.30228: return [0, 1, 0, 0, 0, 1]
    elif p < 23.99361: return [0, 0, 0, 0, 1, 1]
    elif p < 27.68493: return [0, 0, 0, 0, 1, 1]
    else:              return [0, 0, 1, 0, 0, 1]

@blueprint.route('/<template>')
@login_required
def route_template(template):
    
    # get all docs
    myjson = requests.get('http://localhost:5984/cleancrab/_all_docs?include_docs=true')

    # get regions from db
    regionjson = requests.get('http://localhost:5984/regions/_all_docs?include_docs=true')

    # for each id, save entry
    #print(myjson.json(), file=sys.stderr)
    entries = []
    for element in myjson.json()['rows']:
        entries.append(element['doc'])
 
    users = {}   

    # users.bob.card = ["1", "4"] (JAN, APR etc)    

    for user in entries:
        try:
            crab = ""
            #check what crab was spotted
            if user["species"] == 0:
                crab = "ucid"
            else :
                crab = "card"
            
            # need to check whether usage or crab spotting 
            users[user["uuid"]][crab].append(user["submission"])
            users[user["uuid"]]["profession"].append(user["job"])
        except KeyError as error:
            users[user["uuid"]] = {}
            users[user["uuid"]]["card"] = []
            users[user["uuid"]]["ucid"] = []   
            users[user["uuid"]]["profession"] = []

            crab = ""
            if user["species"] == 0:
                crab = "ucid"
            else :
                crab = "card"
            users[user["uuid"]][crab].append(user["submission"])
            users[user["uuid"]]["profession"].append(user["job"])



    
    profAnswers = {
        "• I catch crabs and depend on them for my living": "Professional Fisher",
        "• I catch crabs only occasionally for my own consumption": "Own Consumption",
        "• I work with crab meat processing": "Meat Processor",
        "• I work with crab commercialization": "Trader",
        "• I am a local villager and do not normally catch mangrove crabs": "Observing Villager",
        "• I work for ICMBio": "ICMBio",
        "• I work for IBAMA": "IBAMA",
        "• I work in the city hall": "City Hall",
        "• I am a researcher": "Researcher",
        "• I do not want to specify": "Not specified",
        "• I am testing/showing how the app works": "Testing",
        "• Pego caranguejo-uçá ou guaiamum e dependo deste recurso para viver": "Professional Fisher",
        "• Pego caranguejo-uçá ou guaiamum apenas ocasionalmente para consumo": "Own Consumption",
        "• Sou beneficiador de carne de caranguejo-uçá": "Meat Processor",
        "• Sou comerciante de caranguejo-uçá ou guaiamum": "Trader",
        "• Sou morador local e normalmente não pego caranguejos ou guaiamuns": "Observing Villager",
        "• Sou funcionário do ICMBio": "ICMBio",
        "• Sou funcionário do IBAMA": "IBAMA",
        "• Sou servidor da Prefeitura": "City Hall",
        "• Sou pesquisador": "Researcher",
        "• Não quero informar": "Not specified",
        "• Sou do ICMBio e observei eu mesmo": "ICMBio",
        "• Sou do ICMBio e relato resultados dum coletor": "ICMBio",
        "• Sou functionário do IBAMA e observei eu mesmo": "IBAMA",
        "• Sou functionário do IBAMA e relato resultados dum coletor": "IBAMA",
        "• Sou functionário da Prefeitura e observei eu mesmo":"City Hall",
        "• Sou functionário da Prefeitura e relato resultados dum coletor":"City Hall",
        "• Sou pesquisador e observei eu mesmo":"Researcher",
        "• Sou pesquisador e relato resultados dum coletor":"Researcher",
        "• Estou testando/mostrando como o aplicativo funciona":"Testing",
        "• I work for ICMBio and observed the Andada myself": "ICMBio",
        "• I work for ICMBio and report results of a collector": "ICMBio",
        "• I work for ICMBio and report results of a crab fisher": "ICMBio",
        "• I work for IBAMA and observed the Andada myself": "IBAMA",
        "• I work for IBAMA and report results of a collector": "IBAMA",
        "• I work for IBAMA and report results of a crab fisher": "IBAMA",
        "• I work in the city hall and observed the Andada myself":"City Hall",
        "• I work in the city hall and report results of a collector":"City Hall",
        "• I work in the city hall and report results of a crab fisher":"City Hall",
        "• I am a researcher and observed the Andada myself":"Researcher",
        "• I am a researcher and report results of a collector":"Researcher",
        "• I am a researcher and report results of a crab fisher":"Researcher",
        "• I am testing/showing how the app works":"Testing",
        "• Sou do ICMBio e observei eu mesmo":"ICMBio",
        "• Sou do ICMBio e relato resultados de um extrativista":"ICMBio",
        "• Sou do IBAMA e observei eu mesmo":"IBAMA",
        "• Sou do IBAMA e relato resultados de um extrativista":"IBAMA",
        "• Sou da Prefeitura e observei eu mesmo":"City Hall",
        "• Sou da Prefeitura e relato resultados de um extrativista":"City Hall",
        "• Sou pesquisador e observei eu mesmo":"Researcher",
        "• Sou pesquisador e relato resultados de um extrativista":"Researcher",
        "• Sou turista":"Tourist",
        "• Trabalho com turismo":"Work in tourism",
        "• Outro":"Other",
        "• I am a tourist":"Tourist",
        "• I work in tourism":"Work in tourism",
        "• Other":"Other"
    }
    
    # change user profession array into a set to only show unique answers
    for user in users:
        uniquelist = []
        for job in users[user]["profession"]:
            try:
                #if job[0] == "•":
                #    job = job[2:]
                shortTitle = profAnswers[job]
            except TypeError as error: # other job
                shortTitle = str(job)
            
            if (uniquelist.__contains__(shortTitle) is not True):
                uniquelist.append(shortTitle)


        users[user]["profession"] = uniquelist


    # change moon state into categories (Full, New or Anormalous)
    fullMoons = []
    newMoons = []
    csvPath = '/etc/crab/admin-website/Website/app/base/static/csv/'

    with open(csvPath + 'moons_full.csv', newline='') as csvfile:
        reader = csv.reader(csvfile, delimiter=',', quotechar='|')
        for row in reader:
            if len(row[0])<2:
                row[0] = '0' + row[0]
            if len(row[1])<2:
                row[1] = '0' + row[1]
            row = '/'.join(row)
            row = datetime.strptime(row, '%d/%m/%Y')
            fullMoons.append(row)

            
    with open(csvPath + 'moons_new.csv', newline='') as csvfile:
        reader = csv.reader(csvfile, delimiter=',', quotechar='|')
        for row in reader:
            if len(row[0])<2:
                row[0] = '0' + row[0]
            if len(row[1])<2:
                row[1] = '0' + row[1]
            row = '/'.join(row)
            row = datetime.strptime(row, '%d/%m/%Y')
            newMoons.append(row)

    for user in entries:
        dRange = []
        moonArray = []
        for date in user['dateRange']:
            x = date.split('/')
            if len(x[2])<4:
                x[2] = '20' + x[2]
            dRange.append(datetime.strptime(x[0]+'/'+x[1]+'/'+x[2], '%d/%m/%Y'))

            moon = 'Anormalous'
            foundMoon = False

            # NEW MOON
            for row in newMoons:
                for d in dRange:
                    for i in range(4):
                        if (d + timedelta(days=i)) == row:
                            moon = 'New'
                            foundMoon = True
                    
                    for i in range(7):
                        if (d - timedelta(days=i) == row):
                            moon = 'New'
                            foundMoon = True

                if foundMoon == True:
                    break

            if foundMoon == False:
                # FULL MOON
                for row in fullMoons:
                    for d in dRange:
                        for i in range(4):
                            if (d + timedelta(days=i)) == row:
                                moon = 'Full'
                                foundMoon = True
                        
                        for i in range(7):
                            if (d - timedelta(days=i) == row):
                                moon = 'Full'
                                foundMoon = True
                    if foundMoon == True:
                        break

            moonArray.append(moon)

        if 'Full' in moonArray:
            user["moonState"] = 'Full'
        elif 'New' in moonArray:
            user["moonState"] = 'New'
        else:
            user["moonState"] = 'Anormalous'


    regions = json.loads(regionjson.text, object_pairs_hook=OrderedDict)
    regDoc = regions['rows'][0]['doc']

    # dictionary for dates with moons
    dateList = {}


    
    
    # get dates
    for user in entries:
        for val in user['dateRange']:
            try:
                dateList[val][5] += 1
            except KeyError as e:
                dateList[val] = phase(val)


    


    return render_template(template + '.html', dates=dateList, test=entries, userlist=users, regions=regDoc)

    