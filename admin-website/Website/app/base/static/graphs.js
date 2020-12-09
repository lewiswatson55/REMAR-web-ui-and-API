$(document).ready(function() {
    

  
    console.log("graphs");

    if ($('#bothChart').length )
    { 
      var ctx = document.getElementById("bothChart");
      bothChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ["January", "February", "March", "April", "May", "June", "July"],
          datasets: [{
            label: 'Short Version',
            backgroundColor: "#00a288",
            data: [51, 30, 40, 28, 92, 50, 45]
          }, {
            label: 'Long Version',
            backgroundColor: "#79bd8f",
            data: [41, 56, 25, 48, 72, 34, 12]
          }]
        },

        options: {
          scales: {
            xAxes: [{ stacked: true }],
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Number of App Entries'
              },
                stacked: true,
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });   
    }


    if($('#carChart').length ){ 
      
      var ctx = document.getElementById("carChart");
      carChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ["January", "February", "March", "April", "May", "June", "July"],
          datasets: [{
            label: 'Short Version',
            backgroundColor: "#00a288",
            data: [51, 30, 40, 28, 92, 50, 45]
          }, {
            label: 'Long Version',
            backgroundColor: "#79bd8f",
            data: [41, 56, 25, 48, 72, 34, 12]
          }]
        },

        options: {
          scales: {
            xAxes: [{ stacked: true }],
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Number of App Entries'
              },
                stacked: true,
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });   
        
    }

      if ($('#ucChart').length ){ 
			  
        var ctx = document.getElementById("ucChart");
        ucChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
              label: 'Short Version',
              backgroundColor: "#00a288",
              data: [51, 30, 40, 28, 92, 50, 45]
            }, {
              label: 'Long Version',
              backgroundColor: "#79bd8f",
              data: [41, 56, 25, 48, 72, 34, 12]
            }]
          },

          options: {
            scales: {
              xAxes: [{ stacked: true }],
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Number of App Entries'
                },
                  stacked: true,
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });        
      }

      pieplug = {	afterDraw: function(professionpieChart) {
        if (professionpieChart.data.datasets[0].data.length === 0) {

          console.log("NO DATA HERE");
          // No data is present
          var ctx = professionpieChart.chart.ctx;
          var width = professionpieChart.chart.width;
          var height = professionpieChart.chart.height
          professionpieChart.clear();
          
          ctx.save();
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = "16px normal 'Helvetica Nueue'";
          ctx.fillText('No data to display', width / 2, height / 2);
          ctx.restore();
        }
      }
    };
    
    // pie charts
    if ($('#professionpieChart').length ){
				  
      var ctx = document.getElementById("professionpieChart");
      var data = {
      datasets: [{
        data: [120, 50, 140, 180, 100],
        backgroundColor: [
          "#007965",
          "#008d76",
          "#1ba483",
          "#39b78d",
          "#55c28f",
          "#71cc91",
          "#8ed694",
          "#aae096",
          "#c6eb98",
          "#e3f59b",
          "#ffff9d",
          "#d36f50",
          "#b5411e",
          "#afafaf"
        ],
        label: 'Count' // for legend
      }],
      labels: [
        "Dark Gray",
        "Purple",
        "Gray",
        "Green",
        "Blue"
      ]
      };

      professionpieChart = new Chart(ctx, {
      data: data,
      type: 'bar',
      options: {
         legend: {
            display: false
         }}
      });
      
    }

    $('#allVersBtn').click();

    $("#shortVBtn").click(function() {
     
    });

    $("#longVBtn").click(function() {

    });

    // get dates from records
    records.forEach((entries,index) => {
      dates[index] = moment(entries.submission, "YYYY-MM-DD");

      
      // get profession + species

    });

    init_piepicker();

})

var pieplug;
var professionpieChart;
var mybarChart;
var dates = {};

