import { useContext } from 'react';
import SettingContext from 'src/contexts/setting/settingContext';

const useSetting = () => useContext(SettingContext);

export default useSetting ;
