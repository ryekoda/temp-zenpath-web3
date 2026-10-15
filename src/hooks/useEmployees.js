import { useState, useEffect } from 'react';
import { GetEmployees } from '../helpers/database/Employees';



export default function useEmployees(companyUID, position, lastDoc, refreshUID, isGranted, dbURL, isLoading, setIsLoading) {
  const [employees, setEmployees] = useState([])


  useEffect(() => {
    if (isGranted) {
      (async () => {
        const employeesData = await GetEmployees(companyUID, dbURL, lastDoc).catch((err) => console.log('employees error: ', err)); 
        setEmployees(lastDoc ? oldEmployees => [...oldEmployees, ...employeesData] : employeesData);
        if (typeof isLoading === 'boolean') setIsLoading(false)
      })();  
    }
  }, [ refreshUID ]);


  return employees
}
