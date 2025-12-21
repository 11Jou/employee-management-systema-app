import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { HttpClient } from "@/services/HttpClient";
import Show, { ShowField } from "@/components/Show";
import LoadingSpinner from "@/components/LoadingSpinner";
import Error from "@/components/Error";

interface Company {
  id: number;
  name: string;
  number_of_department: number;
  number_of_employee: number;
}

export default function CompanyDetail() {
const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fields: Record<keyof Company, ShowField> = {
    id: { label: "Company ID" },
    name: { label: "Company Name" },
    number_of_department: { label: "Number of Departments" },
    number_of_employee: { label: "Number of Employees" },
  };

  useEffect(() => {
    const id = router.query.id;
    if (!id) return;
    const fetchCompany = async () => {
        const response = await HttpClient.get(`management/companies/${id}/`);
        if (response.data.success) {
            console.log(response.data.data);
            setCompany(response.data.data);
        } else {
            setError(response.data.message);
        }
        setLoading(false);
    };
    fetchCompany();
  }, [router.query.id]);

  return (
    <>
      {loading && <LoadingSpinner />}
      {error && <Error message={error} />}
      {company && <Show data={company as unknown as Record<string, unknown>} fields={fields} title="Company Details" />}
    </>
  );
}
