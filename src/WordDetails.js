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
	name: "com.iCottrell.WordDetails",
	kind: enyo.VFlexBox, components: [
		{kind: "com.iCottrell.config", name: "config"},
		{name: "dictionaryLookupAudioOnly", kind: "WebService", handleAs: "xml", onSuccess: "gotAudioResults", onFailure: "gotAudioLookupFailure"},
		{name: "dictionaryLookup", kind: "WebService", handleAs: "xml", onSuccess: "gotLookupResults", onFailure: "gotLookupFailure"},
		{flex: 2, name: "deflist", kind: "VirtualList", className: "deflist", onSetupRow: "listSetupRow", components: [
			{kind: "Divider", name: "defdivider"},
			{kind: "Item", className: "item", components: [
				{name: "defstring"}
			]}
		]},
		{kind: enyo.HFlexBox, name: "dictlogo", showing: false, style:"background-color:white", components:[
			{kind:"Spacer"},
			{kind:"Image", src:"img/dict_blue.png", onclick:"openDictionarySite"},
		]},
		{kind: enyo.HFlexBox, layoutKind: "HFlexLayout", className: "bottom-background", components: [
			{kind: "Button", caption: "Speak", showing: false, name: "play", flex:1 , onclick:"playSound"},
		]},
		{kind: "Scrim", layoutKind: "VFlexLayout", align: "center", pack: "center",components: [
			{kind: "SpinnerLarge", showing:true}
		]},
		{kind: "Sound", name: "sound", preload:false},
		{name: "browser", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "open", onSuccess: "openedBrowser", onFailure: "genericFailure"}
	],
	create: function() {
		this.wordData = [];
	    this.inherited(arguments);
		this.wordDB = null;
		this.child_id = 0;
	},
	setDB: function(db){
		this.wordDB = db;
	},
	playSound: function(){
		if(this.audiofile){
			this.$.sound.setSrc(this.audiofile);
			this.$.sound.play();
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
			this.$.defstring.setContent(this.wordData[inIndex][1][0].toUpperCase()+
			this.wordData[inIndex][1].substring(1,this.wordData[inIndex][1].length));
			return true;
		}
	},
	updateDefinition: function(word){
		this.wordData = [];
		if(!word.definition | word.definition ===""){
			this.$.deflist.punt();
			this.$.deflist.reset();
			var url = "http://api-pub.dictionary.com/v001?vid="+this.$.config.getDictionaryAPIKey()+"&q="+word.word+"&type=define&site=dictionary";
			this.$.dictionaryLookup.setUrl(url);
			this.$.dictlogo.show();
			var r = this.$.dictionaryLookup.call();
			this.$.scrim.show();
		}else{
			this.$.dictlogo.hide();
			this.wordData.push(["Custom Definition", word.definition]);
			this.$.deflist.refresh();
			var url = "http://api-pub.dictionary.com/v001?vid="+this.$.config.getDictionaryAPIKey()+"&q="+word.word+"&type=define&site=dictionary";
			this.$.dictionaryLookupAudioOnly.setUrl(url);
			this.$.dictionaryLookupAudioOnly.call();	
		}
		return true;
	},
	gotAudioResults: function(inSender, inResponse, inRequest) {
		var dictionary = inResponse;
		if(dictionary.getElementsByTagName("pron")[0]){
			this.audiofile = dictionary.getElementsByTagName("pron")[0].getAttribute("audiofile");
		}else {
			this.audiofile = null;
		}
		if(this.audiofile){
			this.$.play.show();
			this.$.empty.hide();
		}else{
			this.$.empty.show();
			this.$.play.hide();
		}
	},
	gotLookupResults: function(inSender, inResponse, inRequest) {
		this.$.scrim.hide();
		var dictionary = inResponse;
		if(dictionary.getElementsByTagName("pron")[0]){
			this.audiofile = dictionary.getElementsByTagName("pron")[0].getAttribute("audiofile");
			
		}else{
			this.audiofile = null;
		}
		if(this.audiofile){
			this.$.empty.hide();
			this.$.play.show();
		}else{
			this.$.play.hide();
			this.$.empty.show();
		}
	
		var ps = dictionary.getElementsByTagName("partofspeech");
		for(var i=0; i< ps.length; i++ ){
			var d = ps[i].getElementsByTagName("def");
			var att = (ps[i].getAttribute("pos")? ps[i].getAttribute("pos").toUpperCase(): null);
			for(var j=0; j < d.length; j++){
				this.wordData.push([ att, d[j].childNodes[0].nodeValue ]);
			}
		}
		this.$.deflist.refresh();	
	},
	gotAudioLookupFailure: function() {
		
	},
	gotLookupFailure: function() {
		this.$.scrim.hide();
		this.log("got lookup failure!");
	},
	openDictionarySite: function(){
		this.$.browser.call({
				id: "com.palm.app.browser", 
				params:{target: "http://www.Dictionary.com"}
			});
	}
});