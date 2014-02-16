# CookieMaster Release History

### Version 1.14.1 - _2014/2/16_

 - Fixed bug where achievements were unlocked before they were earned
 - Fixed bug where upgrades would appear in the store before they should
 - Fixed bug where deficit stats would appear in tooltips in the native Stats panel

### Version 1.14.0 - _2014/2/15_

 - Added setting to show or hide the deficit alerts in the tooltips
 - Portals and Grandmas now show correct income and BCI values
 - Income and BCI calculations for buildings are now performed by simulating actual purchases, to ensure 100% correct calculations. Upgrades still based on the older method of computing all modifiers from the base cost.
 - Added CpC income stat to clicking-related Upgrade tooltips
 - Added setting to hide the native game buff timer bars
 - Max/current Lucky and Lucky+Frenzy reward stats are now highlighted if reached
 - Fixed bug where Reindeer timer in title bar would display when it shouldn't (and count backwards)
 - Missing Upgrades stats now display descriptions for each upgrade
 - Missing Upgrades stats should no longer display the season switching upgrades once Season Switcher has been purchased

### Version 1.13.0 - _2014/2/14_

 - Fixed bug where Prism upgrades would not have their efficiency and gains calculated
 - Added stat to show estimated time remaining until X Heavenly Chips

### Version 1.12.3 - _2014/2/14_

 - Updated plugin to fix compatibility issues with latest game release (v.1.0411)
 - Seasonal timers will now only display during the correct season
 - Added info for Prisms to building efficiency calculations

### Version 1.12.2 - _2014/2/9_

 - Removed 10 second option from Pop Wrinklers setting as it was only intended for debugging
 - Converted entire project to use 4 spaces for indentation across all HTML, CSS and JS
 - Streamlined build process for easier updating

### Version 1.12.1 - _2014/2/9_

 - Fixed bug where Auto-pop Wrinkler timer would not reset properly after reaching zero
 - Fixed bug where Auto-pop Wrinkler feature would not show timer bar for first countdown after setting was saved/changed
 - Fixed bug where games with very high numbers would calculate incorrect or missing information for Prestige stats

### Version 1.12.0 - _2014/2/8_

 - Changed auto-clicker option for Click Frenzies to also include Elder Frenzies
 - Added a visual timer bar for Automatically Pop Wrinklers setting
 - Added tooltip stat to show when a purchase would put you under the bank required for current maximum Cookie Chain tier
 - Added interactive Prestige stat to show total cookies and cookies remaining to reach an arbitrary number of Heavenly Chips
 - Added total number of cookies required to the Cookies to next HC stat
 - Fixed User Script icon URL

