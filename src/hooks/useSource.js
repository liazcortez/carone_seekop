import { useContext } from 'react';
import SourceContext from 'src/contexts/source/sourceContext';

const useSource = () => useContext(SourceContext);

export default useSource;
