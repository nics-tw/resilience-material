import React from "react";
import styles from "./styles.module.css";

export default function VerticalTable({
  data,
}: {
  data: Record<string, React.ReactNode>;
}) {
  return (
    <section>
      <table>
        <tbody>
          {Object.entries(data).map(([key, value]) => (
            <tr key={key}>
              <th scope="row" className={styles.verticalTableHeader}>
                {key}
              </th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
