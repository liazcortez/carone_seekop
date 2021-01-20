import { useContext } from 'react';
import OmsGlobalContext from 'src/contexts/omsGlobal/omsGlobalContext';

const useOmsGlobal = () => useContext(OmsGlobalContext);

export default useOmsGlobal;
