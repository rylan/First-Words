/*******************************************************************************
 * Copyright (c) 2010 Rylan Cottrell. iCottrell.com.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    Rylan Cottrell - initial API and implementation and/or initial documentation
 *******************************************************************************/

enyo.kind({
	name: "com.iCottrell.AddWordDialog", 
	kind: "ModalDialog", 
	layoutKind: "VFlexLayout",
	caption: "Add Word",
	events:{
		onWordAdded: ""
	},
	width: "70%", 
	components: [
		{kind: "RowGroup",  components: [
			{kind: "Input", hint: "Enter word", name:"word", onkeypress: "handleKeypress"},						
			{kind: "DatePicker", name: "datePicker", label: "Date", minYear: 2009, onChange: "wordDate"},
			{kind: "Input", name: "keywords", hint: "Keywords -- Optional, used to improve image search results (separated by ',')", label:"Word"},
			{kind: "RichText", name:"wordDefinition", hint:"Custom definition -- Optional"}	
		]},
		{kind: "HFlexBox", layoutKind: "HFlexLayout", components: [
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
	addWordSetFocus: function() {
		this.$.word.forceFocusEnableKeyboard();
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
	createRecordDataHandler: function(transaction, results) {	
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
	},
	handleKeypress: function(inSender, inEvent) {
		if (inEvent.keyCode == "13") {
        	this.addWord();
    	} else {
        	return this.inherited(arguments);
      	}
	}
});
