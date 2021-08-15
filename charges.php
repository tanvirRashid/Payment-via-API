<?php

// print_r($_POST);

 $json = json_encode($_POST);


 //print_r($json);



$url = "https://test-api.pinpayments.com/1/charges";

$curl = curl_init($url);
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$headers = array(
   "Accept: application/json",
   "Authorization: Basic bFRXbk5kc0pFaXJ2eTdtcTBvaGt6Zzog",
   "Content-Type: application/json",
);
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

$data = $json;

curl_setopt($curl, CURLOPT_POSTFIELDS, $data);

//for debug only!
curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

//curl_exec($curl);
$resp = curl_exec($curl);

$decode = json_decode($resp, true);

my_print($decode);

function my_print($array) {
    $output = "<p>";
    foreach ($array as $key => $value) {
        if (is_array($value)) {
            //echo $key .':'. $value . '</br>';
            my_print($value);
            //$output .= "<li>".my_print($value)."</li>";
        } else {
            if (($key == 'success') && ($value == 'true')) {
               $output .= "<p>Payment was successful!</p>
                           <p> Thanks for your payment!</p>";
                           //<p>".$key .':'.$value."</p>";
               //$output .= "<li>".$key .':'.$value."</li>";
            }
            elseif (($key == 'error')) {
               $output .= "<p>Oops! Payment declined with ".$key .': '.$value."</p>";
            }
            /*{
               $output .= "<p>Payment declined!</p><li>".$key .':'.$value."</li>";
            }*/
             //echo $key .':'. $value . '</br>';
             //$output .= "<li>".$value."</li>";
        }
    }
    $output .= "</p>";
    echo $output;
}

/*if($e = curl_error($curl)){
   echo $e;

}
else{
   $decode = json_decode($resp, true);
   foreach($decode as $array){    
    foreach($array as $array2){
      if((is_array($array2) == false)){
         foreach($array as $key=>$value){
            if (is_array($key)) {
               foreach($key as $key3=>$value3){
                  echo $key3 .':'. $value3 . '</br>';
               }
            }
            echo $key .':'. $value . '</br>';
         }
      }
      foreach($array2 as $key2=>$value2){
            echo $key2 .':'. $value2 . '</br>';
         } 
     
         
         /*header('Location: success.html');
exit;*/
   /*}
    foreach($array as $key=>$value){
         echo $key .':'. $value . '</br>';
      }
}*/
  // $decode_more = json_decode($decode, true);
 //  echo $decode_more[0];
   //print_r($decode);
   /*foreach ($decode as $key => $value) {
      echo $key .':'. $value . '<br>';
      echo "Hello";
   }*/
   // print_r($decode);
//}*/
curl_close($curl);
//header('Location: success.html');
//var_dump($decode);
//var_dump($decode_more);

?>

