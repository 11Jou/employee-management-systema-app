import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { HttpClient } from "@/services/HttpClient";
import Show, { ShowField } from "@/components/Show";
import LoadingSpinner from "@/components/LoadingSpinner";
import Error from "@/components/Error";
import Head from "next/head";


interface Department {
    id: number;
    name: string;
    number_of_employee: number;
}

export default function DepartmentDetail() {
    const router = useRouter();
    const [department, setDepartment] = useState<Department | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fields: Record<keyof Department, ShowField> = {
        id: { label: "Department ID" },
        name: { label: "Department Name" },
        number_of_employee: { label: "Number of Employees" },
      };

    useEffect(() => {
        const id = router.query.id;
        if (!id) return;
        const fetchDepartment = async () => {
            setLoading(true);
            const response = await HttpClient.get(`management/departments/${id}/`);
            if (response.data.success) {
                setDepartment(response.data.data);
            } else {
                setError(response.data.message);
            }
            setLoading(false);
        };
        fetchDepartment();
    }, [router.query.id]);
    return (
        <>
            <Head>
                <title>Employee Management - Department Details</title>
            </Head>
            {loading && <LoadingSpinner />}
            {error && <Error message={error} />}
            {department && <Show data={department as unknown as Record<string, unknown>} fields={fields} title="Department Details" />}
        </>
    );
}