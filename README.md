Module D
=====
Melnikov and Suarez climate dashboard.
=====
Team members:
Ivan Melnikov
Matt Suarez
=====
General information

The dashboard can be run from any of the two instances of NodeJS, my port and full address being:


The database to connect to, however, is found on Matt's side, the login information is presented below:

c.connect({
    host: 'localhost',
    user: 'mjsuarez',
    password: 'mjsuarez_pw',
    db: 'mjsuarez_db'
});

That is a sample from the connect script, found in the queries.js file in the sql directory. The application queries the database tables upon climate view change - so basically whichever weather information you would like to see, that is what it queries and changes the view to.