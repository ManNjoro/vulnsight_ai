import { Chip } from '@mui/material';

const statusMap: Record<string, {label: string; color: 'error' | 'success' | 'warning' | 'secondary'}> = {
  0: { label: 'Safe', color: 'success' },
  1: { label: 'Vulnerable', color: 'error' },
}

const StatusBadge = ({status}: {status: string}) => {
    const statusInfo = statusMap[status] || {label: 'Unknown', color: 'secondary'};
  return (
    <Chip color={statusInfo.color} label={statusInfo.label} size='small' />
  )
}

export default StatusBadge