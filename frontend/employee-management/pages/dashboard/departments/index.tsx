import Table, { Column } from "@/components/Table";
import { useState, useEffect } from "react";
import { HttpClient } from "@/services/HttpClient";
import LoadingSpinner from "@/components/LoadingSpinner";
import Error from "@/components/Error";


interface Department {
    id: number;
    name: string;
    number_of_employee: number;
}

const columns: Column<Department>[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'number_of_employee', header: 'Number of Employee' },
];

export default function DepartmentsIndex() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDepartments = async () => {
            const response = await HttpClient.get('management/departments/');
            if (response.data.success) {
                setDepartments(response.data.data);
            } else {
                setError(response.data.message);
            }
            setLoading(false);
        };
        fetchDepartments();
    }, []);

    return (
        <>
            {loading && <LoadingSpinner />}
            {error && <Error message={error} />}
            {departments.length > 0 && <Table columns={columns} data={departments} />}
        </>
    );
}