import { useContext } from 'react';
import LeadContext from 'src/contexts/lead/leadContext';

const useLead = () => useContext(LeadContext);

export default useLead;
