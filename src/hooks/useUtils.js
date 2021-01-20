import { useContext } from 'react';
import UtilsContext from 'src/contexts/utils/utilsContext';

const useUtils = () => useContext(UtilsContext);

export default useUtils;
