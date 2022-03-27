Due to the non-standardised nature of terminals, there is no guarantee that theres full support for the features of this module. 

## Color

There are two colormodes for inline color changes, full 8bpc RGB and 16 color mode. These modes can be used in the same line, though naturally not at the same time. To use full RGB colors, you use the tag `<c f=#hexcol b=#hexcol>`, where either the foreground or the background color is optional. 16 color mode uses a simpler tag: `<c c=XY>` where X is a hex number representing the background color and Y is the foreground color. 

There is a separate function to set the background of the entire terminal AFTER the cursor. It is advised to set the global background and clear the screen afterwards so that the entire window takes on the new color. 

## Additional functions

#### print()

Allows HTML like formatting of text. The tags are as follows:
```
<r>:        Resets all tags
<u>:        Underline
<b>:        Bold
<i>:        Italic
<n>:        Invert
<blink>:    Blinking slowly
<cross>:    Crossed out
<fraktur>:  Fraktur text
<ol>:       Overline
<dol>:      Double overline
<framed>:   Framed text
<encircle>: Encircled text
```

Like in common markup languages, adding a slash before the tag disables it again.

Color texts are slightly more involved. to cancel them, you can either do `</c>` to reset to default colors, or `</c f>` or `</c b>` to reset foreground and background color individually. 
#### setcursorposition(x, y)

Moves the cursor to the specified location on screen. Note that this may erase text if you move it to a position further up the screen. 

#### push() and pop()

Save the current cursor position and restore it at a later point. 

#### clear()

Clears the screen. When executed in repl, you will still see the usual `undefined` after clearing, but if executed as part of a script, it works with no issue. 

#### defaultcolor() 

Supposed to reset the terminal colors to default

#### displayMode() 

Changes the display mode of the terminal, refer to [this list](https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797#screen-modes) for more info
