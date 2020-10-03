import { useContext } from 'react';
import CommentContext from 'src/contexts/comment/commentContext';

const useComment = () => useContext(CommentContext);

export default useComment;
