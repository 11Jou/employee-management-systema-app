import { useEffect, useState } from "react";
import HttpClient from "../../services/HttpClient";
import Counter from "@/components/Counter";
import LoadingSpinner from "@/components/LoadingSpinner";
import Error from "@/components/Error";
import Head from "next/head";

interface Dashboard {
    total_companies: number;
    total_departments: number;
    total_employees: number;
}

export default function Dashboard() {
    const [dashboard, setDashboard] = useState<Dashboard | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            setLoading(true);
            const response = await HttpClient.get('management/dashboard/');
            if (response.data.success) {
                setDashboard(response.data.data);
            } else {
                setError(response.data.message);
            }
            setLoading(false);
        };
        fetchDashboard();
    }, []);
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Head>
                <title>Employee Management - Dashboard</title>
            </Head>
            {loading && <LoadingSpinner />}
            {error && <Error message={error} />}
            {dashboard && <Counter title="Total Companies" value={dashboard.total_companies} color="bg-blue-500" textColor="text-white" />}
            {dashboard && <Counter title="Total Departments" value={dashboard.total_departments} color="bg-green-500" textColor="text-white" />}
            {dashboard && <Counter title="Total Employees" value={dashboard.total_employees} color="bg-red-500" textColor="text-white" />}
        </div>
    )
}