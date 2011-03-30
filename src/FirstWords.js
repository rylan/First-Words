enyo.kind({
	kind:"Control",
	name: "com.iCottrell.FirstWords",
	kind: enyo.VFlexBox, components:[
		{kind: enyo.HFlexBox, className:"topBackground", components:[
			{kind:"Image", src:"img/firstWords.png", className:"imageLogo"},
			{content: "- An Interactive Guide", style:"margin-top:15px;margin-left:5px; font-size:12pt"}
		]},
		{kind: enyo.HFlexBox,
		flex:2,	
		layoutKind: "HFlexLayout", wideWidth: 800, components: [
			{flex:1, kind: enyo.VFlexBox, components: [
				{kind: "com.iCottrell.WordList", name: "wordlist",  onWordSelected: "wordSelected"},
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
		]}
	], 
	wordSelected: function(){
		this.$.photos.getImages(this.$.wordlist.getSelectedWord());
		this.$.details.updateDefinition(this.$.wordlist.getSelectedWord().word);
	},
	addWordOpen: function(){
		this.$.addWordDialog.openAtCenter();
	},
	refreshWordList: function(){
		this.$.wordlist.loadData(null);
	}
});