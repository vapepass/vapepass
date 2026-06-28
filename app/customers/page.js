'use client';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Modal from '@/components/ui/Modal';
import Progress, { StampProgress } from '@/components/ui/Progress';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { Input, InputGroup, InputIcon } from '@/components/ui/Input';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/Table';
import { getCustomers } from '@/lib/customer-api';
import { mapCustomer } from '@/lib/mappers';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const PER_PAGE = 8;

export default function Customers() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await getCustomers({ search, page, limit: PER_PAGE });
        setCustomers(data.customers.map(mapCustomer));
        setTotal(data.total);
        setPages(data.pages || 1);
      } catch {
        setCustomers([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, page]);

  return (
    <DashboardLayout>
      <PageHeader
        title="Customers"
        description={`${total} total members`}
      />

      <div className="relative mb-5 max-w-sm">
        <InputGroup>
          <InputIcon><Search size={16} /></InputIcon>
          <Input
            className="pl-10"
            placeholder="Search by name or phone…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            aria-label="Search customers"
          />
        </InputGroup>
      </div>

      <Card padding={false} className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : (
          <Table>
            <TableHead>
              <TableRow className="border-b border-line">
                <TableHeader>Customer</TableHeader>
                <TableHeader>Phone</TableHeader>
                <TableHeader>Progress</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Joined</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-body py-12">
                    No customers yet. Share your join link to get started.
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((c) => (
                  <TableRow
                    key={c.id}
                    className="cursor-pointer hover:bg-canvas/60"
                    onClick={() => setSelected(c)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar name={c.name} size="sm" />
                        <span className="font-medium text-ink">{c.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-body text-sm">{c.phone}</TableCell>
                    <TableCell>
                      <StampProgress value={c.stamps} max={c.goal} className="w-24" />
                    </TableCell>
                    <TableCell>
                      <Badge variant={c.status === 'rewarded' ? 'warning' : 'success'}>
                        {c.status === 'rewarded' ? 'Reward ready' : 'Active'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted text-sm">{c.joined}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      {pages > 1 && (
        <div className="flex items-center justify-between mt-5">
          <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft size={14} /> Previous
          </Button>
          <span className="text-sm text-muted">Page {page} of {pages}</span>
          <Button variant="secondary" size="sm" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
            Next <ChevronRight size={14} />
          </Button>
        </div>
      )}

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name}>
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar name={selected.name} size="lg" />
              <div>
                <p className="font-semibold text-ink">{selected.name}</p>
                <p className="text-sm text-body">{selected.phone}</p>
                {selected.email && <p className="text-sm text-muted">{selected.email}</p>}
              </div>
            </div>
            <Progress value={selected.stamps} max={selected.goal} showLabel />
            <p className="text-xs text-muted">Joined {selected.joined}</p>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
