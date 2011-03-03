enyo.kind({
	name: "com.iCottrell.PhotoViewerCarousel",
	kind: enyo.VFlexBox,
	style: "background-color: white;",
	components: [
		{name: "googleSearch", kind: "WebService", onSuccess: "gotSearchResults", onFailure: "gotSearchFailure"},
		{name: "dividerTitle", className: "title-photo"},
		{kind: "ImageView", flex: 1, onGetLeft: "getLeft", onGetRight: "getRight"},
		{kind: "Scrim", layoutKind: "VFlexLayout", align: "center", pack: "center",components: [
			{kind: "SpinnerLarge"}
		]}
	],
	
	create: function() {
		this.photos = [];
		this.index = 0;
		this.filter = "sushi";
		this.keywords = ["food"];   
	 	this.inherited(arguments);
	    this.$.dividerTitle.setContent(this.filter);
		this.getImages(null);
		this.$.imageView.setCenterView(this.getImageURL(this.index));
		
	},
	addKeywords: function(keys){ 
		var str = "";
		for(var i=0; i<keys.length; i++){
			str+="%20"+keys[i];
		}
		return str;		
	},
	getImages: function(record){
		if (!record) {
				this.filter = "sushi";
				this.keywords = ["food", "seafood"];
		}else {
			this.filter = record.word;
			if(!record.keywords && record.keywords.length>0){
				this.filter+=this.addKeywords(record.keywords);
			}
		} 
	
		this.$.dividerTitle.setContent(this.filter);
		this.photos = [];
			var url = "https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q="+this.filter+"&key=ABQIAAAAIsrBDRfwcjtKvBvRv1Nf-RQktEsemDdwhF8r6nwtU5g9wU9dGhSP7qi16vSAeKyNSaln4KsC8I-yAg&safe=active"
			//flickr "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20flickr.photos.search("+this.range+")%20where%20text%3D%22" + this.filter + "%22&format=json&safe_search=1&content_type=1&callback=";
			this.$.googleSearch.setUrl(url);
			var r = this.$.googleSearch.call();
			this.$.scrim.show();
			return true;
	},
	gotSearchResults: function(inSender, inResponse, inRequest) {
		this.$.scrim.hide();
		this.photos = inResponse.responseData.results;
		this.index = 0;
		this.$.imageView.setCenterView(this.getImageURL(this.index));
		//this.$.imageView.refresh();
	},
	gotSearchFailure: function() {
		this.$.scrim.hide();
		this.log("got search failure!");
	},
	getImageURL: function(inIndex) {
		if(this.photos[inIndex]){
			return this.photos[inIndex].url;
			//return "http://farm" + this.photos[inIndex].farm + ".static.flickr.com/" + this.photos[inIndex].server + "/" + this.photos[inIndex].id + "_" + this.photos[inIndex].secret+".jpg";
		}else return null;
	},
	getLeft: function(inSender, inSnap) {
	    inSnap && this.index--;
	    return this.getImageURL(this.index-1);
	},
	getRight: function(inSender, inSnap) {
	    inSnap && this.index++;
	    return this.getImageURL(this.index+1);
	},
	setCenterView: function(inSender){
		return this.getImageURL(this.index);
	}
});