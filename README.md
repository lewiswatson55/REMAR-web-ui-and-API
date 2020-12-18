# REMAR_CIDADÃO Public Website, Admin Website and API

The backend in written in [Python Flask](https://flask.palletsprojects.com/en/1.1.x/).

The frontend makes use of standard HTML, CSS and JavaScript capabilities along with extensive use of Bootstrap, 
the [Gentelella website template](https://github.com/afourmy/flask-gentelella) and the [DataTables](https://www.datatables.net) jQuery plug-in.

### 1. API

The API receives data from the [REMAR_CIDADÃO](https://github.com/musevarg/REMAR-android-app) Android Application.

The API is used to keep a local copy of the json files sent from the Android app, as well as saving them in a [CouchDB](https://couchdb.apache.org) database.
The CouchDB database is used to handle and parse the data sent to the front-end of the user interface website (more below). The local copies of the files are kept in case of a
"disaster scenario" in order to be able to recreate the CouchDB database (and its content).

### 2. Admin Panel

A simple admin panel allows for displaying useful information to the members of the REMAR Project.

More importantly, they can download the data (all of it, or filter it if needed) in the form of a CSV file for further analysis.

![](https://raw.githubusercontent.com/musevarg/REMAR-web-ui-and-API/master/images/web-scr4.PNG)

![](https://raw.githubusercontent.com/musevarg/REMAR-web-ui-and-API/master/images/web-scr5.PNG)

### 3. Public Interface

The public interface aims to give some insight to the REMAR_CIDADÃO app users.

It allows them to see selected information about the data that was collected from all users of the app.

Selected screenshots below, the website can be seen [here](http://crabdata.napier.ac.uk).

![](https://raw.githubusercontent.com/musevarg/REMAR-web-ui-and-API/master/images/web-scr1.PNG)

![](https://raw.githubusercontent.com/musevarg/REMAR-web-ui-and-API/master/images/web-scr2.PNG)

![](https://raw.githubusercontent.com/musevarg/REMAR-web-ui-and-API/master/images/web-scr3.PNG)
