CookieMaster
=============

CookieMaster is designed to be a lighter, faster, prettier and more easily extendable alternative to Cookie Monster.

It is (being) written from scratch and aims to bring rough feature parity with Cookie Monster, while offering nicer visual integration, more speed and flexibility.

New features that I think of will also be incorporated.

How to use
----------

1. Paste the contents of https://github.com/greenc/CookieMaster/blob/master/build/bookmarklet.js into a bookmark in your browser.
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

It's still fairly early in development, so it's not quite feature complete yet. Here's the checklist so far:

 - Long number shortening (convert 1,234,567,890 to 1.235 billion)
 - Show different suffix types when shortening numbers
 - Number localization (numbers formatted to 123,456,789.0 or 123.456.789,0 depending on your preference)
 - Clean up the game window (remove top bar, make cookie counter more visible, etc.)
 - Change game font
 - Display accurate countdown timers for game events, e.g. Next golden cookie, remaining time for buffs
 - Play an audio alert when Golden Cookies and Reindeer spawn
 - Flash the screen when Golden Cookies and Reindeer spawn
 - Display countdowns to next Golden Cookie and Reindeer in the title tab
 - Auto-clicker for the Big Cookie with speed control
 - Button to instantly pop all on-screen wrinklers
 - Calculate and display Heavenly Chip data
 - Calculate and display information regarding banked cookies for maximum buff payouts and other items
 - Calculate and display how many cookies wrinklers have sucked and the reward for popping them
 - Other useful stats
 - Pause button

Upcoming features
-----------

 - Calculate and display the most efficient purchases and upgrades
 - Option to have Wrinklers carry over between sessions
 - Smart auto-clicking for Golden Cookies and Reindeer
 - Multiple save slots and easy save import/export functionality
 - Higher attainable FPS for more accurate timers without crippling your system!

Release schedule
-----------
I try to update CookieMaster as often as possible, but I'm currently a single developer doing this in my spare time, so there's no fixed release schedule as such. If you're a fellow developer, or even just have a feature request or suggestion, feel free to make a pull request or open an issue in the issue tracker :)

Update log
-----------

### Version 1.3.3 - 2013/12/31

 - Added more stats for CpS and CpC
 - Fixed crash when importing a save into a new, unsaved game
 - Fixed bug where timers wouldn't show the min limit when importing a save into a new, unsaved game
 - Fixed bug in stats values for Frenzy and Elder Frenzy CpS

### Version 1.3.2 - 2013/12/31

 - Stats panel now updates instantly when opened
 - Added CookieMaster version info to Stats and Settings panels

### Version 1.3.1 - 2013/12/31

 - Fixed bug where clicking a Golden Cookie would sometimes not register properly

### Version 1.3.0 - 2013/12/31

 - Integrated Stats and Settings windows into the center game panel
 - Added option to display timers at the top or bottom of the left panel
 - Added option to auto-click the big cookie (with speed control)
 - Moved button to pop all reindeer into left panel, now only displays when needed
 - Added more stats
 - Visual tweaks and improvements
 - Cleaned up some messy code

### Version 1.2.4 - 2013/12/31

 - Fixed broken bookmarklet code

### Version 1.2.3 - 2013/12/30

 - Fixed bug where Golden Cookie audio alert would play Reindeer alert sound instead

### Version 1.2.2 - 2013/12/29

 - Fixed bug where title bar counters would display "undefined"
 - Now using stricter linting of source files
 - Minor performance enhancements

### Version 1.2.1 - 2013/12/29

 - Fixed bug where audio alert settings would not work correctly
 - Improved accuracy of large number formatting (still not perfect though)
 - Improved precision of time to next HC stat

### Version 1.2.0 - 2013/12/29

 - Moderate refactoring of many methods for clarity and performance
 - Added more granular control over audio and visual alerts
 - Reduced playback volume for audio alerts
 - Added section headings to the stats panel
 - Added a button to pop all Wrinklers at once
 - Removed "s" suffix from timer countdown values
 - Minor performance tweaks
 - Improved source formatting and commenting

### Version 1.1.3 - 2013/12/28

 - Added check to prevent loading CookieMaster more than once
 - Made some error and warning messages a little clearer

### Version 1.1.2 - 2013/12/28

 - Removed cache buster parameter from jQuery dependency file

### Version 1.1.1 - 2013/12/28

 - Fixed bug where top bar would remain visible when Clean UI was active

### Version 1.1.0 - 2013/12/28

 - Ads are no longer hidden when Clean UI is active
 - Added several suffix options when shortening numbers
 - Upgrade prices now display correct number formatting
 - Moved project to Grunt
 - Bookmarklet now loads a bootstrap file that handles all dependencies
 - All external sources are now loaded in minified for speeeeed

### Version 1.0.0 - 2013/12/28

 - First public release :)