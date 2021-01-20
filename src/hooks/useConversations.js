import { useContext } from 'react';
import ConversationsContext from 'src/contexts/conversations/conversationsContext';

const useConversations = () => useContext(ConversationsContext);

export default useConversations;
