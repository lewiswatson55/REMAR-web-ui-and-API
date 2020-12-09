var firstUseCSV = true;
 
	    function init_daterangepicker_single_call(daterangepickerID) {
	      
				if( typeof ($.fn.daterangepicker) === 'undefined'){ return; }
				if( $('#' + daterangepickerID).length === 0){ return; }
		  
				var cb = function(start, end, label) {
				  $('#' + daterangepickerID + ' span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
				};

				var optionSet1 = {
					startDate: '01/11/2020',
					endDate: moment(),
					minDate: '01/11/2020',
					maxDate: '31/12/2100',
					dateLimit: {
					days: 720
					},
					showDropdowns: true,
					showWeekNumbers: false,
					timePicker: false,
					timePickerIncrement: 1,
					timePicker12Hour: true,
					ranges: makeRanges(),
					opens: 'right',
					buttonClasses: ['btn btn-default'],
					applyClass: 'btn-small btn-success',
					showRangeInputsOnCustomRangeOnly: true,
					separator: ' to ',
					locale: {
					format: 'DD/MM/YYYY',
					applyLabel: 'Submeter',
					cancelLabel: 'Cancelar',
					fromLabel: 'From',
					toLabel: 'To',
					customRangeLabel: 'Selecionar as datas',
					daysOfWeek: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
					monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
					firstDay: 1
					}
				};

				$('#' + daterangepickerID).daterangepicker(optionSet1, cb);

				$('#' + daterangepickerID +' span').html($('#' + daterangepickerID).data('daterangepicker').startDate.format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));

				getDaterange($('#' + daterangepickerID).data('daterangepicker'));

				$('#' + daterangepickerID).on('show.daterangepicker', function() {
				 	prettifyPickerMenu();
				});
				$('#' + daterangepickerID).on('hide.daterangepicker', function() {
				  //console.log("hide event fired");
				});

				/*$('#' + daterangepickerID).on('showCalendar.daterangepicker', function() {
				 	prettifyCalendar2();
				});*/

				$('#' + daterangepickerID).on('apply.daterangepicker', function(ev, picker) {
					//console.log("apply event fired, start/end dates are " + picker.startDate.format('MMMM D, YYYY') + " to " + picker.endDate.format('MMMM D, YYYY'));
					// fire graph re-draw here.
					resetCharts();
					if(picker.chosenLabel == "Selecionar as datas")
					{
						$('#selectedDate').text(dateRange[0] + " - " + dateRange[1]);
						initCharts();
						getMapData(getSpecies(), getState(), getArea());
					}
					else
					{
						getDaterange(picker);
					}

				});
				$('#' + daterangepickerID).on('cancel.daterangepicker', function(ev, picker) {
				  //console.log("cancel event fired");
				});

				$('#options1').click(function() {
				  $('#' + daterangepickerID).data('daterangepicker').setOptions(optionSet1, cb);
				});

				$('#options2').click(function() {
				  $('#' + daterangepickerID).data('daterangepicker').setOptions(optionSet2, cb);
				});

				$('#destroy').click(function() {
				  $('#' + daterangepickerID).data('daterangepicker').remove();
				});
  
  
		}


function getDaterange()
{
if (firstUseCSV)
{
	openCSV();firstUseCSV=false;
}

/* Set new date range */
//dateRange = [picker.startDate.format('DD/MM/YY'), picker.endDate.format('DD/MM/YY')];

	/* Load/Reload charts */
	chart1_data(getSpecies(), getState(), getArea());
	chart2_data(getSpecies(), getState(), getArea());
	chart3_data(getSpecies(), getState(), getArea());
	chart4_data(getSpecies(), getState(), getArea());
	chart5_data(getSpecies(), getState(), getArea());
	chart7_data(getSpecies(), getState(), getArea());
	getCount(getSpecies(), getState(), getArea());
	//$('#selectedDate').text(pickerLabel(picker));

	/* Fixing map display */
	$('#chart6').width($('.col-md-11').width()*0.9);
	$('#chart6').height($('.col-md-1').height()*0.9);
	getMapData(getSpecies(), getState(), getArea());
}

var firstUse = true;
init_daterangepicker_single_call('datePicker');
getDaterange();
//console.log("public.js loaded");

function makeRanges()
{
	var startYear = 2016;
	var currentYear = '' + new Date().getFullYear();
	var ranges = {};
	ranges["Todos os anos"] = ["01/11/2020", "31/12/" + currentYear];
	for (var i=currentYear; i>=startYear; i--)
	{
		ranges["Temporada " + (i-1) + "/" + i] = ["01/11/" + (i-1), "30/04/" + i];
	}
	return ranges;
}


function pickerLabel(picker)
{
	if (picker.chosenLabel == 'Selecionar as datas')
	{
		return picker.startDate.format('DD/MM/YY') + ' - ' + picker.endDate.format('D/M/Y');
	}
	else
	{
		return picker.chosenLabel;
	}
}

function prettifyPickerMenu(){
	if ($('#selectedDate').text() == 'Todos os anos')
	{
		$('.daterangepicker div ul li').each(function(index){
			if (index==0){
				$(this).addClass("active");
			}
			else {
				$(this).removeClass("active");
				if ($(this).text() == "Selecionar as datas"){
					$(this).click(prettifyCalendar2);
				}
			}
		});
	}
	$('.calendar').css("display", "none");
}

function prettifyCalendar(){
	$('.calendar-table').each(function(index){
		if (index==0)
		{
			$(this).html('<div style="margin-top:10px;">Select start date and end date by clicking the boxes above</div>');
			$(this).css("width", "212px");
		}
		else
		{
			$(this).html("");
		}
	});

	$('.daterangepicker_input').each(function(index){
		var html = '<div style="margin-top:10px;" class="input-prepend input-group"><span class="add-on input-group-addon"><i class="glyphicon glyphicon-calendar fa fa-calendar"></i></span><input type="text" style="width: 200px" id="manualPick'+index+'" class="form-control" value="01/11/2020" /></div>';
		$(this).html(html);
	});

$('.calendar').css("display", "block");

			/*$('#manualPick1').daterangepicker({
	            singleDatePicker: true
	        }, function(start, end, label) {
	            //console.log(start.toISOString(), end.toISOString(), label);
	        });

	        $('#manualPick2').daterangepicker({
	            singleDatePicker: true
	        }, function(start, end, label) {
	            //console.log(start.toISOString(), end.toISOString(), label);
	    	});*/
}

function prettifyCalendar2(){

$('.calendar').each(function(index){
if (index==0)
{

$(this).html('<div style="margin-top:15px;margin-bottom:15px;">Selecione as datas clicando nas caixas abaixo.</div><p>Data de início (dd/mm/aaaa)</p><div class="input-prepend input-group"><span class="add-on input-group-addon"><i class="glyphicon glyphicon-calendar fa fa-calendar"></i></span><input type="text" style="width: 200px" id="start-date" class="form-control" value="'+dateRange[0]+'" /></div><p>Data final (dd/mm/aaaa)</p><div class="input-prepend input-group"><span class="add-on input-group-addon"><i class="glyphicon glyphicon-calendar fa fa-calendar"></i></span><input type="text" style="width: 200px" id="end-date" class="form-control" value="'+dateRange[1]+'" /></div>');

startPicker();
endPicker();

$(this).css("display", "block");

}
});

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
