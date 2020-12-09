var endYear = new Date().getFullYear()+1;
var dateRange = ['01/11/2020', '30/04/' + endYear];
var reload = false;

$(document).ready(function() {
	protectedAreaDropdown('All');
	datePickerDropdown();
	sameHeight();
	//console.log("Charts.js loaded.");
	//console.log(records);
	console.log('%c REMAR_Cidadão Public Interface v1.0 ', 'background: #FFFFFF; color: #3CAF0F; font-size: 17px; font-weight: bold;');
	sameWidth();
});

$(window).on('resize', function(){
	sameHeight();
	getMapData(getSpecies(), getState(), getArea());
	sameWidth();
});

/* Function to generate chart legends */

function makeLegend(legendID, colorArray, textArray){
	var htmlLegend = '';

	for (i in colorArray)
	{
		htmlLegend += '<div style="display:inline-block;"><div style="display:inline-block; width:30px; height:10px; background:'+colorArray[i]+'; border:solid 1px; margin-left:5px;"></div><div style="display:inline-block; margin-left:5px;">'+textArray[i]+'</div></div>';
	}

	$('#'+legendID).html(htmlLegend);
}

/* Function to pick chart colors */
function chartColors(data_length){

	var colors = [];

	if (data_length > 16){
		console.log("ERROR: Can't compute more than 16 values\nDefault color: #dedede\n(at: function chartColors)");
		for (i in data_length){colors.push('#dedede');}
		return colors;
	}

	// Viridis color palette
	var viridis = ['#200028', '#481567', '#482677', '#453781', '#404788', '#39568C', '#33638D', '#2D708E', '#287D8E', '#238A8D', '#1F968B', '#20A387', '#29AF7F', '#3CBB75', '#55C667', '#73D055', '#95D840', '#B8DE29', '#DCE319', '#FED725'];

	var step =  viridis.length / data_length;
	var step2 = Math.ceil(step);
	var diff = 0; var sub = 0;
	if (step < 2){
		diff = data_length - (viridis.length/2);
		sub=1;
	}

	var hasUndefined = false;

	var colors = [];

	for(var i=0; i<data_length; i++)
	{
		if (diff != 0)
		{
			colors.push(viridis[i]);
			diff=diff-1;
		}
		else
		{
			var index = (i-sub)*step2;
			if (viridis[index] != undefined)
			{
				colors.push(viridis[index]);
			}
			else
			{
				hasUndefined = true;
				break;
			}
		}
	}

	if (hasUndefined)
	{
		step2 = Math.floor(step);

		colors = [];

		for(var i=0; i<data_length; i++)
		{
			if (diff != 0)
			{
				colors.push(viridis[i]);
				diff=diff-1;
			}
			else
			{
				var index = (i-sub)*step2;
				if (viridis[index] != undefined)
				{
					colors.push(viridis[index]);
				}
				else
				{
					hasUndefined = true;
					break;
				}
			}
		}

	}

	return colors;
}

/* Function to pick labels */
function chartLabels(initData){
	var labels = [];
	for (var key of Object.keys(initData)) {
    	if (initData[key] != 0)
    	{
    		labels.push(key);
    	}
	}
	return labels;
}

/* Function to remove empty data */
function chartData(initData){
	var data = [];
	for (var key of Object.keys(initData)) {
    	if (initData[key] != 0)
    	{
    		data.push(initData[key]);
    	}
	}
	return data;
}

/* -------------------------------- */
/* Chart 1: When did Andada happen? */
/* -------------------------------- */

function initChart1(initData, initColor, initLabels){

      var ctx = document.getElementById("chart1");
      var data = {
      datasets: [{
        data: initData,
        backgroundColor: initColor,
        label: 'Count' // for legend
      }],
      labels: initLabels
      };

      chart1 = new Chart(ctx, {
	      data: data,
	      type: 'pie',
	      options: {
		    legend: {
		      display: false
		    },
		    animation: {
		    	duration: 1800
		    },
		    tooltips: {
		    	bodyFontSize: 15,
            	callbacks: {
	                label: function(tooltipItem, data) {

	                	var label = " ";
	                    label += data.labels[tooltipItem['index']];

	                    if (label) {
	                        label += ': ';
	                    }
	                    var sum = 0;
	                    var dataArr = data.datasets[0].data;
                  		dataArr.map(data => {
                      		sum += data;
                  		});

	                    label += (data.datasets[0].data[tooltipItem['index']]*100 / sum).toFixed(0) + "%";
	                    return label;
	                }
        		}
        	}
		  }
      });
}

function chart1_data(species, state, area){

	var dayNightAll = {
		"Somente de dia" : 0,
		"Somente de noite" : 0,
		"Dia e noite" : 0,
		"Naõ sei / Naõ olhei" : 0
	}

	var dayNightUcides = {
		"Somente de dia" : 0,
		"Somente de noite" : 0,
		"Dia e noite" : 0,
		"Naõ sei / Naõ olhei" : 0
	}

	var dayNightCardisoma = {
		"Somente de dia" : 0,
		"Somente de noite" : 0,
		"Dia e noite" : 0,
		"Naõ sei / Naõ olhei" : 0
	}

	for (record in records){

		if (toDate(records[record].dateRange[0]) >= toDate(dateRange[0]) && toDate(records[record].dateRange[0]) <= toDate(dateRange[1]))
		{
			if (checkArea(records[record], area))
			{
				if (records[record].type == 1)
				{
					if (records[record].species == 0)
					{
						if ((state != 'All' && state.includes(records[record].state)) || state.includes('All'))
						{
							switch(records[record].timeofday) {
					  			case 0:
									dayNightAll["Somente de dia"] += 1;
									dayNightUcides["Somente de dia"] += 1;
									break;
								case 1:
									dayNightAll["Somente de noite"] += 1;
									dayNightUcides["Somente de noite"] += 1;
									break;
								case 2:
									dayNightAll["Dia e noite"] += 1;
									dayNightUcides["Dia e noite"] += 1;
									break;
								case 3:
									dayNightAll["Naõ sei / Naõ olhei"] += 1;
									dayNightUcides["Naõ sei / Naõ olhei"] += 1;
									break;
								default:
									break;
							}
						}
					}
					else if (records[record].species == 1)
					{
						if ((state != 'All' && state.includes(records[record].state)) || state.includes('All'))
						{
							switch(records[record].timeofday) {
					  			case 0:
									dayNightAll["Somente de dia"] += 1;
									dayNightCardisoma["Somente de dia"] += 1;
									break;
								case 1:
									dayNightAll["Somente de noite"] += 1;
									dayNightCardisoma["Somente de noite"] += 1;
									break;
								case 2:
									dayNightAll["Dia e noite"] += 1;
									dayNightCardisoma["Dia e noite"] += 1;
									break;
								case 3:
									dayNightAll["Naõ sei / Naõ olhei"] += 1;
									dayNightCardisoma["Naõ sei / Naõ olhei"] += 1;
									break;
								default:
									break;
							}
						}
					}
				}
			}
		}
	}

	if (species == 0)
	{
		initData = chartData(dayNightUcides);
		initLabels = chartLabels(dayNightUcides);
		initColor = chartColors(initLabels.length);
	}
	else if (species == 1)
	{
		initData = chartData(dayNightCardisoma);
		initLabels = chartLabels(dayNightCardisoma);
		initColor = chartColors(initLabels.length);
	}
	else
	{
		initData = chartData(dayNightAll);
		initLabels = chartLabels(dayNightAll);
		initColor = chartColors(initLabels.length);
	}

	if (initData == undefined || initData == [] || sum(initData) == 0)
	{
		noData('chart1');
	}
	else
	{
		initChart1(initData, initColor, initLabels);
		makeLegend('chart1legend', initColor, initLabels);
	}
}


/* ------------------------------------------ */
/* Chart 2: Habitat where Andada was observed */
/* ------------------------------------------ */

function initChart2(initData, initColor, initLabels){

	  var ctx = document.getElementById("chart2").getContext('2d');

      var data = {
      datasets: [{
        data: initData,
        backgroundColor: initColor,
        label: 'Count' // for legend
      }],
      labels: initLabels
      };

      chart2 = new Chart(ctx, {
	      data: data,
	      type: 'pie',
	      options: {
		    legend: {
		    	display: false
		    },
		    animation: {
		    	duration: 1800
		    },
		    tooltips: {
		    	bodyFontSize: 15,
            	callbacks: {
	                label: function(tooltipItem, data) {

	                	var label = " ";
	                    label += data.labels[tooltipItem['index']];

	                    if (label) {
	                        label += ': ';
	                    }
	                    var sum = 0;
	                    var dataArr = data.datasets[0].data;
                  		dataArr.map(data => {
                      		sum += data;
                  		});

	                    label += (data.datasets[0].data[tooltipItem['index']]*100 / sum).toFixed(0) + "%";
	                    return label;
	                }
        		}
        	}
		  }
      });
}

