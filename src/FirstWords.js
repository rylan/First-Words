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
	    		{kind: enyo.VFlexBox, flex: 3, components: [
					{kind: "com.iCottrell.Photos", name:"photos", flex:3},
					{kind: "com.iCottrell.WordDetails", name: "details", flex:1},
					
				]}
			]}
		], 
		onChange: function(inSender, inEvent){
			this.$.photos.searchBtnClick(this.$.wordlist.data[inEvent.rowIndex]);
			this.$.details.updateDefinition(this.$.wordlist.data[inEvent.rowIndex]);
			this.$.photos.refresh();
			this.$.details.refresh();
		}	
});