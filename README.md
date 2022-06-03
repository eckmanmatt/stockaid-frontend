# Stock[AID]

## The Future of Personal Stock Management

### Matt Downey & Matt Eckman

We create a stock portfolio management, MERN application that uses a 3rd party API.

In order to plan all aspects of the project, track our day-to-day tasks and overall project management, we used the tool Trello.



Within this full-stack application, we have our API connected to our back-end and then communicating with our front-end.

While using the API for all available stock data, we used RESTful routes/CRUD in order to pull that information and add to our database which is hosted on MongoDB Atlas.

The CRUD database visible from what we add to it from the API is deployed via Heroku and can be found here:

https://stockaid-back-end.herokuapp.com/stocks


The front-end is deployed on Heroku and can be found here:

https://stockaid-portfolio-manager.herokuapp.com/



##Technologies Used

For styling the majority of the application, we used Bootstrap.

When reworking how the API is called upon, we were faced with an object within an array, of the called results, being contained in a single string. We investigated that the best method to extract that would be to use the JSON.parse() function. This can be found in App.js on lines 71-73 and lines 135-137.
