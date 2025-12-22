import Table, { Column } from '@/components/Table';
import { useState, useEffect, useCallback } from 'react';
import { HttpClient } from '@/services/HttpClient';
import LoadingSpinner from '@/components/LoadingSpinner';
import Error from '@/components/Error';
import Head from 'next/head';

interface User {
    name: string;
    email: string;
    role: string;
    date_joined: string;
}


const columns: Column<User>[] = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
    { key: 'date_joined', header: 'Date Joined' },
];

export default function UserAccountsIndex() {
    const [userAccounts, setUserAccounts] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<{
        count: number;
        next: string | null;
        previous: string | null;
    } | null>(null);


    
    const fetchEmployees = useCallback(async (page: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await HttpClient.get(`management/user-accounts/?page=${page}`);
            if (response.data.success) {
                const data = response.data.data;
                if (data.results) {
                    setUserAccounts(data.results);
                    setPagination({
                        count: data.count || 0,
                        next: data.next,
                        previous: data.previous,
                    });
                } else {
                    setUserAccounts(Array.isArray(data) ? data : []);
                    setPagination(null);
                }
            } else {
                setError(response.data.message);
            }
        } catch {
            setError('Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        fetchEmployees(currentPage);
    }, [currentPage, fetchEmployees]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    return (
        <div className="flex flex-col gap-4">
            <Head>
                <title>Employee Management - Hired Employees</title>
            </Head>
            {loading && <LoadingSpinner />}
            {error && <Error message={error} />}
            {userAccounts && (
                <Table 
                    columns={columns} 
                    data={userAccounts}
                    pagination={pagination ? {
                        ...pagination,
                        currentPage,
                        totalPages: pagination ? Math.ceil(pagination.count / 10) : 0,
                    } : undefined}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}