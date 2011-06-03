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