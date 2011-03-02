enyo.kind({
		kind:"Control",
		name: "com.iCottrell.FirstWords",
		kind: enyo.VFlexBox, components:[
			{kind: "PageHeader", layoutKind: "HFlexLayout", components:[
				{content: "First Words -"},
				{content: "An Interactive Guide", style:"margin-left:4px; font-size:12pt"}
			]},
			{kind: enyo.HFlexBox,
			flex:2,	
			layoutKind: "HFlexLayout", wideWidth: 800, components: [
				{flex:2, kind: enyo.VFlexBox, components: [
					{kind: "com.iCottrell.WordList", name: "wordlist", flex: 1, onclick: "onChange"},
						{name: "console", style: "color: white; background-color: white; padding: 4px; border:none"},
						{kind: enyo.HFlexBox, layoutKind: "HFlexLayout", className: "bottom-background", components: [
							{kind: enyo.Button, name: "addWordButton", caption: "Add Word", flex:1, onclick: "addWord"},
							{name: "addWordDialog", kind: "Popup", layoutKind: "VFlexLayout",
							width: "75%", style: "overflow: hidden",  components: [
								//{className: "addDialogTitle", content: "Add Word"},
								{kind: "RowGroup", caption: "Add Word", components: [
									{kind: "FancyInput", hint: "Enter word", label:"Word"},						
									{kind: "DatePicker", label: "Date", minYear: 2009, onChange: "wordDate"},
									{kind: "FancyInput", hint: "Enter keywords (separated by ',')", label:"Word"},	
								]},
								{kind: enyo.HFlexBox, layoutKind: "HFlexLayout", components: [
									{kind: "Button", caption: "Add", flex:1},
									{kind: "Button", caption: "Cancel", onclick:"cancelDialog", flex:1}
								]}
							]},
							{name: "emptyspace", flex: 1}
							],}
						]},
	    		{kind: enyo.VFlexBox, flex: 3, style:"border-left: 1px solid silver;", components: [
					{kind: "com.iCottrell.PhotoViewerCarousel", name:"photos", flex:2},
					{kind: "com.iCottrell.WordDetails", name: "details", flex:1},
					
				]}
			]}
		], 
		onChange: function(inSender, inEvent){
			this.$.photos.getImages(this.$.wordlist.data[inEvent.rowIndex]);
			this.$.details.updateDefinition(this.$.wordlist.data[inEvent.rowIndex].word);
		},
		addWord: function(){
			this.$.addWordDialog.openAtCenter();
		},
		cancelDialog: function() {
			this.$.addWordDialog.close();
		}, 
		wordDate: function(){
			
		}	
});