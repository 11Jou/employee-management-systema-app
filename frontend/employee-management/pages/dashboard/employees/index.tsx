import Table, { Column, TableAction } from '@/components/Table';
import { useState, useEffect } from 'react';
import { HttpClient } from '@/services/HttpClient';
import LoadingSpinner from '@/components/LoadingSpinner';
import Error from '@/components/Error';
import { useRouter } from 'next/router';
import ConfirmDelete from '@/components/ConfirmDelete';

interface Employee {
    id: number;
    employee_name: string;
    company: string;
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

    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [employeeId, setEmployeeId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const handleDelete = (id: number) => {
        setShowConfirmDelete(true);
        setEmployeeId(id);
        setDeleteError(null);
    };

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
                // Refresh the employee list
                const fetchResponse = await HttpClient.get('management/employees/');
                if (fetchResponse.data.success) {
                    setEmployees(fetchResponse.data.data);
                }
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
        const fetchEmployees = async () => {
            setLoading(true);
            const response = await HttpClient.get('management/employees/');
            if (response.data.success) {
                setEmployees(response.data.data);
            } else {
                setError(response.data.message);
            }
            setLoading(false);
        };
        fetchEmployees();
    }, []);
    return (
        <>
            {loading && <LoadingSpinner />}
            {error && <Error message={error} />}
            {employees.length > 0 && <Table columns={columns} data={employees} actions={actions} actionsHeader="Actions" />}
            
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
        </>
    );
}