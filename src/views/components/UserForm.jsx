import React from 'react';
import PhoneInput from 'react-phone-input-2';

const UserForm = ({
  formRef,
  handleSubmit,
  clientType,
  post,
  handleChange,
  formErrors,
  phone,
  handleContact,
  isClientOrPending,
  packages,
  handlePackageSelection,
  maxTrainingDays,
  selectedPackage,
}) => {
  return (
    <div>
      <form ref={formRef} onSubmit={handleSubmit} autoComplete="off">
        <div className="row mb-1">
          <div className="col-md-12">
            <label htmlFor="fullname" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              readOnly={clientType === 'Client'}
              className="form-control form-control-sm"
              value={post.fullname}
              onChange={handleChange}
              style={{ fontSize: '14px' }}
            />
            {formErrors.fullname && (
              <p className="text-danger">{formErrors.fullname}</p>
            )}
          </div>
        </div>

        <div className="row mb-1">
          <div className="col-md-6 pe-2">
            <label htmlFor="emailAddress" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="emailAddress"
              name="emailAddress"
              readOnly={clientType === 'Client'}
              className="form-control form-control-sm"
              value={post.email}
              onChange={handleChange}
              style={{ fontSize: '14px' }}
            />
            {formErrors.emailAddress && (
              <p className="text-danger">{formErrors.emailAddress}</p>
            )}
          </div>

          <div className="col-md-6 ps-2">
            <label htmlFor="phone" className="form-label">
              Phone Number
            </label>
            <div className="phone-number-container">
              <PhoneInput
                country={'ke'}
                inputClass="form-control form-control-sm"
                value={phone}
                autoComplete="off"
                disabled={clientType === 'Client'}
                onChange={handleContact}
                inputProps={{
                  id: 'phone',
                  name: 'phone',
                }}
                inputStyle={{
                  width: '100%',
                  backgroundColor: isClientOrPending ? 'white' : 'white',
                  fontSize: '12px',
                  lineHeight: '1.5',
                  height: 'calc(1.6em + 0.5rem + 2px)',
                }}
                masks={{ ke: '... ... ...' }}
              />
              {formErrors.phone && (
                <p className="text-danger">{formErrors.phone}</p>
              )}
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-12">
            <label htmlFor="companyName" className="form-label">
              Organisation Name
            </label>
            <input
              type="text"
              id="psCompanyName"
              name="organisationName"
              readOnly={clientType === 'Client'}
              className="form-control form-control-sm"
              value={post.organisationName}
              onChange={handleChange}
              style={{ fontSize: '14px' }}
            />
            {formErrors.psCompanyName && (
              <p className="text-danger">{formErrors.psCompanyName}</p>
            )}
          </div>
        </div>

        <h5 className="d-flex justify-content-start p-1">Plan Details</h5>
        <div className="row">
          <div className="col-md">
            <select
              id="packages"
              disabled={clientType === 'Client'}
              name="packageId"
              className="form-select form-control form-control-sm"
              value={post.packageId || ''}
              style={{ fontSize: '14px', backgroundColor: 'white' }}
              onChange={handlePackageSelection}
            >
              {packages.map((pkg) => (
                <option key={pkg.packageId} value={pkg.packageId}>
                  {pkg.packageName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md">
            <select
              id="billingCycle"
              disabled={clientType === 'Client'}
              name="billingCycle"
              className="form-select form-control form-control-sm"
              style={{ fontSize: '14px', backgroundColor: 'white' }}
              value={post.billingCycle}
              onChange={handleChange}
            >
              <option value={0}>Monthly</option>
              <option value={1}>Quarterly</option>
              <option value={2}>Annual</option>
            </select>
            {formErrors.billingCycle && (
              <p className="text-danger">{formErrors.billingCycle}</p>
            )}
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-md-4 pe-0">
            <label htmlFor="branchCount" className="form-label">
              Branches
            </label>
            <input
              type="number"
              id="branchCount"
              name="branchCount"
              readOnly={clientType === 'Client'}
              className="form-control form-control-sm"
              value={post.branchCount}
              onChange={handleChange}
              min="0"
              style={{ fontSize: '14px' }}
            />
            {formErrors.branchCount && (
              <p className="text-danger">{formErrors.branchCount}</p>
            )}
          </div>

          <div className="col-md-4">
            <label htmlFor="userCount" className="form-label">
              Users
            </label>
            <input
              type="number"
              readOnly={clientType === 'Client'}
              id="userCount"
              name="userCount"
              className="form-control form-control-sm"
              value={post.userCount}
              onChange={handleChange}
              min="0"
              style={{ fontSize: '14px' }}
            />
            {formErrors.userCount && (
              <p className="text-danger">{formErrors.userCount}</p>
            )}
          </div>

          <div className="col-md-4 ps-0">
            <label htmlFor="trainingDays" className="form-label">
              Training Sessions
            </label>
            <input
              type="number"
              id="trainingDays"
              name="trainingDays"
              className="form-control form-control-sm"
              style={{ fontSize: '14px' }}
              value={maxTrainingDays[selectedPackage] || ''}
              readOnly
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <label htmlFor="additionalNotes" className="form-label">
              Additional Notes
            </label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              readOnly={clientType === 'Client'}
              className="form-control form-control-sm"
              onChange={handleChange}
              value={post.additionalNotes}
              placeholder="Additional information"
              style={{ fontSize: '14px', height: '200px' }}
            />
            {formErrors.additionalNotes && (
              <p className="text-danger">{formErrors.additionalNotes}</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
