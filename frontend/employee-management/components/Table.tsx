import React from 'react';

export interface Column<T = Record<string, unknown>> {
    key: string;
    header: string;
    render?: (value: unknown, row: T, index: number) => React.ReactNode;
    className?: string;
    headerClassName?: string;
}

export interface TableAction<T = Record<string, unknown>> {
    label: string;
    onClick: (row: T, index: number) => void;
    className?: string;
    variant?: 'primary' | 'secondary' | 'danger';
}

interface TableProps<T = Record<string, unknown>> {
    columns: Column<T>[];
    data: T[];
    className?: string;
    emptyMessage?: string;
    loading?: boolean;
    actions?: TableAction<T>[];
    actionsHeader?: string;
}

export default function Table<T = Record<string, unknown>>({
    columns,
    data,
    className = "",
    emptyMessage = "No data available",
    loading = false,
    actions = [],
    actionsHeader = "Actions",
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
                        {actions.length > 0 && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200">
                                {actionsHeader}
                            </th>
                        )}
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
                            {actions.length > 0 && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="flex items-center gap-2">
                                        {actions.map((action, actionIndex) => {
                                            const getButtonClass = () => {
                                                const baseClass = "px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer";
                                                const variantClass = 
                                                    action.variant === 'danger' 
                                                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                                                        : action.variant === 'secondary'
                                                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                        : "bg-blue-100 text-blue-700 hover:bg-blue-200";
                                                return `${baseClass} ${variantClass} ${action.className || ""}`;
                                            };
                                            
                                            return (
                                                <button
                                                    key={actionIndex}
                                                    onClick={() => action.onClick(row, rowIndex)}
                                                    className={getButtonClass()}
                                                >
                                                    {action.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
