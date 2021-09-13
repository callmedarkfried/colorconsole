function output(string) {

	var codes = {
		"r": "\x1b[0m", //reset
		"u": "\x1b[4m", // unerline
		"s": "\x1b[24m", //stop underline
		"cf": "\x1b[39m",
		"cb": "\x1b[49m",
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
	
	string = string.replace(/\<r\>/g, codes.r);
	string = string.replace(/\<u\>/g, codes.u);
	string = string.replace(/\<\/u\>/g, codes.s);
	string = string.replace(/\<\/c f\>/g, codes.cf);
	string = string.replace(/\<\/c b\>/g, codes.cb);
	string = string.replace(/\<\/c\>/g, codes.cb + codes.cf);
	

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
	
	
	string += codes.r
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
		process.stdout.write(output(input) + "\noman");
	},
	setcursorposition: function (x, y) {
		// coming soon
	}
}