import { useContext } from 'react';
import AlertContext from 'src/contexts/auth/authContext';

const useAlert = () => useContext(AlertContext);

export default useAlert;
