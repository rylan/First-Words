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
	name: "com.iCottrell.FirstWords",
	flex:1,
	kind: enyo.VFlexBox, 
	components:[
		{kind: enyo.HFlexBox, className:"topBackground", components:[
			{kind:"Image", src:"img/firstWords.png", className:"imageLogo"},
			{content: "- An Interactive Guide", style:"margin-top:15px;margin-left:5px; font-size:12pt"}
		]},
		{kind: enyo.HFlexBox, flex: 1, layoutKind: "HFlexLayout", wideWidth: 800, components: [
			{flex:2, kind: enyo.VFlexBox, components: [
				{kind: "com.iCottrell.WordList", name: "wordlist",  flex:1, onWordSelected: "wordSelected", onWordDeleted:"wordDeleted"},
					{name: "console", style: "color: white; background-color: white; padding: 4px; border:none"},
					{kind: enyo.HFlexBox, layoutKind: "HFlexLayout", className: "bottom-background", components: [
						{kind: enyo.Button, name: "addWordButton", className:"enyo-button-blue", caption: "Add Word", flex:1, onclick: "addWordOpen"},
						{kind: enyo.Button, name: "editWordButton", className:"enyo-button-blue", caption: "Edit Word", flex:1, showing:false,  onclick: "editWordOpen"},
						{kind: "com.iCottrell.AddWordDialog", name:"addWordDialog", onWordAdded:"refreshWordList", onWordSelected:"wordSelect", onWordDeselected:"wordDeselect"},
						{kind: "com.iCottrell.EditWordDialog", name:"editWordDialog", onWordUpdated:"refreshWordList"}
					],}
				]},
	    	{kind: enyo.VFlexBox, flex: 5, style:"border-left: 1px solid silver;", components: [
				{kind: "com.iCottrell.PhotoViewerCarousel", name:"photos", flex:2},
				{kind: "com.iCottrell.WordDetails", name: "details", flex:1},			
			]}
		]},
		{kind: "AppMenu", components: [
			{caption: "About", onclick: "openAbout"}
		]},
		{kind: "com.iCottrell.FirstWordsAbout", name:"about"}
	], 
	create: function(){
		this.inherited(arguments);
		this.wordDB = openDatabase('FirstWordsDB', '1.0', 'First Words Data Store', '65536');
		this.child_id = 0; //Default Child
		try{
			this.nullHandleCount=0;
			var sqlTable = 'CREATE TABLE firstwords (word TEXT NOT NULL, whendate TEXT NOT NULL, definition TEXT, keywords TEXT, child INTEGER NOT NULL);'
			this.wordDB.transaction(
				enyo.bind(this, (function (transaction) {
					transaction.executeSql(sqlTable, [], enyo.bind(this,this.createTableDataHandler), enyo.bind(this,this.errorHandler));
				}))
			);
		}
		catch(e){
			this.error(e);
		}		
	},
	createTableDataHandler: function(transaction, results) 
	{	
		this.$.photos.setDB(this.wordDB);
		this.$.details.setDB(this.wordDB);
		this.$.wordlist.setDB(this.wordDB);
		this.$.addWordDialog.setDB(this.wordDB);
		this.$.editWordDialog.setDB(this.wordDB);
		this.$.wordlist.loadData();
	},
	errorHandler: function(transaction, error){
		this.$.photos.setDB(this.wordDB);
		this.$.details.setDB(this.wordDB);
		this.$.wordlist.setDB(this.wordDB);
		this.$.addWordDialog.setDB(this.wordDB);
		this.$.editWordDialog.setDB(this.wordDB);
		this.$.wordlist.loadData();
	},
	wordSelected: function(){
		this.$.editWordButton.show();
		this.$.photos.getImages(this.$.wordlist.getSelectedWord());
		this.$.details.updateDefinition(this.$.wordlist.getSelectedWord());
	},
	addWordOpen: function(){
		this.$.addWordDialog.openAtCenter();
	},
	editWordOpen: function(){
		this.$.editWordDialog.openDialog(this.$.wordlist.getSelectedWord());
	},
	refreshWordList: function(){
		this.$.wordlist.loadData(null);
	},
	openAbout: function (inSender, inEvent){
		this.$.about.openAtCenter();
	},
	wordDeselect: function(){
		this.$.editWordButton.hide();
		this.$.editWordDialog.resetDialog();
	}, 
	wordDeleted: function(inEvent){
		if(this.$.wordlist.getSelectedWord() == null){
			this.$.photos.getImages( null );
			this.$.details.updateDefinition( null );
			this.editWordButton.hide();	
		}
	}
});