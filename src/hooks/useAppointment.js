import { useContext } from 'react';
import AppointmentContext from 'src/contexts/appointment/appointmentContext';

const useAppointment = () => useContext(AppointmentContext);

export default useAppointment;
