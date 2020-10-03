import { useContext } from 'react';
import MakeContext from 'src/contexts/make/makeContext';

const useMake = () => useContext(MakeContext);

export default useMake;
