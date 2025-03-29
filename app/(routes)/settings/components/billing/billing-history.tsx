"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
    Download,
    ChevronDown,
    ChevronUp,
    Search,
    FileText,
    CheckCircle2,
    AlertCircle,
    Clock
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

type Invoice = {
    id: string;
    date: Date;
    amount: number;
    status: "paid" | "pending" | "failed";
    description: string;
};

export function BillingHistory() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Sample invoice data
    const allInvoices: Invoice[] = [
        {
            id: "INV-001",
            date: new Date(2025, 3, 15),
            amount: 49.99,
            status: "paid",
            description: "Business Pro Plan - Monthly Subscription"
        },
        {
            id: "INV-002",
            date: new Date(2025, 2, 15),
            amount: 49.99,
            status: "paid",
            description: "Business Pro Plan - Monthly Subscription"
        },
        {
            id: "INV-003",
            date: new Date(2025, 1, 15),
            amount: 49.99,
            status: "paid",
            description: "Business Pro Plan - Monthly Subscription"
        },
        {
            id: "INV-004",
            date: new Date(2025, 0, 15),
            amount: 49.99,
            status: "paid",
            description: "Business Pro Plan - Monthly Subscription"
        },
        {
            id: "INV-005",
            date: new Date(2024, 11, 15),
            amount: 49.99,
            status: "paid",
            description: "Business Pro Plan - Monthly Subscription"
        },
        {
            id: "INV-006",
            date: new Date(2024, 10, 15),
            amount: 49.99,
            status: "paid",
            description: "Business Pro Plan - Monthly Subscription"
        },
        {
            id: "INV-007",
            date: new Date(2024, 9, 15),
            amount: 49.99,
            status: "paid",
            description: "Business Pro Plan - Monthly Subscription"
        },
        {
            id: "INV-008",
            date: new Date(2024, 8, 15),
            amount: 49.99,
            status: "paid",
            description: "Business Pro Plan - Monthly Subscription"
        },
        {
            id: "INV-009",
            date: new Date(2024, 7, 15),
            amount: 49.99,
            status: "paid",
            description: "Business Pro Plan - Monthly Subscription"
        },
        {
            id: "INV-010",
            date: new Date(2024, 6, 15),
            amount: 49.99,
            status: "paid",
            description: "Business Pro Plan - Monthly Subscription"
        },
        {
            id: "INV-011",
            date: new Date(2024, 5, 15),
            amount: 49.99,
            status: "paid",
            description: "Business Pro Plan - Monthly Subscription"
        },
        {
            id: "INV-012",
            date: new Date(2024, 4, 15),
            amount: 49.99,
            status: "pending",
            description: "Business Pro Plan - Monthly Subscription"
        },
        {
            id: "INV-013",
            date: new Date(2024, 3, 15),
            amount: 49.99,
            status: "failed",
            description: "Business Pro Plan - Monthly Subscription"
        }
    ];

    // Filter and sort invoices
    const filteredInvoices = allInvoices
        .filter(invoice => {
            const matchesSearch =
                invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                invoice.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus =
                statusFilter === "all" ||
                invoice.status === statusFilter;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (sortDirection === "asc") {
                return a.date.getTime() - b.date.getTime();
            } else {
                return b.date.getTime() - a.date.getTime();
            }
        });

    // Paginate invoices
    const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
    const paginatedInvoices = filteredInvoices.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const toggleSortDirection = () => {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "paid":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Paid
                    </Badge>
                );
            case "pending":
                return (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400">
                        <Clock className="mr-1 h-3 w-3" />
                        Pending
                    </Badge>
                );
            case "failed":
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Failed
                    </Badge>
                );
            default:
                return null;
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <CardTitle>Billing History</CardTitle>
                        <CardDescription>
                            View and download your past invoices and payment receipts
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search invoices..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1); // Reset to first page on search
                                    }}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select
                                    value={statusFilter}
                                    onValueChange={(value) => {
                                        setStatusFilter(value);
                                        setCurrentPage(1); // Reset to first page on filter change
                                    }}
                                >
                                    <SelectTrigger className="w-[130px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="paid">Paid</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="failed">Failed</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" onClick={toggleSortDirection}>
                                    Date {sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        {filteredInvoices.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="text-lg font-medium">No invoices found</h3>
                                <p className="text-muted-foreground">
                                    {searchQuery || statusFilter !== "all"
                                        ? "Try adjusting your search or filter criteria"
                                        : "You don't have any invoices yet"}
                                </p>
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Invoice</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedInvoices.map((invoice) => (
                                            <TableRow key={invoice.id}>
                                                <TableCell className="font-medium">{invoice.id}</TableCell>
                                                <TableCell>{format(invoice.date, "MMM d, yyyy")}</TableCell>
                                                <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                                                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm">
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Download
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        {filteredInvoices.length > 0 && (
                            <div className="mt-6">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                            />
                                        </PaginationItem>

                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNumber;

                                            // Logic to show appropriate page numbers
                                            if (totalPages <= 5) {
                                                pageNumber = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNumber = i + 1;
                                                if (i === 4) return (
                                                    <PaginationItem key={i}>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                );
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNumber = totalPages - 4 + i;
                                                if (i === 0) return (
                                                    <PaginationItem key={i}>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                );
                                            } else {
                                                if (i === 0) return (
                                                    <PaginationItem key={i}>
                                                        <PaginationLink onClick={() => setCurrentPage(1)}>
                                                            1
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                );
                                                if (i === 1) return (
                                                    <PaginationItem key={i}>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                );
                                                if (i === 3) return (
                                                    <PaginationItem key={i}>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                );
                                                if (i === 4) return (
                                                    <PaginationItem key={i}>
                                                        <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                                                            {totalPages}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                );
                                                pageNumber = currentPage + i - 2;
                                            }

                                            return (
                                                <PaginationItem key={i}>
                                                    <PaginationLink
                                                        onClick={() => setCurrentPage(pageNumber)}
                                                        isActive={currentPage === pageNumber}
                                                    >
                                                        {pageNumber}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        })}

                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}