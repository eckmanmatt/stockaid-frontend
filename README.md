# Stock[AID]

## The Future of Personal Stock Management

### Matt Downey & Matt Eckman

We have created a stock portfolio-management, MERN application.

In order to plan all aspects of the project, track our day-to-day tasks and overall project management, we used the tool Trello. Also, following the below wireframe:
![image](https://user-images.githubusercontent.com/70616807/171883797-5abec77b-8c11-4f90-b138-c8afeaf5c4a8.png)



Within this full-stack application, we have used a 3rd party API called Polygon.io. It is connected to our back-end and then communicating with our front-end. The API is from https://polygon.io/ and we used the data groups 'Tickers' and 'Previous Close'.

While using the API for all available stock data, we used RESTful routes/CRUD in order to pull that information and add to our database which is hosted on MongoDB Atlas.

The CRUD database visible from what we add to it from the API is deployed via Heroku and can be found here:

https://stockaid-back-end.herokuapp.com/stocks


The front-end is deployed on Heroku and can be found here:

https://stockaid-portfolio-manager.herokuapp.com/



## Technologies Used

### Applications Used

- Mongoose/Mongo, Express, React (JSX), Node for structure
- MongoDB Atlas & Heroku for deployment
- Git/GitHub
- Bootstrap/CSS


When reworking how the API is called upon, we were faced with an object within an array, of the called results, being contained in a single string. We investigated that the best method to extract that would be to use the JSON.parse() function. This can be found in App.js on lines 71-73 and lines 135-137.