function chart2_data(species, state, area){

/*

This is the data structure as sent from the Android app

Ucides (0):
0: Mangrove		Manguezal
1: Forest		Mata
2: Beach		Praia
3: Road			Estrada					
4: Other 		Outro

Cardisoma (1) old:
0: Mangrove		Manguezal
1: Saltmarsh	Apicum
2: Forest		Mata
3: Beach		Praia
4: Road			Estrada
5: House		Casa
6: Other		Outro

Cardisoma (1) new:
0: Mangrove			Manguezal
1: Saltmarsh		Apicum
2: Forest			Mata
3: Beach			Praia
4: Road				Estrada
5: Leito de rio 	River bed
6: Costão rochoso 	Rocky Shores
7: House			Casa
8: Other			Outro

*/

	var habitatUcides = {
		"Manguezal" : 0,
		"Mata" : 0,
		"Praia" : 0,
		"Estrada" : 0,
		"Outro" : 0
	}

	var habitatCardisoma = {
		"Manguezal" : 0,
		"Apicum" : 0,
		"Mata" : 0,
		"Praia" : 0,
		"Estrada" : 0,
		"Leito de rio" : 0,
		"Costão rochoso" : 0,
		"Casa" : 0,
		"Outro" : 0
	}

	var habitatAll = {
		"Manguezal" : 0,
		"Apicum" : 0,
		"Mata" : 0,
		"Praia" : 0,
		"Estrada" : 0,
		"Leito de rio":0,
		"Costão rochoso":0,
		"Casa" : 0,
		"Outro" : 0
	}

	for (record in records)
	{
		if (toDate(records[record].dateRange[0]) >= toDate(dateRange[0]) && toDate(records[record].dateRange[0]) <= toDate(dateRange[1]))
		{
		if (checkArea(records[record], area))
		{
			if (records[record].type == 1)
			{
				if (records[record].species == 0)
				{
					if ((state != 'All' && state.includes(records[record].state)) || state.includes('All'))
					{
						if (records[record].habitat[0] == "true") {habitatUcides["Manguezal"] += 1; habitatAll["Manguezal"] += 1;}
						else if (records[record].habitat[1] == "true") {habitatUcides["Mata"] += 1; habitatAll["Mata"] += 1;}
						else if (records[record].habitat[2] == "true") {habitatUcides["Praia"] += 1; habitatAll["Praia"] += 1;}
						else if (records[record].habitat[3] == "true") {habitatUcides["Estrada"] += 1; habitatAll["Estrada"] += 1;}
						else if (records[record].habitat[4] == "true") {habitatUcides["Outro"] += 1; habitatAll["Outro"] += 1;}
					}
				}

				else if (records[record].species == 1)
				{
					if ((state != 'All' && state.includes(records[record].state)) || state.includes('All'))
					{
						if (records[record].habitat.length < 9){
							if (records[record].habitat[0] == "true") {habitatCardisoma["Manguezal"] += 1; habitatAll["Manguezal"] += 1;}
							else if (records[record].habitat[1] == "true") {habitatCardisoma["Apicum"] += 1; habitatAll["Apicum"] += 1;}
							else if (records[record].habitat[2] == "true") {habitatCardisoma["Mata"] += 1; habitatAll["Mata"] += 1;}
							else if (records[record].habitat[3] == "true") {habitatCardisoma["Praia"] += 1; habitatAll["Praia"] += 1;}
							else if (records[record].habitat[4] == "true") {habitatCardisoma["Estrada"] += 1; habitatAll["Estrada"] += 1;}
							else if (records[record].habitat[5] == "true") {habitatCardisoma["Casa"] += 1; habitatAll["Casa"] += 1;}
							else if (records[record].habitat[6] == "true") {habitatCardisoma["Outro"] += 1; habitatAll["Outro"] += 1;}
						} else {
							if (records[record].habitat[0] == "true") {habitatCardisoma["Manguezal"] += 1; habitatAll["Manguezal"] += 1;}
							else if (records[record].habitat[1] == "true") {habitatCardisoma["Apicum"] += 1; habitatAll["Apicum"] += 1;}
							else if (records[record].habitat[2] == "true") {habitatCardisoma["Mata"] += 1; habitatAll["Mata"] += 1;}
							else if (records[record].habitat[3] == "true") {habitatCardisoma["Praia"] += 1; habitatAll["Praia"] += 1;}
							else if (records[record].habitat[4] == "true") {habitatCardisoma["Estrada"] += 1; habitatAll["Estrada"] += 1;}
							else if (records[record].habitat[5] == "true") {habitatCardisoma["Leito de rio"] += 1; habitatAll["Leito de rio"] += 1;}
							else if (records[record].habitat[6] == "true") {habitatCardisoma["Costão rochoso"] += 1; habitatAll["Costão rochoso"] += 1;}
							else if (records[record].habitat[7] == "true") {habitatCardisoma["Casa"] += 1; habitatAll["Casa"] += 1;}
							else if (records[record].habitat[8] == "true") {habitatCardisoma["Outro"] += 1; habitatAll["Outro"] += 1;}
						}
					}
				}
			}
		}
		}
	}

if (species==0){
	initData = chartData(habitatUcides);
	initLabels = chartLabels(habitatUcides);
	initColor = chartColors(initLabels.length);
}
else if (species==1){
	initData = chartData(habitatCardisoma);
	initLabels = chartLabels(habitatCardisoma);
	initColor = chartColors(initLabels.length);
}
else if (species==2){
	initData = chartData(habitatAll);
	initLabels = chartLabels(habitatAll);
	initColor = chartColors(initLabels.length);
}

	if (initData == undefined || initData == [] || sum(initData) == 0)
	{
		noData('chart2');
	}
	else
	{
		initChart2(initData, initColor, initLabels);
		makeLegend('chart2legend', initColor, initLabels);
	}

}



/* ----------------------- */
/* Chart 3: Protected Area */
/* ----------------------- */

function initChart3(initData, initColor, initLabels){

	  var ctx = document.getElementById("chart3").getContext('2d');

      var data = {
      datasets: [{
        data: initData,
        backgroundColor: initColor,
        label: 'Count' // for legend
      }],
      labels: initLabels
      };

      chart3 = new Chart(ctx, {
	      data: data,
	      type: 'pie',
	      options: {
		    legend: {
		    	display: false
		    },
		    animation: {
		    	duration: 1800
		    },
		    tooltips: {
		    	bodyFontSize: 15,
            	callbacks: {
	                label: function(tooltipItem, data) {

	                	var label = " ";
	                    label += data.labels[tooltipItem['index']];

	                    if (label) {
	                        label += ': ';
	                    }
	                    var sum = 0;
	                    var dataArr = data.datasets[0].data;
                  		dataArr.map(data => {
                      		sum += data;
                  		});

	                    label += (data.datasets[0].data[tooltipItem['index']]*100 / sum).toFixed(0) + "%";
	                    return label;
	                }
        		}
        	}
		  }
      });
}

