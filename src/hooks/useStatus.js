import { useContext } from 'react';
import StatusContext from 'src/contexts/status/statusContext';

const useStatus = () => useContext(StatusContext);

export default useStatus;
