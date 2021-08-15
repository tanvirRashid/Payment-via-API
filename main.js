
$(function() {
  fields = HostedFields.create({
    /* Set this to true when testing. Set it to false in production. */
    sandbox: true,
    /* Optional: set autocomplete to true to allow web browsers to suggest saved credit cards. */
    autocomplete: true,

            /*
              These are the CSS styles for the input elements inside the iframes. Inside each iframe
              is a single input with its id set to name, number, cvc or expiry.

              When the input has a valid value, it will have the 'hosted-fields-valid' class. When
              the input has an invalid value, it will have the 'hosted-fields-invalid' class.
              */
              styles: {
                'input': {
               /* 'font-size': '16px',
                'font-family': 'helvetica, tahoma, calibri, sans-serif',
                'color': '#3a3a3a'*/
              },
              '.hosted-fields-invalid:not(:focus)': {
                'color': 'red'
              }
            },

            /*
              The fields object defines the fields to be created. All four fields are required
              (name, number, cvc, expiry).

              Each field requires a selector for the element in which to create an iframe. Optionally,
              you can define placeholder text and a label selector (the CSS selector of the label
              element for that particular field).
              */
              fields: {
                name: {
                  selector: '#name',
                  placeholder: 'John More'
                },
                number: {
                  selector: '#number',
                  placeholder: 'xxxx xxxx xxxx xxxx'
                },
                cvc: {
                  selector: '#cvc',
                  placeholder: '123'
                },
                expiry: {
                  selector: '#expiry',
                  placeholder: '01/22'
                }
              }
            });
});



$(function () {
  /* The submit event for the form. */

  $('#payment_form').on('submit', function(e){
              /*
                If there's no card_token element in the form, then tokenisation hasn't happened yet.
                Ensure the default action is prevented and call a function to tokenise the field.
                */
                if( $('#card_token').length == 0 ) {
                  e.preventDefault();
                  tokenizeHostedFields();
                }
              });
});

          /*
            Tokenises the hosted fields. Appends a hidden field for card_token on success, adds
            error messages otherwise.
            */

            function tokenizeHostedFields(){

            /*
              Tokenise the card. This requires address details not included in the hosted fields
              which can be pulled from elsewhere (such as other form elements).
              */
              fields.tokenize(
              {
                publishable_api_key: 'pk_ZJGE-3tc_orGw5oQmRNMyA',
                address_line1: document.getElementById('adr').value,
                // address_line2: '123 Example St',
                address_city: document.getElementById('city').value,
                address_postcode: document.getElementById('postcode').value,
                address_state: document.getElementById('state').value,
                address_country: 'Australia'
              },
              function(err, response){
                if(err) {
                  /*
                    Example error:

                    {
                      error: "invalid_resource",
                      error_description: "One or more parameters were missing or invalid",
                      messages: [
                        {
                          code: "number_invalid",
                          message: "A valid card number is required",
                          param: "number"
                        }
                      ]
                    }
                    */

                    handleErrors(err);
                    return;
                  }

                /*
                  Example successful response:

                  {
                    address_city: "Perth",
                    address_country: "Australia",
                    address_line1: "Unit 42",
                    address_line2: "123 Example St",
                    address_postcode: "6000",
                    address_state: "WA",
                    customer_token: null,
                    display_number: "XXXX-XXXX-XXXX-0000",
                    expiry_month: 12,
                    expiry_year: 2034,
                    name: "Roland Robot",
                    primary: null,
                    scheme: "visa",
                    token: "card_Evv6AG9AzI2Gg0n3FrmQdw"
                  }
                  */

                  /* Append a hidden element to the form with the card_token. */

                  $('<input>').attr({
                    type: 'hidden',
                    id: 'card_token',
                    name: 'card_token',
                    value: response.token
                  }).appendTo('#payment_form');

                  tokenjs = response.token;


              //send the data to charges.php to submit charge
              $.ajax({
                url:"charges.php",
                method: "POST",
                    data: {"amount": document.getElementById('amount').value,"currency":"AUD",   "description": document.getElementById('des').value,  "email":document.getElementById('email').value,   "ip_address":"203.192.1.172",    "card_token": tokenjs},
                    success: function(res){
                      var w    = window.open('result.html');
                      //var w    = window.location.replace('result.html');
                      w.onload = function(){
                        this.document.getElementById('log2').innerHTML += res;                        
                      };                        
                    }
                  })
                // Resubmit the form with the added card_token input. 
                //$('#payment_form').submit();
              })
            };

            /* Handles rendering of the error messages to the form. */

            function handleErrors(err){
              /* Clear any existing error messages. */

              $('.error_message').text('');

              /* Add each error message to their respective divs. */

              err.messages.forEach(function(errMsg){
                $('#errors_for_' + errMsg.param).text(errMsg.message);
              });
            }

