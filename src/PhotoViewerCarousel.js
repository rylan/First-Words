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
			str = str.concat("%20", keys[i]);
		}
		return str;		
	},
	getImages: function ( record ) {
		var keywords = null;
		if (record){
			this.filter = record.word;
	
			if(record.keywords){
				keywords = this.addKeywords(record.keywords.split(","));
			}
			this.log("LLL:"+keywords);
			this.$.dividerTitle.setContent(this.filter);
			this.photos = [];
			if(this.filter == "42"){
				var url = "https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=Hitchhikers%20Guide%20To%20The%20Galaxy&key="+this.$.config.getGoogleAPIKey()+"&safe=active&rsz=8"
			} else {
				if(keywords){
					this.log(keywords)
					var url = "https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q="+this.filter+keywords+"&key="+this.$.config.getGoogleAPIKey()+"&safe=active&rsz=8"		
				} else {
					var url = "https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q="+this.filter+"&key="+this.$.config.getGoogleAPIKey()+"&safe=active&rsz=8"	
				}
				
			}
			
			this.$.googleSearch.setUrl(url);
			var r = this.$.googleSearch.call();
			this.$.scrim.show();
			return true;
		}else{
			this.photos = [];
			this.index = 0;
			this.filter = "";
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