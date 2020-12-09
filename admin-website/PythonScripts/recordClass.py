#
# This class is used to build the data structure of the file that will be saved in the cleancrab database (couchdb)
# (The original file as sent from the app was saved in the rawcrab database (couchdb), and is also saved physically in /etc/crab/API/data/sightings)
#
# It is the cleancrab database that is used to return data to the front-end, which is generally parsed via javascript.
# There isn't much change needed here, unless some questions are added or removed from the questionnaire, it is important to ensure the data
# is saved accordingly in cleancrab, but the way the data is returned to the user depends on the front-end implementation.
#
# Please note that it is important to ensure all versions of the questionnaire can be parsed, as the cleancrab database is intended to be
# potemtially completely deleted and re-populated using the files in /etc/crab/API/data/sightings
#
# I would not recommend deleting any current implementation, but instead adding if statements in the setSpecVars
# of the Short and/or Long classes to identify which version of the questionnaire is to be parsed
#


import re
import json
from dateutil.parser import parse
import users
import moonphase

monthDict = {}
monthDict['jan'] = "Jan"
monthDict['fev'] = "Feb"
monthDict['mar'] = "Mar"
monthDict['abr'] = "Apr"
monthDict['mai'] = "May"
monthDict['jun'] = "Jun"
monthDict['jul'] = "Jul"
monthDict['ago'] = "Aug"
monthDict['set'] = "Sep"
monthDict['out'] = "Oct"
monthDict['nov'] = "Nov"
monthDict['z'] = "Dec" # regex removes de 

def validateAnswerLength(answer):
    if len(answer) == 1 :
        #print ("only 1 answer")
        # parse if needed
        try :
            return int(answer[0])
        except:
            return answer[0] 
    else :
        #print ("multiple answers")
        return answer
        

class Record(object):   
    
    def __init__(self, file):
        # store filepath
        self.fileName = file
        
        # open file and store string
        with open(file, "r") as handle:
            self.fileDict = json.loads(handle.read())

        # set variables that are consistent in both modes
        self.setVars()
        
        self.phoneid = ''

        # short or long (0, 1)
        self.type = 0

    def getNewUserID(self):
        uuid = self.fileDict['sightings'][0]['seen_by']
        return uuid
        # for each user, check for uuid 
        #for phoneID, user in users.phoneList.items() :
        #   if uuid in user.uuids :
        #       return user.generatedID
        
        #raise ValueError("UUID " + uuid+" not linked to any user account" + str(self.fileDict)) 

    def setVars(self):
        self.uuid = self.getNewUserID()
        # change from list to single str/int if needed.        
        self.species = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['2'])
        self.year = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['3'])
        # change year to correct format
        self.formatYear()
        self.month = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['4'])
        # change date to correct format (without time)
        self.dateRange = []
        self.formatDateRange(self.fileDict['sightings'][0]['answers'][0]['5'])       
        self.moonState = self.findMoonState()


    # This is not much use any more, as this is eventually overriden by the front-end
    # TODO: Use algorithm I wrote in /etc/crab/admin-website/Website/app/tables/routes.py (starting line 166)
    # To return actual moonphase as Full Moon, New Moon, or Abnormal (this is all we need)
    def findMoonState(self):
        moonSelect = []
        for date in self.dateRange :
            dateStr = date.split("/")
            # day month year - 0,1,2
            moonSelect.append(moonphase.phase(int(dateStr[2]), int(dateStr[1]), int(dateStr[0])))

        return moonSelect

    # The Android app saves the submission date as a portuguese date (i.e. 29 de nov. de 2020 14:53:28)
    # This method turns this into a normal date format
    def formatSub(self):
        de = re.compile('(de)')
        temp = de.sub('', self.submission)
        temp = temp.split(' ')
        reg = re.compile('[a-z]+')
        final = ""
        for temps in temp:
            if (reg.match(temps)):
                try :
                    final += monthDict[temps[0:3]]
                    final += " "
                except :
                    print ("Unknown date!!")
            else :
                final += temps
                final += " "
                
        self.submission = str(parse(final, dayfirst=True))

    # For some reason the Android app doesn't save the actual observed year of the Andada
    # But instead saves the index of the element in the list (element 0 being 2016)
    # This method retrieves the actual year based on the index
    def formatYear(self):
        # change 0/1/2 into real year
        tempYear = 2016
        self.year = tempYear + self.year    

    # When picking the dates of the observed Andada, Caldroid (Android calendar library)
    # also adds the time as 00:00. We remove this here.
    def formatDateRange(self, dateRange):
        # remove time from date ans
        for day in dateRange:
            splitStr = day.split()
            self.dateRange.append(splitStr[0])
        
    def getFile(self):
        return self.fileDict

    def __str__(self):
        return "I am crab data"

