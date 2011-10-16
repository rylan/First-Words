/*******************************************************************************
 * Copyright (c) 2010 Rylan Cottrell. iCottrell.com.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    Rylan Cottrell - initial API and implementation and/or initial documentation
 *******************************************************************************/

enyo.kind({
	name: "com.iCottrell.WordDetails",
	kind: "VFlexBox", 
	components: [
		{name: "dictionaryLookup", 
			kind: "WebService", 
			handleAs: "json", 
			onSuccess: "gotLookupResults", 
			onFailure: "gotLookupFailure"},
		{kind: "Hybrid", 
			name: "plugin", 
			width: 0, 
			height: 0, 
			executable: "lib/flite_cmu_us_kal16", 
			takeKeyboardFocus: false, 
			onPluginReady: "handlePluginReady"},
		{kind: "com.iCottrell.config", name: "config"},
		{kind:"HFlexBox", flex: 2, components: [
			{flex:2, name: "deflist", kind: "VirtualList", className: "deflist", onSetupRow: "listSetupRow", components: [
				{kind: "Divider", name: "defdivider"},
				{kind: "Item", className: "item", components: [
					{name: "defstring"}
				]}
			]},
			{kind:"VFlexBox", style:"background-color:white;", components:[ 
				{kind: enyo.AnimatedImage, name:"roboto", className: "robotoAnimated", easingFunc: enyo.easing.linear, imageHeight: 253, imageCount: 3, repeat: -1, onclick:"playSound"}
			]}
		]},
		{kind: "HFlexBox", layoutKind: "HFlexLayout", className: "bottom-background", components: [
			{content:" ", name:"empty"},
			{kind: "Button", caption: "Speak", showing: false, className:"enyo-button-blue", name: "play", flex:1 , onclick:"playSound"},
		]},
		{kind: "Scrim", layoutKind: "VFlexLayout", align: "center", pack: "center",components: [
			{kind: "SpinnerLarge", showing:true}
		]},
		{name: "browser", kind: "PalmService", 
			service: "palm://com.palm.applicationManager/", 
			method: "open", 
			onSuccess: "openedBrowser", 
			onFailure: "genericFailure"}
	],
	create: function() {
		this.wordData = [];
	    this.inherited(arguments);
		this.wordDB = null;
		this.child_id = 0;
		this.word = null;
		this.talkcount = 0;
	},
	setDB: function(db){
		this.wordDB = db;
	},
	handlePluginReady: function(inSender) {
		this.pluginReady = true;
	},
	endRoboto: function(robo){
		this.talkcount--;
		if(this.talkcount <=0) {
			this.$.roboto.stop();
		}
	},
	playSound: function(){
		console.log("Test");
		if(this.pluginReady) {
			this.$.roboto.start();
			this.$.plugin.addCallback("playbackComplete", enyo.bind(this, this.endRoboto));
			if(this.word.word.toLowerCase() == "lost in space") {
				this.talkcount++;
				this.$.plugin.callPluginMethod("playAudio", "Danger, Will Robinson!");
			} else if (this.word.word.toLowerCase() == "42"){
				this.talkcount++;
				this.$.plugin.callPluginMethod("playAudio", "The Answer to the Great Question, of Life, the Universe and Everything.    DON'T PANIC!");
			} else {	
				this.talkcount++;
				this.$.plugin.callPluginMethod("playAudio", this.word.word);
				
				if( !this.word.definition | this.word.definition ===""){
					this.talkcount++;
					try{
						this.$.plugin.callPluginMethod("playAudio", this.wordData[0].text);
					} catch(err){
						this.talkcount--;
					}
				} else if(this.word.definition){
					this.talkcount++;
					this.$.plugin.callPluginMethod("playAudio", this.word.definition);
				}
			}
		}

	}, 
	getGroupName: function(inIndex){
		var a = null;
		if(this.wordData[inIndex-1]){ 
			a = this.wordData[inIndex-1].partOfSpeech;
		}
		var b = this.wordData[inIndex].partOfSpeech;
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
			this.$.defstring.setContent(this.wordData[inIndex].text[0].toUpperCase()+
			this.wordData[inIndex].text.substring(1,this.wordData[inIndex].text.length));
			return true;
		}
	},
	updateDefinition: function(wordobj){
		this.wordData = [];
		this.word = wordobj
		if(wordobj.word == "42") {
			var tmp = new Object();
			tmp.partOfSpeech="DON'T PANIC!";
			tmp.text="The Hitchhiker's Guide to the Galaxy is a science fiction comedy series created by Douglas Adams.";
			this.wordData.push(tmp);
			this.$.empty.hide();
			//this.$.play.show();
			this.$.deflist.refresh();
		} else if(this.word.word.toLowerCase() == "lost in space"){
			var tmp = new Object();
			tmp.partOfSpeech="Danger!";
			tmp.text="It is October 16, 1997 and the United States is proceeding towards the launch of one of history's great adventures: man's colonization of deep space. The Jupiter 2, a futuristic saucer-shaped spaceship, mission is to take a single family on a five-and-a-half-year journey to a planet of the nearby star Alpha Centauri, which space probes reveal possesses ideal conditions for human life. The Robinson family was selected from among two million volunteers for this mission. The family includes Professor John Robinson, his wife, Maureen, their children, Judy, Penny, and Will. They will be accompanied by their pilot, US Space Corps Major Donald West, who is trained to fly the ship in the unlikely event that its sophisticated automatic guidance system malfunctions.";
			this.wordData.push(tmp);
			this.$.empty.hide();
		//	this.$.play.show();
			this.$.deflist.refresh();
		}else if(!wordobj.definition | wordobj.definition ===""){
			this.$.deflist.punt();
			this.$.deflist.reset();
			var url = "http://api.wordnik.com/v4/word.json/"+wordobj.word+"/definitions?useCanonical=true&limit=1&api_key="+this.$.config.getDictionaryAPIKey();
			this.$.dictionaryLookup.setUrl(url);
			var r = this.$.dictionaryLookup.call();
			this.$.scrim.show();
		}else {
			var tmp = new Object();
			tmp.partOfSpeech="Custom Definition";
			tmp.text=wordobj.definition;
			this.wordData.push(tmp);
			this.$.empty.hide();
		//	this.$.play.show();
			this.$.deflist.refresh();
		}
		return true;
	},
	gotLookupResults: function(inSender, inResponse, inRequest) {
		this.$.scrim.hide();
		this.$.empty.hide();
		//this.$.play.show();
		this.wordData = inResponse;
		this.$.deflist.refresh();	
	},
	gotAudioLookupFailure: function() {
		
	},
	gotLookupFailure: function() {
		this.$.scrim.hide();
		this.log("got lookup failure!");
	},
});