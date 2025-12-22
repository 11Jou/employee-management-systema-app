import Table, { Column } from '@/components/Table';
import { useState, useEffect, useCallback } from 'react';
import { HttpClient } from '@/services/HttpClient';
import LoadingSpinner from '@/components/LoadingSpinner';
import Error from '@/components/Error';
import Head from 'next/head';

interface Company {
    id: number;
    name: string;
}

interface Department {
    id: number;
    name: string;
}

interface Employee {
    employee_name: string;
    employee_email: string;
    phone_number: string;
    company: Company;
    department: Department;
    hired_date: string;
    day_employee: number;
    status: string;
    designation: string;
}

const columns: Column<Employee>[] = [
    { key: 'employee_name', header: 'Name' },
    { key: 'employee_email', header: 'Email' },
    { key: 'phone_number', header: 'Phone Number' },
    { key: 'company', header: 'Company', render: (value: unknown) => (value as Company)?.name || "-" },
    { key: 'department', header: 'Department', render: (value: unknown) => (value as Department)?.name || "-" },
    { key: 'hired_date', header: 'Hired Date' },
    { key: 'day_employee', header: 'Day Employee' },
    { key: 'status', header: 'Status' },
    { key: 'designation', header: 'Designation' },
];

export default function HiredEmployeesIndex() {
    const [employees, setEmployees] = useState<Employee[]>([]);
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
            const response = await HttpClient.get(`management/employees/hired/?page=${page}`);
            if (response.data.success) {
                const data = response.data.data;
                if (data.results) {
                    setEmployees(data.results);
                    setPagination({
                        count: data.count || 0,
                        next: data.next,
                        previous: data.previous,
                    });
                } else {
                    setEmployees(Array.isArray(data) ? data : []);
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
            {employees && (
                <Table 
                    columns={columns} 
                    data={employees}
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