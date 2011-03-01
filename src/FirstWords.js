enyo.kind({
		kind:"Control",
		name: "com.iCottrell.HelloWorld",
		kind: enyo.VFlexBox, components:[
			{kind: "PageHeader", layoutKind: "HFlexLayout", components:[
				{content: "First Words -"},
				{content: "An Interactive Guide", style:"margin-left:4px; font-size:12pt"}
			]},
			{kind: enyo.HFlexBox,
			flex:2,	
			layoutKind: "HFlexLayout", wideWidth: 800, components: [
				{kind: "com.iCottrell.WordList", name: "wordlist", flex: 1, onclick: "onChange"},
	    		{kind: enyo.VFlexBox, flex: 3, style:"border-left: 1px solid silver;", components: [
					{kind: "com.iCottrell.Photos", name:"photos", flex:2},
					{kind: "com.iCottrell.WordDetails", name: "details", flex:1},
					
				]}
			]}
		], 
		onChange: function(inSender, inEvent){
			this.$.photos.searchBtnClick(this.$.wordlist.data[inEvent.rowIndex]);
			this.$.details.updateDefinition(this.$.wordlist.data[inEvent.rowIndex].word);
		}	
});