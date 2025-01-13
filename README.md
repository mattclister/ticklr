### Welcome

Thank you for visiting Ticklr. This project readme is written for prospective employers and gives a high-level guide to Ticklr’s implementation and my decision making.

The latest deployment is available to view here: https://ticklr.onrender.com/  
Feel free to sign up or else use: ( demo@email.com : abc123!! ).
If creating your own account you need to verify your reminder email in settings.

I can be contacted at *matt.c.lister (at) gmail.com*

#### Technologies Used: REACT, TypeScript, JavaScript, HTML, JSX, CSS, SASS, SQL, DOCKER, EXPRESS, AXIOS, SQLite, Vite, ViTest

### What is Ticklr?

A “Tickler” or “Ticker File” is an system first introduced to me by David Allen in his excellent book “Getting things done”. Being the 80s, it was a physical drawer with a folder for each day of the month. By placing reminders, needed documents and items like gig tickets into the appropriate drawer, you could mail things to yourself in the future. Todo apps fulfil some of these functions but not quite as he or I imagine, so I decided to make a simpler way. Ticklr then is a place to put anything you need on a given date, partway between a todo app and a calendar. On that date, your items can be emailed to you or sent directly to your todo app or sent to Zapier, where you might trigger almost anything on the internet. As such it serves as a digital event scheduler, that I hope will allow users to schedule anything from one place.

Technically Ticklr is a single page **React** app, built with vite that also has a subdomain static **HTML** site for user guides. Ticklr’s client is written in **Typescript** and **JSX** and uses **axios** for requests. It uses a **Node** server written in Javascript and uses **Express** to serve the app and the static site. Data is stored in a **SQL** database managed with **SQLite**. My styling is built on **Bootstrap** with some custom **CSS** and **SASS**. The sever connects to Mailgun to deliver emails via the maligun api. My control system is Git and the app is built into a **Docker** image for deployment by continuous integration to render.com.

Here is a quick tour of the key files:

### Login and Signup
- *[client/src/Components/UserLoginForm.tsx](/client/src/Components/UserLoginForm.tsx)*
- *[client/src/Components/UserRegisterForm.tsx](/client/src/Components/UserRegisterForm.tsx)*

Login and Signup forms both utilise the React Hook Form library and Zod for real time validation. When a user successfully logs in they are issued with a JSON Web Token via BcryptJS which is valid for an hour and currently stored in the browser’s local storage. This level of security was okay for development but my intention is to store the token in an HTTP-only secure cookie to prevent client-side JavaScript from accessing the token in future.

### Reminders Page
- *[client/src/Components/RemindersPage.tsx](/client/src/Components/RemindersPage.tsx)*

The Reminders Page serves as my main parent component and holds any states required by multiple components. It passes down states and setState functions. It also nests my Item Details drawer in an animation component, which is animated with the Framer Motion library. I did spend some time trying to animate this with pure CSS but never got it to work. I left with the suspicion that the issue was the timing of component renders and after quickly learning the basics of Framer Motion, I made the decision to move on.

### Reminders List
- *[client/src/Components/RemindersList.tsx](/client/src/Components/RemindersList.tsx)*

Reminders List loads items from the server and renders them. I use a UseEffect and a loading screen to hold the app while the server responds, while ensuring we avoid an infinite loop of sever requests on every render. Currently items are sorted by date before mapping but I intend to add a search bar and add a .filter here too.

### Item Details
- *[client/src/Components/ItemDetails.tsx](/client/src/Components/ItemDetails.tsx)*

The item details component conditionally renders either the “add new item” or “update item” interface depending on if an active item is selected. I thought this was a good application of DRY principals as they both share the same zod validation and server request pathways. However, it later transpired that this makes the animation difficult and you may notice there is no animation going from the update view to the add new view. I will need to either split these into 2 separate components or experiment with animating out and back in the same component, with an updated render in between.

Despite this I am particularly pleased about my “optimistic updates” which make the app feel really fast. By updating the GUI before the server requests are completed the app feels faster than your internet 99% of the time. The GUI then reverts if the server request fails, which hopefully isn’t too often, hence optimistic.

### Server
- *[server/server.js](/server/server.js)*
- *[server/scheduled_functions.js](/server/scheduled_functions.js)*
- *[server/queries.js](/server/queries.js)*

My server.js entry point shows my routing and also the single custom console command I have which uses readline to allows me to manually trigger events from my server’s shell. Server.js also uses node-cron to schedule my hourly sending of reminder emails.

Scheduled_functions.js contains my API connection to Mailgun, and queries the database each hour to see if any reminder emails need sending.

It also contains my email validation system. When a user registers a new reminder email address, the address is sent an email containing a validation url. This URL contains s 10 minute long JWT which is routed through the server to the validateEmailLink function. If the JWT is valid the email address is added as being safe for Mailgun to email.

Queries.js contains most of my SQL queries, which use the parameterised query method to prevent SQL injection. It also hashes my passwords for storage and validation.

### Testing
- *[client/tests/components/ReminderList.test.tsx](/client/tests/components/ReminderList.test.tsx)*

Ticklr is set up to be continuously integrated. Updates to the main branch are tested via git actions and code deploys automatically to render if tests succeed. Currently I only have a small number of tests and have had to learn more about testing react apps.
I am using vitest with JSDOM over Jest as ViTest supports ECMAScript and JSX. I did consider running the tests within my docker build, but running the tests on GitHub before building on render saves render pipeline costs in only pushing working versions to render.

### Deployment
One of the biggest challenges of my project came in deploying ticklr and I struggled to deploy it to render directly from Github encountering several versioning errors. I knew Docker was likely the solution and in the process of learning Docker I fell for its ability to simplify several intractable problems.

I wanted my app to be shareable with potential employers and run reliably on any system. I knew a container with a slimline version of linux like node:alpine, would meet my requirements. However, I came to learn that SQLite was not compatible with alpine as several core linux libraries it depended on had been removed. I was faced with creating a 1.3Gb Docker image including a full version of linux which seemed too much to expect a prospective employer to download.

The solution I found was to build the docker image in steps and in one of those steps install the missing libraries and rebuild SQLite to a version native for alpine. This gave me a much more reasonable final image size of of 290Mb. My Dockerfile might be the thing I’m most proud of in this project in that it does what I thought was impossible in about 2 commands, albeit after countless versions and build attempts.

#### Contact

Thank you for looking at ticklr which continues to be developed. I am available to hire and contactable at: matt.c.lister (at) gmail.com
