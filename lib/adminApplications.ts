import { api } from '@/lib/api';
import type { ApplicationSummary } from '@/lib/application';

// Each returns false if the admin cancels. Failures throw, for the page to show.

export async function sendBackToReview(application: ApplicationSummary): Promise<boolean> {
  const question = `Send the application from ${application.company} back to review? The customer sees it in review straight away.`;
  if (!window.confirm(question)) return false;
  await api(`/admin/applications/${application.id}/restore`, {});
  return true;
}

export async function deleteForever(application: ApplicationSummary): Promise<boolean> {
  const question = `Delete the application from ${application.company} for good? It is erased from the database and can’t be recovered.`;
  if (!window.confirm(question)) return false;
  await api(`/admin/applications/${application.id}/permanent`, undefined, 'DELETE');
  return true;
}
