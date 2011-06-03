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
	name: "com.iCottrell.FirstWordsAbout",
	kind: enyo.ModalDialog, 
	layoutKind: "VFlexLayout",
	width: "45%", 
	components: [
		{kind: "HFlexBox", components:[
			{kind: "Image", src:"img/icon.png",  className:"aboutimg"}, 
			{kind: "VFlexBox", flex:3, components:[
				{content: "First Words", className:"abouth1"},
				{content: "Version 1.0.0", className: "aboutver"},
				{content: "Developed by iCottrell.com", className:"abouttxt"},
				{content: "Direct all inquries to dev@icottrell.com", className:"abouttxt"}
			]}
		]},
		{kind: "Button", caption: $L("OK"), onclick: "closePopup", className:"enyo-button-blue", style: "margin-top:10px"},
		{name: "browser", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "open", onSuccess: "openedBrowser", onFailure: "genericFailure"}
	],
	create: function(){
		this.inherited(arguments);
	},
	closePopup: function(){
		this.close();
	}
});