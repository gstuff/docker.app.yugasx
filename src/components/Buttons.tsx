import React from 'react';

import {retrieve_data_asx} from './CompFunctions';

export const TestButton: React.FC = ({  }) => {
  return (
    <button onClick={retrieve_data_asx}>Test Data Retrieval</button>
  );
};

//export default TestButton;