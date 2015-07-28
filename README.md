This is the final project of my course at General Assembly. 


# The app and the background

I decided to build a simple, potentially addictive mind game, which would let us discover the world, improve our language skills, and compete agains others, while also using the incredible concept built by What3Words (see below)

I discovered a wonderful website called [What3Words] (http://what3words.com/) , which was sponsoring a hackathon I took part in (2015 AnalogFolk hackathon). They divided the whole world into 57 trillion of tiny 3mx3m squares and assigned to each square a unique combination of 3 words. Since it is unique and very precise, the combination allows each square to be easily located. Beyond the fun aspect, it brings tremendous progress to the 4 billion people who are invisible as their country suffer from inaccurate addressing.


# Rules and features

As you explore the world, you are presented with a new series of three words for each location you visit. The game is to make the longest anagram, using only the letters available in those three words.
For instance, if going to the center of London (3 Whitehall), you will see the words "future human foster". With those letters you can build the word "fun", not a highly complex one, but it works.

When you submit your answer a series of check happen to ensure that your words exists (for the moment I use the free Yandex Dictionnary API), that it only uses the letter available in the three words, and that it is not too easy (not either of the three words or their basic plural or singular, longer than 3 characters).
Yandex also gave me a translation of the word, so at the moment each good answer will teach you how to say your word in Italian. I will add a little flag somewhere on the map so that you can change the language to be translated into

If you login, you can then take part in the two games I have developped. Playing games enables you to earn points for each valid answer and to compare your score against all other users. 

## Game 1: the Journey challenge

The original idea was to have users play the game while on their bus journey. As they progress through the city and their journey, they reach the same fixed locations (bus stops) and submit their longest anagram at this location. Since one location has a unique combination of three words, it becomes very easy for users to be ranked agains others, not only at this specific location, but also across the whole journey. You could then become the master of the bus route 55!

I started building a static version of the game, where your location is not tracked, and the journey is simulated: as you enter an origin and a destination, your journey from A to B is divided in a number of steps (courtesy of Google Maps API). For you to get to the next step, and eventually to your destination, you simply need to enter a valid answer. As you do, you will see your icon on the map smoothly move from the current step to the next, where the challenge starts again.

As a reward for hard-working users, a completed journey also brings bonus points based on the number of steps in that journey.

The next step in that game is obviously to record the journey in the database so that users can compare scores on a same journey.  This is something I will build later on. My priority for the demo was to have a fully-functioning game.


## Game 2: the exploration game

The idea came from one of my classmate after my presenation to the class. It immediately resonated as I found it quite "poetic" and very much in the spirit of discovery that I had in mind.

As you freely browse the world and submit answers, getting three successful answers means you have created a combination of three words. The game will then transport you from your current location to wherever in the world matches these three words. Of course not every combination of three words matches a location, and in this event you will be transported to a random location in the world. From your new location you play again (and earn points) until you reach three succesful answers and get transported again.

I tried to add some smooth animation effects to the map to display the transition (zoom out to see the whole world, see the marker on the map make its way to the new location, zoom in and center the map on the new location). If you know of nicer or easier methods, please do not hesitate to let me know! (the functions are in client/public > i) game.js > Game.teleportFromTo, ii) map.js > Marker.transition, and iii) view.js > View.smoothZoom)

# Technologies used
 
My aim was to use what we learnt over the past three months to create something enjoyable to use and which would demonstrate my current level in coding. 

## Client

The whole game revolves around maps, and since I chose the Google Maps API it seemed easier to have a lot of Javascript code to render elements on the apge. It also helps that I really enjoy coding in Javascript.

I chose to use Mustache templating to render my views, and not a front-end framework, as I am using a limited number of views and am not really iterating through colletions.

I started developping with a python simpleHTTPserver, then quickly made a ruby file with Sinatra so i could deploy on Heroku

Admittedly, a front-end framework would have been useful for the management of the various 'click' and 'submit' events, which I am manually turning on and off using jQuery. However, many of these events are Google Maps events, which come with their own syntax to be attached to the DOM events; given the limited time to finalize the project, I thought ill-advised to spend too long trying to integrate Backbone with Google Maps when, to be fair, the use of jQuery remains acceptable for the small number of events I use.

## Server

I realized I did not need many functionalities from my server at the moment and that I was mostly going to use it to store the answers given by users and return rankings for each location and for each user. I therefore chose Rails for the convenience that Ruby and Active Record bring to database queries.

With hindisght, the benefits of Rails were not so clear-cut. In my next project I would like to go back to Node and Mongo so that I can compare again:

* I feel that Node/Express gives a lot more flexibility as to what functionalities we choose to use. Rails comes with a lot of functionalities I am not needing or using, but as they are out of the box it did not make the process any longer.

* The Active Record associations can sometimes be tricky to get right. In my current case they were relatively easy (or to be more honest, once I got them right on paper, they became easy to create on the Rails app), but creating the associations to add the Journey Class is going to take some time so that I can achieve exactly what I want (the commented-out bits in journey.rb and location.rb prove I do not fully know what I want yet!). In contrast, MongoDB was a lot more straightforward as we do not really create associations. In a way the Rails approach ensure we cannot deviate from the "rules" we established, so that itsn't too bad.

* Clear benefit of Rails though is the ease of using Ruby to make db queries. Next time I use Mongo I will practise Mongoid, as I saw a classmate use it and it looked similar to Active Record


## Learning points

 Callback

to be continued

I also wanted to practice using Devise for authentication. This brought its share of issues since I was not using Rails for my views but I had to let the client-side know whether a user was logged in. 

* Created my own Registrations and SessionsController, inheriting from the Devise Controllers but building on them

* Learning about JS-cookies to manage auth_token and tell devise about the current user  

* Tweaking Rspec so that it can simulate a Devise login!


# Development timeframe

We had 10 days to develop the app before the presentation to the class. I was quite happy with with I built in that time, as I was able to show a fully functioning app with the two games and the ranking system.

After this we had two weeks to prepare for the final event of the course, a "meet and greet" day where comapnies came to see our work and discuss job opportunities. During that time we worked on various things, CV, personal website, etc, and of course on improving the final project:

* The feedback from the class and teachers was quite positive, and some comments led me to add new features to the app:
  * I removed the initial game, whereby you could only move on the map if you typed in a correct word
  * I added the "exploration" game

* Demo-ing the app and talking about it also highlighted various bugs and missing functionalities that I fixed and implemented.

# Next steps and improvements

* On Journeys 
  * save in the database so that users can really compare their skills
  * Let's be crazy, work with Transport for London so that bus riders find a way to kill time in a fun way which also promotes literacy and discovery of your city.

* Making the game harder or more personalized
  * Have a timeout function that would force users to submit a valid answer within [10] seconds, or else the game moves to the next step of the journey without any points earned.
  * Monitor the user's actual physical location and updadte the three words on the map with that specific location.

* Translations
  * add a flag to let users change the language to translate their answers to
  * leverage on what3words multi-lingual capabilities so that the game can be played in other languages than English.