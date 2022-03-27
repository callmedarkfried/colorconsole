This serves as a sort of showcase of the possibilities.
Note that not all functionality is supported by every terminal.
```js
let cc = require("./colorconsole.js");
cc.renderdiscord({
	author: {
		displayName: "Username",
		roleColor: "ff00ff",
		isBot: true
	},
	message: {
		mentionsuser: false,
		content: "embed text",
		timestamp: "date",
		hasEmbed: true,
		embed: {
			title: "title",
			color: "7f0000",
			content: "this is an embed {@everyone} [link]",
			timestamp: "yesterday"
		},
		reply: {
			isReply: true,
			author: "author",
			text: "content",
			authorRole: 406202
		}
	}
});
	
```
