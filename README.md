annotatAR
=========

*Prototype Website*: [annotatar.xyz](https://annotatar.xyz)

*Created by*: Rachel Boyce (RB) [arebe.us](http://arebe.us)


What's all this?
----------------

Lo-fi augmented reality for the mobile web, designed to:

* generate locative media from interactions on Twitter
* work on smart devices without installing a native app 

More information is available on the [project blog](https://arebe.github.io/annotatar).

How to deploy annotatAR
-----------------------

1. Fork this repo

2. Create a new meteor project called "annotatar" with `meteor create annotatar` and remove the default html, css, and js files from the root - you just need the meteor package files

3. `cd` into that directory and initialize an new git repo

4. Set the remote to your fork of annotatar with `git remote add origin <your url>`

5. Pull the repo from the remote (this may take a few moments)

6. Open the `packages` file in the `.meteor` directory and add the following: 
````
mrt:twit
lfergon:exportcsv
ejson
iron:router
twbs:bootstrap
houston:admin
dburles:google-maps 
````

7. Create a `settings.json` in the project root directory, to store your API keys, with the format:
````
{
	"twitter": {
		"consumer_key": "xxxxx",
		"consumer_secret": "xxxxx",
		"access_token": "xxxxx",
		"access_token_secret": "xxxxx"
	}, 
	"public": {
		"houston_root_route": "/houston",
		"houston_documents_per_page": "30"
	}
}
````
8. Run the meteor app with `meteor --settings settings.json`

9. Deploy to your own server using [Meteor Up](https://github.com/arunoda/meteor-up), instructions for which can be found [on the project blog](http://arebe.github.io/annotatar/2015/12/08/week14/)

License
-------
Original code in this repo is licensed under [GPLv3](https://www.gnu.org/licenses/gpl-3.0.html). Its dependencies include Meteor.js and jQuery (MIT license).

*annotatAR* was originally developed as a capstone project as a requirement for ALM in Digital Media Design at Harvard University School for Extension Studies.