function chart3_data(species, state, area){

	var protectedUcides = {
		"Dentro" : 0,
		"Fora" : 0,
		"Não sei" : 0
	}

	var protectedCardisoma = {
		"Dentro" : 0,
		"Fora" : 0,
		"Não sei" : 0
	}

	var protectedAll = {
		"Dentro" : 0,
		"Fora" : 0,
		"Não sei" : 0
	}

	for (record in records)
	{
		if (toDate(records[record].dateRange[0]) >= toDate(dateRange[0]) && toDate(records[record].dateRange[0]) <= toDate(dateRange[1]))
		{
		if (checkArea(records[record], area))
		{
			if (state.includes('All'))
			{
				if (records[record].species == 0)
				{
					if (records[record].protectedArea[0] == "0") {protectedUcides["Dentro"] += 1; protectedAll["Dentro"] += 1;}
					else if (records[record].protectedArea[0] == "1") {protectedUcides["Fora"] += 1; protectedAll["Fora"] += 1;}
					else if (records[record].protectedArea[0] == "2") {protectedUcides["Não sei"] += 1; protectedAll["Não sei"] += 1;}
					//console.log(records[record]);
				}

				else if (records[record].species == 1)
				{
					if (records[record].protectedArea[0] == "0") {protectedCardisoma["Dentro"] += 1; protectedAll["Dentro"] += 1;}
					else if (records[record].protectedArea[0] == "1") {protectedCardisoma["Fora"] += 1; protectedAll["Fora"] += 1;}
					else if (records[record].protectedArea[0] == "2") {protectedCardisoma["Não sei"] += 1; protectedAll["Não sei"] += 1;}
					//console.log(records[record]);
				}
			}
			else if (state.includes(records[record].state))
			{
				if (records[record].species == 0)
				{
					if (records[record].protectedArea[0] == "0") {protectedUcides["Dentro"] += 1; protectedAll["Dentro"] += 1;}
					else if (records[record].protectedArea[0] == "1") {protectedUcides["Fora"] += 1; protectedAll["Fora"] += 1;}
					else if (records[record].protectedArea[0] == "2") {protectedUcides["Não sei"] += 1; protectedAll["Não sei"] += 1;}
					//console.log(records[record]);
				}

				else if (records[record].species == 1)
				{
					if (records[record].protectedArea[0] == "0") {protectedCardisoma["Dentro"] += 1; protectedAll["Dentro"] += 1;}
					else if (records[record].protectedArea[0] == "1") {protectedCardisoma["Fora"] += 1; protectedAll["Fora"] += 1;}
					else if (records[record].protectedArea[0] == "2") {protectedCardisoma["Não sei"] += 1; protectedAll["Não sei"] += 1;}
					//console.log(records[record]);
				}
			}
		}
		}
	}


if (species==0){
	initData = chartData(protectedUcides);
	initLabels = chartLabels(protectedUcides);
	initColor = chartColors(initData.length);
}
else if (species==1){
	initLabels = chartLabels(protectedCardisoma);
	initData = chartData(protectedCardisoma);
	initColor = chartColors(initData.length);
}
else if (species==2){
	initLabels = chartLabels(protectedAll);
	initData = chartData(protectedAll);
	initColor = chartColors(initData.length);
}

	if (initData == undefined || initData == [] || sum(initData) == 0)
	{
		noData('chart3');
	}
	else
	{
		initChart3(initData, initColor, initLabels);
		makeLegend('chart3legend', initColor, initLabels);
	}

}





/* ------------------- */
/* Chart 4: Moon Phase */
/* ------------------- */

function initChart4(initData, initColor, initLabels){

	  var ctx = document.getElementById("chart4").getContext('2d');

      var data = {
      datasets: [{
        data: initData,
        backgroundColor: initColor,
        label: 'Count' // for legend
      }],
      labels: initLabels
      };

      chart4 = new Chart(ctx, {
	      data: data,
	      type: 'pie',
	      options: {
		    legend: {
		    	display: false
			},
			animation: {
		    	duration: 1800
		    },
		    tooltips: {
		    	bodyFontSize: 15,
            	callbacks: {
	                label: function(tooltipItem, data) {

	                	var label = " ";
	                    label += data.labels[tooltipItem['index']];

	                    if (label) {
	                        label += ': ';
	                    }
	                    var sum = 0;
	                    var dataArr = data.datasets[0].data;
                  		dataArr.map(data => {
                      		sum += data;
                  		});

	                    label += (data.datasets[0].data[tooltipItem['index']]*100 / sum).toFixed(0) + "%";
	                    return label;
	                }
        		}
        	}
		  }
      });
}

function chart4_data(species, state, area){

	var moonUcides = {
		"Andada na Lua Cheia" : 0,
		"Andada na Lua Nova" : 0,
		"Andada de ocorrência irregular" : 0
	}

	var moonCardisoma = {
		"Andada na Lua Cheia" : 0,
		"Andada na Lua Nova" : 0,
		"Andada de ocorrência irregular" : 0
	}

	var moonAll = {
		"Andada na Lua Cheia" : 0,
		"Andada na Lua Nova" : 0,
		"Andada de ocorrência irregular" : 0
	}

	var foundMoon = false;

	for (record in records)
	{
		if (toDate(records[record].dateRange[0]) >= toDate(dateRange[0]) && toDate(records[record].dateRange[0]) <= toDate(dateRange[1]))
		{
		if (checkArea(records[record], area))
		{
			if (state.includes('All'))
			{
					if (records[record].species == 0)
					{
						for (i in records[record].moonState)
						{
							if (records[record].moonState[i] == "full"){moonUcides["Andada na Lua Cheia"] += 1; moonAll["Andada na Lua Cheia"] += 1; foundMoon=true; break;}
							else if (records[record].moonState[i] == "new"){moonUcides["Andada na Lua Nova"] += 1; moonAll["Andada na Lua Nova"] += 1; foundMoon=true; break;}
						}
						if (!foundMoon)
						{
							//moonUcides["Andada de ocorrência irregular"] += 1; moonAll["Andada de ocorrência irregular"] += 1;
						}
					}

					else if (records[record].species == 1)
					{
						for (i in records[record].moonState)
						{
							if (records[record].moonState[i] == "full"){moonCardisoma["Andada na Lua Cheia"] += 1; moonAll["Andada na Lua Cheia"] += 1; foundMoon=true; break;}
							else if (records[record].moonState[i] == "new"){moonCardisoma["Andada na Lua Nova"] += 1; moonAll["Andada na Lua Nova"] += 1; foundMoon=true; break;}
						}
						if (!foundMoon)
						{
							//moonCardisoma["Andada de ocorrência irregular"] += 1; moonAll["Andada de ocorrência irregular"] += 1;
						}
					}
			}
			else
			{
				if (state.includes(records[record].state))
				{
					if (records[record].species == 0)
					{
						for (i in records[record].moonState)
						{
							if (records[record].moonState[i] == "full"){moonUcides["Andada na Lua Cheia"] += 1; moonAll["Andada na Lua Cheia"] += 1; foundMoon=true; break;}
							else if (records[record].moonState[i] == "new"){moonUcides["Andada na Lua Nova"] += 1; moonAll["Andada na Lua Nova"] += 1; foundMoon=true; break;}
						}
						if (!foundMoon)
						{
							//moonUcides["Andada de ocorrência irregular"] += 1; moonAll["Andada de ocorrência irregular"] += 1;
						}
					}

					else if (records[record].species == 1)
					{
						for (i in records[record].moonState)
						{
							if (records[record].moonState[i] == "full"){moonCardisoma["Andada na Lua Cheia"] += 1; moonAll["Andada na Lua Cheia"] += 1; foundMoon=true; break;}
							else if (records[record].moonState[i] == "new"){moonCardisoma["Andada na Lua Nova"] += 1; moonAll["Andada na Lua Nova"] += 1; foundMoon=true; break;}
						}
						if (!foundMoon)
						{
							//moonCardisoma["Andada de ocorrência irregular"] += 1; moonAll["Andada de ocorrência irregular"] += 1;
						}
					}
				}
			}
			foundMoon=false;
		}
		}
	}

if (species==0){
	initLabels = chartLabels(moonUcides);
	initData = chartData(moonUcides);
	initColor = chartColors(initData.length);
}
else if (species==1){
	initLabels = chartLabels(moonCardisoma);
	initData = chartData(moonCardisoma);
	initColor = chartColors(initData.length);
}
else if (species==2){
	initLabels = chartLabels(moonAll);
	initData = chartData(moonAll);
	initColor = chartColors(initData.length);
}

	if (initData == undefined || initData == [] || sum(initData) == 0)
	{
		noData('chart4');
	}
	else
	{
		initChart4(initData, initColor, initLabels);
		makeLegend('chart4legend', initColor, initLabels);
	}

}





/* ------------------- */
/* Chart 5: Profession */
/* ------------------- */

function initChart5(initData, initColor, initLabels){

	  var c = document.getElementById("chart5");
	  var ctx = c.getContext('2d');

      var data = {
      datasets: [{
        data: initData,
        backgroundColor: initColor,
        label: 'Count' // for legend
      }],
      labels: initLabels
      };

      chart5 = new Chart(ctx, {
	      data: data,
	      type: 'pie',
	      options: {
		    legend: {
		    	display: false
		    },
		    animation: {
		    	duration: 1800
		    },
		    tooltips: {
		    	bodyFontSize: 15,
            	callbacks: {
	                label: function(tooltipItem, data) {

	                	var label = " ";
	                    label += data.labels[tooltipItem['index']];

	                    if (label) {
	                        label += ': ';
	                    }
	                    var sum = 0;
	                    var dataArr = data.datasets[0].data;
                  		dataArr.map(data => {
                      		sum += data;
                  		});

	                    label += (data.datasets[0].data[tooltipItem['index']]*100 / sum).toFixed(0) + "%";
	                    return label;
	                }
        		}
        	}
		  }
      });
}

