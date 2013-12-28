CookieMaster
=============

CookieMaster is designed to be a lighter, faster, prettier and more easily extendable alternative to Cookie Monster.

It is (being) written from scratch and aims to bring rough feature parity with Cookie Monster, while offering nicer visual integration, more speed and flexibility.

New features that I think of will also be incorporated.

How to use
----------

1. Paste the contents of https://github.com/greenc/CookieMaster/blob/master/bookmarklet.js into a bookmark in your browser.
2. Load up Cookie Clicker.
3. Load the recently created bookmark.

Browser support
----------

This is a very early release and extensive browser testing has not yet been done, however it should work in current releases of the following browsers:

 - Chrome
 - Firefox
 - Safari
 - IE

What can CookieMaster do?
---------------------------

Not a whole lot yet, as it's still fairly early in development. Here's the checklist so far:

 - Long number shortening (convert 1,234,567,890 to 1.235 billion)
 - Show different suffix types when shortening numbers
 - Number localization (numbers formatted to 123,456,789.0 or 123.456.789,0 depending on your preference)
 - Clean up the game window (remove top bar, make cookie counter more visible, etc.)
 - Change game font
 - Display accurate countdown timers for game events, e.g. Next golden cookie, remaining time for buffs
 - Play an audio alert and flash the screen when Golden Cookies and Reindeer spawn
 - Calculate and display Heavenly Chip data
 - Calculate and display information regarding banked cookies for maximum buff payouts and other items
 - Calculate and display how many cookies wrinklers have sucked and the reward for popping them
 - Pause button

And when it's done?
-----------

 - Calculate and display the most efficient purchases and upgrades
 - Multiple save slots and easy save import/export functionality
 - Higher attainable FPS for more accurate timers without crippling your system!

And when will that be?
-----------

I'm currently a single developer doing this in my spare time, so updates may be erratic. Feel free to issue a pull request though ;)

Update log
-----------

*Version 1.1.1* - 2013/12/28

 - Fixed bug where top bar would remain visible when Clean UI was active

*Version 1.1.0* - 2013/12/28

 - Ads are no longer hidden when Clean UI is active
 - Added several suffix options when shortening numbers
 - Upgrade prices now display correct number formatting
 - Moved project to Grunt
 - Bookmarklet now loads a bootstrap file that handles all dependencies