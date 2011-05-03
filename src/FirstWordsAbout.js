enyo.kind({
	name: "com.iCottrell.FirstWordsAbout",
	kind: enyo.Popup, 
	layoutKind: "VFlexLayout",
	width: "85%", style: "overflow: hidden",
	components: [
		{kind: "HFlexBox", components:[
			{kind: "Image", src:"img/icon.png",  className:"aboutimg"}, 
			{kind: "VFlexBox", flex:3, components:[
				{content: "First Wors", className:"abouth1"},
				{content: "Version 1.0.0", className: "aboutver"},
				{content: "Developed by iCottrell.com", className:"abouttxt"},
				{content: "Direct all inquries to dev@icottrell.com", className:"abouttxt"}
			]}
		]},
		{name: "browser", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "open", onSuccess: "openedBrowser", onFailure: "genericFailure"}
	],
	create: function(){
		this.inherited(arguments);
	}
});