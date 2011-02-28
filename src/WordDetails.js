enyo.kind({
	name: "com.iCottrell.WordDetails",
	kind: enyo.VFlexBox, components: [
		{name: "dictionaryLookup", kind: "WebService", handleAs: "xml", onSuccess: "gotLookupResults", onFailure: "gotLookupFailure"},
		{kind: "Button", caption: "Play Sound", onclick:"plqySound"},
		{flex: 1, name: "deflist", kind: "VirtualList", className: "deflist", onSetupRow: "listSetupRow", components: [
			{kind: "Divider", name: "defdivider"},
			{kind: "Item", className: "defitem", components: [
				{name: "defstring"}
			]}
		]},
		{kind: "Scrim", layoutKind: "VFlexLayout", align: "center", pack: "center",components: [
			{kind: "SpinnerLarge"}
		]}
	],
	create: function() {
		this.data = [];
	    this.inherited(arguments);
		this.updateDefinition("sushi");
	},
	playSound: function(){
		if(!this.audiofile){
			var audio = new Audio();
			audio.src = this.audiofile;
			audio.play();
		}
	}, 
	updateDefinition: function(word){
		var url = "http://api-pub.dictionary.com/v001?vid=yj66jd4006bmxf1wgnwhcse7nuo75ff3zl9jzej0ku&q="+word+"&type=define";
		this.$.dictionaryLookup.setUrl(url);
		var r = this.$.dictionaryLookup.call();
		this.$.scrim.show();
		return true;
	},
	gotLookupResults: function(inSender, inResponse, inRequest) {
		this.$.scrim.hide();
		var dictionary = inResponse;
		this.audiofile = dictionary.getElementsByTagName("pron")[0].getAttribute("audiofile");
		this.pron = dictionary.getElementsByTagName("pron")[0].childNodes[0].nodeValue;
		this.partspeech = dictionary.getElementsByTagName("partofspeech");
		
	},
	gotSearchFailure: function() {
		this.$.scrim.hide();
		this.log("got lookup failure!");
	}
});