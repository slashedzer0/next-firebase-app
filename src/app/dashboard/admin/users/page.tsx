"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Copy, Trash2, Loader2 } from "lucide-react";
import { usePagination } from "@/stores/use-pagination";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/services/firebase";
import { deleteUserData } from "@/utils/delete-user";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { doc, getDoc } from "firebase/firestore";

interface UserData {
  id: string;
  fullName: string;
  status: string;
  nim?: string;
  phone?: string;
  email: string;
}

function StatusBadge({ status }: { status: string }) {
  return status === "active" ? (
    <Badge className="bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60 shadow-none rounded-full">
      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2" /> Active
    </Badge>
  ) : (
    <Badge className="bg-red-600/10 dark:bg-red-600/20 hover:bg-red-600/10 text-red-500 border-red-600/60 shadow-none rounded-full">
      <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2" /> Inactive
    </Badge>
  );
}

export default function AdminDashboardUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentPage, itemsPerPage, setCurrentPage } = usePagination();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<{
    id: string;
    fullName: string;
    email: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);

        // Get student users from Firestore
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("role", "==", "student"));
        const querySnapshot = await getDocs(q);

        const userData: UserData[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          userData.push({
            id: doc.id,
            fullName: data.fullName || "",
            status: data.status || "active",
            nim: data.nim || "",
            phone: data.phone || "",
            email: data.email || "",
          });
        });

        setUsers(userData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const totalPages = Math.ceil(users.length / itemsPerPage);

  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Format name as "First L."
  const formatName = (fullName: string) => {
    const parts = fullName.split(" ");
    if (parts.length <= 1) return fullName;

    const firstName = parts[0];
    const lastName = parts[parts.length - 1];
    return `${firstName} ${lastName.charAt(0)}.`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Copied to clipboard: ${text}`);
  };

  // Function to handle clicking the delete button
  const handleDeleteClick = async (userId: string) => {
    try {
      // Get full user data before showing dialog
      const userDoc = await getDoc(doc(db, "users", userId));

      if (!userDoc.exists()) {
        alert("User not found");
        return;
      }

      const userData = userDoc.data();

      setDeletingUser({
        id: userId,
        fullName: userData.fullName || "Unknown User",
        email: userData.email || "No email",
      });
      setDeleteDialogOpen(true);
    } catch (error) {
      console.error("Error preparing user deletion:", error);
      alert("Could not prepare user for deletion");
    }
  };

  // Function to handle confirming deletion
  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;

    setIsDeleting(true);
    try {
      // Delete all user data and auth account
      await deleteUserData(deletingUser.id);

      // Update UI by filtering out the deleted user
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== deletingUser.id)
      );

      // Success message
      alert(
        `User ${deletingUser.fullName} has been successfully deleted from the system.`
      );
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(
        `Failed to delete user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setDeleteDialogOpen(false);
      setDeletingUser(null);
      setIsDeleting(false);
    }
  };

  // Function to handle canceling deletion
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeletingUser(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Users</h1>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <Card className="bg-background">
          <CardHeader></CardHeader>
          <CardContent>
            <div className="grid w-full md:block">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="[&>*]:whitespace-nowrap">
                      <TableHead className="pl-4 sticky left-0 bg-background min-w-[100px]">
                        Name
                      </TableHead>
                      <TableHead className="sticky left-[100px] bg-background">
                        Status
                      </TableHead>
                      <TableHead className="text-right">NIM</TableHead>
                      <TableHead className="text-right">Phone</TableHead>
                      <TableHead className="text-right">Email</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        className="group [&>td]:whitespace-nowrap"
                      >
                        <TableCell className="pl-4 sticky left-0 bg-background font-medium">
                          {formatName(user.fullName)}
                        </TableCell>
                        <TableCell className="sticky left-[100px] bg-background font-medium">
                          <StatusBadge status={user.status} />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {user.nim || ""}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {user.phone || ""}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {user.email}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => copyToClipboard(user.email)}
                              title="Copy email address"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleDeleteClick(user.id)}
                              title="Delete user account permanently"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>

        {users.length > 0 && (
          <Pagination className="w-full max-w-xs mx-auto p-4">
            <PaginationContent className="w-full justify-between">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  className={`border ${
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  aria-disabled={currentPage === 1}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="text-xs text-muted-foreground">
                  Page {currentPage} of {totalPages || 1}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  className={`border ${
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      setCurrentPage(currentPage + 1);
                  }}
                  aria-disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* Delete User Account Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-semibold">
                {deletingUser?.fullName}&apos;
              </span>
              s account from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <div className="flex justify-end gap-2 w-full">
              <Button
                variant="outline"
                onClick={handleDeleteCancel}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Account"
                )}
              </Button>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
