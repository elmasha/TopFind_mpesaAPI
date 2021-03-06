const express = require('express')
const request = require('request')
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const db = require("./firebase/firebase_connect");

///-----Port-----///
const port = app.listen(process.env.PORT || 4004);
const _urlencoded = express.urlencoded({ extended: false })
app.use(cors())
app.use(express.json())
app.use(express.static('public'));

//----AllOW ACCESS -----//
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");


    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    res.locals.top = order_ID;
    next();
});




app.get('/', (req, res, next) => {
    res.status(200).send("Hello welcome to TopFind Mpesa API")

})

///------STK_PUSH------///

app.get('/stk', access, _urlencoded, function(req, res) {



    let endpoint = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    let auth = "Bearer " + req.access_token

    let _shortCode = '174379';
    let _passKey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'


    const timeStamp = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password =
        Buffer.from(`${_shortCode}${_passKey}${timeStamp}`).toString('base64');


    request({
            url: endpoint,
            method: "POST",
            headers: {
                "Authorization": auth
            },

            json: {

                "BusinessShortCode": _shortCode,
                "Password": password,
                "Timestamp": timeStamp,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": "1",
                "PartyA": "254746291229",
                "PartyB": _shortCode, //Till  No.
                "PhoneNumber": "254746291229",
                "CallBackURL": "http://e044-196-207-163-68.ngrok.io/stk_callback",
                "AccountReference": "TopFind digital Merchants",
                "TransactionDesc": "_transDec"

            }

        },
        (error, response, body) => {

            if (error) {
                console.log(error);
                res.status(404).json(error);

            } else {

                res.status(200).json(body);
                console.log(body);



            }


        })




});
//----MIDDLEWARE---///
const middleware = (req, res, next) => {

    next();
};


///------STK_CALLBACK-----///
app.post('/stk_callback', _urlencoded, middleware, function(req, res, next) {
    console.log('.......... STK Callback ..................');
    if (res.status(200)) {

        console.log("ID", id)
        console.log("CheckOutId", _checkoutID)

        res.json((req.body.Body.stkCallback.CallbackMetadata))
        console.log(req.body.Body.stkCallback.CallbackMetadata)
    }

})


////-----ACCESS_TOKEN-----
app.get('/access_token', access, (req, res) => {

    res.status(200).json({ access_token: req.access_token })

})

function access(res, req, next) {

    let endpoint = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    let auth = new Buffer.from("adTmAF8YQU0wZdaCfFEz6vMkJ3uhDFvt:D9nbuznGH9d6ntpx").toString('base64');

    request({
            url: endpoint,
            headers: {
                "Authorization": "Basic  " + auth
            }

        },
        (error, response, body) => {

            if (error) {
                console.log(error);
            } else {

                res.access_token = JSON.parse(body).access_token
                console.log(body)
                next()

            }

        }
    )


}
///----END ACCESS_TOKEN--- 


//-- listen
app.listen(port, (error) => {

    if (error) {



    } else {

        console.log(`Server running on port http://localhost:${port}`)

    }


});