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
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<{
        count: number;
        next: string | null;
        previous: string | null;
    } | null>(null);

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
            setLoading(true);
            setError(null);
            try {
                const response = await HttpClient.get(`management/departments/?page=${currentPage}`);
                if (response.data.success) {
                    const data = response.data.data;
                    // Handle paginated response
                    if (data.results) {
                        setDepartments(data.results);
                        setPagination({
                            count: data.count || 0,
                            next: data.next,
                            previous: data.previous,
                        });
                    } else {
                        // Fallback for non-paginated response
                        setDepartments(Array.isArray(data) ? data : []);
                        setPagination(null);
                    }
                } else {
                    setError(response.data.message);
                }
            } catch {
                setError('Failed to fetch departments');
            } finally {
                setLoading(false);
            }
        };
        fetchDepartments();
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <>
            <Head>
                <title>Employee Management - Departments</title>
            </Head>
            {loading && <LoadingSpinner />}
            {error && <Error message={error} />}
            {departments && (
                <Table 
                    columns={columns} 
                    data={departments} 
                    actions={actions} 
                    actionsHeader="Actions"
                    pagination={pagination ? {
                        ...pagination,
                        currentPage,
                        totalPages: pagination ? Math.ceil(pagination.count / 10) : 0,
                    } : undefined}
                    onPageChange={handlePageChange}
                />
            )}
        </>
    );
}