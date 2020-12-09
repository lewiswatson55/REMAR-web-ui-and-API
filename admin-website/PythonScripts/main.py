#!/usr/bin/env python3

from recordClass import Short
from recordClass import Long
import users
import json
import glob
import requests
import os
from datetime import datetime

folders = "/etc/crab/API/data/sightings/"

# glob files
# files = glob.glob(folders+'/**/**/**/*.json')

# The below will only scan the folders for the current month
# If the entire cleancrab database needs to be recreated comment out lines 19 to 23
# and uncomment line 15 (files = glob.glob(folders+'/**/**/**/*.json'))
year = datetime.now().strftime('%Y')
month = datetime.now().strftime('%m')
day = datetime.now().strftime('%d')

files = glob.glob(folders + '/' + year + '/' + month + '/**/*.json')

print ("Total entries in folder:" + str(len(files)))

if (len(files) == 0):
    print ("No files found")
    exit()

dataList = {}

# add json to data list.
for file in files:
    with open(file, "r") as handle:
        data = json.loads(handle.read())
        #print(data)

    # Only add to list if version is 1.0
    #if (data != None):
    #    if ('0' in data['sightings'][0]['answers'][0]):
    #        if (data['sightings'][0]['answers'][0]['0'][0] == str(1.0)): 
    #            dataList[file] = data
    dataList[file] = data

# generate user ids
users.generate()

# Create Objects for each file 
recordsList = []

states = ["Alagoas", "Amapá", "Bahia", "Ceará", "Espírito Santo", "Maranhão", "Paraná", "Paraíba", "Pará", "Pernambuco", "Piauí", "Rio Grande do Norte", "Rio de Janeiro", "Santa Catarina", "Sergipe", "São Paulo"]

def validateVersionCorrect(item):
    #check if state exists in q6 if so, definitely short (see "57591dd5-758b-4dcf-bc64-782e63687fd0" for issue)
    try:
        if (len(dataList[item]['sightings'][0]['answers'][0]) < 11):
            if (dataList[item]['sightings'][0]['answers'][0]['6'][0] in states):
                return True
            else :
                return False
        else:
            if (dataList[item]['sightings'][0]['answers'][0]['7'][0] in states):
                return True
            else :
                return False
    except:
        print( "Version error found in " + item)
        return False

for item in dataList:
    if (item != None):
        try:
            if (dataList[item]['sightings'][0]['answers'][0]['1'][0] == str(0) and validateVersionCorrect(item)):
                tempRecord = Short(item)
                recordsList.append(tempRecord)
            else:
                tempRecord = Long(item)
                recordsList.append(tempRecord)
        except:
            print("An exception occurred, it could be someone using an older version of the app...")

for record in recordsList:
    
    # serialise to json 
    data = json.dumps(record.__dict__)

    # curl to insert into clean db
    response = requests.put('http://127.0.0.1:5984/cleancrab/'+os.path.basename(record.fileName), data=data)
    print ("Added " + os.path.basename(record.fileName))

