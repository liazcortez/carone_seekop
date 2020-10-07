import { useContext } from 'react';
import DocumentContext from 'src/contexts/document/documentContext';

const useDocument = () => useContext(DocumentContext);

export default useDocument ;
