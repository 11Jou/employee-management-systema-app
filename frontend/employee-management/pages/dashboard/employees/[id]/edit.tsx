import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { HttpClient } from "@/services/HttpClient";
import LoadingSpinner from "@/components/LoadingSpinner";
import Error from "@/components/Error";

interface Company {
    id: number;
    name: string;
}

interface Department {
    id: number;
    name: string;
    company: number;
}

interface Employee {
    id: number;
    employee_name: string;
    employee_email: string;
    phone_number: string;
    address: string;
    company: number;
    department: number;
    status: string;
    designation: string;
}

const EMPLOYEE_STATUSES = [
    { value: 'application_received', label: 'Application Received' },
    { value: 'interview_scheduled', label: 'Interview Scheduled' },
    { value: 'hired', label: 'Hired' },
    { value: 'not_accepted', label: 'Not Accepted Yet' },
];

export default function EmployeeEdit() {
    const router = useRouter();
    const { id } = router.query;

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const [employee, setEmployee] = useState<Employee | null>(null);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
    const [departmentsLoaded, setDepartmentsLoaded] = useState(false);

    const [formData, setFormData] = useState({
        employee_name: "",
        employee_email: "",
        phone_number: "",
        address: "",
        company: "",
        department: "",
        status: "application_received",
        designation: "",
    });

    // Fetch employee data
    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch employee
                const employeeResponse = await HttpClient.get(`management/employees/${id}/`);
                if (employeeResponse.data.success) {
                    const emp = employeeResponse.data.data;
                    setEmployee(emp);
                    
                    // Extract IDs from nested company and department objects
                    const companyId = emp.company && typeof emp.company === 'object' 
                        ? emp.company.id 
                        : emp.company;
                    const departmentId = emp.department && typeof emp.department === 'object' 
                        ? emp.department.id 
                        : emp.department;
                    
                    setFormData({
                        employee_name: emp.employee_name || "",
                        employee_email: emp.employee_email || "",
                        phone_number: emp.phone_number || "",
                        address: emp.address || "",
                        company: String(companyId) || "",
                        department: String(departmentId) || "",
                        status: emp.status || "application_received",
                        designation: emp.designation || "",
                    });
                } else {
                    setError(employeeResponse.data.message);
                }

                const companiesResponse = await HttpClient.get('management/companies/');
                if (companiesResponse.data.success) {
                    setCompanies(companiesResponse.data.data);
                }
                

                const departmentsResponse = await HttpClient.get('management/departments/');
                if (departmentsResponse.data.success) {
                    setDepartments(departmentsResponse.data.data);
                    setDepartmentsLoaded(true);
                }
            } catch {
                setError("Failed to load employee data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        // Only filter when we have both company selected and departments loaded
        if (formData.company && departmentsLoaded && departments.length > 0) {
            const filtered = departments.filter(
                (dept) => String(dept.company) === formData.company
            );
            setFilteredDepartments(filtered);
            
            // Preserve the current department if it exists in the filtered list
            // Only reset if the department doesn't belong to the company
            setFormData(prev => {
                const currentDeptId = prev.department;
                if (currentDeptId && !filtered.some(d => String(d.id) === currentDeptId)) {
                    return { ...prev, department: "" };
                }
                return prev;
            });
        } else if (!formData.company) {
            setFilteredDepartments([]);
        }
    }, [formData.company, departments, departmentsLoaded]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setSubmitError(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitError(null);
        setSubmitting(true);

        try {
            const payload = {
                employee_name: formData.employee_name,
                employee_email: formData.employee_email,
                phone_number: formData.phone_number,
                address: formData.address,
                company: parseInt(formData.company),
                department: parseInt(formData.department),
                status: formData.status,
                designation: formData.designation,
            };

            const response = await HttpClient.patch(`management/employees/update/${id}/`, payload);

            if (response.data.success) {
                router.push(`/dashboard/employees/${id}`);
            } else {
                const errorMsg = 
                    typeof response.data.errors === 'object' 
                        ? JSON.stringify(response.data.errors)
                        : response.data.message || "Failed to update employee";
                setSubmitError(errorMsg);
            }
        } catch {
            setSubmitError("An unexpected error occurred. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <Error message={error} />;
    }

    if (!employee) {
        return <Error message="Employee not found" />;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Edit Employee</h1>
                <p className="text-gray-600 mt-1">Update employee information</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                {submitError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{submitError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {/* Employee Name */}
                        <div>
                            <label htmlFor="employee_name" className="block text-sm font-medium text-gray-700 mb-2">
                                Employee Name *
                            </label>
                            <input
                                type="text"
                                id="employee_name"
                                name="employee_name"
                                value={formData.employee_name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                required
                            />
                        </div>

                        {/* Employee Email */}
                        <div>
                            <label htmlFor="employee_email" className="block text-sm font-medium text-gray-700 mb-2">
                                Employee Email *
                            </label>
                            <input
                                type="email"
                                id="employee_email"
                                name="employee_email"
                                value={formData.employee_email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                required
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                id="phone_number"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                required
                            />
                        </div>

                        {/* Designation */}
                        <div>
                            <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-2">
                                Designation *
                            </label>
                            <input
                                type="text"
                                id="designation"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                required
                            />
                        </div>

                        {/* Company */}
                        <div>
                            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                                Company *
                            </label>
                            <select
                                id="company"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                required
                            >
                                <option value="">Select Company</option>
                                {companies.map((company) => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Department */}
                        <div>
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                                Department *
                            </label>
                            <select
                                id="department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                required
                                disabled={!formData.company}
                            >
                                <option value="">
                                    {formData.company ? "Select Department" : "Select Company First"}
                                </option>
                                {filteredDepartments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                Status *
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                required
                            >
                                {EMPLOYEE_STATUSES.map((status) => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                            Address *
                        </label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            required
                        />
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end gap-4 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Updating..." : "Update Employee"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
