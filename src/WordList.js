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
	name: "com.iCottrell.WordList",
	flex:2,
	kind: enyo.VFlexBox,
	events: {
		onWordSelected: "",
		onWordDeleted: ""
	},
	components: [
		{flex: 1, name: "list", kind: "VirtualList", className: "list", onSetupRow: "listSetupRow", components: [
			{kind: "Divider"},
			{kind: "SwipeableItem", className: "item", onclick:"itemClick", onConfirm: "deleteItem", components: [
				{name: "itemWord", flex: 1},
				{name: "itemDate", className: "item-date"}
			]}
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.data = [];
		this.selectedWord ="";
		this.wordDB = null;
		this.child_id = 0;
	},
	setDB: function(db){
		this.wordDB = db;
	},
	setChildId: function(id){
		this.child_id = id;
	},
	loadData: function() {
		if(this.wordDB){
			var queryWordList = 'SELECT word, whendate, definition, keywords FROM firstwords where child ="'+this.child_id+'";'
			try {
				this.wordDB.transaction(
					enyo.bind(this, (function (transaction) {
						transaction.executeSql(queryWordList, [], enyo.bind(this, this.queryDataHandler), enyo.bind(this,this.errorHandler));
					}))
				);
			}
			catch(e){
				this.error(e);
			}
		}
	},
	queryDataHandler: function(transaction, results) {
		this.data = [];
		try{
			for(var i=0; i < results.rows.length; i++){
				this.data.push( results.rows.item(i) );
			}
		}
		catch(e) {
			this.error(e);
		}
		this.data.sort(function(inA, inB) {
			var an = inA.word;
			var bn = inB.word;
			if (an < bn) return -1;
			if (an > bn) return 1;
			return 0;
		});
		this.$.list.refresh();
	},
	errorHandler: function(transaction, error) {
		this.error(error);
	},
	queryResponse: function(inSender, inResponse) {
		this.data = inResponse.results;
		//sorts the data by words
		this.data.sort(function(inA, inB) {
			var an = inA.word;
			var bn = inB.word;
			if (an < bn) return -1;
			if (an > bn) return 1;
			return 0;
		});
		this.$.list.refresh();
	},
	getGroupName: function(inIndex) {
		// get previous record
		var r0 = this.data[inIndex -1];
		// get (and memoized) first letter of last name
		if (r0 && !r0.letter) {
			r0.letter = r0.word[0];
		}
		var a = r0 && r0.letter;
		// get record
		var r1 = this.data[inIndex];
		if (!r1.letter) {
			r1.letter = r1.word[0];
		}
		var b = r1.letter;
		// new group if first letter of last name has changed
		return a != b ? b : null;
	},
	setupDivider: function(inIndex) {
		// use group divider at group transition, otherwise use item border for divider
		var group = this.getGroupName(inIndex);
		this.$.divider.setCaption(group);
		this.$.divider.canGenerate = Boolean(group);
		this.$.swipeableItem.applyStyle("border-top", Boolean(group) ? "none" : "1px solid silver;");
	},
	listSetupRow: function(inSender, inIndex) {
		var record = this.data[inIndex];
		if (record) {
			// bind data to item controls
			this.setupDivider(inIndex);
			this.$.swipeableItem.applyStyle("background-color", inSender.isSelected(inIndex) ? "lightblue" : null);
			this.$.itemWord.setContent(record.word);
			this.$.itemDate.setContent(this.formatDate(record.whendate));
			
			if(inSender.isSelected(inIndex)){
				this.selectedWord = this.data[inIndex];
				this.doWordSelected();
			}
			return true;
		}
	},
	formatDate: function (date){
		var d = new Date(date*1);
		return d.toLocaleDateString();
	},
	itemClick: function(inSender, inEvent, inRowIndex){
		this.$.list.select(inRowIndex);
		return true;
	},
	getSelectedWord: function(){
		return this.selectedWord;
	},
	deleteItem: function (inSender, inIndex){
		var sqlDelete = 'DELETE FROM firstwords WHERE word="'+this.data[inIndex].word+'" AND child="'+this.child_id+'";'
		try {
			this.wordDB.transaction(
				enyo.bind(this, (function (transaction) {
					transaction.executeSql(sqlDelete, [], enyo.bind(this, this.deleteDataHandler), enyo.bind(this,this.errorHandler));
				}))
			);
		}
		catch(e){
			this.error(e);
		}
		
		if(this.data[inIndex].word === this.getSelectedWord().word){
			this.selectedWord = null;
		}
		
	},
	deleteDataHandler: function(){
		this.loadData();
		this.$.list.refresh();
		this.doWordDeleted();
	}
});