function chart5_data(species, state, area){

	var prettifyAnwers = {
		"I catch crabs and depend on them for my living": "Extrativista",
        "I catch crabs only occasionally for my own consumption": "Pegador ocasional",
        "I work with crab meat processing": "Beneficiador de carne",
        "I work with crab commercialization": "Comerciante",
        "I am a local villager and do not normally catch mangrove crabs": "Morador local que não pega",
        "I work for ICMBio": "Funcionário do ICMBio",
        "I work for IBAMA": "Funcionário do IBAMA",
        "I work in the city hall": "Servidor da Prefeitura",
        "I am a researcher": "Pesquisador",
        "I do not want to specify": "Não informou",

        "Pego caranguejo-uçá ou guaiamum e dependo deste recurso para viver": "Extrativista",
        "Pego caranguejo-uçá ou guaiamum apenas ocasionalmente para consumo": "Pegador ocasional",
        "Sou beneficiador de carne de caranguejo-uçá": "Beneficiador de carne",
        "Sou comerciante de caranguejo-uçá ou guaiamum": "Comerciante",
        "Sou morador local e normalmente não pego caranguejos ou guaiamuns": "Morador local que não pega",
        "Sou funcionário do ICMBio": "ICMBio",
        "Sou funcionário do IBAMA": "IBAMA",
        "Sou servidor da Prefeitura": "Servidor da Prefeitura",
        "Sou pesquisador": "Pesquisador",
        "Não quero informar": "Não informou",

        "Sou do ICMBio e observei eu mesmo": "Funcionário do ICMBio",
		"Sou do ICMBio e relato resultados dum coletor": "ICMBio",
		"Sou functionário do IBAMA e observei eu mesmo": "IBAMA",
		"Sou functionário do IBAMA e relato resultados dum coletor": "IBAMA",
		"Sou functionário da Prefeitura e observei eu mesmo":"Servidor da Prefeitura",
		"Sou functionário da Prefeitura e relato resultados dum coletor":"Servidor da Prefeitura",
		"Sou pesquisador e observei eu mesmo":"Pesquisador",
		"Sou pesquisador e relato resultados dum coletor":"Pesquisador",
		"Estou testando/mostrando como o aplicativo funciona":"Testing",

		"I work for ICMBio and observed the Andada myself": "ICMBio",
		"I work for ICMBio and report results of a collector": "ICMBio",
		"I work for ICMBio and report results of a crab fisher": "ICMBio",
		"I work for IBAMA and observed the Andada myself": "IBAMA",
		"I work for IBAMA and report results of a collector": "IBAMA",
		"I work for IBAMA and report results of a crab fisher": "IBAMA",
		"I work in the city hall and observed the Andada myself":"Servidor da Prefeitura",
		"I work in the city hall and report results of a collector":"Servidor da Prefeitura",
		"I work in the city hall and report results of a crab fisher":"Servidor da Prefeitura",
		"I am a researcher and observed the Andada myself":"Pesquisador",
		"I am a researcher and report results of a collector":"Pesquisador",
		"I am a researcher and report results of a crab fisher":"Pesquisador",
		"I am testing/showing how the app works":"Testing",

		"Sou do ICMBio e observei eu mesmo":"ICMBio",
        "Sou do ICMBio e relato resultados de um extrativista":"ICMBio",
        "Sou do IBAMA e observei eu mesmo":"IBAMA",
        "Sou do IBAMA e relato resultados de um extrativista":"IBAMA",
        "Sou da Prefeitura e observei eu mesmo":"Servidor da Prefeitura",
        "Sou da Prefeitura e relato resultados de um extrativista":"Servidor da Prefeitura",
        "Sou pesquisador e observei eu mesmo":"Pesquisador",
        "Sou pesquisador e relato resultados de um extrativista":"Pesquisador",
        "Sou turista":"Outro",
        "Trabalho com turismo":"Outro",
        "Outro":"Outro",
        "I am a tourist":"Outro",
        "I work in tourism":"Outro",
        "Other":"Outro"
	}

	var profUcides = {
		"Extrativista" : 0,
		"Pegador ocasional" : 0,
		"Beneficiador de carne" : 0,
		"Comerciante" : 0,
		"Morador local que não pega" : 0,
		"Funcionário do ICMBio" : 0,
		"Funcionário do IBAMA" : 0,
		"Servidor da Prefeitura" : 0,
		"Pesquisador" : 0,
		"Não informou" : 0,
		"Outro" : 0
	}

	var profCardisoma = {
		"Extrativista" : 0,
		"Pegador ocasional" : 0,
		"Beneficiador de carne" : 0,
		"Comerciante" : 0,
		"Morador local que não pega" : 0,
		"ICMBio" : 0,
		"IBAMA" : 0,
		"Servidor da Prefeitura" : 0,
		"Pesquisador" : 0,
		"Não informou" : 0,
		"Outro" : 0
	}

	var profAll = {
		"Extrativista" : 0,
		"Pegador ocasional" : 0,
		"Beneficiador de carne" : 0,
		"Comerciante" : 0,
		"Morador local que não pega" : 0,
		"ICMBio" : 0,
		"IBAMA" : 0,
		"Servidor da Prefeitura" : 0,
		"Pesquisador" : 0,
		"Não informou" : 0,
		"Outro" : 0
	}

	var foundJob = false;

	for (record in records)
	{
		if (toDate(records[record].dateRange[0]) >= toDate(dateRange[0]) && toDate(records[record].dateRange[0]) <= toDate(dateRange[1]))
		{
		if (checkArea(records[record], area))
		{
			if (state.includes('All'))
			{
					if (records[record].species == 0)
					{
						for (i in Object.keys(prettifyAnwers))
						{
							if (records[record].job[0] == '•')
							{
								records[record].job = records[record].job.substring(2);
							}
							if (records[record].job == Object.keys(prettifyAnwers)[i])
							{
								profUcides[prettifyAnwers[Object.keys(prettifyAnwers)[i]]] += 1;
								profAll[prettifyAnwers[Object.keys(prettifyAnwers)[i]]] += 1;
								foundJob = true;
								break;
							}
						}
						if (!foundJob)
						{
							profUcides["Outro"] += 1;
							profAll["Outro"] += 1;
						}
					}

					else if (records[record].species == 1)
					{
						for (i in Object.keys(prettifyAnwers))
						{
							if (records[record].job[0] == '•')
							{
								records[record].job = records[record].job.substring(2);
							}
							if (records[record].job == Object.keys(prettifyAnwers)[i])
							{
								profCardisoma[prettifyAnwers[Object.keys(prettifyAnwers)[i]]] += 1;
								profAll[prettifyAnwers[Object.keys(prettifyAnwers)[i]]] += 1;
								foundJob = true;
								break;
							}
						}
						if (!foundJob)
						{
							profCardisoma["Outro"] += 1;
							profAll["Outro"] += 1;
						}
					}

			}
			else
			{
				if (state.includes(records[record].state))
				{
					if (records[record].species == 0)
					{
						for (i in Object.keys(prettifyAnwers))
						{
							if (records[record].job[0] == '•')
							{
								records[record].job = records[record].job.substring(2);
							}
							if (records[record].job == Object.keys(prettifyAnwers)[i])
							{
								profUcides[prettifyAnwers[Object.keys(prettifyAnwers)[i]]] += 1;
								profAll[prettifyAnwers[Object.keys(prettifyAnwers)[i]]] += 1;
								foundJob = true;
								break;
							}
						}
						if (!foundJob)
						{
							profUcides["Outro"] += 1;
							profAll["Outro"] += 1;
						}
					}

					else if (records[record].species == 1)
					{
						for (i in Object.keys(prettifyAnwers))
						{
							if (records[record].job[0] == '•')
							{
								records[record].job = records[record].job.substring(2);
							}
							if (records[record].job == Object.keys(prettifyAnwers)[i])
							{
								profCardisoma[prettifyAnwers[Object.keys(prettifyAnwers)[i]]] += 1;
								profAll[prettifyAnwers[Object.keys(prettifyAnwers)[i]]] += 1;
								foundJob = true;
								break;
							}
						}
						if (!foundJob)
						{
							profCardisoma["Outro"] += 1;
							profAll["Outro"] += 1;
						}
					}
				}
			}
			foundJob = false;
		}
		}
	}

if (species==0){
	initLabels = chartLabels(profUcides);
	initData = chartData(profUcides);
	initColor = chartColors(initData.length);
}
else if (species==1){
	initLabels = chartLabels(profCardisoma);
	initData = chartData(profCardisoma);
	initColor = chartColors(initData.length);
}
else if (species==2){
	initLabels = chartLabels(profAll);
	initData = chartData(profAll);
	initColor = chartColors(initData.length);
}


	if (initData == undefined || initData == [] || sum(initData) == 0)
	{
		noData('chart5');
	}
	else
	{
		initChart5(initData, initColor, initLabels);
		makeLegend('chart5legend', initColor, initLabels);
	}

}


/* ------------------------------------- */
/* Friendly reminder: Chart 6 is the map */
/*              See map.js               */
/* ------------------------------------- */





