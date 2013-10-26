#Prerequisites:
- get a web server (Apache, nginx, or whatever)
- get a git client
- checkout the repository at https://github.com/fatso83/planting-awareness-web
- get a text editor

#3 main tasks
  0. -set up a github repository-
  1. -Sketching up a wireframe and start coding html+css (using Bootstrap)-
  2. Get to know how to use Can.js
  3. Make a communication api in javascript (in progress)

# Todos

## Make a pagelinks parser
Make a parser that returns nice urls to call to retrieve the next url
(Hmm ... is it perhaps needed at all?)

## Create a front page
- lists the various plants
- contains basic info
- shows latest image
- shows last updated data

## Create overview page for all registered days
- shows a basic info panel on the left side
- overview of days
- will on click display a panel underneath and slide down to it

## Information panel
- shows all the different sensor data that can be shown
- can choose between the different ones

## Caching on the server
- Currently no caching seems to be in place
- Enable mod_cache on the server to minimize the load on the backend and improve performance
- Add caching headers on the client

## CSV export of graph
- server or client

## Smoothing of data points
- might involve a smaller web server part to do the actual data crunching (maybe a nightly batch job) on the larger sets
- the client might handle doing a single days worth
- involves downloading all the sensor data associated with a plant
- a subset of data points must be made where large deviations are "handled"/squashed
- the amount of observations must be manageable
