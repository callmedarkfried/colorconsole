function output(string) {

	var codes = {
		formatting: {
			"<r>": "\x1b[0m", //reset
			"<u>": "\x1b[4m", // unerline
			"</u>": "\x1b[24m", //stop underline
			"<n>": "\x1b[7m", //invert
			"</n>": "\x1b[27m", //end invert
			"<i>": "\x1b[3m", //italic
			"</i>": "\x1b[23m",
			"<blink>": "\x1b[5m", //slowblink
			"</blink>": "\x1b[25m",
			"<cross>": "\x1b[9m", //crossed out
			"</cross>": "\x1b[29m", //end crossed out
			"<fraktur>": "\x1b[20m", //fraktur
			"</fraktur>": "\x1b[23m",
			"<b>": "\x1b[1m", //bold
			"</b>": "\x1b[22m", //end bold
			"</c f>": "\x1b[39m",
			"</c b>": "\x1b[49m",
			"</c>": "\x1b[39m\x1b[49m",
			"<ol>": "\x1b[53m", //overline
			"</ol>": "\x1b[55m",
			"<dol>": "\x1b[63m", //double overline
			"</dol>": "\x1b[65m",
			"<framed>": "\x1b[51m",
			"<encircle>": "\x1b[52m",
			"</framed>": "\x1b[54m",
			"</encircle>": "\x1b[54m",
		},
		foreground: {
			"0": "30", //FgBlack
			"1": "31", //FgRed
			"2": "32", //FgGreen
			"3": "33", //FgYellow
			"4": "34", //FgBlue
			"5": "35", //FgMagenta
			"6": "36", //FgCyan
			"7": "37", //FgWhite
			"8": "90", //FgBlack
			"9": "91", //FgRed
			"a": "92", //FgGreen
			"b": "93", //FgYellow
			"c": "94", //FgBlue
			"d": "95", //FgMagenta
			"e": "96", //FgCyan
			"f": "97", //FgWhite
		},
		background:
		{
			"0": "40", //BgBlack
			"1": "41", //BgRed
			"2": "42", //BgGreen
			"3": "43", //BgYellow
			"4": "44", //BgBlue
			"5": "45", //BgMagenta
			"6": "46", //BgCyan
			"7": "47", //BgWhite
			"8": "100", //BgBlack
			"9": "101", //BgRed
			"a": "102", //BgGreen
			"b": "103", //BgYellow
			"c": "104", //BgBlue
			"d": "105", //BgMagenta
			"e": "106", //BgCyan
			"f": "107", //BgWhite
		}
	}
	for (f in codes.formatting) {
		string = string.replace(f, codes.formatting[f])
	}
	

	var colortags = string.match(/<c ([bf]=#[\da-f]{1,6} ?){1,2}>/g);
	for (var c in colortags) {
		
		var code = "";
		var end = "";
		var colors = colortags[c].match(/(?<= )[fb]=#[\da-f]{1,6}(?= |>)/g)
		for (var x in colors) {
			var offset = 38;
			if (colors[x].startsWith("b")) offset += 10
			var colorcode = colors[x].replace(/[fb]=#|;|,/g, "")
			code += `\x1b[${offset};2;${hexToRgbString(colorcode)}m`
			}
		string = string.replace(colortags[c], code)
	}
	
	var presetTags = string.match(/<c c=[\da-f]{2}>/g);
	
	for (var p in presetTags) {
		var bg = presetTags[p][5];
		var fg = presetTags[p][6];
		string = string.replace(presetTags[p], `\x1b[${codes.background[bg]}m\x1b[${codes.foreground[fg]}m`)
	}
	
	
	return string;
}

function hexToRgbString(hex) {
	switch (hex.length) {
		case 1: 
			var parse = parseInt(hex + hex, 16)
			return `${parse};${parse};${parse}`
		case 2:
			var parse = parseInt(hex, 16)
			return `${parse};${parse};${parse}`
		case 3:
			var r = parseInt(hex[0] + hex[0], 16)
			var g = parseInt(hex[1] + hex[1], 16)
			var b = parseInt(hex[2] + hex[2], 16)
			return `${r};${g};${b}`
		case 6:
			var r = parseInt(hex[0] + hex[1], 16)
			var g = parseInt(hex[2] + hex[3], 16)
			var b = parseInt(hex[4] + hex[5], 16)
			return `${r};${g};${b}`
	}
}
module.exports = {
	
	print: function(input) {
		process.stdout.write(output(input) + "\n");
	},
	setcursorposition: function (x, y) {
		process.stdout.write(`\x1b[${x};${y}f`)
	},
	setbackgroundcolor: function (color) {
		process.stdout.write(`\x1b[48;2;${hexToRgbString(color)}m\x1b[2k`)
	},
	setforegroundcolor: function (color) {
		process.stdout.write(`\x1b[38;2;${hexToRgbString(color)}m\x1b[2k`)
	},
	defaultcolor: function() {
		process.stdout.write(`\x1b[39m`);
	},
	displayMode: function(mode) {
		process.stdout.write(`\x1b[=${mode}h`);
	},
	clear: function() {
		process.stdout.write(`\x1b[2J`)
		process.stdout.write(`\x1b[0;0f`)
	},
	push: function() {
		process.stdout.write(`\x1b[s`)
	},
	pop: function () {
		
		process.stdout.write(`\x1b[u`)
	},
	discorddivider: function() {
		this.print("<c f=#ed4245>――――――――――――――――――――――――――――――――――――――――――――――――――――<c b=#ed4245 f=#ffffff> NEW <c b=#36393f>")
	},
	renderdiscord: function(template) {
		// embedping: {@letters (ACTUALLY CURT)} 
		// embed link: [(Jump)]
		let embed = [];
		let maxEmbedlength = 0;
		if(template.message.hasEmbed) {
			let embeddedContent = template.message.embed.content.split("\n");
			
			
			embed.push(template.message.embed.title);
			embed.push("");
			maxEmbedlength = template.message.embed.title.length;
			for (x of embeddedContent) {
				embed.push(x);
				if (x.length > maxEmbedlength) maxEmbedlength = x.length
			}
			if (template.message.embed.timestamp != "") embed.push(template.message.embed.timestamp);
			if (template.message.embed.timestamp.length > maxEmbedlength) maxEmbedlength = template.message.embed.timestamp.length;
		}
		
		let output = [];
		if (template.message.mentionsuser) output.push("\x1b[0K<c b=#49443c>\x1b[2K");
		if (template.message.reply.isReply) output.push(`\x1b[2K┌── <c f=#${template.message.reply.authorRole}>${template.message.reply.author} <c f=#b5b5b6>${template.message.reply.text}`)
		
		let line1 = "\x1b[2K";
		line1 += `   <c b=#${template.message.mentionsuser?"49443c":"36393f"}><c f=#${template.author.roleColor}>${template.author.displayName}`
		if (template.author.isBot) line1 += (` <c b=#5865f2 f=#ffffff> BOT <c b=#${template.message.mentionsuser?"49443c":"36393f"}>`);
		line1 += (` <c f=#72767d>  ${template.message.timestamp}<c f=#ffffff> <c b=#${template.message.mentionsuser?"49443c":"36393f"}> `);
		output.push(line1);
		
		if (template.message.content != "") {
			template.message.content = template.message.content.replace("{", "<c b=#3c406f> ").replace("}", ` <c b=#${template.message.mentionsuser?"49443c":"36393f"}>`);
			output.push(`\x1b[0K\x1b[2K<c b=#${template.message.mentionsuser?"49443c":"36393f"}>   ${template.message.content} <c b=#${template.message.mentionsuser?"49443c":"36393f"}>\x1b[0K `);
		}
		
		if(template.message.hasEmbed) {
			output.push(`   <c f=#${template.message.embed.color}>▗<c f=#2f3136>▄▄▄` + "".padEnd(maxEmbedlength, "▄") + "▖</c f>")
			for (x in embed) {
				embed[x] = embed[x].padEnd(maxEmbedlength);
				embed[x] = embed[x].replace("{", "<c b=#3c406f> ").replace("}", " <c b=#2f3136>");
				embed[x] = embed[x].replace("[", " <c f=#1ea3e8>").replace("]", " <c f=#ffffff>");
				output.push(`\x1b[0K\x1b[2K<c b=#${template.message.mentionsuser?"49443c":"36393f"}>   <c f=#${template.message.embed.color}>▐<c f=#ffffff b=#2f3136>   ${embed[x]}<c b=#${template.message.mentionsuser?"49443c":"36393f"}>\x1b[0K`);
			}
		}
		output.push(" \x1b[0K\x1b[2K");
		output.push("<c b=#36393f>\x1b[0K\x1b[2K<c b=#36393f>\x1b[0K");
		for(x of output) {
			this.print(x);
		}
	}
}
