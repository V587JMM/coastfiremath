import { type coastAgeRows, dollars } from '~/lib/calculator';

export function AgeTable({ rows, caption }: { rows: ReturnType<typeof coastAgeRows>; caption: string }) {
  return (
    <table className="age-table">
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">Starting age</th>
          <th scope="col">Years to grow</th>
          <th scope="col">Coast number</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ age, years, coast }) => (
          <tr key={age}>
            <th scope="row">{age}</th>
            <td>{years}</td>
            <td>{dollars(coast)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
