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

interface PaginationInfo {
    count: number;
    next: string | null;
    previous: string | null;
    currentPage?: number;
    totalPages?: number;
}

interface TableProps<T = Record<string, unknown>> {
    columns: Column<T>[];
    data: T[];
    className?: string;
    emptyMessage?: string;
    loading?: boolean;
    actions?: TableAction<T>[];
    actionsHeader?: string;
    pagination?: PaginationInfo;
    onPageChange?: (page: number) => void;
}

export default function Table<T = Record<string, unknown>>({
    columns,
    data,
    className = "",
    emptyMessage = "No data available",
    loading = false,
    actions = [],
    actionsHeader = "Actions",
    pagination,
    onPageChange,
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

    const pageSize = 10;
    const totalPages = pagination ? Math.ceil(pagination.count / pageSize) : 0;
    let currentPage = pagination?.currentPage;
    
    if (pagination && !currentPage) {
        if (pagination.previous) {
            try {
                const url = new URL(pagination.previous);
                const prevPage = url.searchParams.get('page');
                currentPage = prevPage ? parseInt(prevPage) + 1 : 1;
            } catch {
                currentPage = 1;
            }
        } else if (pagination.next) {
            try {
                const url = new URL(pagination.next);
                const nextPage = url.searchParams.get('page');
                currentPage = nextPage ? parseInt(nextPage) - 1 : 1;
            } catch {
                currentPage = 1;
            }
        } else {
            currentPage = pagination.count > 0 ? 1 : 0;
        }
    }

    return (
        <div className={`rounded-lg border border-gray-200 w-full ${className}`}>
            <div className="overflow-x-auto">
                <table className="border-collapse bg-white" style={{ width: '100%', minWidth: 'max-content' }}>
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
            {pagination && pagination.count > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Showing <span className="font-medium">{data.length}</span> of{' '}
                        <span className="font-medium">{pagination.count}</span> results
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                if (pagination.previous && onPageChange && currentPage) {
                                    onPageChange(currentPage - 1);
                                }
                            }}
                            disabled={!pagination.previous}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                pagination.previous
                                    ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 cursor-pointer'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            Previous
                        </button>
                        <div className="flex items-center gap-1">
                            {currentPage && totalPages > 0 && (() => {
                                const pages = [];
                                
                                // Show first page
                                if (currentPage > 2) {
                                    pages.push(1);
                                    if (currentPage > 3) pages.push('ellipsis-start');
                                }
                                
                                // Show pages around current page
                                for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
                                    pages.push(i);
                                }
                                
                                // Show last page
                                if (currentPage < totalPages - 1) {
                                    if (currentPage < totalPages - 2) pages.push('ellipsis-end');
                                    pages.push(totalPages);
                                }
                                
                                return pages.map((page, idx) => {
                                    if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                                        return (
                                            <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">
                                                ...
                                            </span>
                                        );
                                    }
                                    const pageNum = page as number;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => onPageChange && onPageChange(pageNum)}
                                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                                pageNum === currentPage
                                                    ? 'bg-blue-600 text-white cursor-pointer'
                                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 cursor-pointer'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                });
                            })()}
                        </div>
                        <button
                            onClick={() => {
                                if (pagination.next && onPageChange && currentPage) {
                                    onPageChange(currentPage + 1);
                                }
                            }}
                            disabled={!pagination.next}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                pagination.next
                                    ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 cursor-pointer'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
