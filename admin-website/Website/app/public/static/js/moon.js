/*
*
*  Full moon: day 3,2 and 1 BEFORE full moon, day of moon, until day 6 AFTER full moon
*  New Moon: day 3,2 and 1 BEFORE new moon, day of moon,  until day 6 AFTER new moon
*
*  All other: anormalous
*
*/

var fullMoons = [], newMoons = [];

function openCSV(){
    $.ajax({
        type: "GET",
        url: "/static/csv/moons_full.csv",
        dataType: "text",
        success: function(data) {
        	fullMoons = processData(data);
        	//console.log(fullMoons);
		    $.ajax({
		        type: "GET",
		        url: "/static/csv/moons_new.csv",
		        dataType: "text",
		        success: function(data) {
		        	newMoons = processData(data);
		        	//console.log(newMoons);
		        	getMoonState();
		        }
		     });
        }
     });
}

function processData(csvText) {
    var record_num = 3;  // or however many elements there are in each row
    var allTextLines = csvText.split(/\r\n|\n/);
    var arr = [];
    for(line in allTextLines)
    {
    	if (allTextLines[line] != '')
    	{
    		arr.push(parseDate(allTextLines[line]));
    	}
    }
    return arr;
}

function parseDate(date){
	var dateMomentObject = moment(date, "D,M,YYYY");
	return dateMomentObject.toDate();
}

// Convert to milliseconds for comparison
function dateToMilli(date){
	return date.getTime();
}

function checkDateRange(date){
		var anormalous = false;

		for (fm in fullMoons)
		{
			if (dateToMilli(date) == dateToMilli(fullMoons[fm]))
			{
				//console.log('exact full moon found');
				anormalous = false;
				return 'full';
			}
			else
			{
				for (var i=1; i<=3; i++)
				{
					if ((dateToMilli(date)+i*86400000) == dateToMilli(fullMoons[fm]))
					{
						//console.log('full moon within 3 days prior found');
						anormalous = false;
						return 'full';
					}
				}
				for (var i=6; i>=1; i--)
				{
					if ((dateToMilli(date)-i*86400000) == dateToMilli(fullMoons[fm]))
					{
						//console.log('full moon within 6 days after found');
						anormalous = false;
						return 'full';
					}
				}
				anormalous = true;
			}
		}

		for (nm in newMoons)
		{
			if (dateToMilli(date) == dateToMilli(newMoons[nm]))
			{
				//console.log('exact new moon found');
				anormalous = false;
				return 'new';
			}
			else
			{
				for (var i=1; i<=3; i++)
				{
					if ((dateToMilli(date)+i*86400000) == dateToMilli(newMoons[nm]))
					{
						//console.log('new moon within 3 days prior found');
						anormalous = false;
						return 'new';
					}
				}
				for (var i=6; i>=1; i--)
				{
					if ((dateToMilli(date)-i*86400000) == dateToMilli(newMoons[nm]))
					{
						//console.log('new moon within 6 days after found');
						anormalous = false;
						return 'new';
					}
				}
				anormalous = true;
			}
		}


		if (anormalous)
		{
			//console.log("anormalous found");
			return 'anormalous';
		}
}

var moonStates = [];

function getMoonState(){
	for (record in records)
	{
		moonStates = [];
		for (d in records[record].dateRange)
		{
			moonStates.push(checkDateRange(toDate(records[record].dateRange[d])));
		}
		
		records[record].moonState = moonStates;
	}

	if (window.chart4 != null)
	{
		window.chart4.destroy();
		chart4_data(getSpecies(), getState(), getArea());
	}
}