"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Trash2, Plus, AlertCircle, Loader2, Croissant as Visa, CreditCard as CreditCardIcon, ClipboardPaste as Mastercard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";

const paymentMethodSchema = z.object({
    cardNumber: z.string().min(16, "Card number must be 16 digits").max(19, "Card number must be at most 19 digits"),
    cardholderName: z.string().min(2, "Cardholder name is required"),
    expiryMonth: z.string().min(1, "Expiry month is required"),
    expiryYear: z.string().min(1, "Expiry year is required"),
    cvv: z.string().min(3, "CVV must be 3 or 4 digits").max(4, "CVV must be 3 or 4 digits"),
    isDefault: z.boolean().default(false),
});

type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;

export function PaymentMethods() {
    const [paymentMethods, setPaymentMethods] = useState([
        {
            id: "1",
            type: "visa",
            last4: "4242",
            expiryMonth: "12",
            expiryYear: "2025",
            isDefault: true,
            cardholderName: "Jane Doe"
        },
        {
            id: "2",
            type: "mastercard",
            last4: "5678",
            expiryMonth: "09",
            expiryYear: "2024",
            isDefault: false,
            cardholderName: "Jane Doe"
        }
    ]);

    const [isAddingCard, setIsAddingCard] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [cardToDelete, setCardToDelete] = useState<string | null>(null);

    const form = useForm<PaymentMethodFormValues>({
        resolver: zodResolver(paymentMethodSchema),
        defaultValues: {
            cardNumber: "",
            cardholderName: "",
            expiryMonth: "",
            expiryYear: "",
            cvv: "",
            isDefault: false,
        },
    });

    function onSubmit(data: PaymentMethodFormValues) {
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            const newCard = {
                id: Math.random().toString(36).substring(2, 9),
                type: data.cardNumber.startsWith("4") ? "visa" : "mastercard",
                last4: data.cardNumber.slice(-4),
                expiryMonth: data.expiryMonth,
                expiryYear: data.expiryYear,
                isDefault: data.isDefault,
                cardholderName: data.cardholderName
            };

            let updatedMethods = [...paymentMethods];

            if (data.isDefault) {
                updatedMethods = updatedMethods.map(method => ({
                    ...method,
                    isDefault: false
                }));
            }

            setPaymentMethods([...updatedMethods, newCard]);
            setIsLoading(false);
            setIsAddingCard(false);
            form.reset();
            toast.success("Payment method added successfully");
        }, 1500);
    }

    function handleDeleteCard(id: string) {
        setCardToDelete(id);
        setIsDeleteDialogOpen(true);
    }

    function confirmDeleteCard() {
        if (!cardToDelete) return;

        setPaymentMethods(paymentMethods.filter(method => method.id !== cardToDelete));
        setIsDeleteDialogOpen(false);
        setCardToDelete(null);
        toast.success("Payment method removed");
    }

    function setDefaultCard(id: string) {
        setPaymentMethods(paymentMethods.map(method => ({
            ...method,
            isDefault: method.id === id
        })));
        toast.success("Default payment method updated");
    }

    const getCardIcon = (type: string) => {
        switch (type) {
            case "visa":
                return <Visa className="h-6 w-6 text-blue-600" />;
            case "mastercard":
                return <Mastercard className="h-6 w-6 text-orange-600" />;
            default:
                return <CreditCardIcon className="h-6 w-6" />;
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
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Payment Methods</h2>
                        <p className="text-muted-foreground">Manage your payment methods and billing preferences</p>
                    </div>
                    <Button onClick={() => setIsAddingCard(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Payment Method
                    </Button>
                </div>
            </motion.div>

            {paymentMethods.length === 0 ? (
                <motion.div variants={itemVariants}>
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <CreditCardIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="text-lg font-medium">No payment methods</h3>
                            <p className="mb-4 text-center text-muted-foreground">
                                You haven&apos;t added any payment methods yet.
                            </p>
                            <Button onClick={() => setIsAddingCard(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Payment Method
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            ) : (
                <motion.div variants={itemVariants}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Payment Methods</CardTitle>
                            <CardDescription>
                                Your payment methods are securely stored for future transactions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup defaultValue={paymentMethods.find(m => m.isDefault)?.id}>
                                {paymentMethods.map((method, index) => (
                                    <div key={method.id}>
                                        {index > 0 && <Separator className="my-4" />}
                                        <div className="flex items-center justify-between py-2">
                                            <div className="flex items-center space-x-4">
                                                <RadioGroupItem
                                                    value={method.id}
                                                    id={`card-${method.id}`}
                                                    checked={method.isDefault}
                                                    onClick={() => setDefaultCard(method.id)}
                                                />
                                                <div className="flex items-center gap-3">
                                                    {getCardIcon(method.type)}
                                                    <div>
                                                        <Label
                                                            htmlFor={`card-${method.id}`}
                                                            className="font-medium"
                                                        >
                                                            {method.type.charAt(0).toUpperCase() + method.type.slice(1)} ending in {method.last4}
                                                            {method.isDefault && (
                                                                <Badge variant="outline" className="ml-2 bg-primary/10 text-xs font-normal text-primary">
                                                                    Default
                                                                </Badge>
                                                            )}
                                                        </Label>
                                                        <div className="text-sm text-muted-foreground">
                                                            Expires {method.expiryMonth}/{method.expiryYear}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {!method.isDefault && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteCard(method.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                                                        <span className="sr-only">Delete card</span>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </RadioGroup>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <CardTitle>Billing Address</CardTitle>
                        <CardDescription>
                            This address will be used for your invoices and tax documents
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            <p className="font-medium">Jane Doe</p>
                            <p className="text-muted-foreground">123 Main Street</p>
                            <p className="text-muted-foreground">Apt 4B</p>
                            <p className="text-muted-foreground">San Francisco, CA 94103</p>
                            <p className="text-muted-foreground">United States</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline">Edit Address</Button>
                    </CardFooter>
                </Card>
            </motion.div>

            {/* Add Payment Method Dialog */}
            <Dialog open={isAddingCard} onOpenChange={setIsAddingCard}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add Payment Method</DialogTitle>
                        <DialogDescription>
                            Add a new credit or debit card to your account.
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="cardNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Card Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="1234 5678 9012 3456"
                                                {...field}
                                                onChange={(e) => {
                                                    // Only allow numbers and spaces
                                                    const value = e.target.value.replace(/[^\d\s]/g, '');
                                                    field.onChange(value);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="cardholderName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cardholder Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="expiryMonth"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Expiry Month</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="MM" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Array.from({ length: 12 }, (_, i) => {
                                                        const month = (i + 1).toString().padStart(2, '0');
                                                        return (
                                                            <SelectItem key={month} value={month}>
                                                                {month}
                                                            </SelectItem>
                                                        );
                                                    })}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="expiryYear"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Expiry Year</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="YYYY" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Array.from({ length: 10 }, (_, i) => {
                                                        const year = (new Date().getFullYear() + i).toString();
                                                        return (
                                                            <SelectItem key={year} value={year}>
                                                                {year}
                                                            </SelectItem>
                                                        );
                                                    })}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="cvv"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CVV</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="123"
                                                    {...field}
                                                    onChange={(e) => {
                                                        // Only allow numbers
                                                        const value = e.target.value.replace(/[^\d]/g, '');
                                                        field.onChange(value);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="isDefault"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Set as default payment method</FormLabel>
                                            <FormDescription>
                                                This will be used as your default payment method for all subscriptions.
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddingCard(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Add Payment Method
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Remove Payment Method</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove this payment method? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center gap-4 py-4">
                        <AlertCircle className="h-10 w-10 text-destructive" />
                        <div>
                            <p className="font-medium">This will permanently remove the card</p>
                            <p className="text-sm text-muted-foreground">
                                Any subscriptions using this payment method will need to be updated.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteCard}>
                            Remove
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}

