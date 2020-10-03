import { useContext } from 'react';
import TaskContext from 'src/contexts/task/taskContext';

const useTask = () => useContext(TaskContext);

export default useTask;
