from app.public import blueprint
from flask import render_template, redirect, url_for
import requests
import json

@blueprint.route('/')
def public():

	 # total number of submissions
    dbOverview = requests.get('http://localhost:5984/cleancrab/')
	# get all docs
    myjson = requests.get('http://localhost:5984/cleancrab/_all_docs?include_docs=true')

    # for each id, save entry
    entries = []
    users = []
    totalCount = 0
    longCount = 0
    for element in myjson.json()['rows']:
        entries.append(element['doc'])
        totalCount += 1
        longCount += element['doc']['type']
        users.append(element['doc']['uuid'])

    shortCount = totalCount - longCount
    userCount = len(set(users))

    # count responses for each state
    states = []
    for entry in entries :
      states.append(str(entry['state']))

    stateCount = {i:states.count(i) for i in states}

    # change keys to country codes 

    # open country codes
    ccodes = json.loads('{"Alagoas":{"code":"al"},"Amapá":{"code":"ap"},"Bahia":{"code":"ba"},"Ceará":{"code":"ce"},"Espírito Santo":{"code":"es"},"Maranhão":{"code":"ma"},"Paraná":{"code":"pr"},"Paraíba":{"code":"pb"},"Pará":{"code":"pa"},"Pernambuco":{"code":"ma"},"Piauí":{"code":"pi"},"Rio Grande do Norte":{"code":"rn"},"Rio de Janeiro":{"code":"rj"},"Santa Catarina":{"code":"sc"},"Sergipe":{"code":"se"},"São Paulo":{"code":"sp"}}')


    stateAns = {}
    for state in stateCount:
        try:
            stateAns[str(ccodes[state]['code'])] = stateCount[state]
            # stateAns[str(ccodes[state]['code'])] = ''.join((stateCount[state], 'test'))
        except:
            print("key error")

            
    county = []
    for entry in entries :
      county.append(str(entry['county']))

    countyAns = {i:county.count(i) for i in county}

    return render_template('public.html', docCount=dbOverview.json()['doc_count'], shortCount=shortCount, longCount=longCount, userCount=userCount, record=entries, crabState=stateAns, crabCounty=countyAns)



@blueprint.errorhandler(404)
def not_found_error(error):
    return redirect(url_for('public_blueprint.public'))