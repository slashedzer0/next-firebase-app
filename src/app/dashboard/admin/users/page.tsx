'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Copy, Trash2 } from 'lucide-react';
import { Spinner } from '@/components/spinner';
import { usePaginationWithReset } from '@/stores/use-pagination-store';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { deleteUserData, handleError, toast } from '@/utils';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { doc, getDoc } from 'firebase/firestore';
import { AdminUserData } from '@/types/admin';

function StatusBadge({ status }: { status: string }) {
  const t = useTranslations('DashboardAdminPage');
  return status === 'active' ? (
    <Badge className="bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60 shadow-none rounded-full">
      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2" /> {t('active') || 'Active'}
    </Badge>
  ) : (
    <Badge className="bg-red-600/10 dark:bg-red-600/20 hover:bg-red-600/10 text-red-500 border-red-600/60 shadow-none rounded-full">
      <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2" /> {t('inactive') || 'Inactive'}
    </Badge>
  );
}

export default function AdminDashboardUsersPage() {
  const t = useTranslations('DashboardAdminPage');
  const [users, setUsers] = useState<AdminUserData[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentPage, itemsPerPage, setCurrentPage } = usePaginationWithReset();
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
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('role', '==', 'student'));
        const querySnapshot = await getDocs(q);

        const userData: AdminUserData[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          userData.push({
            id: doc.id,
            fullName: data.fullName || '',
            status: data.status || 'active',
            nim: data.nim || '',
            phone: data.phone || '',
            email: data.email || '',
          });
        });

        setUsers(userData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatName = (fullName: string) => {
    const parts = fullName.split(' ');
    if (parts.length <= 1) return fullName;

    const firstName = parts[0];
    const lastName = parts[parts.length - 1];
    return `${firstName} ${lastName.charAt(0)}.`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(t('emailCopied'));
      })
      .catch((error) => {
        handleError(error, t('failedCopy'));
      });
  };

  const handleDeleteClick = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));

      if (!userDoc.exists()) {
        toast.error(t('userNotFound'));
        return;
      }

      const userData = userDoc.data();

      setDeletingUser({
        id: userId,
        fullName: userData.fullName || 'Unknown User',
        email: userData.email || 'No email',
      });
      setDeleteDialogOpen(true);
    } catch (error) {
      handleError(error, t('errorLoadingData'));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;

    setIsDeleting(true);
    try {
      await deleteUserData(deletingUser.id);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== deletingUser.id));

      toast.success(t('userDeleted', { name: deletingUser.fullName }));
    } catch (error) {
      handleError(error, t('failedDeleteUser', { name: deletingUser.fullName }));
    } finally {
      setDeleteDialogOpen(false);
      setDeletingUser(null);
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeletingUser(null);
  };

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">{t('users')}</h1>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <Card className="bg-background">
          <CardHeader></CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <Spinner className="h-8 w-8 text-muted-foreground" />
              </div>
            ) : (
              <div className="grid w-full md:block">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="[&>*]:whitespace-nowrap">
                        <TableHead className="pl-4 sticky left-0 bg-background min-w-[100px]">
                          {t('name')}
                        </TableHead>
                        <TableHead className="sticky left-[100px] bg-background">
                          {t('status')}
                        </TableHead>
                        <TableHead className="text-right">{t('nim')}</TableHead>
                        <TableHead className="text-right">{t('phone')}</TableHead>
                        <TableHead className="text-right">{t('email')}</TableHead>
                        <TableHead className="text-right">{t('actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedUsers.map((user) => (
                        <TableRow key={user.id} className="group [&>td]:whitespace-nowrap">
                          <TableCell className="pl-4 sticky left-0 bg-background font-medium">
                            {formatName(user.fullName)}
                          </TableCell>
                          <TableCell className="sticky left-[100px] bg-background font-medium">
                            <StatusBadge status={user.status} />
                          </TableCell>
                          <TableCell className="text-right font-medium">{user.nim || ''}</TableCell>
                          <TableCell className="text-right font-medium">
                            {user.phone || ''}
                          </TableCell>
                          <TableCell className="text-right font-medium">{user.email}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
                                onClick={() => copyToClipboard(user.email)}
                                title={t('copyEmail')}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 text-destructive"
                                onClick={() => handleDeleteClick(user.id)}
                                title={t('deleteUser')}
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
            )}
          </CardContent>
          <CardFooter></CardFooter>
        </Card>

        {users.length > 0 && (
          <Pagination className="w-full max-w-xs mx-auto p-4">
            <PaginationContent className="w-full justify-between">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  className={`border ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  aria-disabled={currentPage === 1}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="text-xs text-muted-foreground">
                  {t('pageOf', { current: currentPage, total: totalPages || 1 })}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  className={`border ${
                    currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                  aria-disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('areYouSure')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('cannotBeUndone', { name: deletingUser?.fullName ?? '' })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <div className="flex justify-center md:justify-end gap-2 w-full">
                <Button variant="outline" onClick={handleDeleteCancel} disabled={isDeleting}>
                  {t('cancel')}
                </Button>
                <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      {t('deleting')}
                    </>
                  ) : (
                    t('deleteAccount')
                  )}
                </Button>
              </div>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
