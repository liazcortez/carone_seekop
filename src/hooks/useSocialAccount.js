import { useContext } from 'react';
import SocialAccountContext from 'src/contexts/socialAccount/socialAccountContext';

const useSocialAccount = () => useContext(SocialAccountContext);

export default useSocialAccount;