class Short(Record):
    def __init__(self, file):
        Record.__init__(self, file)
        self.setSpecVars()
        
    def setSpecVars(self):
        # Shorter answers (10) means an older version of the short questionnaire is being parsed
        print("recordClass.py (line 154) - Length of data: " + str(len(self.fileDict['sightings'][0]['answers'][0])))
        if (len(self.fileDict['sightings'][0]['answers'][0]) < 11):
            # q6 observed state
            self.state = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['6'])
            # q7 observed county
            self.county = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['7'])
            # q8 job
            self.job = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['8'])
            # q9 submission
            self.submission = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['9'])
            self.formatSub()
        # Longer answers (12) means that the new version of the short questionnaire is being parsed
        else:
            # q6 amplitude
            self.state = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['6'])
            # q7 observed state
            self.state = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['7'])
            # q8 observed county
            self.county = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['8'])
            # q9 Protected Area
            self.protectedArea = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['9'])
            # q10 job
            self.job = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['10'])
            # q11 Additional observation
            self.additionalObs = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['11'])
            # q12 submission
            self.submission = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['12'])
            self.formatSub()
        
    def __str__(self):
        return "I am SHORT"
        

class Long(Record):

    def __init__(self, file):
        Record.__init__(self, file)
        self.setSpecVars()

    def formatPDate(self):
        try :
            splitString = self.fileDict['sightings'][0]['answers'][0]['6'][0].split()
            return splitString[0]
        except :
            return ""

    def setSpecVars(self): 
    	if (self.fileDict['sightings'][0]['answers'][0]['0'][0] == str(2.0)):
    		# overwrite long type
	        self.type = 1
	        # q6 most prominent date
	        self.prominent = self.formatPDate()
	        # q7 another seen in last 2 weeks - Y/N/IDK - Yes leads to (Lower, Similar, Higher, Idk)
	        self.another = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['7'])
	        # q8 what time of day - Day, Night, Both, Idk
	        self.timeofday = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['8'])
	        # Females Berried - Y/N/IDK
	        self.berried = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['9'])
	        # Habitat - Multiple choice (Mangrove, Hinterland/SaltFlat, Beach, MudFlat, Other)
	        self.habitat = re.findall('\w+', self.fileDict['sightings'][0]['answers'][0]['10'][0])
	        # State
	        self.state = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['11'])
	        # County
	        self.county = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['12'])
	        # Protected Area - Y/N/IDK (if yes, list or type field)
	        self.protectedArea = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['13'])
	        # Let us know what you do
	        self.job = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['14'])
	        # Additional field of text
	        self.additionalObs = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['15'])
	        # Submission
	        self.submission = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['16'])
	        self.formatSub()
    	else:
	        # overwrite long type
	        self.type = 1
	        # q6 most prominent date
	        self.prominent = self.formatPDate()
	        # q7 another seen in last 2 weeks - Y/N/IDK - Yes leads to (Lower, Similar, Higher, Idk)
	        self.another = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['7'])
	        # q8 what time of day - Day, Night, Both, Idk
	        self.timeofday = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['8'])
	        # Females Berried - Y/N/IDK
	        self.berried = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['9'])
	        # Habitat - Multiple choice (Mangrove, Hinterland/SaltFlat, Beach, MudFlat, Other)
	        self.habitat = re.findall('\w+', self.fileDict['sightings'][0]['answers'][0]['10'][0])
	        # State
	        self.state = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['11'])
	        # County
	        self.county = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['12'])
	        # Local Name for spot (text entry or IDK)
	        self.localName = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['13'])
	        # Protected Area - Y/N/IDK (if yes, list or type field)
	        self.protectedArea = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['14'])
	        # Let us know what you do
	        self.job = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['15'])
	        # Additional field of text
	        self.additionalObs = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['16'])
	        # Submission
	        self.submission = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['17'])
	        self.formatSub()
        
