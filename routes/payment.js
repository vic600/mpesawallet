const schedule = require('node-schedule');
const prettyjson = require('prettyjson');
const request = require('request')
const ts = require('time-stamp');
const options = {
    noColor: true
};
module.exports = (router) => {
    function gettoken(cb) {
        const Token = String;
        var app_key = "NeHwfzV96cQaZBNLITwyIRdwq8RbfDLN";
        var app_secret = "9u9jw7NIt6cGBLor";
        var appKeySecret = app_key + ":" + app_secret;
        var auth = "Basic " + new Buffer.from(appKeySecret).toString("base64");
        var url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"

        var au = auth.trim()

        request(
            {
                url: url,
                headers: {
                    "Authorization": au,

                }
            },
            function (error, response, body) {
                if (error) {
                    console.log(error);

                } else {
                    var auth = body.split(":");
                    var Token1 = auth[1];
                    var tk2 = Token1.split(",");
                    var tk3 = tk2[0];
                    var tk = tk3.replace("\"", "");
                    var rt2 = tk.replace('"', "");
                    const Token = "Bearer " + rt2.trim();
                    cb(Token)


                }

            })

    }
    router.post('/pay', (req, res) => {
        gettoken((tk) => {
            if (!req.body.phone) {
                res.json({ success: false, message: 'valid phone number must be provided' })
            } else {

                if (!req.body.amount) {
                    res.json({ success: false, message: 'valid amount  must be provided' })
                } else {
                    var Shortcode = 174379;
                    var PartyB = 174379;
                    var Reference = "28";
                    var description = "RCGARDENS";
                    // var Bearer = now_token;
                    var Passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
                    var Time_Stamp = ts('YYYYMMDDHHMMSS')
                    this.Timestamp = Time_Stamp;
                    this.Leo = ts('YYYYMMDD')

                    //console.log('Mpesa time ' +   this.Timestamp);
                    var PartyA = req.body.phone;

                    //this.Thisamo[0] = "1";      //remember to remove this  
                    var Amount = req.body.amount;
                    var plainstring = Shortcode + Passkey + Time_Stamp;
                    var Cred = new Buffer.from(plainstring).toString("base64")   // Base64.encodeToString(plainstring.getBytes("ISO-8859-1"),Base64.DEFAULT);
                    //console.log('cred ' + Cred);
                    var Credetials = Cred.replace("\\s", "");
                    var url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
                    request(
                        {
                            method: 'POST',
                            url: url,
                            headers: {
                                "Authorization": tk.trim()
                            },
                            json: {
                                BusinessShortCode: Shortcode,
                                Password: Credetials,
                                Timestamp: Time_Stamp,
                                TransactionType: "CustomerPayBillOnline",
                                Amount: Amount,
                                PartyA: PartyA,
                                PartyB: PartyB,
                                PhoneNumber: PartyA,
                                CallBackURL: "http://178.128.194.44:3000/payment/mpesa",
                                AccountReference: Reference,
                                TransactionDesc: description
                            }
                        },
                        function (error, response, body) {

                            if (error) {
                                res.json(error)

                            } else {
                                res.json(body).status(200)

                            }

                            //console.log(timestamp);

                        }
                    )
                }

            }


        })
    })
    // router.post('/schedule',(req,res)=>{
    //  if (!req.body.d) {
    //      res.json({success:false,message:'when missing'})
    //  } else {

    //     var date = new Date(req.body.d);

    //     var j = schedule.scheduleJob(date, function(){
    //       console.log('The world is going to end today.');
    //     });
    //     res.json({success:true,message:'cron set'})  
    //  }
    // })
    router.post('/stkquery', (req, res) => {
        gettoken(function (tk) {
            if (!req.body.check) {
                res.json({ success: false, message: 'provide a valid CheckoutRequestID' })
            } else {
                var Shortcode = 174379;
                var Bearer = tk;
                var Passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
                var Time_Stamp = ts('YYYYMMDDHHMMSS')
                var plainstring = Shortcode + Passkey + Time_Stamp;
                var Cred = new Buffer.from(plainstring).toString("base64")   // Base64.encodeToString(plainstring.getBytes("ISO-8859-1"),Base64.DEFAULT);
                var Credetials = Cred.replace("\\s", "");
                var url = "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query" //"https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query"
                request(
                    {
                        method: 'POST',
                        url: url,
                        headers: {
                            "Authorization": Bearer.trim()
                        },
                        json: {
                            "BusinessShortCode": Shortcode,
                            "Password": Credetials,
                            "Timestamp": Time_Stamp,
                            "CheckoutRequestID": req.body.check
                        }
                    },
                    function (error, response, body) {
                        if (error) {
                            res.json(error)
                        } else {
                            res.json(body).status(200)
                        }

                    }
                )
            }



        })

    })
    router.post('/pstatus', (req, res) => {
        gettoken(function (tk) {
            if (!req.body.check) {
                res.json({ success: false, message: 'provide a valid Trasaction id' })
            } else {
                var Shortcode = 174379;
                var initiator = 'testapi'
                var Bearer = tk;
                var Passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
                var Time_Stamp = ts('YYYYMMDDHHMMSS')
                var plainstring = Shortcode + Passkey + Time_Stamp;
                var Cred = new Buffer.from(plainstring).toString("base64")   // Base64.encodeToString(plainstring.getBytes("ISO-8859-1"),Base64.DEFAULT);
                var Credetials = Cred.replace("\\s", "");
                var url = "https://sandbox.safaricom.co.ke/mpesa/transactionstatus/v1/query"  // "https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query"

                request(
                    {
                        method: 'POST',
                        url: url,
                        headers: {
                            "Authorization": Bearer.trim()
                        },
                        json: {
                            "Initiator": Shortcode,
                            "SecurityCredential": Credetials,
                            "CommandID": "TransactionStatusQuery",
                            "TransactionID": req.body.check,
                            "PartyA": Shortcode,
                            "IdentifierType": "11",
                            "ResultURL": "http://178.128.194.44:3000/payment/status",
                            "QueueTimeOutURL": "http://178.128.194.44:3000/payment/timeout",
                            "Remarks": "confirm ",
                            "Occasion": "transaction "
                        }
                    },
                    function (error, response, body) {
                        if (error) {
                            res.json(error);
                        } else {
                            res.json(body).status(200)
                        }

                    }
                )
            }


        })
    })
    router.post('/c2b', (req, res) => {
        gettoken((tk) => {
            if (!req.body.phone) {
                res.json({ success: false, message: 'valid phone number must be provided' })
            } else {

                if (!req.body.amount) {
                    res.json({ success: false, message: 'valid amount  must be provided' })
                } else {
                    var Shortcode = 600777;
                    var PartyB = 174379;
                    var Reference = "28";
                    var description = "RCGARDENS";
                    // var Bearer = now_token;
                    var Passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
                    var Time_Stamp = ts('YYYYMMDDHHMMSS')
                    this.Timestamp = Time_Stamp;
                    this.Leo = ts('YYYYMMDD')
                    var plainstring = Shortcode + Passkey + Time_Stamp;
                    var Cred = new Buffer.from(plainstring).toString("base64")   // Base64.encodeToString(plainstring.getBytes("ISO-8859-1"),Base64.DEFAULT);
                    //console.log('cred ' + Cred);
                    var Credetials = Cred.replace("\\s", "");
                    var url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate"
                    request(
                        {
                            method: 'POST',
                            url: url,
                            headers: {
                                "Authorization": tk.trim()
                            },
                            json: {
                                //Fill in the request parameters with valid values
                                "ShortCode": Shortcode,
                                "CommandID": "CustomerPayBillOnline",
                                "Amount": req.body.amount,
                                "Msisdn": req.body.phone,
                                "BillRefNumber": "test"
                            }
                        },
                        function (error, response, body) {
                            // TODO: Use the body object to extract the response
                            if (error) {
                                console.log(error);

                            }
                            res.json(body).status(200);
                        }
                    )

                }
            }
        })


    })
    router.post('/mpesa', (req, res) => {
        // let message = {
        //     "ResponseCode": "00000000",
        //     "ResponseDesc": "success"
        // };

        console.log(prettyjson.render(req.body, options));
        // res.json({ success: true, message: message })
    })
    router.post('/status', (req, res) => {
        // let message = {
        //     "ResponseCode": "00000000",
        //     "ResponseDesc": "success"
        // };

        console.log(prettyjson.render(req.body, options));
        // res.json({ success: true, message: message })
    })
    router.post('/timeout', (req, res) => {
        // let message = {
        //     "ResponseCode": "00000000",
        //     "ResponseDesc": "success"
        // };

        console.log(prettyjson.render(req.body, options));
        // res.json({ success: true, message: message })
    })
    return router
}   