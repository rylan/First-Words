enyo.kind({
	name: "com.iCottrell.WordDetails",
	kind: enyo.VFlexBox, components: [
		{name: "dictionaryLookup", kind: "WebService", handleAs: "xml", onSuccess: "gotLookupResults", onFailure: "gotLookupFailure"},
		{flex: 2, name: "deflist", kind: "VirtualList", className: "deflist", onSetupRow: "listSetupRow", components: [
			{kind: "Divider", name: "defdivider"},
			{kind: "Item", className: "item", components: [
				{name: "defstring"}
			]}
		]},
		{kind: "Button", caption: "Play Sound", className:"bottom-background", onclick:"plqySound"},
		{kind: "Scrim", layoutKind: "VFlexLayout", align: "center", pack: "center",components: [
			{kind: "SpinnerLarge"}
		]}
	],
	create: function() {
		this.wordData = [];
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
	getGroupName: function(inIndex){
		var a = null;
		if(this.wordData[inIndex-1]){ 
			a = this.wordData[inIndex-1][0];
		}
		var b = this.wordData[inIndex][0];
		return a!=b ? b: null;
	},
	setupDivider: function(inIndex){
		var group = this.getGroupName(inIndex);
		this.$.defdivider.setCaption(group);
		this.$.defdivider.canGenerate = Boolean(group);
		this.$.item.applyStyle("border-top", Boolean(group) ? "none" : "1px solid silver;");
	},
	listSetupRow: function(inSender, inIndex){
		if(this.wordData[inIndex]){
			this.setupDivider(inIndex);
			this.$.defstring.setContent(this.wordData[inIndex][1]);
			return true;
		}
	},
	updateDefinition: function(word){
		this.wordData = [];
		this.$.deflist.punt();
		this.$.deflist.reset();
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
		var ps = dictionary.getElementsByTagName("partofspeech");
		for(var i=0; i< ps.length; i++ ){
			var d = ps[i].getElementsByTagName("def");
			for(var j=0; j < d.length; j++){
				this.wordData.push([ps[i].getAttribute("pos"), d[j].childNodes[0].nodeValue ]);
			}
		}
		this.$.deflist.refresh();;	
	},
	gotLookupFailure: function() {
		this.$.scrim.hide();
		this.log("got lookup failure!");
	}
});