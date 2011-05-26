enyo.kind({
	name: "com.iCottrell.FirstWords",
	flex:1,
	kind: enyo.VFlexBox, 
	components:[
		{kind: enyo.HFlexBox, className:"topBackground", components:[
			{kind:"Image", src:"img/firstWords.png", className:"imageLogo"},
			{content: "- An Interactive Guide", style:"margin-top:15px;margin-left:5px; font-size:12pt"}
		]},
		{kind: enyo.HFlexBox,
		flex:2,	
		layoutKind: "HFlexLayout", wideWidth: 800, components: [
			{flex:1, kind: enyo.VFlexBox, components: [
				{kind: "com.iCottrell.WordList", name: "wordlist",  flex:1, onWordSelected: "wordSelected"},
					{name: "console", style: "color: white; background-color: white; padding: 4px; border:none"},
					{kind: enyo.HFlexBox, layoutKind: "HFlexLayout", className: "bottom-background", components: [
						{kind: enyo.Button, name: "addWordButton", caption: "Add Word", flex:1, onclick: "addWordOpen"},
						{kind: "com.iCottrell.AddWordDialog", name:"addWordDialog", onWordAdded:"refreshWordList"},
						{name: "emptyspace", flex: 1}
					],}
				]},
	    	{kind: enyo.VFlexBox, flex: 4, style:"border-left: 1px solid silver;", components: [
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
		try{
			this.nullHandleCount=0;
			var sqlTable = 'CREATE TABLE firstwords (word TEXT NOT NULL, whendate TEXT NOT NULL, definition TEXT, keywords TEXT);'
			this.wordDB.transaction(
				enyo.bind(this, (function (transaction) {
					transaction.executeSql(sqlTable, [], enyo.bind(this,this.createTableDataHandler), enyo.bind(this,this.errorHandler));
				}))
			);
		}
		catch(e){
			console.log(e);
		}		
	},
	createTableDataHandler: function(transaction, results) 
	{	
		this.$.photos.setDB(this.wordDB);
		this.$.details.setDB(this.wordDB);
		this.$.wordlist.setDB(this.wordDB);
		this.$.addWordDialog.setDB(this.wordDB);
		this.$.wordlist.loadData();
	},
	errorHandler: function(transaction, error){
		this.$.photos.setDB(this.wordDB);
		this.$.details.setDB(this.wordDB);
		this.$.wordlist.setDB(this.wordDB);
		this.$.addWordDialog.setDB(this.wordDB);
		this.$.wordlist.loadData();
	},
	wordSelected: function(){
		this.$.photos.getImages(this.$.wordlist.getSelectedWord());
		this.$.details.updateDefinition(this.$.wordlist.getSelectedWord());
	},
	addWordOpen: function(){
		this.$.addWordDialog.openAtCenter();
	},
	refreshWordList: function(){
		this.$.wordlist.loadData(null);
	},
	openAbout: function (inSender, inEvent){
		this.$.about.openAtCenter();
	}
});