### Version 1.11.8 - _2014/2/5_

 - Reverted fix from previous release since Cookie Clicker live site is not UTF-8 compatible :(

### Version 1.11.7 - _2014/2/5_

 - Fixed character encoding issues in some number notation formats

### Version 1.11.6 - _2014/2/5_

 - Fixed typos in scientific notation suffixes
 - Amended update message for Chrome extension users

### Version 1.11.5 - _2014/2/5_

 - Wrinkler stats now have a Wrinkler-themed icon
 - CSS tweaks to stats page
 - Fixed potential bug where timers would not reappear when tab was not active and auto-clicker for popups was on
 - Minor performance enhancements

### Version 1.11.4 - _2014/2/5_

 - Fixed potential catastrophic plugin crash on initialization
 - Added moderate performance improvements to plugin loading and initialization routines

### Version 1.11.3 - _2014/2/3_

 - Minor changes to the Chrome Extension manifest
 - No new features this time, sorry :(

### Version 1.11.2 - _2014/2/3_

 - CookieMaster now silently fixes the game bug where Golden Cookies and Reindeer do not spawn in a new, unsaved game.
 - Updated site to not show "Add to Chrome" button to non-Chrome users

### Version 1.11.1 - _2014/2/3_

 - Secured all game manipulating methods into a function that ensures they are available to work on
 - Minor site updates

### Version 1.11.0 - _2014/2/3_

 - Added Chrome extension to repo
 - Removed integrity check method to simplify deployment process across both builds

### Version 1.10.3 - _2014/2/2_

 - Fixed some minor bugs
 - Added some more system messages
 - Improved code sanity in a few methods
 - Added some missing comment headers for some methods
 - Updated cookiemaster.co.uk to Bootstrap 3.1.0
 - Small improvements to cookiemaster.co.uk layout

### Version 1.10.2 - _2014/2/2_

 - Changed update checker script to prevent it from caching AJAX request

### Version 1.10.1 - _2014/2/2_

 - Added some more status messages for when things go horribly, horribly wrong

### Version 1.10.0 - _2014/2/2_

 - Made timer controls more granular. Now you can choose which individual timers you want to show
 - Added a timer for Elder Pledge
 - Cleaned up code for timers somewhat
 - Added setting to auto-pop Wrinklers at specified time intervals
 - Added a more persistent messaging system to display dismissable messages
 - Changed some existing system messages to use new messging system
 - Added auto-update checker. A message will now be displayed when a CookieMaster update is available
 - Added setting to show or hide the Missed Golden Cookies statistic since apparently some of you don't like seeing it
 - Added setting to hide the building information boxes that appear on hover
 - Added setting to always display all available upgrades in the store

### Version 1.9.2 - _2014/1/30_

 - Fixed bug where resetting a game with a high-speed auto-clicker running would unintentionally give extra cookies to the reset game

### Version 1.9.1 - _2014/1/29_

 - Fixed bug where store upgrade tooltips would not disappear after hovering

### Version 1.9.0 - _2014/1/28_

 - Added option to specify custom audio alerts
 - Added stats for missing upgrades
 - Fixed bug where stats for missing achievements would not update once populated

### Version 1.8.2 - _2014/1/28_

 - Fixed bug where range sliders would not save selected value correctly

### Version 1.8.1 - _2014/1/27_

 - Segregated settings into sections
 - Cleaned up some methods

### Version 1.8.0 - _2014/1/27_

 - Added color blind setting
 - Added True Neverclick setting to prevent you accidentally clicking the Big Cookie while attempting to get the achievement
 - Added auto-clicker for Golden Cookies and Reindeer.
 - Added setting for Big Cookie auto-clicker to click during all Frenzies
 - Added ability to download logged stats as a CSV (currently only supported in Chrome and Firefox)
 - Added stats showing your missing achievements and shadow achievements along with their descriptions
 - Cleaned up a few bugs with logging

### Version 1.7.0 - _2014/1/17_

 - Moved CookieMaster to new (and final) host that should be super fast (seriously, it's got SSDs and stuff)
 - Added long written notation for those who prefer milliards and billiards
 - Fixed bug so now all shortened numbers respect your number rounding precision value
 - Minor code refactoring
 - Added contributers section to the readme - shout out to those helping to make CookieMaster even more awesome!

### Version 1.6.4 - _2014/1/15_

 - Moved CookieMaster to GitHub pages as we've been booted off of rawgithub :/

### Version 1.6.3 - _2014/1/14_

 - Fixed typo that prevented Reindeer audio alert from playing (oops!)

### Version 1.6.2 - _2014/1/14_

 - Added more number formatting options (scientific, scientific "e" notation and compact scientific notation)
 - CpS chart now shows a logarithmic scale with a zero baseline for easy of use
 - Fixed delay on Golden Cookie and Reindeer alert sounds (credit to Jesper Öqvist - https://github.com/llbit)

### Version 1.6.1 - _2014/1/09_

 - Fixed some logic with logging when saving user settings and reloading the page

### Version 1.6.0 - _2014/1/09_

 - Added persistent stat logging. You can now track your base and effective CpS across your session(s) (Currently in BETA)
 - Massive and wildly unncecessary refactoring of the bootstrap file :(

### Version 1.5.3 - _2014/1/08_

 - Fixed bug in webkit browsers where audio alerts would only play once
 - Added volume slider for audio alerts

### Version 1.5.2 - _2014/1/08_

 - Prevented Wrinklers getting clicked when clicking Golden Cookies and Reindeer (yay!)
 - Cleaned up some methods

### Version 1.5.1 - _2014/1/08_

 - Fixed incorrect audio file URLs in build directory

### Version 1.5.0 - _2014/1/08_

 - Added building efficiency stats. Methods for calculating stats are derived from [Maxime Fabre's forked Cookie Monster repo](https://github.com/Anahkiasen/cookie-monster), which improves on the original Cookie Monster calculations considerably
 - Added option to show a table with color-coded keys for building efficiency stats
 - Added option to auto-click the Golden Cookie during Click Frenzies
 - Audio files for Golden Cookies and Season Popup now moved into the repo
 - Enhanced Golden Cookie stats with time remaining to reach Lucky/Lucky+Frenzy required bank
 - Added effective CpS method and modified all relevant stats to use this when calculating time remaining
 - Added stat to show your effective CpS
 - Added stat to show reward for clicking Reindeer
 - Improved accuracy of certain stats
 - Fixed Cookie Chain stats bug where normal/Wrath chain values and rewards were reversed
 - Minor visual fixes and tweaks

### Version 1.4.2 - _2014/1/02_

 - Fixed wrong stats showing for current Luck and current Frenzy + Lucky rewards when player is under the max bank required value

### Version 1.4.1 - _2014/1/02_

 - Fixed wrong stats showing for Cookie Chain bank and CpS values

### Version 1.4.0 - _2014/1/02_

 - Added option to choose rounding precision for large numbers
 - Added option to make Golden Cookies more visible when they spawn
 - Added option to increase the clickable area of Golden Cookies to help clicking accuracy, especially during cookie chains
 - Golden Cookie clicks now register as soon as the mouse is pressed, instead of when released
 - Added more stats for CpS and CpC
 - Added stats for maximum cookie chain rewards and bank/CpS needed to advance to next chain tier
 - Reorganized some of the stats
 - Fixed crash when importing a save into a new, unsaved game
 - Fixed bug where timers wouldn't show the min limit when importing a save into a new, unsaved game
 - Fixed bug in stats for Frenzy and Elder Frenzy CpS values

### Version 1.3.2 - _2013/12/31_

 - Stats panel now updates instantly when opened
 - Added CookieMaster version info to Stats and Settings panels

### Version 1.3.1 - _2013/12/31_

 - Fixed bug where clicking a Golden Cookie would sometimes not register properly

### Version 1.3.0 - _2013/12/31_

 - Integrated Stats and Settings windows into the center game panel
 - Added option to display timers at the top or bottom of the left panel
 - Added option to auto-click the big cookie (with speed control)
 - Moved button to pop all reindeer into left panel, now only displays when needed
 - Added more stats
 - Visual tweaks and improvements
 - Cleaned up some messy code

### Version 1.2.4 - _2013/12/31_

 - Fixed broken bookmarklet code

### Version 1.2.3 - _2013/12/30_

 - Fixed bug where Golden Cookie audio alert would play Reindeer alert sound instead

### Version 1.2.2 - _2013/12/29_

 - Fixed bug where title bar counters would display "undefined"
 - Now using stricter linting of source files
 - Minor performance enhancements

### Version 1.2.1 - _2013/12/29_

 - Fixed bug where audio alert settings would not work correctly
 - Improved accuracy of large number formatting (still not perfect though)
 - Improved precision of time to next HC stat

### Version 1.2.0 - _2013/12/29_

 - Moderate refactoring of many methods for clarity and performance
 - Added more granular control over audio and visual alerts
 - Reduced playback volume for audio alerts
 - Added section headings to the stats panel
 - Added a button to pop all Wrinklers at once
 - Removed "s" suffix from timer countdown values
 - Minor performance tweaks
 - Improved source formatting and commenting

### Version 1.1.3 - _2013/12/28_

 - Added check to prevent loading CookieMaster more than once
 - Made some error and warning messages a little clearer

### Version 1.1.2 - _2013/12/28_

 - Removed cache buster parameter from jQuery dependency file

### Version 1.1.1 - _2013/12/28_

 - Fixed bug where top bar would remain visible when Clean UI was active

### Version 1.1.0 - _2013/12/28_

 - Ads are no longer hidden when Clean UI is active
 - Added several suffix options when shortening numbers
 - Upgrade prices now display correct number formatting
 - Moved project to Grunt
 - Bookmarklet now loads a bootstrap file that handles all dependencies
 - All external sources are now loaded in minified for speeeeed

### Version 1.0.0 - _2013/12/28_

 - First public release :)