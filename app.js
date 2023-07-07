const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(`${__dirname}/`))

app.get("/", function(req, res){
    res.sendFile(`${__dirname}/signup.html`);
});

app.post("/", function(req, res) {
    
    // variables ingresadas por el usuario a registrar
    const queryFirstName = req.body.firstName;
    const queryLastName = req.body.lastName;
    const queryEmail = req.body.email;

    //data del usuario ingresado
    const data = {
        members: [
            {
                email_address: queryEmail,
                status: "subscribed",
                merge_fields: {
                    FNAME: queryFirstName,
                    LNAME: queryLastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    // URL de lista de usuarios registrados mailchimp
    const url = "https://us21.api.mailchimp.com/3.0/lists/0af31136fa";

    const options = {
        method: "POST",
        auth: "f.jeraldo1993@gmail.com:70f089ec1285878810d5beec81bfcf25-us21"
    };

    const request = https.request(url, options, function(response) {
        response.on("data", function(data) {

            if (response.statusCode === 200) {
                res.sendFile(`${__dirname}/success.html`)
            } else {
                res.sendFile(`${__dirname}/failure.html`)
            }
            console.log(JSON.parse(data));
        })
    });

    //request.write(jsonData);
    request.end()
    
});

// redirecciona la pagina
app.post("/failure", function(req, res) {
    res.redirect("/");
})

//API key
// 70f089ec1285878810d5beec81bfcf25-us21

//Audencie ID
//0af31136fa

// el puerto sera el entregado por heroku o por el localhost
app.listen(process.env.PORT || 4000, function(){
    console.log("Server is running on port 4000");
});