var pickboy;
var daysBetween;
function getDaterange(picker, flag)
{
    // flag sets both or either species
    if (flag == -1)
    {
      mybarChart = bothChart;
    }
    else if (flag == 0)
    {
      mybarChart = ucChart;
    }
    else if (flag == 1)
    {
      mybarChart = carChart;
    }
    
    // get start and end date, work out best way of splitting data.
    console.log("hello ", picker.startDate.format('MMMM D, YYYY'), flag);
    pickboy = picker;
    daysBetween = Math.round(Math.abs(picker.endDate - picker.startDate)/(24*60*60*1000));

    var timeInterval = "";
    var intervalFormat = "";

    // if more than 30, split into months.
    if (daysBetween < 32)
    {
      timeInterval = "day"
      intervalFormat = "DD-MMMM"
    }
    else
    {
      timeInterval = "month"
      intervalFormat = "MMMM-YY"
    }

    var intervalLabel = [];
    
    var graphRaw = {};

    var tempDate = moment(picker.startDate); // copy startDate
    tempDate.subtract(1, timeInterval); // to include start date
    
    // get all months in selection
    do
    {
        tempDate.add(1, timeInterval).endOf(timeInterval);
        var monthName = tempDate.format(intervalFormat);
        intervalLabel.push(monthName);
        graphRaw[monthName] = []; // add an empty list for data
    }
    while( tempDate < picker.endDate )

    //console.log(months);

    for (date in dates)
    {
      var speciesCheck;
      if (flag == -1) // don't check for species so make check = flag
      {
        speciesCheck = flag;
      }
      else
      {
        speciesCheck = records[date].species;
      }

      if (dates[date].isBetween(picker.startDate, picker.endDate, 'days', '[]') && speciesCheck == flag){
        console.log(dates[date].format('MMMM-YY'), " is WITHIN time");
        graphRaw[dates[date].format(intervalFormat)].push(records[date].type);
      }
      
    }

    var graphShortData = [];
    var graphLongData = [];

    // change bar chart data
    for (mon of intervalLabel)
    {
      console.log(mon);
      // for each type within month dict, check for 0 and 1 and add to list
      var short = 0;
      var long = 0;
      // sum types 
      for (type of graphRaw[mon])
      {
        if (type == 0){
          short++;
          //console.log("short boy");
          }
          else{
          //console.log("long boy");
          long++;
          }
      }

      // add to graph data vars
      graphShortData.push(short);
      graphLongData.push(long);
    }

    // update graph
    mybarChart.data.labels = intervalLabel;
    mybarChart.data.datasets[0].data = graphShortData;
    mybarChart.data.datasets[1].data = graphLongData;
    mybarChart.update();

}

var pieData;
function init_piepicker() {
  console.log("pie picker");
  if( typeof ($.fn.daterangepicker) === 'undefined'){ return; }
  if( $('#piepicker').length === 0){ return; }
  console.log('init_piepicker');

  var cb = function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
    $('#piepicker span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
  };

  var optionSet1 = {
      startDate: '16/11/2017',
      endDate: moment(),
      minDate: '16/11/2017',
      maxDate: '31/12/2100',
      dateLimit: {
      days: 720
      },
      showDropdowns: true,
      showWeekNumbers: true,
      timePicker: false,
      timePickerIncrement: 1,
      timePicker12Hour: true,
      ranges: {
      'All Time': ['16/11/2017', moment()],
      'This Season': [moment().startOf('year').subtract(2, 'month').add(1, 'year'), moment().startOf('year').add(3, 'month').add(1, 'year').endOf('month')],
      'Last Season': [moment().startOf('year').subtract(2, 'month').subtract(1, 'year'), moment().startOf('year').add(3, 'month').endOf('month')],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
      'This Year' : [moment().startOf('year'), moment()],
      'Last Year' : [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
      },
      opens: 'left',
      buttonClasses: ['btn btn-default'],
      applyClass: 'btn-small btn-primary',
      cancelClass: 'btn-small',     
      showRangeInputsOnCustomRangeOnly: true, 
      separator: ' to ',
      locale: {
      format: 'DD/MM/YYYY',
      applyLabel: 'Submit',
      cancelLabel: 'Clear',
      fromLabel: 'From',
      toLabel: 'To',
      customRangeLabel: 'Custom',
      daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      firstDay: 1
      }
  };

  $('#piepicker').daterangepicker(optionSet1, cb);

  getDatePie($('#piepicker').data('daterangepicker'), -1);

  $('#piepicker span').html($('#piepicker').data('daterangepicker').startDate.format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));

  $('#piepicker').on('show.daterangepicker', function() {
    console.log("show event fired");
  });
  $('#piepicker').on('hide.daterangepicker', function() {
    console.log("hide event fired");
  });
  $('#piepicker').on('apply.daterangepicker', function(ev, picker) {
      console.log("apply event fired, start/end dates are " + picker.startDate.format('MMMM D, YYYY') + " to " + picker.endDate.format('MMMM D, YYYY'));
      // fire graph re-draw here. 
      getDatePie(picker, -1);
      // array for date values between 	[gd(2012, 1, 1), 17], year mn day
  });
  $('#piepicker').on('cancel.daterangepicker', function(ev, picker) {
    console.log("cancel event fired");
  });

  $('#destroy').click(function() {
    $('#piepicker').data('daterangepicker').remove();
  });

}

function percentageData(og_array)
{
  var totalSum = og_array.reduce(function(a, b) { return a + b; }, 0);

  // var i;
  // for (i = 0; i < og_array.length; i++)
  // { 
  //   var percentage = Math.floor(((og_array[i]/totalSum) * 100)+0.5);
  //   og_array[i] = percentage;
  // }

  return og_array;
}


