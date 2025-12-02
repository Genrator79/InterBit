import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { MailIcon, TrashIcon, UserIcon, ShieldIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import axios from "@/utils/axios";

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("/"); // Assuming this hits /api/ (userRoutes) which has getAllUsers
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async (id: number) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        setDeletingId(id);
        try {
            const response = await axios.delete(`/${id}`);
            if (response.data.success) {
                toast.success("User deleted successfully");
                setUsers(users.filter((user) => user.id !== id));
            }
        } catch (error: any) {
            console.error("Error deleting user:", error);
            toast.error(error.response?.data?.message || "Failed to delete user");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <Card className="mb-12">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserIcon className="size-5 text-primary" />
                    User Management
                </CardTitle>
                <CardDescription>Manage registered users</CardDescription>
            </CardHeader>

            <CardContent>
                <div className="space-y-4">
                    {isLoading ? (
                        <div>Loading users...</div>
                    ) : (
                        users.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <UserIcon className="size-5 text-primary" />
                                    </div>

                                    <div>
                                        <div className="font-semibold flex items-center gap-2">
                                            {user.username}
                                            <Badge variant={user.role === 'ADMIN' ? 'default' : 'outline'} className="text-[10px] h-5">
                                                {user.role}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                            <MailIcon className="h-3 w-3" />
                                            {user.email}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        className="h-8 px-3"
                                        onClick={() => handleDeleteUser(user.id)}
                                        disabled={deletingId === user.id || user.role === 'ADMIN'} // Prevent deleting admins if needed
                                    >
                                        <TrashIcon className="size-4 mr-1" />
                                        {deletingId === user.id ? "..." : "Delete"}
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default UserManagement;
