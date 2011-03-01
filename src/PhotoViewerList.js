enyo.kind({
	name: "com.iCottrell.PhotoViewerList",
	kind: enyo.VFlexBox,
	pageSize: 10,
	style: "background-color: white;",
	components: [
		{name: "flickrSearch", kind: "WebService", onSuccess: "gotSearchResults", onFailure: "gotSearchFailure"},
		{name: "dividerTitle", className: "title-photo"},
		{kind: enyo.HFlexBox, flex: 1, components: [
			{name: "list", align:"center", kind: enyo.VirtualList, flex: 1, 
				onSetupRow: "setupRow",
				onAcquirePage: "acquirePage",
				onDiscardPage: "discardPage",
				components: [
					{kind: "Item", layoutKind: "HFlexLayout", onclick: "itemClick", components: [					   
						{name: "thumbnail", kind: "Image"}	
					]}
				]
			}
		]},
		{kind: "Scrim", layoutKind: "VFlexLayout", align: "center", pack: "center",components: [
			{kind: "SpinnerLarge"}
		]}
	],
	constructor: function() {
		this.inherited(arguments);
		this.pages = [];
		this.filter = "sushi";
		this.keywords = ["food"];
	},
	create: function() {
		this.inherited(arguments);
		this.$.list.pageSize = this.pageSize;
		this.$.dividerTitle.setContent(this.filter);
	},
	fetchRow: function(inIndex) {
		var page = Math.floor(inIndex / this.pageSize);
		var p = this.pages[page];
		if (!p || !p.data) {
			return null;
		}
		var row = inIndex - (page * this.pageSize);
		if (inIndex < 0) {
			row -= (this.pageSize - p.data.length);
		}
		return p.data[row];
	},
	setupRow: function(inSender, inRow) {
		var data = this.fetchRow(inRow);
		if (data) {
			this.$.thumbnail.setSrc(data.photoUrl_thumb);
			return true;
		}
	},
	acquirePage: function(inSender, inPage) {
		if (inPage >= 0 && !this.pages[inPage]) {
			return this.search(inPage);
		}
	},
	discardPage: function(inSender, inPage) {
	},
	getImages: function(record) {
		this.filter = record.word;
		this.keywords = record.keywords;
		if (!this.filter) {
			this.filter = "sushi";
			this.keywords = [];
		}
		this.$.dividerTitle.setContent(this.filter);
		this.pages = [];
		this.$.list.punt();
		this.$.list.reset();
	},
	search: function(inPage) {
		this.log(inPage);
		
		if (!this.filter) {
			return false;
		}
		var i = inPage*this.pageSize;
		var range = i + "%2C" + (i+this.pageSize);
		if(!this.keywords && this.keywords.length>0){
			this.filter+=this.addKeywords(this.keywords);
		}
		
		var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20flickr.photos.search(" + range + ")%20where%20text%3D%22" + this.filter + "%22&format=json&safe_search=1&content_type=1&callback=";
		this.$.flickrSearch.setUrl(url);
		var r = this.$.flickrSearch.call(null, {pageIndex: inPage});
		this.$.scrim.show();
		return true;
	},
	addKeywords: function(keys){ 
		var str = "";
		for(var i=0; i<keys.length; i++){
			str+="+"+keys[i];
		}
		return str;		
	},
	gotSearchResults: function(inSender, inResponse, inRequest) {
		var pageIndex = inRequest.pageIndex;
		this.$.scrim.hide();
		var photos = inResponse.query.results.photo;
		for (var i=0, p; p = photos[i]; i++) {
			var urlprefix = "http://farm" + p.farm + ".static.flickr.com/" + p.server + "/" + p.id + "_" + p.secret;
			p.photoUrl_thumb = urlprefix + ".jpg"
			p.photoUrl = urlprefix + ".jpg"
		}
		this.pages[pageIndex] = {
			data: photos
		};
		// after getting the first batch of data, tell the list to render; alternative is to scroll the empty list
		if (pageIndex == 0) {
			this.$.list.refresh();
		}
	},
	gotSearchFailure: function() {
		this.$.scrim.hide();
		this.log("got search failure!");
	}
});