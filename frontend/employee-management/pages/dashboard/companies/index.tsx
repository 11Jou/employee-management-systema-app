import Table, { Column } from "@/components/Table";
import { useState } from "react";
import { HttpClient } from "@/services/HttpClient";
import { useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Error from "@/components/Error";

interface Company {

    id: number;
    name: string;
    number_of_department: number;
    number_of_employee: number;
}

const columns: Column<Company>[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'number_of_department', header: 'Number of Department' },
    { key: 'number_of_employee', header: 'Number of Employee' },
];

export default function CompaniesIndex() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchCompanies = async () => {
            setLoading(true);
            const response = await HttpClient.get('management/companies/');
            if (response.data.success) {
                setCompanies(response.data.data);
            } else {
                setError(response.data.message);
            }
            setLoading(false);
        };
        fetchCompanies();
    }, []);
    return (
        <>
            {loading && <LoadingSpinner />}
            {error && <Error message={error} />}
            {companies.length > 0 && <Table columns={columns} data={companies} />}
        </>
    );
}