function getDatePie(picker, flag)
{
  // get start and end date, work out best way of splitting data.
  console.log("hello ", picker.startDate.format('MMMM D, YYYY'), flag);
  pickboy = picker;
  daysBetween = Math.round(Math.abs(picker.endDate - picker.startDate)/(24*60*60*1000));

  var profSelect = {};

  // list of numbers by profession

  for (date in dates)
  {
    if (dates[date].isBetween(picker.startDate, picker.endDate, 'days', '[]')){
      console.log(dates[date].format('MMMM-YY'), " is WITHIN time");
      
      // check if it contains other
      var prof = records[date].job;

      var profAnswers = {
        "I catch crabs and depend on them for my living": "Professional Fisher",
        "I catch crabs only occasionally for my own consumption": "Own Consumption",
        "I work with crab meat processing": "Meat Processor",
        "I work with crab commercialization": "Trader",
        "I am a local villager and do not normally catch mangrove crabs": "Observing Villager",
        "I work for ICMBio": "ICMBio",
        "I work for IBAMA": "IBAMA",
        "I work in the city hall": "City Hall",
        "I am a researcher": "Researcher",
        "I do not want to specify": "Not specified",
        "I am testing/showing how the app works": "Testing",
        "Testing / Showing how the app works": "Testing",
        "Pego caranguejo-uçá ou guaiamum e dependo deste recurso para viver": "Professional Fisher",
        "Pego caranguejo-uçá ou guaiamum apenas ocasionalmente para consumo": "Own Consumption",
        "Sou beneficiador de carne de caranguejo-uçá": "Meat Processor",
        "Sou comerciante de caranguejo-uçá ou guaiamum": "Trader",
        "Sou morador local e normalmente não pego caranguejos ou guaiamuns": "Observing Villager",
        "Sou funcionário do ICMBio": "ICMBio",
        "Sou funcionário do IBAMA": "IBAMA",
        "Sou servidor da Prefeitura": "City Hall",
        "Sou pesquisador": "Researcher",
        "Não quero informar": "Not specified",
        "Sou functionário do ICMBio e observei eu mesmo": "ICMBio",
        "Sou functionário do ICMBio e relato resultados dum coletor": "ICMBio",
        "Sou functionário do IBAMA e observei eu mesmo": "IBAMA",
        "Sou functionário do IBAMA e relato resultados dum coletor": "IBAMA",
        "Sou functionário da Prefeitura e observei eu mesmo":"City Hall",
        "Sou functionário da Prefeitura e relato resultados dum coletor":"City Hall",
        "Sou pesquisador e observei eu mesmo":"Researcher",
        "Sou pesquisador e relato resultados dum coletor":"Researcher",
        "Estou testando/mostrando como o aplicativo funciona":"Testing",
        "I work for ICMBio and observed the Andada myself": "ICMBio",
        "I work for ICMBio and report results of a collector": "ICMBio",
        "I work for IBAMA and observed the Andada myself": "IBAMA",
        "I work for IBAMA and report results of a collector": "IBAMA",
        "I work in the city hall and observed the Andada myself":"City Hall",
        "I work in the city hall and report results of a collector":"City Hall",
        "I am a researcher and observed the Andada myself":"Researcher",
        "I am a researcher and report results of a collector":"Researcher",
        "I am testing/showing how the app works":"Testing",
        "Sou do ICMBio e observei eu mesmo":"ICMBio",
        "Sou do ICMBio e relato resultados de um extrativista":"ICMBio",
        "Sou do IBAMA e observei eu mesmo":"IBAMA",
        "Sou do IBAMA e relato resultados de um extrativista":"IBAMA",
        "Sou da Prefeitura e observei eu mesmo":"City Hall",
        "Sou da Prefeitura e relato resultados de um extrativista":"City Hall",
        "Sou pesquisador e observei eu mesmo":"Researcher",
        "Sou pesquisador e relato resultados de um extrativista":"Researcher",
        "Sou turista":"Tourist",
        "Trabalho com turismo":"Work in tourism",
        "Outro":"Other",
        "I am a tourist":"Tourist",
        "I work in tourism":"Work in tourism",
        "Other":"Other"
      }

      //console.log("job", typeof(prof));
      if (typeof(prof) !== "string")
      {
        console.log("other");
        prof = "Other";
      }
      else if (prof[0] == '•')
      {
        prof = prof.substring(2);
        prof = profAnswers[prof];
      }
      else
      {
        prof = profAnswers[prof];
      }   

      if (profSelect[prof] === undefined)
      { 
        profSelect[prof] = 1;
      } 
      else
      {
        profSelect[prof] += 1;
      }
    }
  }

  var newLabels = Object.keys(profSelect);
  professionpieChart.data.labels = newLabels;

  pieData = newLabels.map((key)=>{return profSelect[key]});

// change to percentage
  professionpieChart.data.datasets[0].data = percentageData(pieData);
  professionpieChart.data.datasets[0].labels = newLabels;
  professionpieChart.update();

  if (professionpieChart.data.datasets[0].data.length === 0)
  {
    console.log("no data");
    $("#professionpieChart").hide();
    $("#nodata").show();
  }
  else
  {
    $("#professionpieChart").show();
    $("#nodata").hide();
  }


}