/* ------------------------------------- */
/* -Chart 7: Part of the protected area- */
/* ------------------------------------- */



function initChart7(initData, initColor, initLabels){

      var ctx = document.getElementById("chart7");
      //ctx.height = $('#chart4').height();
      var data = {
      datasets: [{
        data: initData,
        backgroundColor: initColor,
        label: 'Count' // for legend
      }],
      labels: initLabels
      };

      chart7 = new Chart(ctx, {
	      data: data,
	      type: 'pie',
	      options: {
		    legend: {
		      display: false
		    },
		    animation: {
		    	duration: 1800
		    },
		    tooltips: {
		    	bodyFontSize: 15,
            	callbacks: {
	                label: function(tooltipItem, data) {

	                	var label = " ";
	                    label += data.labels[tooltipItem['index']];

	                    if (label) {
	                        label += ': ';
	                    }
	                    var sum = 0;
	                    var dataArr = data.datasets[0].data;
                  		dataArr.map(data => {
                      		sum += data;
                  		});

	                    label += (data.datasets[0].data[tooltipItem['index']]*100 / sum).toFixed(0) + "%";
	                    return label;
	                }
        		}
        	}
		  }
      });
}

function chart7_data(species, state, area){

	var protectedAreas = {"Alagoas":["APA de Piaçabuçu","Resex Lagoa do Jequiá","APA Costa dos Corais","APA de Santa Rita"],"Amapá":["ESEC de Maracá-Jipioca","Parna do Cabo Orange","Rebio do Lago Piratuba"],"Bahia":["Parna do Monte Pascoal","Rebio de Una","Resex Baia de Iguape","Resex Cassurubá","Resex do Corumbau","Resex de Canavieiras","Revis Rio dos Frades","Revis de Una","APA Baía de Camamu","APA Baía de Todos os Santos","APA Caraíva/ Trancoso","APA Costa de Itacaré/ Serra Grande","APA Lagoa Encantada","APA Lagoas de Guarajuba","APA Plataforma Continental do Litoral Norte","APA Ponta da Baleia / Abrolhos","APA Santo Antônio","PARNA do Descobrimento"],"Ceará":["Parna de Jericoacoara","Resex Batoque","APA Delta do Parnaíba","APA do Estuário do Rio Mundaú","APA do Manguezal da Barra Grande","APA do Rio Pacoti","APA Serra de Ibiapaba"],"Espírito Santo":["APA Costa das Algas","Revis de Santa Cruz","APA Conceição da Barra","APA do Maciço Central","APA Municipal Manguezal Sul da Serra","ESEC Municipal Ilha do Lameirão","PE de Itaúnas","PNM de Jacarenema","PNM do Manguezal de Itanguá","PNM Dom Luiz Gonzaga Fernandes","RDS Municipal do Manguezal de Cariacica","RDS Municipal Papagaio","RDS Municipal Piraque-Açú e Piraque-Mirim"],"Maranhão":["Parna dos Lençois Maranhenses","Resex de Cururupu","APA Delta do Parnaíba","APA da Baixada Maranhense","APA da Foz do Rio das Preguiças - Pequenos Lençóis - Região Lagunar Adjacente","APA das Reentrâncias Maranhenses","APA de Upaon-açu / Miritiba / Alto Preguiças","PE da Ilha do Cardoso"],"Pará":["Resex de São João da Ponta","Resex Mãe Grande de Curuça","Resex Araí Peroba","Resex Chocoaré- Mato Grosso","Resex Gurupi-Piriá","Resex Maracanã","Resex Marinha Cuinarana","Resex Marinha de Tracuateua","Resex Marinha de Caeté-Taperaçú","Marinha Mestre Lucindo","RESEX Marinha Mocapajuba","Resex Soure","APA de Algodoal-Maiandeua","APA do Arquipélago do Marajó"],"Paraíba":["APA da Barra de Mamanguape","ARIE Manguezais da Foz do Rio Mamanguape","Flona da Restinga de Cabedelo","Resex Acaú- Goiana","ARIE da Barra do Rio Camaratuba","PE do Jacarapé"],"Pernambuco":["Resex Acaú- Goiana","Parna Marinho de Fernando de Noronha","APA Costa dos Corais","APA de Sirinhaém"],"Piauí":["Resex  Delta do Parnaíba","APA Serra de Ibiapaba"],"Paraná":["APA de Guaraqueçaba","ESEC de Guaraqueçaba","Parna do Superagui","APA Estadual de Guaratuba","ESEC do Guaraguaçu","PARNA de Saint-Hilaire/Lange","REBIO Bom Jesus"],"Rio Grande do Norte":["APA Bonfim/Guaraíra","APA de Jenipabu","PE da Lagoa do Açu","RDS Estadual Ponta do Tubarão"],"Rio de Janeiro":["APA de Cairuçu","APA de Guapi-Mirim","ESEC da Guanabara","APA da Bacia do Rio Macacu","APA da Bacia do Rio São João - Mico Leão","APA da Orla Marítima da Baía de Sepetiba","APA da Serra da Capoeira Grande","APA das Brisas","APA de Tamoios","APA do Morro do Silvério","APA da Estrela","APA Suruí","REBIO Estadual de Guaratiba"],"Santa Catarina":["APA da Baleia Franca","APA de Anhatomirim","ESEC de Carijós","Resex do Pirajubaé","PE Acarai","PE da Serra do Tabuleiro","PNM da Caieira","RDS da Ilha do Morro do Amaral"],"Sergipe":["Rebio de Santa Izabel","FLONA do Ibura","RPPN do Caju"],"São Paulo":["APA de Cananéia-Iguapé-Peruíbe","ARIE Ilha do Ameixal","Resex Mandira","APA Ilha Comprida","APA Marinha do Litoral Norte","ARIE do Guará","ESEC Juréia-Itatins","PE da Serra do Mar","PE do Itinguçu","PE Lagamar de Cananeia","PE Restinga de Bertioga","RDS da Barra do Una","RDS Itapanhapima","RESEX Ilha do Tumba","RESEX Taquari"]};

	var areasAll = {
		"RESEX" : 0,
		"APA" : 0,
		"ESEC" : 0,
	 	"REBIO" : 0,
	 	"PARNA" : 0,
	 	"MN" : 0,
	 	"REVIS" : 0,
	 	"ARIE" : 0,
	 	"FLONA" : 0,
	 	"REFAU" : 0,
	 	"RDS" : 0,
	 	"RPPN" : 0,
	 	"Outro" : 0
	 }

	var areasUcides = {
		"RESEX" : 0,
		"APA" : 0,
		"ESEC" : 0,
	 	"REBIO" : 0,
	 	"PARNA" : 0,
	 	"MN" : 0,
	 	"REVIS" : 0,
	 	"ARIE" : 0,
	 	"FLONA" : 0,
	 	"REFAU" : 0,
	 	"RDS" : 0,
	 	"RPPN" : 0,
	 	"Outro" : 0
	 }

	var areasCardisoma = {
		"RESEX" : 0,
		"APA" : 0,
		"ESEC" : 0,
	 	"REBIO" : 0,
	 	"PARNA" : 0,
	 	"MN" : 0,
	 	"REVIS" : 0,
	 	"ARIE" : 0,
	 	"FLONA" : 0,
	 	"REFAU" : 0,
	 	"RDS" : 0,
	 	"RPPN" : 0,
	 	"Outro" : 0
	 }

	for (record in records){

		if (toDate(records[record].dateRange[0]) >= toDate(dateRange[0]) && toDate(records[record].dateRange[0]) <= toDate(dateRange[1]))
		{
		if (checkArea(records[record], area))
		{
			if (records[record].species == 0)
			{
				if ((state != 'All' && state.includes(records[record].state)) || state.includes('All'))
				{
					if(records[record].protectedArea[0] == "0" || records[record].protectedArea[0] == 0)
					{
						if (protectedAreas[records[record].state][records[record].protectedArea[1]] != undefined)
					  	{
					  		for (var key of Object.keys(areasAll))
					  		{
					  			if (protectedAreas[records[record].state][records[record].protectedArea[1]].toUpperCase().includes(key + " "))
					  			{
					  				areasAll[key] += 1;
					  				areasUcides[key] += 1;
					  			}
					  		}
					  	}
					  	else {
					  		areasAll["Outro"] += 1;
					  		areasUcides["Outro"] += 1;
					  	}
					}
				}
			}
			else if (records[record].species == 1)
			{
				if ((state != 'All' && state.includes(records[record].state)) || state.includes('All'))
				{
					if(records[record].protectedArea[0] == "0" || records[record].protectedArea[0] == 0)
					{
						if (protectedAreas[records[record].state][records[record].protectedArea[1]] != undefined)
					  	{
					  		for (var key of Object.keys(areasAll))
					  		{
					  			if (protectedAreas[records[record].state][records[record].protectedArea[1]].toUpperCase().includes(key + " "))
					  			{
					  				areasAll[key] += 1;
					  				areasCardisoma[key] += 1;
					  			}
					  		}
					  	}
					  	else {
					  		areasAll["Outro"] += 1;
					  		areasCardisoma["Outro"] += 1;
					  	}
					}
				}
			}
		}
		}
	}


	if (species == 0)
	{
		initData = chartData(areasUcides);
		initLabels = chartLabels(areasUcides);
		initColor = chartColors(initData.length);
	}
	else if (species == 1)
	{
		initData = chartData(areasCardisoma);
		initLabels = chartLabels(areasCardisoma);
		initColor = chartColors(initData.length);
	}
	else
	{
		initData = chartData(areasAll);
		initLabels = chartLabels(areasAll);
		initColor = chartColors(initData.length);
	}

	if (initData == undefined || initData == [] || sum(initData) == 0)
	{
		noData('chart7');
	}
	else
	{
		initChart7(initData, initColor, initLabels);
		makeLegend('chart7legend', initColor, initLabels);
	}
}

