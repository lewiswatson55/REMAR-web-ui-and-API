var stateValues;

function init_JQVmap(){
	
		if(typeof (jQuery.fn.vectorMap) === 'undefined'){ return; }
		
		//console.log('init_JQVmap');
			
		// show map of brazil
			
			if ($('#chart6').length ){
				
				//console.log('brazil');
				$('#chart6').vectorMap({
					map: 'brazil_br',
					zoomButtons : false,
					backgroundColor: null,
					selectedColor: null,
					color: '#ffffff',
					hoverOpacity: 0.7,
					enableZoom: false,
					showTooltip: true,
					regionsSelectable: false,
					values: sample_data,
					normalizeFunction: 'polynomial',
					onLabelShow: function(event, label, code){
						if (stateValues[code] == undefined) {stateValues[code] = 0}
						label.html('<div style="font-size:16px; padding:2px;"><b>' + label[0].innerText + '</b><br>Number of uses: ' + stateValues[code] + '</div>'); 
					}
				});		
			};
}

function updateMap(stateColors, stateValues, legendMax, legendMin)
{
	//var myMapObj = $('#chart6').vectorMap('get', 'mapObject');
	//console.log(myMapObj);

	$('.jqvmap-region').attr('fill', '#fff');
	$('.jqvmap-region').attr('original', '#fff');

	jQuery('#chart6').vectorMap('set', 'colors', stateColors);

	var c = document.getElementById("chart6legend");
	var ctx = c.getContext("2d");

	ctx.clearRect(0, 0, c.width, c.height);

	var cHeight = 500;

	// Create gradient
	var grd = ctx.createLinearGradient(0,0,0,cHeight);
	grd.addColorStop(0,"rgb(27, 167, 131)");
	grd.addColorStop(1,"rgb(198, 235, 152)");

	// Fill with gradient
	ctx.fillStyle = grd;
	ctx.fillRect(10,10,20,cHeight);

	ctx.fillStyle = "black";
	ctx.font = "15px Arial";
	var median = (legendMax)/2;
	ctx.fillText(Math.ceil(legendMax),45,25);
	ctx.fillText(Math.ceil((median+legendMax)/2),45,(25+((cHeight+25)/2))/2);
	ctx.fillText(Math.ceil(median),45,(cHeight+25)/2);
	ctx.fillText(Math.ceil((median+legendMin)/2),45,(cHeight+((cHeight+25)/2))/2);
	ctx.fillText(Math.ceil(legendMin),45,cHeight);
	//console.log("map.js: map loaded");

	$('#chart6').css("height", "90%");
	$('#chart6').css("width", "90%");}

function getMapData(species, state, area){

	var statesAll = {"ac": 0, "al": 0, "am": 0, "ap": 0, "ba": 0, "ce": 0, "es": 0, "go": 0, "ma": 0, "mg": 0, "mt": 0, "pa": 0, "pb": 0, "pe": 0, "pi": 0, "pr": 0, "rj": 0, "rn": 0, "rr": 0, "rs": 0, "sc": 0, "se": 0, "sp": 0};
	var statesUcides = {"ac": 0, "al": 0, "am": 0, "ap": 0, "ba": 0, "ce": 0, "es": 0, "go": 0, "ma": 0, "mg": 0, "mt": 0, "pa": 0, "pb": 0, "pe": 0, "pi": 0, "pr": 0, "rj": 0, "rn": 0, "rr": 0, "rs": 0, "sc": 0, "se": 0, "sp": 0};
	var statesCardisoma = {"ac": 0, "al": 0, "am": 0, "ap": 0, "ba": 0, "ce": 0, "es": 0, "go": 0, "ma": 0, "mg": 0, "mt": 0, "pa": 0, "pb": 0, "pe": 0, "pi": 0, "pr": 0, "rj": 0, "rn": 0, "rr": 0, "rs": 0, "sc": 0, "se": 0, "sp": 0};
	var states = {"Alagoas":"al","Amapá":"ap","Bahia":"ba","Ceará":"ce","Espírito Santo":"es","Maranhão":"ma","Paraná":"pr","Paraíba":"pb","Pará":"pa","Pernambuco":"ma","Piauí":"pi","Rio Grande do Norte":"rn","Rio de Janeiro":"rj","Santa Catarina":"sc","Sergipe":"se","São Paulo":"sp"};

	for (record in records){

		if (toDate(records[record].dateRange[0]) >= toDate(dateRange[0]) && toDate(records[record].dateRange[0]) <= toDate(dateRange[1]))
		{
		if (checkArea(records[record], area))
		{	
			if ((state != 'All' && state.includes(records[record].state)) || state.includes('All'))
			{
				if (records[record].species == 0)
				{
					statesUcides[states[records[record].state]] += 1;
					statesAll[states[records[record].state]] += 1;
				}
				else if (records[record].species == 1)
				{
					statesCardisoma[states[records[record].state]] += 1;
					statesAll[states[records[record].state]] += 1;
				}
			}
		}
		}
	}

if (species == 0)
{
	mapLegend(statesUcides);
}
else if(species == 1)
{
	mapLegend(statesCardisoma);
}
else
{
	mapLegend(statesAll);
}

}

function mapLegend(mapData){

	var max = 0, min=Number.MAX_VALUE;

	for (var key of Object.keys(mapData))
  	{
      	if (parseFloat(mapData[key]) > max)
      	{
        	max = parseFloat(mapData[key]);
      	}
      	if (parseFloat(mapData[key]) < min)
      	{
        	min = parseFloat(mapData[key]);
      	}
 	}

 	var colors = {"ac": "", "al": "", "am": "", "ap": "", "ba": "", "ce": "", "es": "", "go": "", "ma": "", "mg": "", "mt": "", "pa": "", "pb": "", "pe": "",	"pi": "", "pr": "", "rj": "", "rn": "", "rr": "", "rs": "", "sc": "", "se": "", "sp": ""};

	var startColor = [198, 235, 152], endColor = [27, 167, 131];

	for (var key of Object.keys(mapData))
  	{
      if (mapData[key] > 0)
      {
        colors[key] = '#';
          for (var i = 0; i<3; i++)
          {
              hex = Math.round(startColor[i]
                  + (endColor[i]
                  - startColor[i])
                  * (mapData[key] / (max - min))).toString(16);
  
              if (hex.length == 1)
              {
                  hex = '0'+hex;
              }
  
              colors[key] += (hex.length == 1 ? '0' : '') + hex;
          }
      }
      else
      {
      		colors[key] += '#FFFFFF';
      }
  }  

  	stateValues = mapData;
  	//console.log(colors);
  	//console.log(mapData);
	init_JQVmap();
	updateMap(colors, mapData, max, min);
}