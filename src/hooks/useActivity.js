import { useContext } from 'react';
import ActivityContext from 'src/contexts/activities/activityContext';

const useActivity = () => useContext(ActivityContext);

export default useActivity;
