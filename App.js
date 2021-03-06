Ext.define('WSJFBoardApp', {
    extend: 'Rally.app.App',
	componentCls: 'app',
	launch: function () {
        app = this;
		typeComboBox = this.add({
			xtype: 'rallyportfolioitemtypecombobox',
			listeners: {
				select: function(combobox) {
					// console.log(typeComboBox.getRecord());
					app.piType = typeComboBox.getRecord().get('TypePath');
					this._getField();
				},
				scope: this
			}
		});
	},
	_getField: function() {
		if ( this._myBoard ) { this._myBoard.destroy(); }
		if ( this._fieldCombo ) { this._fieldCombo.destroy(); }
		piField = '';
		var that = this;		
		var piFields = new Ext.create('Ext.data.Store', {
			fields: ['name','field'],
			data : [
				{name: that.getSetting('TimeCriticalityLabel'),   field: that.getSetting('TimeCriticalityField')},
				{name: that.getSetting('UserBusinessValueLabel'), field: that.getSetting('UserBusinessValueField')},
				{name: that.getSetting('RROEValueLabel'),         field: that.getSetting('RROEValueField')},
				{name: that.getSetting('JobSizeLabel'),           field: that.getSetting('JobSizeField')}
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
					columns = this.setColumns();
					this._createBoard(piLabel, piField, columns);
				},
				ready: function(combobox) {
					piLabel = combobox.getRawValue();
					piField = combobox.getValue();
					columns = this.setColumns();
					this._createBoard(piLabel, piField, columns);
				}
			}
		});
		this.add(this._fieldCombo);
	},
    _createBoard: function(label, field) {
		if ( this._myBoard ) { this._myBoard.destroy(); }
        this._myBoard = Ext.create("Rally.ui.cardboard.CardBoard", {
			xtype: 'rallycardboard',
			types: app.piType,
			attribute: field,
			listeners:{
				scope:this
			},
			columnConfig: {
                columnHeaderConfig: {
                headerTpl: '{size}'
            	}
            },
            columns: columns,
			cardConfig: {
				fields: ['InvestmentCategory', 'PreliminaryEstimate','Release'],
				editable: true,
				enableValidationUi: true,
				showIconMenus: true
			},
			storeConfig: {
				filters: app.getQueryFilter(),
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
                name: 'TimeCriticalityField',
                xtype: 'rallytextfield',
                label : "Time Criticality Field",
                labelWidth: 200
            },
            {
                name: 'TimeCriticalityLabel',
                xtype: 'rallytextfield',
                label : "Time Criticality Label",
                labelWidth: 200
            },
            {
                name: 'RROEValueField',
                xtype: 'rallytextfield',
                label : "RROEValue Field",
                labelWidth: 200
            },
            {
                name: 'RROEValueLabel',
                xtype: 'rallytextfield',
                label : "RROEValue Label",
                labelWidth: 200
            },
            {
                name: 'UserBusinessValueField',
                xtype: 'rallytextfield',
                label : "User Business Value Field",
                labelWidth: 200
            },
            {
                name: 'UserBusinessValueLabel',
                xtype: 'rallytextfield',
                label : "User Business Value Label",
                labelWidth: 200
            },
            {
                name: 'JobSizeField',
                xtype: 'rallytextfield',
                label : "Job Size Field",
                labelWidth: 200
            },
            {
                name: 'JobSizeLabel',
                xtype: 'rallytextfield',
                label : "Job Size Label",
                labelWidth: 200
            },
            {
                name: 'Values',
                xtype: 'rallytextfield',
                label : "Size Values (Columns)",
                labelWidth: 200
            },
			{
				type: 'query'
			}
        ];
        return values;
    },
    config: {
        defaultSettings : {
            TimeCriticalityField : 'TimeCriticality',
            RROEValueField : 'RROEValue',
            UserBusinessValueField : 'UserBusinessValue',
            JobSizeField : 'JobSize',
            TimeCriticalityLabel : 'Time Criticality',
            RROEValueLabel : 'RROE Value',
            UserBusinessValueLabel : 'User Business Value',
			JobSizeLabel : 'Job Size',
			Values : ['1','2','3','5','8','13','21']
        }
	},
	getQueryFilter: function () {
		var filters = [];
		if (app.getSetting('query')) {
			filters.push(Rally.data.QueryFilter.fromQueryString(app.getSetting('query')));
		}
		return filters;
	},
	onScopeChange: function() {
		piLabel = this._fieldCombo.getRawValue();
		piField = this._fieldCombo.getValue();
		columns = this.setColumns();
        this._createBoard(piLabel, piField, columns);
	},
	setColumns: function() {
		var val = this.getSetting('Values').split(',');
		var columns = [];
        _.each( val, function (n) {
            columns.push({
                value: n,
                columnHeaderConfig: {
                    headerData: {size: n}
                }
            });
		});
		return columns;
	}});

