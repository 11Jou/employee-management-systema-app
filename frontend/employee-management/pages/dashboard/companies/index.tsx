import Table, { Column, TableAction } from "@/components/Table";
import { useState } from "react";
import { HttpClient } from "@/services/HttpClient";
import { useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Error from "@/components/Error";
import { useRouter } from "next/router";
import Head from "next/head";

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
    const router = useRouter();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<{
        count: number;
        next: string | null;
        previous: string | null;
    } | null>(null);

    const actions: TableAction<Company>[] = [
        {
            label: "View",
            onClick: (row) => {
                router.push(`/dashboard/companies/${row.id}`);
            },
            variant: "primary",
        },
    ];

    useEffect(() => {
        const fetchCompanies = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await HttpClient.get(`management/companies/?page=${currentPage}`);
                if (response.data.success) {
                    const data = response.data.data;
                    if (data.results) {
                        setCompanies(data.results);
                        setPagination({
                            count: data.count || 0,
                            next: data.next,
                            previous: data.previous,
                        });
                    } else {
                        setCompanies(Array.isArray(data) ? data : []);
                        setPagination(null);
                    }
                } else {
                    setError(response.data.message);
                }
            } catch {
                setError('Failed to fetch companies');
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <>
            <Head>
                <title>Employee Management - Companies</title>
            </Head>
            {loading && <LoadingSpinner />}
            {error && <Error message={error} />}
            {companies && (
                <Table 
                    columns={columns} 
                    data={companies} 
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