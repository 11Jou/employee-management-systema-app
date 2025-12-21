import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { HttpClient } from "@/services/HttpClient";
import Show, { ShowField } from "@/components/Show";
import LoadingSpinner from "@/components/LoadingSpinner";
import Error from "@/components/Error";
import Head from "next/head";


interface Company {
    id: number;
    name: string;
}

interface Department {
    id: number;
    name: string;
}

interface Employee {
    id: number;
    employee_name: string;
    employee_email: string;
    phone_number: string;
    address: string;
    company: Company;
    department: Department;
    hired_date: string;
    status: string;
    designation: string;
    day_employee: number;
}

export default function EmployeeDetail() {
    const router = useRouter();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fields: Record<keyof Employee, ShowField> = {
        id: { label: "Employee ID" },
        employee_name: { label: "Employee Name" },
        employee_email: { label: "Employee Email" },
        phone_number: { label: "Phone Number" },
        address: { label: "Address" },
        company: { label: "Company", render: (value: unknown) => (value as Company)?.name || "-" },
        department: { label: "Department", render: (value: unknown) => (value as Department)?.name || "-" },
        hired_date: { label: "Hired Date" },
        status: { label: "Status" },
        designation: { label: "Designation" },
        day_employee: { label: "Day Employee" },
    };

    useEffect(() => {
        const id = router.query.id;
        if (!id) return;
        const fetchEmployee = async () => {
            setLoading(true);
            const response = await HttpClient.get(`management/employees/${id}/`);
            if (response.data.success) {
                setEmployee(response.data.data);
            } else {
                setError(response.data.message);
            }
            setLoading(false);
        };
        fetchEmployee();
    }, [router.query.id]);
    return (
        <>
            <Head>
                <title>Employee Management - Employee Details</title>
            </Head>
            {loading && <LoadingSpinner />}
            {error && <Error message={error} />}
            {employee && <Show data={employee as unknown as Record<string, unknown>} fields={fields} title="Employee Details" />}
        </>
    );
}