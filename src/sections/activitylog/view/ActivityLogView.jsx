import { useState, useEffect, useCallback } from 'react';
import isEqual from 'lodash/isEqual';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
import Scrollbar from 'src/components/scrollbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// api
import { useFetchAllLog, useFetchLogActionType } from 'src/utils/logs';
//
import ActivityLogTableRow from '../activity-log-table-row';
import LogTableToolbar from '../log-table-toolbar';
import LogTableFiltersResult from '../log-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'user', label: 'User' },
  { id: 'action', label: 'Action' },
  { id: 'description', label: 'Description' },
  { id: 'ip_address', label: 'IP Address' },
  { id: 'date', label: 'Date' },
];

const defaultFilters = {
  name: '',
  action: [],
  dateRange: [null, null],
};

// ----------------------------------------------------------------------

export default function ActivityLogView() {
  const table = useTable();
  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);

  const { data: logData, isLoading } = useFetchAllLog();
  const { data: logActionType } = useFetchLogActionType();

  useEffect(() => {
    if (logData?.logs) {
      setTableData(logData.logs);
    }
  }, [logData]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 60 : 80;
  const isNotFound = !dataFiltered.length && !isLoading;
  const canReset = !isEqual(defaultFilters, filters);

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Activity Logs"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          { name: 'Activity Logs' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <LogTableToolbar
          filters={filters}
          onFilters={handleFilters}
          actionOptions={logActionType || []}
        />

        {canReset && (
          <LogTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            onResetFilters={handleResetFilters}
            results={dataFiltered.length}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                onSort={table.onSort}
              />

              <TableBody>
                {isLoading ? (
                  [...Array(table.rowsPerPage)].map((_, index) => (
                    <TableSkeleton key={index} sx={{ height: denseHeight }} />
                  ))
                ) : (
                  <>
                    {dataInPage.map((row) => (
                      <ActivityLogTableRow key={row.id} row={row} />
                    ))}
                  </>
                )}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                />

                <TableNoData notFound={isNotFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={dataFiltered.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, action, dateRange } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  // Filter by name (username or description)
  if (name) {
    inputData = inputData.filter(
      (log) =>
        log.username.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        log.description.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  // Filter by action type
  if (action.length) {
    inputData = inputData.filter((log) => action.includes(log.action));
  }

  // Filter by date range
  if (dateRange[0] && dateRange[1]) {
    inputData = inputData.filter((log) => {
      const logDate = new Date(log.created_at).getTime();
      return logDate >= dateRange[0].getTime() && logDate <= dateRange[1].getTime();
    });
  }

  return inputData;
}
