import { useContext } from 'react';
import VehicleContext from 'src/contexts/vehicle/vehicleContext';

const useVehicle = () => useContext(VehicleContext);

export default useVehicle;
