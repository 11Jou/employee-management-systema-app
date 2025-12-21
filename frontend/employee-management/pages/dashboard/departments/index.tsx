import Table, { Column } from "@/components/Table";
import { useState, useEffect } from "react";
import { HttpClient } from "@/services/HttpClient";
import LoadingSpinner from "@/components/LoadingSpinner";
import Error from "@/components/Error";
import { TableAction } from "@/components/Table";
import { useRouter } from "next/router";
import Head from "next/head";


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
    const router = useRouter();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const actions: TableAction<Department>[] = [
        {
            label: "View",
            onClick: (row) => {
                router.push(`/dashboard/departments/${row.id}`);
            },
            variant: "primary",
        },
    ];

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
            <Head>
                <title>Employee Management - Departments</title>
            </Head>
            {loading && <LoadingSpinner />}
            {error && <Error message={error} />}
            {departments.length > 0 && <Table columns={columns} data={departments} actions={actions} actionsHeader="Actions" />}
        </>
    );
}