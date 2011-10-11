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
	name: "com.iCottrell.ReleaseNotes", 
	kind: "ModalDialog", 
	layoutKind: "VFlexLayout",
	width: "85%", 
	caption: "Release Notes",
	components: [
		{kind: "Scroller", height:"500px", components:[
			{content: "I would like to thank everyone for the tremendous support of this app. "
		 	+ "I have seen the calls for better picture management and I am currently working a solution and "
		 	+ "will be available in the next major release. I am sorry it has taken me so long, but I’m a slave to my day "
			+ "job. For those whom might not be aware, this app utilizes Google Images for the pictures, though "
		 	+ "I use the strictest settings Google Images has and place no bias on the words or pictures, I can't say the same thing "
		 	+ "for how the Google search algorithm works. Because of that, I am also working on a warning system "
		 	+ "that can warn other parents of words that are possible returning age inappropriate or offensive images. "
		 	+ "If you have comments or suggestions I would love to hear them, email dev@icottrell.com"},
		
			{kind:"RowGroup", caption:"What's new in version 1.0.5", components:[
				{content:"Fixed bug with keywords not being applied properly in the image search query."},
				{content:"Replaced the dictionary service calls from Dictionary.com to Wordnik to handle the number of query calls."},
				{content:"Word pronunciation through the use of the Flite open source project (http://http://www.speech.cs.cmu.edu/flite/).", onclick:"openFlite"},
				{content:"General bug fixes."}
			]},
			{kind:"RowGroup", caption:"Coming soon - Picture Management", components:[
				{content:"Block unwanted, disliked, age inappropriate, or offensive pictures."},
				{content:"Reporting system to informs others of potentially inappropriate or offensive pictures."}
			]},
		]},
		{kind: "Button", caption: "Close", className:"enyo-button-blue", onclick:"closeDialog"}
	],
	create: function() {
		this.inherited(arguments);
	},
	closeDialog: function() {
		this.close();
	},
	openFlite: function(){
		window.location = "http://www.speech.cs.cmu.edu/flite/";
	}
});