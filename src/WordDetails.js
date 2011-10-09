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
	kind: enyo.VFlexBox, components: [
		{kind: "com.iCottrell.config", name: "config"},
		{kind: enyo.Hybrid, 
			name: "plugin", 
			width: 0, 
			height: 0, 
			executable: "sdltts", 
			takeKeyboardFocus: false, 
			onPluginReady: "handlePluginReady"},
		{name: "dictionaryLookup", 
			kind: "WebService", 
			handleAs: "json", 
			onSuccess: "gotLookupResults", 
			onFailure: "gotLookupFailure"},
		{flex: 2, name: "deflist", kind: "VirtualList", className: "deflist", onSetupRow: "listSetupRow", components: [
			{kind: "Divider", name: "defdivider"},
			{kind: "Item", className: "item", components: [
				{name: "defstring"}
			]}
		]},
		{kind: enyo.HFlexBox, layoutKind: "HFlexLayout", className: "bottom-background", components: [
			{kind: "Button", caption: "Speak", showing: true, name: "play", flex:1 , onclick:"playSound"},
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
	},
	setDB: function(db){
		this.wordDB = db;
	},
	handlePluginReady: function(inSender) {
		console.log("plugin initialized");
		this.pluginReady = true;
	},
	playSound: function(){
		if(this.pluginReady) {
			
			if(this.word.word.toLowerCase() == "lost in space") {
				this.$.plugin.callPluginMethod("playAudio", "Danger, Will Robinson!");
			} else if (this.word.word.toLowerCase() == "42"){
				this.$.plugin.callPluginMethod("playAudio", "The Answer to the Great Question, of Life, the Universe and Everything.    DON'T PANIC!");
			} else {
				var status = this.$.plugin.callPluginMethod("playAudio", this.word.word);	

				if(!this.word.definition | this.word.definition ===""){
					this.$.plugin.callPluginMethod("playAudio", this.wordData[0].text);
				} else {
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
			this.$.deflist.refresh();
		} else if(!wordobj.definition | wordobj.definition ===""){
			this.$.deflist.punt();
			this.$.deflist.reset();
			var url = "http://api.wordnik.com/v4/word.json/"+wordobj.word+"/definitions?useCanonical=true&api_key="+this.$.config.getDictionaryAPIKey();
			this.$.dictionaryLookup.setUrl(url);
			var r = this.$.dictionaryLookup.call();
			this.$.scrim.show();
		}else {
			var tmp = new Object();
			tmp.partOfSpeech="Custom Definition";
			tmp.text=wordobj.definition;
			this.wordData.push(tmp);
			this.$.deflist.refresh();
		}
		return true;
	},
	gotLookupResults: function(inSender, inResponse, inRequest) {
		this.$.scrim.hide();
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