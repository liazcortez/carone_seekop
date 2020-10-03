import { useContext } from 'react';
import MailContext from 'src/contexts/mail/mailContext';

const useMail = () => useContext(MailContext);

export default useMail;
