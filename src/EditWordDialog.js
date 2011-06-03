enyo.kind({
	name: "com.iCottrell.EditWordDialog", 
	kind: enyo.Popup, 
	layoutKind: "VFlexLayout",
	width: "73%", style: "overflow: hidden",
	events:{
		onWordUpdated: ""
	},
	components: [
		{kind: "RowGroup", caption: "Edit Word", components: [
			{kind: "Input", hint: "Enter word", name:"word"},						
			{kind: "DatePicker", name: "datePicker", label: "Date", minYear: 2009, onChange: "wordDate"},
			{kind: "Input", name: "keywords", hint: "Keywords -- Optional, used to improve image search results (separated by ',')", label:"Word"},
			{kind: "RichText", name:"wordDefinition", hint:"Custom definition -- Optional"}	
		]},
		{kind: enyo.HFlexBox, layoutKind: "HFlexLayout", components: [
			{kind: "Button", caption: "Edit", flex:1, onclick: "editWordApply"},
			{kind: "Button", caption: "Cancel", onclick:"cancelDialog", flex:1}
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.wordDB = null;
		this.child_id = 0;
		this.editWord = null;
	},
	setDB: function(db){
		this.wordDB = db;
	},
	queryEditWord: function(word){
		var queryWordList = 'SELECT word, whendate, definition, keywords FROM firstwords where word="'+word+'" and child ="'+this.child_id+'";'
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
	},
	wordDate: function(){
 		return true;		
	},
 	setChildId: function(id){
		this.child_id = id;
	},
	queryDataHandler: function(transaction, results){
		if(results.rows.length === 1) {
			this.editWord = results.rows.item(0);
		}else{
			this.editWord = null;
		}
	},
	openDialog: function(inWord) {
		this.editWord = inWord;
		this.openAtCenter();
		this.$.word.setValue(this.editWord.word);
		this.$.keywords.setValue(this.editWord.keywords);
		if(this.editWord.definition){
			this.$.wordDefinition.setValue(this.editWord.definition);
		}
		var d = new Date();
		d.setTime(this.editWord.whendate);
		this.$.datePicker.setValue(d);
		
	},
	editWordApply: function(){
		if(this.wordDB !== null & this.$.word.getValue() !== "" & this.editWord !== null){
			var word = this.$.word.getValue();
			var keywords =  this.$.keywords.getValue(); 
			var def =  this.$.wordDefinition.getValue();
			var date = new Date( this.$.datePicker.getValue() ).getTime() ;
			this.log( this.$.datePicker.getValue() );
			var sqlinsert = 'INSERT INTO firstwords (word, whendate, definition, keywords, child) VALUES ("'+ word + '","' + date + '","' + def + '","' + keywords + '","' + this.child_id + '");'
			var deleteWord = 'DELETE FROM firstwords WHERE word="'+this.editWord.word+'" AND child="'+this.child_id+'";'
			this.wordDB.transaction (
				enyo.bind(this,(function (transaction){
					transaction.executeSql(deleteWord, [], enyo.bind(this,this.deleteRecordDataHandler), enyo.bind(this,this.errorHandler)); 
					transaction.executeSql(sqlinsert, [], enyo.bind(this,this.createRecordDataHandler), enyo.bind(this,this.errorHandler)); 
				}))
			);
		}
		
	},
	deleteRecordDataHandler: function(transaction, results) {
		this.editWord = null; 
	},
	createRecordDataHandler: function(transaction, results) 
	{	
		this.doWordUpdated();
		this.resetDialog();
		this.close();
	},
	errorHandler: function (transaction, error){
		console.log(error);
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
		this.editWord = null;
	}
});
