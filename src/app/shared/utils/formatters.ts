export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '--';
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) {
    return '--';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(value));
}

export function translateBudgetRequestStatus(status: string | null | undefined): string {
  switch (status) {
    case 'OPEN':
      return 'Aberto';
    case 'SENT_TO_VENDORS':
      return 'Enviado aos fornecedores';
    case 'WAITING_QUOTES':
      return 'Aguardando cotacoes';
    case 'CLOSED':
      return 'Fechado';
    default:
      return status || '--';
  }
}

export function getBudgetRequestStatusClass(status: string | null | undefined): string {
  switch (status) {
    case 'OPEN':
      return 'status-open';
    case 'SENT_TO_VENDORS':
      return 'status-sent';
    case 'WAITING_QUOTES':
      return 'status-waiting';
    case 'CLOSED':
      return 'status-closed';
    default:
      return 'status-default';
  }
}

export function translateBudgetRequestVendorStatus(status: string | null | undefined): string {
  switch (status) {
    case 'SENT':
      return 'Enviado';
    case 'VIEWED':
      return 'Visualizado';
    case 'RESPONDED':
      return 'Respondeu';
    case 'DECLINED':
      return 'Recusado';
    default:
      return status || '--';
  }
}

export function getBudgetRequestVendorStatusClass(status: string | null | undefined): string {
  switch (status) {
    case 'SENT':
      return 'vendor-status-sent';
    case 'VIEWED':
      return 'vendor-status-viewed';
    case 'RESPONDED':
      return 'vendor-status-responded';
    case 'DECLINED':
      return 'vendor-status-declined';
    default:
      return 'vendor-status-default';
  }
}
