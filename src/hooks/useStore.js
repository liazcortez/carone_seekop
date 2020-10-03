import { useContext } from 'react';
import StoreContext from 'src/contexts/store/storeContext';

const useStore = () => useContext(StoreContext);

export default useStore;
