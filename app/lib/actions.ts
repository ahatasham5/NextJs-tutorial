'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce.number({
    invalid_type_error: 'Please enter a valid amount.',
  }).gt(0, 'Amount must be greater than 0'),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
});

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

const CreateInvoice = FormSchema.omit({ id: true });

export async function createInvoice(prevState: State, formData: FormData): Promise<State> {
  // Extract and validate form data
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return error
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;

  // Convert amount to cents
  const amountInCents = amount * 100;

  // Create current date
  const date = new Date().toISOString().split('T')[0];

  try {
    // Insert invoice into database
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return error
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  // Revalidate the cache for the invoices page
  revalidatePath('/dashboard/invoices');

  // Redirect to the invoices page
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  // Temporary error throwing for testing (to be removed later)
  throw new Error('Database Error: Failed to Delete Invoice.');

  try {
    // Delete invoice from database
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch (error) {
    // If a database error occurs, throw an error
    throw new Error('Database Error: Failed to Delete Invoice.');
  }

  // Revalidate the cache for the invoices page
  revalidatePath('/dashboard/invoices');
}

const UpdateInvoice = FormSchema;

export async function updateInvoice(prevState: State, id: string, formData: FormData): Promise<State> {
  // Extract and validate form data
  const validatedFields = UpdateInvoice.safeParse({
    id: id,
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return error
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  // Prepare data for update in the database
  const { customerId, amount, status } = validatedFields.data;

  // Convert amount to cents
  const amountInCents = amount * 100;

  try {
    // Update invoice in database
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    // If a database error occurs, return error
    return {
      message: 'Database Error: Failed to Update Invoice.',
    };
  }

  // Revalidate the cache for the invoices page
  revalidatePath('/dashboard/invoices');

  // Redirect to the invoices page
  redirect('/dashboard/invoices');
}