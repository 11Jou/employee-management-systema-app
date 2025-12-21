import Table, { Column } from '@/components/Table';

interface Employee {
    id: number;
    name: string;
    email: string;
    phone: string;
    status: string;
}

const columns: Column<Employee>[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { 
        key: 'status', 
        header: 'Status',
        render: (value) => (
            <span className={`px-2 py-1 rounded ${
                value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
                {String(value)}
            </span>
        )
    },
];

const data: Employee[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321', status: 'inactive' },
];

export default function EmployeesIndex() {
    return <Table columns={columns} data={data} />;
}