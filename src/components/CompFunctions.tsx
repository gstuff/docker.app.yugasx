//import React from 'react';
import axios from 'axios';

import { curly } from 'node-libcurl';

export async function retrieve_data_asx() {
    const cookie_url = 'https://fc.yahoo.com';
    //const curl = new Curl();

    try {
      /*
      const { data } = await curly.post('http://httpbin.com/post', {
         postFields: JSON.stringify({ field: 'value' }),
         httpHeader: [
            'Content-Type: application/json',
            'Accept: application/json'
         ],
      })

      console.log(data)
      */
      // curl.setOpt('URL', cookie_url);
      // curl.setOpt('FOLLOWLOCATION', true);

      // curl.on('end', function (statusCode, data, headers) {
      //    console.info(statusCode);
      //    console.info('---');
      //    console.info(data.length);
      //    console.info('---');
      //    console.info(this.getInfo( 'TOTAL_TIME'));      
      //    this.close();
      // });

      // curl.on('error', curl.close.bind(curl));
      // curl.perform();

         const response = await axios.get(cookie_url, );
         const users = response.data;
         console.log(response.headers);
         console.log(response.data);
         return 'GOOD';
     } catch (error) {
        console.error('Error fetching users:', error.message);
        return 'BAD';
     }     
//     const request: RequestInfo = new Request('./users.json', {
//         method: 'GET',
// //        headers: headers
//       })

//    console.log("retrieve_data_asx()");
}
