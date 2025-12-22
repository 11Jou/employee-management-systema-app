import Table, { Column, TableAction } from '@/components/Table';
import { useState, useEffect, useCallback } from 'react';
import { HttpClient } from '@/services/HttpClient';
import LoadingSpinner from '@/components/LoadingSpinner';
import Error from '@/components/Error';
import { useRouter } from 'next/router';
import ConfirmDelete from '@/components/ConfirmDelete';
import Head from 'next/head';

interface Employee {
    id: number;
    employee_name: string;
    hired_date: string;
    status: string;
    designation: string;
}

const columns: Column<Employee>[] = [
    { key: 'id', header: 'ID' },
    { key: 'employee_name', header: 'Name' },
    { key: 'hired_date', header: 'Hired Date' },
    { key: 'status', header: 'Status' },
    { key: 'designation', header: 'Designation' },
];

export default function EmployeesIndex() {
    const router = useRouter();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<{
        count: number;
        next: string | null;
        previous: string | null;
    } | null>(null);

    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [employeeId, setEmployeeId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const handleDelete = (id: number) => {
        setShowConfirmDelete(true);
        setEmployeeId(id);
        setDeleteError(null);
    };

    const fetchEmployees = useCallback(async (page: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await HttpClient.get(`management/employees/?page=${page}`);
            if (response.data.success) {
                const data = response.data.data;
                // Handle paginated response
                if (data.results) {
                    setEmployees(data.results);
                    setPagination({
                        count: data.count || 0,
                        next: data.next,
                        previous: data.previous,
                    });
                } else {
                    // Fallback for non-paginated response
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

    const handleConfirmDelete = async () => {
        if (!employeeId) return;

        setDeleting(true);
        setDeleteError(null);

        try {
            const response = await HttpClient.delete(`management/employees/delete/${employeeId}/`);
            console.log(response);
            if (response.data.success) {
                setShowConfirmDelete(false);
                setEmployeeId(null);
                await fetchEmployees(currentPage);
            } else {
                setDeleteError(response.data.message || 'Failed to delete employee');
            }
        } catch {
            setDeleteError('An unexpected error occurred. Please try again.');
        } finally {
            setDeleting(false);
        }
    };

    const handleCloseDelete = () => {
        if (!deleting) {
            setShowConfirmDelete(false);
            setEmployeeId(null);
            setDeleteError(null);
        }
    };

    const actions: TableAction<Employee>[] = [
        {
            label: "View",
            onClick: (row) => {
                router.push(`/dashboard/employees/${row.id}`);
            },
            variant: "primary",
        },
        {
            label: "Edit",
            onClick: (row) => {
                router.push(`/dashboard/employees/${row.id}/edit`);
            },
            variant: "secondary",
        },
        {
            label: "Delete",
            onClick: (row) => {
                handleDelete(row.id);
            },
            variant: "danger",
        },
    ];
    useEffect(() => {
        fetchEmployees(currentPage);
    }, [currentPage, fetchEmployees]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    return (
        <div className="flex flex-col gap-4">
            <Head>
                <title>Employee Management - Employees</title>
            </Head>
                <button
                className="self-end w-fit bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer"
                onClick={() => router.push('/dashboard/employees/create')}
                >
                New Employee
                </button>
            {loading && <LoadingSpinner />}
            {error && <Error message={error} />}
            {employees && (
                <Table 
                    columns={columns} 
                    data={employees} 
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
            
            <ConfirmDelete
                isOpen={showConfirmDelete}
                onClose={handleCloseDelete}
                onConfirm={handleConfirmDelete}
                title="Confirm Delete Employee"
                message="Are you sure you want to delete this employee? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                loading={deleting}
                error={deleteError}
            />
        </div>
    );
}