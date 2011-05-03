enyo.kind({
	name: "com.iCottrell.AddWordDialog", 
	kind: enyo.Popup, 
	layoutKind: "VFlexLayout",
	width: "73%", style: "overflow: hidden",
	events:{
		onWordAdded: ""
	},
	components: [
		{kind: "RowGroup", caption: "Add Word", components: [
			{kind: "Input", hint: "Enter word", name:"word"},						
			{kind: "DatePicker", name: "datePicker", label: "Date", minYear: 2009, onChange: "wordDate"},
			{kind: "Input", name: "keywords", hint: "Keywords -- Optional, used to improve image search results (separated by ',')", label:"Word"},
			{kind: "RichText", name:"wordDefinition", hint:"Custom definition -- Optional"}	
		]},
		{kind: enyo.HFlexBox, layoutKind: "HFlexLayout", components: [
			{kind: "Button", caption: "Add", flex:1, onclick: "addWord"},
			{kind: "Button", caption: "Cancel", onclick:"cancelDialog", flex:1}
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.wordDB = null;
	},
	setDB: function(db){
		this.wordDB = db;
	},
	wordDate: function(){
 		return true;		
	},
 
	addWord: function(){
		if(this.wordDB !== null & this.$.word.getValue() !== ""){
			var word = this.$.word.getValue();
			var keywords =  this.$.keywords.getValue(); 
			var def =  this.$.wordDefinition.getValue();
			var date = new Date( this.$.datePicker.getValue()).getTime() ;
			var sqlinsert = 'INSERT INTO firstwords (word, whendate, definition, keywords) VALUES ("'+ word + '","' + date + '","' + def + '","' + keywords + '");'
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

	}
});
