import React from 'react';

const TableData = ({ data, selectedPackage, capitalize, totalAnnual }) => {
  const headerStyle = {
    fontSize: '14px',
    lineHeight: '1.0',
    fontWeight: '600',
    color: 'black',
    padding: '10px',
  };
  return (
    <>
      <div className="table-container">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th className="text-start" style={headerStyle}>
                Pricing Plan
              </th>
              <th className="text-center" style={headerStyle}>
                Amount (Ksh)
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: 'Branch Configuration', key: 'totalConfiguration' },
              { label: 'Training Sessions', key: 'totalTraining' },
              { label: 'User Subscription', key: 'totalUserAccess' },
              { label: 'Hosting Fee', key: 'totalHosting' },
              { label: 'Annual Maintenance', key: 'totalSupport' },
            ].map((item, index) => (
              <tr key={index} className="text-start">
                <td>
                  <p>{item.label}</p>
                </td>
                <td className="text-center">
                  <p>
                    {new Intl.NumberFormat('en-GB').format(
                      data[
                        `${item.key}${capitalize(
                          selectedPackage.split(' ')[1]
                        )}`
                      ] || 0
                    )}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-end">
        <div className="table-container" style={{ width: '100%' }}>
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th className="text-start" style={headerStyle}>
                  Cost Summary
                </th>
                <th className="text-center" style={headerStyle}>
                  Amount (Ksh)
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  label: 'Total',
                  value: Object.values(data).reduce((a, c) => a + c, 0),
                },
                {
                  label: 'VAT (16%)',
                  value: 0.16 * Object.values(data).reduce((a, c) => a + c, 0),
                },
                {
                  label: 'Inclusive',
                  value: Object.values(data).reduce((a, c) => a + c, 0) * 1.16,
                },
              ].map((row, idx) => (
                <tr key={idx}>
                  <td className="text-start">
                    <strong>
                      <p>{row.label}</p>
                    </strong>
                  </td>
                  <td className="text-center">
                    <strong>
                      <p>
                        {new Intl.NumberFormat('en-GB').format(row.value)} Ksh
                      </p>
                    </strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="d-flex justify-content-start">
        <div className="table-container" style={{ width: '100%' }}>
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th className="text-center" style={headerStyle}>
                  One Off (Ksh)
                </th>
                <th className="text-center" style={headerStyle}>
                  Annual (Ksh)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center">
                  <strong>
                    <p style={{ margin: '0' }}>
                      {new Intl.NumberFormat('en-GB').format(
                        (data[
                          `totalConfiguration${capitalize(
                            selectedPackage.split(' ')[1]
                          )}`
                        ] || 0) +
                          (data[
                            `totalHosting${capitalize(
                              selectedPackage.split(' ')[1]
                            )}`
                          ] || 0) +
                          (data[
                            `totalTraining${capitalize(
                              selectedPackage.split(' ')[1]
                            )}`
                          ] || 0)
                      )}{' '}
                      Ksh
                    </p>
                  </strong>
                </td>
                <td className="text-center">
                  <strong>
                    <p style={{ margin: '0' }}>
                      {new Intl.NumberFormat('en-GB').format(totalAnnual)} Ksh
                    </p>
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TableData;
