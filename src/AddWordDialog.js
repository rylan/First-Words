/******************************************************************************* *
* Copyright (c) 2010 Rylan Cottrell. iCottrell.com. Calgary, Alberta, Canada.
* http://www.icottrell.com.  All rights reserved.
* This implementation is not under an open license of any form at this time. People may
* utilize it only when we have explicitly authorized them to do so and only for purposes
* that we have explicitly agreed to. We retain all rights to it. These restrictions are
* likely to be eased in future. For now, if you wish to use the project for any purpose
* that we have not already agreed to, please talk to us about it: we are always happy to
* collaborate.
******************************************************************************/

enyo.kind({
	name: "com.iCottrell.AddWordDialog", 
	kind: enyo.ModalDialog, 
	layoutKind: "VFlexLayout",
	width: "70%", 
	caption: "Add Word",
	events:{
		onWordAdded: ""
	},
	components: [
		{kind: "RowGroup",  components: [
			{kind: "Input", hint: "Enter word", name:"word"},						
			{kind: "DatePicker", name: "datePicker", label: "Date", minYear: 2009, onChange: "wordDate"},
			{kind: "Input", name: "keywords", hint: "Keywords -- Optional, used to improve image search results (separated by ',')", label:"Word"},
			{kind: "RichText", name:"wordDefinition", hint:"Custom definition -- Optional"}	
		]},
		{kind: enyo.HFlexBox, layoutKind: "HFlexLayout", components: [
			{kind: "Button", caption: "Add", flex:1, className:"enyo-button-blue", onclick: "addWord"},
			{kind: "Button", caption: "Cancel", className:"enyo-button-dark", onclick:"cancelDialog", flex:1}
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.wordDB = null;
		this.child_id = 0;
	},
	setDB: function(db){
		this.wordDB = db;
	},
	wordDate: function(){
 		return true;		
	},
 	setChildId: function(id){
		this.child_id = id;
	},
	addWord: function(){
		if(this.wordDB !== null & this.$.word.getValue() !== ""){
			var word = this.$.word.getValue();
			var keywords =  this.$.keywords.getValue(); 
			var def =  this.$.wordDefinition.getValue();
			var date = new Date( this.$.datePicker.getValue()).getTime() ;
			var sqlinsert = 'INSERT INTO firstwords (word, whendate, definition, keywords, child) VALUES ("'+ word + '","' + date + '","' + def + '","' + keywords + '","' + this.child_id + '");'
			this.log(sqlinsert);
			this.wordDB.transaction (
				enyo.bind(this,(function (transaction){
					transaction.executeSql(sqlinsert, [], enyo.bind(this,this.createRecordDataHandler), enyo.bind(this,this.errorHandler)); 
				}))
			);
		}
		
	},
	createRecordDataHandler: function(transaction, results) 
	{	
		this.doWordAdded();
		this.resetDialog();
		this.close();
	},
	errorHandler: function (transaction, error){
		this.error(error);
		this.resetDialog();
		this.close();
	},
	cancelDialog: function() {
		this.resetDialog();
		this.close();
	},
	resetDialog: function() {
		this.$.word.setValue("");
		this.$.datePicker.setValue(new Date());
		this.$.keywords.setValue("");
		this.$.wordDefinition.setValue("");
		this.$.wordDefinition.setHint("Custom definition -- Optional");

	}
});
