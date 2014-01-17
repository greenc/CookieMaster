CookieMaster
=============

CookieMaster is a browser plugin for [Cookie Clicker](http://orteil.dashnet.org/cookieclicker/).

It offers many useful features, statistics and options to help you get the most out of the game. See below for a full list, as well as upcoming and planned features.

CookieMaster is currently being actively developed, with stuff being added almost daily. If you find a bug or have a feature request, you are encouraged to [open an issue](https://github.com/greenc/CookieMaster/issues/new) in the [Issue Tracker](https://github.com/greenc/CookieMaster/issues/new).


How To Use
----------
* Paste the following code into a new bookmark in your browser:

```javascript
javascript:(function(d){d.body.appendChild(d.createElement('script')).setAttribute('src','//greenc.github.io/CookieMaster/build/cm-bootstrap.min.js?cb='+Math.random().toString(36).substr(2,5))})(document)
```

* Load up [Cookie Clicker](http://orteil.dashnet.org/cookieclicker/)
* Click on your recently created bookmark

Screenshot
----------

![CookieMaster Statistics and main game window](https://github.com/greenc/CookieMaster/raw/master/screenshots/cookie-master-main.jpg "CookieMaster")

Features
----------

It's still fairly early in development. Here's the checklist so far:

 - Long number shortening, e.g. 3,476,112,098,761 can be displayed as 3.476 T
 - Show different suffix types when shortening numbers, e.g. 26.696 Qa, 26.696 quadrillion, 26.696 P
 - Number localization: Display a period or comma as your preferred decimal separator
 - Calculate and display the most efficient purchases and upgrades
 - Display estimated time left until upgrades and buildings are affordable
 - Clean up the game window: Remove the top bar, make the cookie counter more visible, etc.
 - Change the game highlight font
 - Display accurate countdown timers for game events, e.g. next Golden Cookie, remaining time for buffs
 - Play audio alerts when Golden Cookies and Reindeer spawn (with volume control)
 - Flash the screen when Golden Cookies and Reindeer spawn
 - Display countdowns to next Golden Cookie and Reindeer in the title tab
 - Option to make Golden Cookies more visible when they spawn
 - Option to increase the hitbox area for Golden Cookies, making them easier to click during Cookie Chains
 - Auto-clicker for the Big Cookie with speed control
 - Ability to set auto-clicker only during Click Frenzies
 - Button to instantly pop all on-screen wrinklers
 - Calculate and display Heavenly Chip data, including time left and cookies left until the next one
 - Calculate and display information about banked cookies for maximum buff payouts and other items
 - Calculate and display your maximum Chain Cookie reward and the required bank and CpS to reach the next reward level
 - Calculate and display how many cookies Wrinklers have sucked and the reward for popping them
 - Clicking Golden Cookies and Reindeer no longer pops Wrinklers that lie beneath them
 - Other useful stats
 - Pause button
 - BETA: Persistent stat logging for tracking your CpS through your sessions


Planned and Upcoming Features
-----------

 - Smart auto-clicking for Golden Cookies and Reindeer to maximise your returns
 - Multiple save slots with import/export functionality
 - Performance optimizations to allow CookieMaster to poll and update even more rapidly


Releases
-----------

I try to update CookieMaster as often as possible, but I'm currently a single developer doing this in my spare time, so there's no fixed release schedule as such.

For a full release history, consult the [changelog page](https://github.com/greenc/CookieMaster/blob/master/CHANGELOG.md)


Browser Support
----------

Extensive browser testing has not yet been carried out, however CookieMaster should work happily in current releases of the following browsers:

 - Chrome (recommended)
 - Firefox
 - Safari
 - Internet Explorer 10+

CookieMaster uses some new web features that may not be supported in older browsers.


Developers / Contributing
----------

CookieMaster uses [Node.js](http://nodejs.org/) and [Grunt](http://gruntjs.com/) for building and managing the project. Although not necessary for contributing changes, it is recommended to have these installed if you want to take advantage of the project build tasks.

It is recommended to download and run Cookie Clicker locally for testing any changes you make to the plugin. All Cookie Clicker game assets are static, so just run a `wget` or your preferred equivalent on http://orteil.dashnet.org/cookieclicker/ to grab the game files. The CookieMaster source file paths assume that you have Cookie Clicker running in an adjacent directory named `/cookieclicker`.

1. Make sure you have [Git](http://git-scm.com/), and optionally [Node.js](http://nodejs.org/) and [Grunt](http://gruntjs.com/) installed first.
2. Fork the CookieMaster repository on GitHub and clone it to your local machine.
3. Make your changes. All source files are located in the `src/` folder. If you are using Node/Grunt, you can run `grunt build` to create a `build/` directory with optimized files for local testing (remember to **only** include `src/` files in your commits if you issue a pull request).
4. When you're done making changes, commit and push them up to your forked repository.
5. You may then create a pull request from GitHub if you would like to have your changes considered for inclusion in the main CookieMaster repo.