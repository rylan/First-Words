enyo.kind({
	name: "com.iCottrell.AddWordDialog", 
	kind: enyo.Popup, 
	layoutKind: "VFlexLayout",
	width: "73%", style: "overflow: hidden", 
	components: [
		{kind: "RowGroup", caption: "Add Word", components: [
			{kind: "FancyInput", hint: "Enter word", name:"word"},						
			{kind: "DatePicker", name: "datePicker", label: "Date", minYear: 2009, onChange: "wordDate"},
			{kind: "FancyInput", name: "keywords", hint: "Keywords -- Optional, used to improve image search results (separated by ',')", label:"Word"},
			{kind: "FancyRichText", name:"wordDefinition", hint:"Custom definition -- Optional"}	
		]},
		{kind: enyo.HFlexBox, layoutKind: "HFlexLayout", components: [
			{kind: "Button", caption: "Add", flex:1, onclick: "addWord"},
			{kind: "Button", caption: "Cancel", onclick:"cancelDialog", flex:1}
		]}
	],
	create: function() {
		this.inherited(arguments);
	},
	wordDate: function(){
 		return true;		
	},
 
	addWord: function(){
		return true;
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
