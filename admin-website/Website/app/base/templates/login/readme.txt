
#####################################################################################

0. uWSGI server
---------------

To start the uWSGI server:
sudo systemctl start uwsgi

To enable it (will be launched on Napier server startup):
sudo systemctl enable uwsgi

To check its status:
sudo systemctl status uwsgi

To stop it:
sudo systemctl stop uwsgi


If for some reason the server doesn't start with systemd, remember that all the files 
in /etc/crab must have the owner and group set as remar:remar (see point 1 below).

If this didn't work, you can try to run:
sudo systemctl stop uwsgi
sudo systemctl disable uwsgi
sudo systemctl enable uwsgi
sudo systemctl start uwsgi



#####################################################################################

1. Files Owner
---------------

To run normally, and especially for systemd to start the uWSGI server on startup,
all the files in /etc/crab should be owned by remar:remar

To set all files to the correct owner and group, run (while in /etc/crab):

sudo chown -R remar:remar *

If you wish to upload files to the server, for instance with FileZilla,
you will need to change the owner to your Napier ID.

(e.g. if your Napier ID is 40000001)
sudo chown -R 40000001 -R *

If you are working with one folder, you can use
sudo chown -R 40000001 -R foldername (e.g. sudo chown -R 40000001 -R admin-website)

Once you are done, remember changing back the ownership to remar:remar
sudo chown -R remar:remar *



#####################################################################################

2. Create New Users
-------------------
(to be used to log into the admin panel at 'http://crabdata.napier.ac.uk/login')


To create new users, the best way is to use the code that is in login-full.html.

For security purposes, the registration form is not available at all in the live version
and should not be, (at least not for long).

If you wish to register a new user, backup the code in login.html somewhere,
then copy the code from login-full.html into login.html

Restart the uWSGI server (sudo systemctl restart uwsgi) and you should be able
to toggle the registration form at 'http://crabdata.napier.ac.uk/login'

In order to register users, the file database.db should be owned by remar:remar
(sudo chown remar:remar database.db)
This file is located in /etc/crab/admin-website/Website/app

Once you are done, put the previous code back in login.html and restart the
server once more (sudo systemctl restart uwsgi).

It is important not to have the registration code as commented in the file, as
someone could uncomment it using the inspector tool and unwanted users may register.



#####################################################################################

3. uWSGI and systemd
--------------------

The uwsgi.service file is located in 	/etc/systemd/system
The emperor.ini file is located in 		/etc/uwsgi/
The vassals are located in 				/etc/crab/vassals
The uWSGI server is located in 			/etc/crab/crabenv/bin/uwsgi (in the Python virtual environment)

Fore more information, please check
https://code.luasoftware.com/tutorials/nginx/setup-nginx-and-uwsgi-for-flask-on-ubuntu/#create-uwsgi-app-configuration-file

FYI: The API 		runs on port 8080, address crab.napier.ac.uk
	 The website 	runs on port 8081, address crabdata.napier.ac.uk



#####################################################################################

4. Logs
-------

The logs are located in /etc/crab/logs
There 3 types of logs:

Website:
crabbler-ui.logs 	(if you get a 500 or 502 error, you may want to check this file
				 	502 error could also be uWSGI not running)
API:
crabbler_web.log 	(simply shows what files were sent from the app and if there uploaded,
				 	not much going on here)
crabblerweb.log  	(if you have a problem with the API, e.g. data from the app not appearing
					after being sent, you may check this log and see if you have an error in
					main.py, recordClass.py or crabblerweb.py)



#####################################################################################

5. Handling App Data
--------------------

When a JSON file is received from the REMAR Android Application, crabblerweb.py saves
it in rawcrab (a couchdb database), and then proceeds to run main.py which itself runs
recordClass.py and other minor files. main.py and recordClass.py process the data from
the JSON file and save this parsed file in cleancrab (another couchdb database).

When changing questions in the Android app, problems usually occur in main.py or
recordClass.py. To know more, you may want to check crabblerweb.log (see above).

crabblerweb.py is located /etc/crab/API/src/crabblerweb/
main.py, recordClass.py and other classes used at the same time can be found in
/etc/crab/admin-website/PythonScripts/

Not all the problems are connected to these files, the data is also parsed by the
front-end, in which case you may want to check:

Admin Panel
/etc/crab/admin-website/Website/app/base/static/build/js/custom.js
/etc/crab/admin-website/Website/app/base/static/graphs.js

Public Interface (crabdata.napier.ac.uk/public)
/etc/crab/admin-website/Website/app/public/static/js/charts.js
/etc/crab/admin-website/Website/app/public/static/js/map.js
/etc/crab/admin-website/Website/app/public/static/js/moon.js
/etc/crab/admin-website/Website/app/public/static/js/public.js

Public Interface (with all data, crabdata.napier.ac.uk/full)
/etc/crab/admin-website/Website/app/full/static/js/charts.js
/etc/crab/admin-website/Website/app/full/static/js/map.js
/etc/crab/admin-website/Website/app/full/static/js/moon.js
/etc/crab/admin-website/Website/app/full/static/js/public.js

I may have forgotten some files.



#####################################################################################

6. CouchDB
----------

Useful info: the couchdb databases are located in /var/lib/couchdb

Important: for the website to work, the owner and group must be couchdb:couchdb

If you want to access these files to either create a backup of them (which is a
very good idea, you should do this before sending rubbish data to the server) or
for whatever reason, you will have to change the ownership.

sudo chown -R 40000001 /var/lib/couchdb

Once you are done, don't forget to set it back to:
sudo chown -R couchdb:couchdb /var/lib/couchdb

More info on couchdb on Github (github.com/REMAR-Project)
You won't really need to use it manually anyway, since it's all handled by
crabblerweb.py and main.py.

I would advocate once more in making a backup of all the files in /var/lib/couchdb.
It can come handy. There is already a backup from 02.12.20 in the same folder, that
does not contain any data for season 2020-2021.

Alternatively, the files are also saved physically in /etc/crab/API/data/sightings

It should be possible to recreate the databases from scratch and repopulate them using
these files. More info on Github.



#####################################################################################



This file contains information that I would have found useful if I had got them beforehand.
It may not be complete.
Thank you,
Max