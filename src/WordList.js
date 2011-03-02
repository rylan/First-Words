enyo.kind({
	name: "com.iCottrell.WordList",
	flex:2,
	kind: enyo.VFlexBox,
	components: [
		{kind: "WebService", url: "data/wordDBList.json", onSuccess: "queryResponse", onFailure: "queryFail"},
		{flex: 1, name: "list", kind: "VirtualList", className: "list", onSetupRow: "listSetupRow", components: [
			{kind: "Divider"},
			{kind: "Item", className: "item", onclick:"itemClick", components: [
				{name: "itemWord", flex: 1},
				{name: "itemDate", className: "item-date"}
			]}
		]}
	
		],
		create: function() {
			this.data = [];
			this.inherited(arguments);
			this.loadData(null);
		},
		loadData: function(inSender) {
			this.$.webService.call();
		},
		queryResponse: function(inSender, inResponse) {
			this.data = inResponse.results;
			//sorts the data by words
			this.data.sort(function(inA, inB) {
				var an = inA.word;
				var bn = inB.word;
				if (an < bn) return -1;
				if (an > bn) return 1;
				return 0;
			});
			this.$.list.refresh();
		},
		getGroupName: function(inIndex) {
			// get previous record
			var r0 = this.data[inIndex -1];
			// get (and memoized) first letter of last name
			if (r0 && !r0.letter) {
				r0.letter = r0.word[0];
			}
			var a = r0 && r0.letter;
			// get record
			var r1 = this.data[inIndex];
			if (!r1.letter) {
				r1.letter = r1.word[0];
			}
			var b = r1.letter;
			// new group if first letter of last name has changed
			return a != b ? b : null;
		},
		setupDivider: function(inIndex) {
			// use group divider at group transition, otherwise use item border for divider
			var group = this.getGroupName(inIndex);
			this.$.divider.setCaption(group);
			this.$.divider.canGenerate = Boolean(group);
			this.$.item.applyStyle("border-top", Boolean(group) ? "none" : "1px solid silver;");
		},
		listSetupRow: function(inSender, inIndex) {
			var record = this.data[inIndex];
			if (record) {
				// bind data to item controls
				this.setupDivider(inIndex);
				this.$.item.applyStyle("background-color", inSender.isSelected(inIndex) ? "lightblue" : null);
				this.$.itemWord.setContent(record.word);
				this.$.itemDate.setContent(this.formatDate(record.when));
				return true;
			}
		},
		formatDate: function(date){
			var d = new Date(date);
			return d.toLocaleDateString();
		},
		itemClick: function(inSender, inEvent, inRowIndex){
			this.$.list.select(inRowIndex);
			return false;
		}
});