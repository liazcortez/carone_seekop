import { useContext } from 'react';
import CompanyContext from 'src/contexts/company/companyContext';

const useCompany = () => useContext(CompanyContext);

export default useCompany;
