//import React from 'react';
import axios from 'axios';

export async function retrieve_data_asx() {
    const cookie_url = 'https://fc.yahoo.com';
    try {
        const response = await axios.get(cookie_url);
        //const users = response.data;
        //console.log(response.headers);
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
