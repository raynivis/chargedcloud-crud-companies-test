import TableRow from './TableRow';

const TableBody = ({ companies, onView, onEdit, onDelete }) => (
    <tbody>
        {companies.map((company, index) => (
            <TableRow
                key={index}
                company={company}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        ))}
    </tbody>
);

export default TableBody;