/* Make all places that have less than 3 occurrences appear as part of 'Outro' */

function cleanArray(array, other){
	if (Object.keys(array).length > 16)
	{
		for (var key of Object.keys(array))
		{
			if (array[key] < 3)
			{
				other = other + array[key];
				delete array[key];
			}
			array["Outro"] = other;
		}
	}
	else
	{
		array["Outro"] = other;
	}
	return array;
}




/* Generic functions */

function getCount(species, state, area)
{
	var shortCount = [0,0,0]; // Three values in array: Ucides, Cardisoma, All Species
	var longCount = [0,0,0];
	var totalCount = [0,0,0];

	for (record in records)
	{
		if (toDate(records[record].dateRange[0]) >= toDate(dateRange[0]) && toDate(records[record].dateRange[0]) <= toDate(dateRange[1]))
		{
		if (checkArea(records[record], area))
		{
			if (records[record].species == 0)
			{
				if ((state != 'All' && state.includes(records[record].state)) || state.includes('All'))
				{
					if (records[record].type==0)
					{
						shortCount[0]++; shortCount[2]++;
						totalCount[0]++; totalCount[2]++;
					}
					else
					{
						longCount[0]++; longCount[2]++;
						totalCount[0]++; totalCount[2]++;
					}
				}
			}
			else if (records[record].species == 1)
			{
				if ((state != 'All' && state.includes(records[record].state)) || state.includes('All'))
				{
					if (records[record].type==0)
					{
						shortCount[1]++; shortCount[2]++;
						totalCount[1]++; totalCount[2]++;
					}
					else
					{
						longCount[1]++; longCount[2]++;
						totalCount[1]++; totalCount[2]++;
					}
				}
			}
		}
		}
	}

	if (species == 0)
	{
		$('#totalCount').text(totalCount[0]);
		$('#shortCount').text(shortCount[0]);
		$('#longCount').text(longCount[0]);
	}
	else if (species == 1)
	{
		$('#totalCount').text(totalCount[1]);
		$('#shortCount').text(shortCount[1]);
		$('#longCount').text(longCount[1]);
	}
	else
	{
		$('#totalCount').text(totalCount[2]);
		$('#shortCount').text(shortCount[2]);
		$('#longCount').text(longCount[2]);
	}

}



/* Convert DD/MM/YY string to date */

function toDate(date){
	var dateMomentObject = moment(date, "DD/MM/YYYY");
	return dateMomentObject.toDate();
}


/* Make charts have same height */

function sameHeight()
{
	var max=0, max2=0, max3=0, max4=0;

	$(".inner-block").each(function(index) {
	    if (index > 2 && index < 7)
	    {
	    	$(this).css("height", "auto");
	    	if ($(this).height() > max)
	    	{
	    		max = $(this).height();
	    	}
	    }
	    if(index==0)
	    {
	    	$(this).css("height", "auto");
	    	if ($(this).height() > max2)
	    	{
	    		max2 = $(this).height();
	    	}
	    }
	   	if(index==1)
	    {
	    	$(this).css("height", "auto");
	    	if ($(this).height() > max3)
	    	{
	    		max3 = $(this).height();
	    	}
	    }
	    if(index>=8 && index<10)
	    {
	    	$(this).css("height", "auto");
	    	if ($(this).height() > max4)
	    	{
	    		max4 = $(this).height();
	    	}
	    }

	});
	$(".inner-block").each(function(index) {
	    if (index > 2 && index < 7)
	    {
	    	$(this).css("height", Math.round(max * 100) / 100 + 30);
	    }
	   	if(index==2)
	    {
	    	$(this).css("height", Math.round((max2-(max3+20)) * 100) / 100);
	    }
	   	if(index>=8 && index<10)
	    {
			$(this).css("height", Math.round(max4 * 100) / 100 + 30);
	    }
	});

	$('.inner-block').eq(10).height($('.inner-block').eq(7).height() - ($('.inner-block').eq(8).height()+41.5));
}


/*  */

function sameWidth()
{
	$(this).css("width", "auto");
	if ($( window ).width() < 992 & $( window ).width() > 425){
		var max=0;

		$(".inner-block").each(function(index) {
	    	$(this).css("width", "auto");
	    	if ($(this).width() > max)
	    	{
	    		max = $(this).width();
	    	}
		});
		$(".inner-block").each(function(index) {
	    	$(this).css("width", max);
		});
		reload = true;
	} 
	else if ($( window ).width() < 425){
		$('.inner-block').eq(0).width($('.inner-block').eq(3).width());
		$('.inner-block').eq(1).width($('.inner-block').eq(3).width());
		$('.inner-block').eq(2).width($('.inner-block').eq(3).width());
		reload = true;
	} else {
		if(reload){
			$(".inner-block").each(function(index) {
	    		$(this).css("width", "auto");
			});
			location.reload();
		}
	}
}


/* Filters */

function changeSpecies(species){
	resetCharts();
	$('#selectedSpecies').text(s = species == "All" ? "Todas" : species);
	chart1_data(getSpecies(), getState(), getArea());
	chart2_data(getSpecies(), getState(), getArea());
	chart3_data(getSpecies(), getState(), getArea());
	chart4_data(getSpecies(), getState(), getArea());
	chart5_data(getSpecies(), getState(), getArea());
	chart7_data(getSpecies(), getState(), getArea());
	getCount(getSpecies(), getState(), getArea());
	getMapData(getSpecies(), getState(), getArea());
}



function changeState(state){
	resetCharts();
	$('#selectedState').text(s = state.includes("All") ? "Todos" : state);
	chart1_data(getSpecies(), getState(), getArea());
	chart2_data(getSpecies(), getState(), getArea());
	chart3_data(getSpecies(), getState(), getArea());
	chart4_data(getSpecies(), getState(), getArea());
	chart5_data(getSpecies(), getState(), getArea());
	chart7_data(getSpecies(), getState(), getArea());
	getCount(getSpecies(), getState(), getArea());
	getMapData(getSpecies(), getState(), getArea());
	protectedAreaDropdown(getState());
}

function changeArea(area){
	resetCharts();
	$('#selectedArea').text(a = area == "All" ? "Todas" : area);
	chart1_data(getSpecies(), getState(), getArea());
	chart2_data(getSpecies(), getState(), getArea());
	chart3_data(getSpecies(), getState(), getArea());
	chart4_data(getSpecies(), getState(), getArea());
	chart5_data(getSpecies(), getState(), getArea());
	chart7_data(getSpecies(), getState(), getArea());
	getCount(getSpecies(), getState(), getArea());
	getMapData(getSpecies(), getState(), getArea());
}

function changeDate(date1, date2, text){
	dateRange = [date1, date2];
	resetCharts();
	$('#selectedDate').text(text);
	chart1_data(getSpecies(), getState(), getArea());
	chart2_data(getSpecies(), getState(), getArea());
	chart3_data(getSpecies(), getState(), getArea());
	chart4_data(getSpecies(), getState(), getArea());
	chart5_data(getSpecies(), getState(), getArea());
	chart7_data(getSpecies(), getState(), getArea());
	getCount(getSpecies(), getState(), getArea());
	getMapData(getSpecies(), getState(), getArea());
}

function getSpecies()
{
	if ($('#selectedSpecies').clone().children().remove().end().text() == "Ucides")
	{
		return 0;
	} 
	else if ($('#selectedSpecies').clone().children().remove().end().text() == "Cardisoma")
	{
		return 1;
	}
	else
	{
		return 2;
	}
}

