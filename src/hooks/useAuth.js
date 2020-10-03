import { useContext } from 'react';
import AuthContext from 'src/contexts/auth/authContext';

const useAuth = () => useContext(AuthContext);

export default useAuth;
