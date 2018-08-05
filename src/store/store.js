import {createStore} from 'redux';

import reducer from '../reducer/reducer';

export default createStore(reducer);
// export default () => {
//   const store = createStore(reducer);
//   return createStore(reducer);
// };