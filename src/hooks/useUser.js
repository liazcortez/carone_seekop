import { useContext } from 'react';
import UserContext from 'src/contexts/user/userContext';

const useUser = () => useContext(UserContext);

export default useUser;
