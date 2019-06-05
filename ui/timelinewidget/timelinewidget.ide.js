TW.IDE.Widgets.timelinewidget = function () {
	this.MAX_SERIES = 24;
	
	this.widgetIconUrl = function() {
		return  "'../Common/extensions/TimelineExtension/ui/timelinewidget/vis.png'";
	};

	this.widgetProperties = function () {
		var properties =  {
			'name': 'TimelineWidget',
			'description': '',
			'category': ['Common'],
			'supportsAutoResize': true,
			'properties': {
				'Data': 
				{
					'baseType': 'INFOTABLE',
					'description': 'Data to be displayed',
					'isBindingTarget': true
				},
                'NumberOfSeries': {
                    'description': TW.IDE.I18NController.translate('tw.labelchart-ide.properties.number-of-series.description'),
                    'defaultValue': 5,
                    'baseType': 'NUMBER',
                    'isVisible': true
                },
                'TimeZoneOffset' :{
                    'description': 'Display graph in following timezone',
                    'baseType': 'STRING',
                    'isBindingTarget': true,
                    'defaultValue': '',
                    'isVisible':true,
                },
				'TimePeriodStartField': 
            	{
                    'description': "Field that denotes the start of each time period",
                    'baseType': 'FIELDNAME',
                    'sourcePropertyName': 'Data',
                    'isBindingTarget': false,
                    'baseTypeRestriction': 'DATETIME',
                    'isVisible': true
            	},
                'TimePeriodEndField': 
                {
                    'description': "Field that denotes the end of each time period",
                    'baseType': 'FIELDNAME',
                    'sourcePropertyName': 'Data',
                    'isBindingTarget': false,
                    'baseTypeRestriction': 'DATETIME',
                    'isVisible': true
                },
                'LabelField': 
                {
                    'description': 'Field that denotes the drives the label of each period',
                    'baseType': 'FIELDNAME',
                    'sourcePropertyName': 'Data',
                    'isBindingTarget': false,
                    'baseTypeRestriction': 'STRING',
                    'isVisible': true
                },
                'TooltipField': 
                {
                    'description': 'Field that denotes the drives the tooltip of each period',
                    'baseType': 'FIELDNAME',
                    'sourcePropertyName': 'Data',
                    'isBindingTarget': false,
                    'baseTypeRestriction': 'STRING',
                    'isVisible': true
                },
                'SeriesField': 
                {
                    'description': 'Field that denotes the drives the series of each period',
                    'baseType': 'FIELDNAME',
                    'sourcePropertyName': 'Data',
                    'isBindingTarget': false,
                    'baseTypeRestriction': 'STRING',
                    'isVisible': true
                },
                'ClassName': 
                {
                    'description': 'Field that denotes the drives the label of each period',
                    'baseType': 'FIELDNAME',
                    'sourcePropertyName': 'Data',
                    'isBindingTarget': false,
                    'baseTypeRestriction': 'STRING',
                    'isVisible': true
                }
                
                
			}
		}
		
		var seriesNumber;
        for (seriesNumber = 1; seriesNumber <= this.MAX_SERIES; seriesNumber++) {
            var datalabelProperty = {
                'description': TW.IDE.I18NController.translate('tw.labelchart-ide.data-label-property.description') + seriesNumber,
                'baseType': 'STRING',
                'isBindingTarget': true,
                'isVisible': true,
                'isLocalizable': true
            };

            var datafieldProperty = {
                'description': TW.IDE.I18NController.translate('tw.labelchart-ide.data-field-property.description') + seriesNumber,
                'baseType': 'STRING',
                'isBindingTarget': false,
                'isVisible': true
            }; 
            
            var classNameProperty = {
                    'description': TW.IDE.I18NController.translate('tw.labelchart-ide.data-field-property.description') + seriesNumber,
                    'baseType': 'STRING',
                    'isBindingTarget': false,
                    'isVisible': true
                };  

            properties.properties['DataField' + seriesNumber] = datafieldProperty;
            properties.properties['DataLabel' + seriesNumber] = datalabelProperty;
            properties.properties['ClassName' + seriesNumber] = classNameProperty;
         
        }
        return properties;
	};
	
	this.setSeriesProperties = function (value) {
        var allWidgetProps = this.allWidgetProperties();

        var seriesNumber;
        if(value > this.MAX_SERIES)
    	{
        	value = this.MAX_SERIES;
        	this.setProperty('NumberOfSeries',this.MAX_SERIES);
    	}
        for (seriesNumber = 1; seriesNumber <= value; seriesNumber++) {
            allWidgetProps['properties']['DataField' + seriesNumber]['isVisible'] = true;
            allWidgetProps['properties']['DataLabel' + seriesNumber]['isVisible'] = true;
            allWidgetProps['properties']['ClassName' + seriesNumber]['isVisible'] = true;
        }

        for (seriesNumber = value + 1; seriesNumber <= this.MAX_SERIES; seriesNumber++) {
            allWidgetProps['properties']['DataField' + seriesNumber]['isVisible'] = false;
            allWidgetProps['properties']['DataLabel' + seriesNumber]['isVisible'] = false;
            allWidgetProps['properties']['ClassName' + seriesNumber]['isVisible'] = false;
        }
    };

	this.afterSetProperty = function (name, value) {
		var thisWidget = this;
		var refreshHtml = false;
		
		if (name === 'NumberOfSeries')
		{
			this.setSeriesProperties(this.getProperty('NumberOfSeries'));
			this.updatedProperties();
			refreshHtml = true;
		}
		
		switch (name) {
			case 'Style':
			case 'TimelineWidget Property':
				thisWidget.jqElement.find('.timelinewidget-property').text(value);
			case 'Alignment':
				refreshHtml = true;
				break;
			default:
				break;
		}
		return refreshHtml;
	};

	this.renderHtml = function () {
		// return any HTML you want rendered for your widget
		// If you want it to change depending on properties that the user
		// has set, you can use this.getProperty(propertyName).
		// return 	'<div class="widget-content widget-timelinewidget">' +
		// 			'<span class="timelinewidget-property">' + this.getProperty('TimelineWidget Property') + '</span>' +
        //         '</div>';
           return '<div class="widget-content widget-timelinewidget">'
             +  '<table height="100%" width="100%"><tr><td valign="middle" align="center">'
             +  '<span>Vis.JS Graph</span>'
             +  '</td></tr></table></div>';
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

};