import { ChangeType } from "../constants/types";

export const handleUserInsert = (change: ChangeType, tableName: string) => {

    console.log(`New record detected in '${tableName}':`, change);


};
export const handleUserdelete = (change: ChangeType, tableName: string) => {

    console.log(`record deleted from '${tableName}':`, change);


};
export const handleAdminInsert = (change: ChangeType, tableName: string) => {

    console.log(`New record detected in '${tableName}':`, change);


};
export const handleAdmindelete = (change: ChangeType, tableName: string) => {

    console.log(`record deleted from '${tableName}':`, change);


};