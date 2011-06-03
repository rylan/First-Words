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
	name: "com.iCottrell.PhotoViewerCarousel",
	kind: enyo.VFlexBox,
	style: "background-color: white;",
	components: [
		{kind: "com.iCottrell.config", name: "config"},
		{name: "googleSearch", kind: "WebService", onSuccess: "gotSearchResults", onFailure: "gotSearchFailure"},
		{name: "dividerTitle", className: "title-photo"},
		{kind: "ImageView", flex: 1, onGetLeft: "getLeft", onGetRight: "getRight", pack: "center"},
		{kind: "Scrim", layoutKind: "VFlexLayout", align: "center", pack: "center",components: [
			{kind: "SpinnerLarge", showing:true}
		]}
	],
	
	create: function() {
		this.photos = [];
		this.index = 0;
		this.filter = "";
		this.keywords = [];   
	 	this.inherited(arguments);
	    this.$.dividerTitle.setContent(this.filter);
		this.getImages(null);
		this.$.imageView.setCenterView(this.getImageURL(this.index));
		this.wordDB = null;
	},
	setDB: function (db) {
		this.wordDB = null;
	},
	addKeywords: function (keys) { 
		var str = "";
		for(var i=0; i<keys.length; i++){
			str+="%20"+keys[i];
		}
		return str;		
	},
	getImages: function ( record ) {
		if (record){
			this.filter = record.word;
			if(!record.keywords && record.keywords.length>0){
				this.filter+=this.addKeywords(record.keywords);
			}
		
	
			this.$.dividerTitle.setContent(this.filter);
			this.photos = [];
			var url = "https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q="+this.filter+"&key="+this.$.config.getGoogleAPIKey()+"&safe=active&rsz=8"
			this.$.googleSearch.setUrl(url);
			var r = this.$.googleSearch.call();
			this.$.scrim.show();
			return true;
		}else{
			this.photos = [];
			this.index = 0;
			this.filter = "";
			this.keywords = [];
			this.$.dividerTitle.setContent(this.filter);
		}
	},
	gotSearchResults: function ( inSender, inResponse, inRequest) {
		this.$.scrim.hide();
		this.photos = inResponse.responseData.results;
		this.index = 0;
		this.$.imageView.setCenterView(this.getImageURL(this.index));
	},
	gotSearchFailure: function() {
		this.$.scrim.hide();
		this.log("got search failure!");
	},
	getImageURL: function (inIndex) {
		if(this.photos[inIndex]){
			return this.photos[inIndex].url;
		}else return null;
	},
	getLeft: function (inSender, inSnap) {
	    inSnap && this.index--;
	    return this.getImageURL(this.index-1);
	},
	getRight: function (inSender, inSnap) {
	    inSnap && this.index++;
	    return this.getImageURL(this.index+1);
	},
	setCenterView: function (inSender){
		return this.getImageURL(this.index);
	}
});