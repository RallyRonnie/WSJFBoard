Ext.define('CustomApp', {
    extend: 'Rally.app.TimeboxScopedApp',
    componentCls: 'app',
    scopeType: 'release',
    comboboxConfig: {
        fieldLabel: 'Select a PSI:',
        labelWidth: 100,
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
		var piFields = new Ext.create('Ext.data.Store', {
			fields: ['field','name'],
			data : [
				{field:"TimeCriticality",name:"Time Value"},
				{field:"UserBusinessValue",name:"User Value"},
				{field:"RROEValue",name:"RR|OE Value"},
				{field:"JobSize",name:"Job Size"}
			]
		});
		this._fieldCombo = new Ext.create('Ext.form.ComboBox', {
			fieldLabel: 'Choose WSJF Field',
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
		_.each( ['1', '2', '3','5','8','13','21'], function (n) {
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
			types: 'PortfolioItem/Feature',
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
    }
});

