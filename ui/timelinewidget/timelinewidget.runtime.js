TW.Runtime.Widgets.timelinewidget = function () {
	var valueElem;
	var thisWidget = this;
	var timeline, off;
	this.renderHtml = function () {
		// return any HTML you want rendered for your widget
		// If you want it to change depending on properties that the user
		// has set, you can use this.getProperty(propertyName). In
		// this example, we'll just return static HTML
		return '<div class="widget-content widget-timelinewidget">' +
			'<div id="timeline"></div>' +
			'</div>';
	};

	this.afterRender = function () {
		// NOTE: this.jqElement is the jquery reference to your html dom element
		// 		 that was returned in renderHtml()

		// get a reference to the value element
		valueElem = this.jqElement.find('.timelinewidget-property');
		// update that DOM element based on the property value that the user set
		// in the mashup builder
		valueElem.text(this.getProperty('TimelineWidget Property'));
	};

	// this is called on your widget anytime bound data changes
	this.updateProperty = function (updatePropertyInfo) {

		if (updatePropertyInfo.TargetProperty === 'Data') {
			thisWidget.data = updatePropertyInfo.ActualDataRows;
			this.drawChart(thisWidget.data);
		}
	};

	//this is called to pass params to vis.js graph and plot it
	this.drawChart = function (data) {
		
		//destroy the previous DOM element and plot new
		if (timeline)
			timeline.destroy();
		var id = 'timeline';
		var container = document.getElementById(id);
		//Create Data, Options and Groups
		this.createGroups();
		this.createData(data);

		//get the timezone in string format eg: "+05:30"
		off = data[0].timezone;
		this.createOptions(off);
		//Draw timeline
		timeline = new vis.Timeline(container, thisWidget.items, thisWidget.groups, thisWidget.options);
	};

	this.createGroups = function () {
		var widgetProperties = thisWidget.properties;
		var numberOfSeries = widgetProperties['NumberOfSeries'];
		var groups = [];

		for (var i = 1; i <= numberOfSeries; i++) {
			var idField = widgetProperties['DataField' + i];
			var display = widgetProperties['DataLabel' + i];
			var classNameField = widgetProperties['ClassName' + i];

			groups.push({ id: idField, content: display, className: classNameField });
		}
		thisWidget.groups = groups;
	};

	this.createData = function (data) {
		var widgetProperties = thisWidget.properties;
		var startField = widgetProperties['TimePeriodStartField'];
		var endField = widgetProperties['TimePeriodEndField'];
		var labelValueField = widgetProperties['LabelField'];
		var tooltipField = widgetProperties['TooltipField'];
		var seriesField = widgetProperties['SeriesField'];
		var classNameField = widgetProperties['ClassName'];
		var items = [];
		if (data != null && data.length > 0) {
			for (var i = 0; i < data.length; i++) {
				var row = data[i];
				var item =
				{
					id: i,
					content: row[labelValueField],
					start: row[startField],
					end: row[endField],
					group: row[seriesField],
					className: row[classNameField],
					title: row[tooltipField]
				}
				items.push(item);
			}
		}

		thisWidget.items = items;
	};

	this.createOptions = function (off) {
		thisWidget.options = {
			width: '100%',
			editable: true, /* this option means you can add or remove items by clicking on the timeline */
			margin: {
				item: 20
			},
			align: 'center',
			stack: false,
			selectable: false,
			moment: function (date) {
				return vis.moment(date).utcOffset(off) //shift the timeline with specified timezone offset
			}
		};
	};
};