function getState()
{
	if ($('#selectedState').clone().children().remove().end().text() == "Todos")
	{
		protectedAreaDropdown('All');
		return ["All"];
	}
	else if ($('#selectedState').clone().children().remove().end().text() == "Região Norte (AP-PI)")
	{
		return ["Amapá", "Pará", "Maranhão", "Piauí"];
	}
	else if ($('#selectedState').clone().children().remove().end().text() == "Região Nordeste (CE-BA)")
	{
		return ["Ceará", "Rio Grande do Norte", "Paraíba", "Pernambuco", "Alagoas", "Sergipe", "Bahia"];
	}
	else if ($('#selectedState').clone().children().remove().end().text() == "Região Central/ Leste (BA- RJ)")
	{
		return ["Bahia", "Espírito Santo", "Rio de Janeiro"];
	}
	else if ($('#selectedState').clone().children().remove().end().text() == "Região Sul (RJ–SC)")
	{
		return ["Rio de Janeiro", "São Paulo", "Paraná", "Santa Catarina"];
	}
	else
	{
		return [$('#selectedState').clone().children().remove().end().text()];
	}
}

function getArea()
{
	if ($('#selectedArea').clone().children().remove().end().text().includes("Todas"))
	{
		return "All";
	}
	else
	{
		return $('#selectedArea').clone().children().remove().end().text();
	}
}


function resetCharts()
{
	window.chart1.destroy();
	window.chart2.destroy();
	window.chart3.destroy();
	window.chart4.destroy();
	window.chart5.destroy();
	window.chart7.destroy();
}

function initCharts(){
	chart1_data(getSpecies(), getState(), getArea());
	chart2_data(getSpecies(), getState(), getArea());
	chart3_data(getSpecies(), getState(), getArea());
	chart4_data(getSpecies(), getState(), getArea());
	chart5_data(getSpecies(), getState(), getArea());
	chart7_data(getSpecies(), getState(), getArea());
	getCount(getSpecies(), getState(), getArea());
	getMapData(getSpecies(), getState(), getArea());
}

function noData(chartID){
	var canvas = document.getElementById(chartID);
	var ctx = canvas.getContext("2d");
	ctx.font = "18px Arial";
	ctx.fillText("Sem dados para este gráfico.",10,50);
	ctx.fillText("Tente alterar os filtros selecionados.",10,75);
	$('#' + chartID + 'legend').html("");
}

/* Calculate sum all of values in a javascript object */

function sum( obj ) {
  var sum = 0;
  for( var el in obj ) {
    if( obj.hasOwnProperty( el ) ) {
      sum += parseFloat( obj[el] );
    }
  }
  return sum;
}

/* Generate protected area dorpdown */

function protectedAreaDropdown(state){

	var protectedAreas = {"Alagoas":["APA de Piaçabuçu","Resex Lagoa do Jequiá","APA Costa dos Corais","APA de Santa Rita"],"Amapá":["ESEC de Maracá-Jipioca","Parna do Cabo Orange","Rebio do Lago Piratuba"],"Bahia":["Parna do Monte Pascoal","Rebio de Una","Resex Baia de Iguape","Resex Cassurubá","Resex do Corumbau","Resex de Canavieiras","Revis Rio dos Frades","Revis de Una","APA Baía de Camamu","APA Baía de Todos os Santos","APA Caraíva/ Trancoso","APA Costa de Itacaré/ Serra Grande","APA Lagoa Encantada","APA Lagoas de Guarajuba","APA Plataforma Continental do Litoral Norte","APA Ponta da Baleia / Abrolhos","APA Santo Antônio","PARNA do Descobrimento"],"Ceará":["Parna de Jericoacoara","Resex Batoque","APA Delta do Parnaíba","APA do Estuário do Rio Mundaú","APA do Manguezal da Barra Grande","APA do Rio Pacoti","APA Serra de Ibiapaba"],"Espírito Santo":["APA Costa das Algas","Revis de Santa Cruz","APA Conceição da Barra","APA do Maciço Central","APA Municipal Manguezal Sul da Serra","ESEC Municipal Ilha do Lameirão","PE de Itaúnas","PNM de Jacarenema","PNM do Manguezal de Itanguá","PNM Dom Luiz Gonzaga Fernandes","RDS Municipal do Manguezal de Cariacica","RDS Municipal Papagaio","RDS Municipal Piraque-Açú e Piraque-Mirim"],"Maranhão":["Parna dos Lençois Maranhenses","Resex de Cururupu","APA Delta do Parnaíba","APA da Baixada Maranhense","APA da Foz do Rio das Preguiças - Pequenos Lençóis - Região Lagunar Adjacente","APA das Reentrâncias Maranhenses","APA de Upaon-açu / Miritiba / Alto Preguiças","PE da Ilha do Cardoso"],"Pará":["Resex de São João da Ponta","Resex Mãe Grande de Curuça","Resex Araí Peroba","Resex Chocoaré- Mato Grosso","Resex Gurupi-Piriá","Resex Maracanã","Resex Marinha Cuinarana","Resex Marinha de Tracuateua","Resex Marinha de Caeté-Taperaçú","Marinha Mestre Lucindo","RESEX Marinha Mocapajuba","Resex Soure","APA de Algodoal-Maiandeua","APA do Arquipélago do Marajó"],"Paraíba":["APA da Barra de Mamanguape","ARIE Manguezais da Foz do Rio Mamanguape","Flona da Restinga de Cabedelo","Resex Acaú- Goiana","ARIE da Barra do Rio Camaratuba","PE do Jacarapé"],"Pernambuco":["Resex Acaú- Goiana","Parna Marinho de Fernando de Noronha","APA Costa dos Corais","APA de Sirinhaém"],"Piauí":["Resex  Delta do Parnaíba","APA Serra de Ibiapaba"],"Paraná":["APA de Guaraqueçaba","ESEC de Guaraqueçaba","Parna do Superagui","APA Estadual de Guaratuba","ESEC do Guaraguaçu","PARNA de Saint-Hilaire/Lange","REBIO Bom Jesus"],"Rio Grande do Norte":["APA Bonfim/Guaraíra","APA de Jenipabu","PE da Lagoa do Açu","RDS Estadual Ponta do Tubarão"],"Rio de Janeiro":["APA de Cairuçu","APA de Guapi-Mirim","ESEC da Guanabara","APA da Bacia do Rio Macacu","APA da Bacia do Rio São João - Mico Leão","APA da Orla Marítima da Baía de Sepetiba","APA da Serra da Capoeira Grande","APA das Brisas","APA de Tamoios","APA do Morro do Silvério","APA da Estrela","APA Suruí","REBIO Estadual de Guaratiba"],"Santa Catarina":["APA da Baleia Franca","APA de Anhatomirim","ESEC de Carijós","Resex do Pirajubaé","PE Acarai","PE da Serra do Tabuleiro","PNM da Caieira","RDS da Ilha do Morro do Amaral"],"Sergipe":["Rebio de Santa Izabel","FLONA do Ibura","RPPN do Caju"],"São Paulo":["APA de Cananéia-Iguapé-Peruíbe","ARIE Ilha do Ameixal","Resex Mandira","APA Ilha Comprida","APA Marinha do Litoral Norte","ARIE do Guará","ESEC Juréia-Itatins","PE da Serra do Mar","PE do Itinguçu","PE Lagamar de Cananeia","PE Restinga de Bertioga","RDS da Barra do Una","RDS Itapanhapima","RESEX Ilha do Tumba","RESEX Taquari"]};

	if (state.includes('All')){
		$('#protectedAreaDropdown').html('<div class="dropdown-toggle">Unidade de conservação: <b><i id="selectedArea">Todas - no estado selecionado</i></b><b class="caret"></b></div>');
		$('#protectedAreaDropdown').css("background", "#dedede");
		$('#protectedAreaInfo').css("display", "block");
		$('#protectedAreaDropdown').css("display", "none");
	}
	else
	{
		$('#protectedAreaDropdown').css("display", "block");
		$('#protectedAreaDropdown').html('<div class="dropdown-toggle" data-toggle="dropdown">Área protegida: <b><i id="selectedArea">Todas</i></b><b class="caret"></b></div><ul id="protectedAreaList" class="dropdown-menu"></ul>');
		$('#protectedAreaDropdown').css("background", "#FFFFFF");
		var listHTML = '';
		listHTML += '<li><a onclick="changeArea(\'All\');">Todas</a></li>';
		for (s in state)
		{
			for (i in protectedAreas[state[s]])
			{
				listHTML += '<li><a onclick="changeArea(\''+protectedAreas[state[s]][i]+'\');">'+protectedAreas[state[s]][i]+'</a></li>';
			}
		}

		$('#protectedAreaList').html(listHTML);
		$('#protectedAreaInfo').css("display", "none");
	}
}

