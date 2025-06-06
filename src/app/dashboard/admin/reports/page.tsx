'use client';

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Info, Trash2 } from 'lucide-react';
import { Spinner } from '@/components/spinner';
import { usePaginationWithReset } from '@/stores/use-pagination-store';
import { collection, query, getDocs, limit, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { toast } from '@/utils';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ReportData, UserDetails } from '@/types/admin';
import { handleError } from '@/utils';

function LevelBadge({ level }: { level: string }) {
  // Convert to capitalized format for badge display
  const formattedLevel = level.charAt(0).toUpperCase() + level.slice(1);

  switch (formattedLevel) {
    case 'Mild':
      return (
        <Badge className="bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60 shadow-none rounded-full">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2" /> {formattedLevel}
        </Badge>
      );
    case 'Moderate':
      return (
        <Badge className="bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/10 text-amber-500 border-amber-600/60 shadow-none rounded-full">
          <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2" /> {formattedLevel}
        </Badge>
      );
    case 'Severe':
      return (
        <Badge className="bg-red-600/10 dark:bg-red-600/20 hover:bg-red-600/10 text-red-500 border-red-600/60 shadow-none rounded-full">
          <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2" /> {formattedLevel}
        </Badge>
      );
    default:
      return null;
  }
}

import { useTranslations } from 'next-intl';

export default function AdminDashboardReportsPage() {
  const t = useTranslations('DashboardAdminPage');
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { currentPage, itemsPerPage, setCurrentPage } = usePaginationWithReset();

  // Add state for the dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingAssessment, setDeletingAssessment] = useState<{
    id: string;
    userName: string;
  } | null>(null);

  // Function to handle clicking the info button
  const handleInfoClick = async (userId: string) => {
    setLoadingUserDetails(true);
    setDialogOpen(true);

    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserDetails({
          email: userData.email || t('noData'),
          nim: userData.nim || t('noData'),
          phone: userData.phone || t('noData'),
        });
      } else {
        setUserDetails({
          email: t('userNotFound'),
          nim: t('userNotFound'),
          phone: t('userNotFound'),
        });
      }
    } catch (error) {
      handleError(error, t('errorLoadingData'), { showToast: false });
      setUserDetails({
        email: t('errorLoadingData'),
        nim: t('errorLoadingData'),
        phone: t('errorLoadingData'),
      });
    } finally {
      setLoadingUserDetails(false);
    }
  };

  // Function to handle clicking the delete button
  const handleDeleteClick = (id: string, userName: string) => {
    setDeletingAssessment({ id, userName });
    setDeleteDialogOpen(true);
  };

  // Function to handle confirming deletion
  const handleDeleteConfirm = async () => {
    if (!deletingAssessment) return;

    setIsDeleting(true);

    try {
      await deleteDoc(doc(db, 'assessments', deletingAssessment.id));

      // Update the UI by filtering out the deleted assessment
      setReports((prevReports) =>
        prevReports.filter((report) => report.id !== deletingAssessment.id)
      );

      // Success notification
      toast.success(t('assessmentDeleted'));

      // Reset state
      setDeleteDialogOpen(false);
      setDeletingAssessment(null);
      setIsDeleting(false);
    } catch (error) {
      handleError(error, t('failedDeleteAssessment'));
      setDeleteDialogOpen(false);
    }
  };

  // Function to handle canceling deletion
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeletingAssessment(null);
  };

  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true);

        // Fetch assessments from Firestore
        const assessmentsRef = collection(db, 'assessments');
        const assessmentsQuery = query(assessmentsRef, limit(100)); // Limit to avoid large queries
        const assessmentsSnapshot = await getDocs(assessmentsQuery);

        // Process assessments and fetch user data
        const reportPromises = assessmentsSnapshot.docs.map(async (assessmentDoc) => {
          const assessmentData = assessmentDoc.data();
          const userId = assessmentData.userId;

          // Get user data to display name
          let userName = 'Unknown User';
          try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              // Extract first name from full name
              const fullName = userData.fullName || '';
              userName = fullName.split(' ')[0] || 'Unknown';
            }
          } catch (error) {
            console.error(`Error fetching user data for ${userId}:`, error);
          }

          return {
            id: assessmentDoc.id,
            userId,
            userName,
            level: assessmentData.stressLevel,
            confidence: assessmentData.confidence,
            date: assessmentData.date || '',
          };
        });

        const reportData = await Promise.all(reportPromises);

        // Sort by date (most recent first)
        reportData.sort((a, b) => {
          // Convert DD-MM-YYYY to sortable format
          const dateA = a.date.split('-').reverse().join('-');
          const dateB = b.date.split('-').reverse().join('-');
          return dateB.localeCompare(dateA);
        });

        setReports(reportData);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  const totalPages = Math.ceil(reports.length / itemsPerPage);

  const paginatedReports = reports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">{t('scanReports')}</h1>
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
                          {t('level')}
                        </TableHead>
                        <TableHead className="text-right">{t('confidence')}</TableHead>
                        <TableHead className="text-right">{t('date')}</TableHead>
                        <TableHead className="text-right">{t('actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedReports.length > 0 ? (
                        paginatedReports.map((report) => (
                          <TableRow key={report.id} className="group [&>td]:whitespace-nowrap">
                            <TableCell className="pl-4 sticky left-0 bg-background font-medium">
                              {report.userName}
                            </TableCell>
                            <TableCell className="sticky left-[100px] bg-background font-medium">
                              <LevelBadge level={report.level} />
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {report.confidence}%
                            </TableCell>
                            <TableCell className="text-right font-medium">{report.date}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => handleInfoClick(report.userId)}
                                >
                                  <Info className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => handleDeleteClick(report.id, report.userName)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            {t('noAssessmentReports')}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter></CardFooter>
        </Card>

        {reports.length > 0 && (
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

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('areYouSure')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('deleteAssessmentRecord', { name: deletingAssessment?.userName ?? '' })}
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
                    t('delete')
                  )}
                </Button>
              </div>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* User Details Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('studentDetails')}</DialogTitle>
              <DialogDescription>{t('contactInfo')}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {loadingUserDetails ? (
                <div className="flex justify-center py-4">
                  <Spinner className="h-6 w-6 text-muted-foreground" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      {t('email')}
                    </Label>
                    <Input
                      id="email"
                      value={userDetails?.email || ''}
                      readOnly
                      className="col-span-3 bg-muted"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nim" className="text-right">
                      {t('nim')}
                    </Label>
                    <Input
                      id="nim"
                      value={userDetails?.nim || ''}
                      readOnly
                      className="col-span-3 bg-muted"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      {t('phone')}
                    </Label>
                    <Input
                      id="phone"
                      value={userDetails?.phone || ''}
                      readOnly
                      className="col-span-3 bg-muted"
                    />
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
