Ext.define('CustomApp', {
    extend: 'Rally.app.TimeboxScopedApp',
    componentCls: 'app',
    scopeType: 'release',
    comboboxConfig: {
        fieldLabel: 'Select a PI:',
//        labelWidth: 100,
        width: 300
    },
	addContent: function() {
	console.log("in content");
		this.filter = this.getContext().getTimeboxScope().getQueryFilter();
		this._getField();
	},
	onScopeChange: function() {
		console.log("in change");
		this.filter = this.getContext().getTimeboxScope().getQueryFilter();
		this._getField();
	},
	_getField: function() {
		if ( this._myBoard ) { this._myBoard.destroy(); }
		if ( this._fieldCombo ) { this._fieldCombo.destroy(); }
		piField = '';
		var that = this;		
		var piFields = new Ext.create('Ext.data.Store', {
			fields: ['field','name'],
			data : [
				{field:"TimeCriticality",name: that.getSetting('TimeCriticalityField')},
				{field:"UserBusinessValue",name: that.getSetting('UserBusinessValueField')},
				{field:"RROEValue",name: that.getSetting('RROEValueField')},
				{field:"JobSize",name: that.getSetting('JobSizeField')}
			]
		});
		this._fieldCombo = new Ext.create('Ext.form.ComboBox', {
			fieldLabel: 'Choose WSJF Field',
//			html: '<h1>test html</h1>',
			store: piFields,
			queryMode: 'local',
			displayField: 'name',
			valueField: 'field',
			listeners:{
				scope: this,
				select: function(combobox) {
//					console.log('processing val: ' + combobox.getValue());
//					console.log('processing rawval: ' + combobox.getRawValue());
					piLabel = combobox.getRawValue();
					piField = combobox.getValue();
					this._createBoard(piLabel, piField);
				},
				ready: function(combobox) {
					piLabel = combobox.getRawValue();
					piField = combobox.getValue();
					this._createBoard(piLabel, piField);
				}
			}
		});
		this.add(this._fieldCombo);
	},
    _createBoard: function(label, field) {
		if ( this._myBoard ) { this._myBoard.destroy(); }
		var pcolumns = '[';
		_.each( ['1','2','3','5','8','13','21'], function (n) {
			var pcolumn = "{ value: '" + n + "', columnHeaderConfig: { headerTpl: '{" +
			field + "}', headerData: { " + field + ": '" + 
//			label + " = " + 
			n + "' } } }";
			pcolumns = pcolumns + pcolumn + ",";
		});
// console.log(this.getContext().getTimeboxScope().getQueryFilter());
		pcolumns = pcolumns.substring(0, pcolumns.length - 1) + "]";
        this._myBoard = Ext.create("Rally.ui.cardboard.CardBoard", {
			xtype: 'rallycardboard',
			types: this.getSetting('PITypeField'),
			attribute: field,
			listeners:{
				scope:this
			},
			columns: eval(pcolumns),
			cardConfig: {
				fields: ['InvestmentCategory', 'PreliminaryEstimate'],
				editable: true,
				enableValidationUi: true,
				showIconMenus: true
			},
			storeConfig: {
				filters: this.filter,
				sorters: [
					{ property: 'Rank', direction: 'ASC' }
				]
			},
			scope: this

        });
        this.add(this._myBoard);
	},
	getSettingsFields: function() {
        var values = [
            {
                name: 'PITypeField',
                xtype: 'rallytextfield',
                label : "Portfolio Item Type",
                labelWidth: 200
            },
            {
                name: 'TimeCriticalityField',
                xtype: 'rallytextfield',
                label : "Time Criticality Field",
                labelWidth: 200
            },
            {
                name: 'RROEValueField',
                xtype: 'rallytextfield',
                label : "RROEValue Field",
                labelWidth: 200
            },
            {
                name: 'UserBusinessValueField',
                xtype: 'rallytextfield',
                label : "User Business Value Field",
                labelWidth: 200
            },
            {
                name: 'JobSizeField',
                xtype: 'rallytextfield',
                label : "Job Size Field",
                labelWidth: 200
            },
            {
                name: 'queryField',
                xtype: 'rallytextfield',
                label : "Query",
                labelWidth: 200
            }
        ];

        return values;
    },

    config: {
        defaultSettings : {
			PITypeField : 'PortfolioItem/Feature',
            TimeCriticalityField : 'TimeCriticality',
            RROEValueField : 'RROEValue',
            UserBusinessValueField : 'UserBusinessValue',
            JobSizeField : 'JobSize'
        }
    }
});

