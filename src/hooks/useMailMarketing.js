import { useContext } from 'react';
import MailMarketingContext from 'src/contexts/mailMarketing/mailMarketingContext';

const useMailMarketing = () => useContext(MailMarketingContext);

export default useMailMarketing;
