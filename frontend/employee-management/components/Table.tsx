import React from 'react';

export interface Column<T = Record<string, unknown>> {
    key: string;
    header: string;
    render?: (value: unknown, row: T, index: number) => React.ReactNode;
    className?: string;
    headerClassName?: string;
}

interface TableProps<T = Record<string, unknown>> {
    columns: Column<T>[];
    data: T[];
    className?: string;
    emptyMessage?: string;
    loading?: boolean;
}

export default function Table<T = Record<string, unknown>>({
    columns,
    data,
    className = "",
    emptyMessage = "No data available",
    loading = false,
}: TableProps<T>) {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className={`overflow-x-auto rounded-lg border border-gray-200 ${className}`}>
            <table className="w-full border-collapse bg-white">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className={`px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200 ${
                                    column.headerClassName || ""
                                }`}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="hover:bg-gray-50 transition-colors"
                        >
                            {columns.map((column) => {
                                const value = (row as Record<string, unknown>)[column.key];
                                return (
                                    <td
                                        key={column.key}
                                        className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
                                            column.className || ""
                                        }`}
                                    >
                                        {column.render
                                            ? column.render(value, row, rowIndex)
                                            : (value !== null && value !== undefined ? String(value) : "-")}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
