import EditForm from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  // Fetch both invoice and customers data in parallel
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);

  // If invoice not found, return 404
  if (!invoice) {
    notFound();
  }

  const breadcrumbs = [
    { label: 'Invoices', href: '/dashboard/invoices' },
    { label: 'Edit Invoice', href: `/dashboard/invoices/${id}/edit`, active: true },
  ];

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <EditForm invoice={invoice} customers={customers} />
    </>
  );
}