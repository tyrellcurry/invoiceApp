const apiURL = process.env.E2E_API_URL ?? 'http://localhost:8080';

/** References seeded by the backend's migrations (backend/migrations/000002_seed_invoices.up.sql). */
export const SEED_REFERENCES = ['RT3080', 'XM9141', 'RG0314', 'FV2353', 'XA5478'];

interface ApiInvoice {
  id: string;
  reference: string;
}

/**
 * Sweeps any invoice left over from a previous (possibly interrupted) test
 * run, so every spec starts from the same 5 seeded invoices regardless of
 * what ran before it, without wiping and re-migrating the database.
 */
export default async function globalSetup(): Promise<void> {
  const response = await fetch(`${apiURL}/invoices`);
  const invoices = (await response.json()) as ApiInvoice[];

  const stray = invoices.filter((invoice) => !SEED_REFERENCES.includes(invoice.reference));
  await Promise.all(
    stray.map((invoice) => fetch(`${apiURL}/invoices/${invoice.id}`, { method: 'DELETE' }))
  );
}