function checkArea(record, area){

	var protectedAreas = {"Alagoas":["APA de Piaçabuçu","Resex Lagoa do Jequiá","APA Costa dos Corais","APA de Santa Rita"],"Amapá":["ESEC de Maracá-Jipioca","Parna do Cabo Orange","Rebio do Lago Piratuba"],"Bahia":["Parna do Monte Pascoal","Rebio de Una","Resex Baia de Iguape","Resex Cassurubá","Resex do Corumbau","Resex de Canavieiras","Revis Rio dos Frades","Revis de Una","APA Baía de Camamu","APA Baía de Todos os Santos","APA Caraíva/ Trancoso","APA Costa de Itacaré/ Serra Grande","APA Lagoa Encantada","APA Lagoas de Guarajuba","APA Plataforma Continental do Litoral Norte","APA Ponta da Baleia / Abrolhos","APA Santo Antônio","PARNA do Descobrimento"],"Ceará":["Parna de Jericoacoara","Resex Batoque","APA Delta do Parnaíba","APA do Estuário do Rio Mundaú","APA do Manguezal da Barra Grande","APA do Rio Pacoti","APA Serra de Ibiapaba"],"Espírito Santo":["APA Costa das Algas","Revis de Santa Cruz","APA Conceição da Barra","APA do Maciço Central","APA Municipal Manguezal Sul da Serra","ESEC Municipal Ilha do Lameirão","PE de Itaúnas","PNM de Jacarenema","PNM do Manguezal de Itanguá","PNM Dom Luiz Gonzaga Fernandes","RDS Municipal do Manguezal de Cariacica","RDS Municipal Papagaio","RDS Municipal Piraque-Açú e Piraque-Mirim"],"Maranhão":["Parna dos Lençois Maranhenses","Resex de Cururupu","APA Delta do Parnaíba","APA da Baixada Maranhense","APA da Foz do Rio das Preguiças - Pequenos Lençóis - Região Lagunar Adjacente","APA das Reentrâncias Maranhenses","APA de Upaon-açu / Miritiba / Alto Preguiças","PE da Ilha do Cardoso"],"Pará":["Resex de São João da Ponta","Resex Mãe Grande de Curuça","Resex Araí Peroba","Resex Chocoaré- Mato Grosso","Resex Gurupi-Piriá","Resex Maracanã","Resex Marinha Cuinarana","Resex Marinha de Tracuateua","Resex Marinha de Caeté-Taperaçú","Marinha Mestre Lucindo","RESEX Marinha Mocapajuba","Resex Soure","APA de Algodoal-Maiandeua","APA do Arquipélago do Marajó"],"Paraíba":["APA da Barra de Mamanguape","ARIE Manguezais da Foz do Rio Mamanguape","Flona da Restinga de Cabedelo","Resex Acaú- Goiana","ARIE da Barra do Rio Camaratuba","PE do Jacarapé"],"Pernambuco":["Resex Acaú- Goiana","Parna Marinho de Fernando de Noronha","APA Costa dos Corais","APA de Sirinhaém"],"Piauí":["Resex  Delta do Parnaíba","APA Serra de Ibiapaba"],"Paraná":["APA de Guaraqueçaba","ESEC de Guaraqueçaba","Parna do Superagui","APA Estadual de Guaratuba","ESEC do Guaraguaçu","PARNA de Saint-Hilaire/Lange","REBIO Bom Jesus"],"Rio Grande do Norte":["APA Bonfim/Guaraíra","APA de Jenipabu","PE da Lagoa do Açu","RDS Estadual Ponta do Tubarão"],"Rio de Janeiro":["APA de Cairuçu","APA de Guapi-Mirim","ESEC da Guanabara","APA da Bacia do Rio Macacu","APA da Bacia do Rio São João - Mico Leão","APA da Orla Marítima da Baía de Sepetiba","APA da Serra da Capoeira Grande","APA das Brisas","APA de Tamoios","APA do Morro do Silvério","APA da Estrela","APA Suruí","REBIO Estadual de Guaratiba"],"Santa Catarina":["APA da Baleia Franca","APA de Anhatomirim","ESEC de Carijós","Resex do Pirajubaé","PE Acarai","PE da Serra do Tabuleiro","PNM da Caieira","RDS da Ilha do Morro do Amaral"],"Sergipe":["Rebio de Santa Izabel","FLONA do Ibura","RPPN do Caju"],"São Paulo":["APA de Cananéia-Iguapé-Peruíbe","ARIE Ilha do Ameixal","Resex Mandira","APA Ilha Comprida","APA Marinha do Litoral Norte","ARIE do Guará","ESEC Juréia-Itatins","PE da Serra do Mar","PE do Itinguçu","PE Lagamar de Cananeia","PE Restinga de Bertioga","RDS da Barra do Una","RDS Itapanhapima","RESEX Ilha do Tumba","RESEX Taquari"]};
	
		if (area == 'All')
		{
			return true;
		}
		else
		{
			if (record.protectedArea != undefined && record.protectedArea[0] == 0)
			{
				if (protectedAreas[record.state][record.protectedArea[1]] != undefined)
				{
					if (area.toUpperCase() == protectedAreas[record.state][record.protectedArea[1]].toUpperCase())
					{
						return true;
					}
				}
			}
		}

	return false;
}


function datePickerDropdown(){

	var html = "";
	var startYear = 2020;
	var currentYear = new Date().getFullYear();

	header = "Todos os anos";
	html += '<li><a onclick="changeDate(\'01/11/2020\', \'31/12/'+currentYear+'\', \''+header+'\');">'+header+'</a></li>';
	for (var i=currentYear+1; i>startYear; i--)
	{
		tempRange = '["01/11/' + (i-1)+'", "30/04/' + i+'"]';
		header = 'Temporada ' +(i-1)+ '/' + i;
		html += '<li><a onclick="changeDate(\'01/11/'+(i-1)+'\', \'30/04/'+i+'\', \''+header+'\');">'+header+'</a></li>';
	}
	html += '<li><a data-toggle="modal" data-target="#dateModal">Selecionar as datas</a></li>'

	$('#datePickerList').html(html);

	startPicker();
	endPicker();

}

function customDateRange(){
	var date1 = $('#start-date').val();
	var date2 = $('#end-date').val();
	dateRange = [date1 , date2];
	var header = date1 + '-' + date2;
	$('#selectedDate').text(header);
	resetCharts();
	initCharts();
}

function startPicker(){
	$('#start-date').daterangepicker({
	  singleDatePicker: true,
	  showDropdowns: true,
	  autoApply: true,
	  minDate : "01/11/2020",
	  startDate: moment(dateRange[0], "DD/MM/YYYY"),
	  locale: {
	    format: 'DD/MM/YYYY',
	    firstDay: 1
	  }
	},function(start, end, label) {
	    console.log(this.startDate);
	    dateRange[0]=start.format("DD/MM/YYYY");
	    if (moment(dateRange[0], "DD/MM/YYYY") > moment(dateRange[1], "DD/MM/YYYY"))
	    {
	    	$('#end-date').val(start.format("DD/MM/YYYY"));
	    }
	    dateRange[1]=$('#end-date').val();
	    endPicker();
	});
}

function endPicker(){
	$('#end-date').daterangepicker({
	  singleDatePicker: true,
	  showDropdowns: true,
	  autoApply: true,
	  minDate: "01/11/2020",
	  startDate: moment(dateRange[1], "DD/MM/YYYY"),
	  locale: {
	    format: 'DD/MM/YYYY',
	    firstDay: 1
	  }
	},function(start, end, label) {
	    dateRange[1]=start.format("DD/MM/YYYY");
	    if (moment(dateRange[1], "DD/MM/YYYY") < moment(dateRange[0], "DD/MM/YYYY"))
	    {
	    	$('#start-date').val(start.format("DD/MM/YYYY"));
	    }
	    dateRange[0]=$('#start-date').val();
	    startPicker();
	});
}


function firstInit()
{
	if (firstUseCSV)
	{
		openCSV();firstUseCSV=false;
	}


	/* Load/Reload charts */
	chart1_data(getSpecies(), getState(), getArea());
	chart2_data(getSpecies(), getState(), getArea());
	chart3_data(getSpecies(), getState(), getArea());
	chart4_data(getSpecies(), getState(), getArea());
	chart5_data(getSpecies(), getState(), getArea());
	chart7_data(getSpecies(), getState(), getArea());
	getCount(getSpecies(), getState(), getArea());

	/* Fixing map display */
	$('#chart6').width($('.col-md-11').width()*0.9);
	$('#chart6').height($('.col-md-1').height()*0.9);
	getMapData(getSpecies(), getState(), getArea());
}

var firstUseCSV = true;
firstInit();