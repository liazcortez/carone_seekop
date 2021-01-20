import { useContext } from 'react';
import QuestLeadContext from 'src/contexts/questLead/questLeadContext';

const useQuestLead = () => useContext(QuestLeadContext);

export default useQuestLead;
