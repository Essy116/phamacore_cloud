import { useState, useEffect, useRef } from 'react';
import Header from '../UI/header';
import PhoneInput from 'react-phone-input-2';

import { Navigate, useLocation } from 'react-router-dom';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getAllPackages } from '../APIS/packageApi';

import {
  getCurrentUser,
  createClient,
  getPhamacorePricing,
  updateSelectionAPI,
  getSelections,
  // updatePackageSelection,
} from '../APIS/formApi';

export default function Form() {
  const location = useLocation();
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [maxTrainingDays, setMaxTrainingDays] = useState({});
  const [phone, setPhone] = useState('');
  const [packages, setPackages] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [clientType, setClientType] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [toastVariant, setToastVariant] = useState('danger');
  const user = JSON.parse(localStorage.getItem('user'));

  const isClientOrPending =
    user?.userType === 'Client' || user?.userType === 'Pending';

  const [post, setPost] = useState({
    userCount: '',
    branchCount: '',
    packageId:
      JSON.parse(localStorage.getItem('packages'))?.selectedPackageId || 2,
    additionalNotes: '',
    clientPackage: '',
    billingCycle: '',
    phone: '',
    email: '',
    organisationName: '',
    fullname: '',
  });
  const [selectedPackage, setSelectedPackage] = useState(
    JSON.parse(localStorage.getItem('packages'))?.selectedPackage ||
      'phAMACore Standard'
  );
  const [data, setData] = useState([]);

  const handleContact = (value) => {
    setPhone(value);
    setPost((prevPost) => ({
      ...prevPost,
      phone: value,
    }));
  };

  const handleChange = (e) => {
    setPost((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const { name } = e.target;
    const data = { ...post, [name]: e.target.value };
    if (
      name === 'additionalNotes' ||
      name === 'userCount' ||
      name === 'branchCount' ||
      name === 'billingCycle'
    ) {
      updateSelection(data);
    }
  };

  const handlePackageSelection = (e) => {
    const packageId = Number(e.target.value);
    const pkg = packages.find((p) => p.packageId === packageId);
    if (!pkg) return;

    setPost((prev) => ({
      ...prev,
      [e.target.name]: packageId,
    }));

    setSelectedPackage(pkg.packageName);

    const storedPackages = JSON.parse(localStorage.getItem('packages')) || {};
    localStorage.setItem(
      'packages',
      JSON.stringify({
        ...storedPackages,
        selectedPackage: pkg.packageName,
        selectedPackageId: packageId,
      })
    );

    const updatedData = { ...post, [e.target.name]: packageId };
    updateSelection(updatedData);
  };

  const handleErrors = (values) => {
    const errors = {};

    if (!values.organisationName) {
      errors.organisationName = 'Required';
    }
    if (!values.userCount) {
      errors.userCount = 'Required';
    }

    if (!values.phone) {
      errors.phone = 'Required';
    }

    if (!values.email) {
      errors.email = 'Required';
    }

    if (!values.packageId) {
      errors.packageId = 'Required';
    }
    if (!values.branchCount) {
      errors.branchCount = 'Required';
    }
    if (!values.fullname) {
      errors.fullname = 'Required';
    }
    if (!values.additionalNotes) {
      errors.additionalNotes = 'Required';
    }
    setFormErrors(errors);
    console.log(errors);
    return Object.keys(errors).length > 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (handleErrors(post)) {
      return;
    }
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    if (!token) return;

    setIsLoading(true);

    const payload = {
      psUserCount: Number(post.userCount) || 0,
      psBranchCount: Number(post.branchCount) || 0,
      packageId:
        Number(post.packageId) ||
        JSON.parse(localStorage.getItem('packages'))?.selectedPackageId ||
        2,
      additionalNotes: post.additionalNotes || '',
    };

    try {
      const response = await createClient(payload, token);

      const data = response.data;

      console.log('API Response:', data);

      setPhone('');
      setPost({
        userCount: '',
        branchCount: '',
        packageId:
          JSON.parse(localStorage.getItem('packages'))?.selectedPackageId || 2,

        additionalNotes: '',
      });

      setToastMessage(data.message || 'Form submitted successfully!');
      setToastVariant('success');
      setShowToast(true);

      navigate('/summary', {
        state: {
          data,
          formData: post,
          initialPackage: selectedPackage,
          summary: data,
        },
      });

      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      console.error('API Error:', err);

      setToastMessage(
        err.response?.data?.message ||
          'There was an error submitting the form. Please try again.'
      );
      setToastVariant('danger');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const totalAnnual =
    (data[
      `totalUserAccess${capitalize(String(selectedPackage.split(' ')[1]))}`
    ] || 0) +
    (data[`totalSupport${capitalize(String(selectedPackage.split(' ')[1]))}`] ||
      0);

  const total = Object.values(data).reduce((acc, curr) => acc + curr, 0) || 0;
  const vat = 0.16 * total;
  const inclusive = total + vat;
  const oneOff =
    (data[`totalConfiguration${capitalize(selectedPackage.split(' ')[1])}`] ||
      0) +
    (data[`totalHosting${capitalize(selectedPackage.split(' ')[1])}`] || 0) +
    (data[`totalTraining${capitalize(selectedPackage.split(' ')[1])}`] || 0);

  localStorage.setItem(
    'pricingData',
    JSON.stringify({
      total,
      vat,
      inclusive,
      oneOff,
      initialPackage: selectedPackage,
      annual: totalAnnual,
    })
  );

  const handleButtonClick = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };
  function capitalize(str) {
    if (typeof str !== 'string' || !str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const monthlyAmount = totalAnnual / 12;
  const quarterlyAmount = totalAnnual / 4;

  const getUserData = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    if (!token) return;

    try {
      const response = await getCurrentUser(token);
      const {
        phone,
        organisationName,
        fullname,
        userType,
        email,
        userId,
        roleId,
        selections,
      } = response.data;

      const phoneNo = phone?.startsWith('0') ? '254' + phone.slice(1) : phone;

      setPost((prev) => ({
        ...prev,
        userId: userId ?? '',
        roleId: roleId ?? '',
        fullname: fullname ?? '',
        email: email ?? '',
        phone: phoneNo ?? '',
        organisationName: organisationName ?? '',
        userType: userType ?? '',
        packageId:
          selections?.packageId ??
          JSON.parse(localStorage.getItem('packages'))?.selectedPackageId ??
          2,
        userCount: selections?.userCount ?? 0,
        branchCount: selections?.branchCount ?? 0,
        billingCycle: (selections?.billingCycle ?? 'MONTHLY').toUpperCase(),
        additionalNotes: selections?.additionalInfo ?? '',
      }));

      setClientType(userType ?? '');
      setPhone(phoneNo ?? '');
      console.log('User data fetched successfully:currentUser', response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      const msg =
        error.response?.data?.detail ||
        'Failed to fetch user data. Please log in again.';
      setToastMessage(msg);
      setToastVariant('danger');
      setShowToast(true);
    }
  };

  const fetchSelections = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;

    if (!token) return;

    try {
      const response = await getSelections(token);
      const {
        packageId,
        userCount,
        branchCount,
        billingCycle,
        additionalInfo,
      } = response?.data?.selections || {};

      setPost((prev) => ({
        ...prev,
        packageId:
          packageId ??
          JSON.parse(localStorage.getItem('packages'))?.selectedPackageId ??
          2,
        userCount: userCount ?? 0,
        branchCount: branchCount ?? 0,
        billingCycle: (billingCycle ?? 'MONTHLY').toUpperCase(),
        additionalNotes: additionalInfo ?? '',
      }));

      console.log(
        '✅ Selections fetched successfully:get',
        response?.data?.selections
      );
    } catch (error) {
      console.error('❌ Error fetching selections:', error);
      const msg =
        error.response?.data?.detail ||
        'Failed to fetch selections. Please try again.';
      setToastMessage(msg);
      setToastVariant('danger');
      setShowToast(true);
    }
  };
  const updateSelection = async (data) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    if (!token) return;

    const payload = {
      request: {
        packageId: Number(
          data.packageId ||
            JSON.parse(localStorage.getItem('packages'))?.selectedPackageId ||
            2
        ),
        userCount: Number(data.userCount) || 0,
        branchCount: Number(data.branchCount) || 0,
        billingCycle: (data.billingCycle || 'MONTHLY').toUpperCase(),
        additionalInfo: data.additionalNotes || '',
      },
    };

    console.log('📦 Sending selection update payload: PUT', payload);

    try {
      const response = await updateSelectionAPI(payload, token);
      console.log('✅ Update Selection Response:', response.data);
    } catch (error) {
      console.error(
        '❌ Error updating selection:',
        error.response?.data || error.message
      );
    }
  };

  const fetchPackages = async () => {
    try {
      const packages = await getAllPackages();
      setPackages(packages);
    } catch (error) {
      setToastMessage(error);
      setToastVariant('danger');
      setShowToast(true);
    }
  };
  useEffect(() => {
    getUserData();
    fetchPackages();
    fetchSelections();
  }, []);
  useEffect(() => {
    console.log('🎁 Selected Package:', selectedPackage);

    const { userCount, branchCount } = post;

    if (userCount && branchCount) {
      getPhamacorePricing(userCount, branchCount)
        .then((response) => {
          console.log('📡 Raw API Response:', response.data);

          const pricingData = Array.isArray(response.data)
            ? response.data[0] || {}
            : response.data || {};

          console.log('📦 Pricing Data (first entry):', pricingData);

          const packageKey = String(
            selectedPackage.split(' ')[1] || ''
          ).toLowerCase();

          const filteredData = {};
          for (let [key, value] of Object.entries(pricingData)) {
            if (key.toLowerCase().includes(packageKey)) {
              filteredData[key] = value;
            }
          }

          console.log('🎯 Filtered Data:', filteredData);
          setData(filteredData);
        })
        .catch((err) => {
          console.error('❌ Pricing Fetch Error:', err);
          setToastMessage(
            err.response?.data?.message ||
              'An error occurred while fetching pricing.'
          );
          setToastVariant('danger');
          setShowToast(true);
        });
    }
  }, [post.userCount, post.branchCount, selectedPackage]);
  useEffect(() => {
    const pkg = packages.find((p) => p.packageId === Number(post.packageId));
    if (pkg && pkg.packageName !== selectedPackage) {
      setSelectedPackage(pkg.packageName);
    }
  }, [post.packageId, packages, selectedPackage]);
  useEffect(() => {
    const stored = localStorage.getItem('maxTrainingDays');
    if (stored) {
      setMaxTrainingDays(JSON.parse(stored));
    }
  }, []);

  return (
    <>
      <Header locationpath={location?.pathname ?? ''} />
      <ToastContainer
        position="top-center"
        className="position-fixed top-0 start-50 translate-middle-x p-3"
        style={{ zIndex: 9999 }}
      >
        <Toast
          bg={toastVariant}
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={5000}
          autohide
        >
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <div
        className="container-fluid  justify-content-center"
        style={{ padding: '30px 0 30px 0' }}
      >
        <div className="d-flex justify-content-center align-items-center">
          <div className="row ">
            <div className="col-md-6 pe-2">
              <div
                className="card shadow h-100"
                style={{ maxWidth: '600px', margin: '0 ' }}
              >
                <div className="card-body">
                  {' '}
                  <h5
                    className="d-flex justify-content-start p-1"
                    style={{
                      padding: '0px',
                    }}
                  >
                    Biodata{' '}
                  </h5>
                  <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    autoComplete="off"
                  >
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
                          className="form-control form-control-sm  "
                          value={post.fullname}
                          onChange={handleChange}
                          style={{
                            fontSize: '14px',
                          }}
                        />
                        {formErrors.fullname && (
                          <p className="text-danger">{formErrors.fullname}</p>
                        )}
                      </div>
                    </div>
                    <div className="row mb-1">
                      <div className="col-md-6 pe-2 ">
                        <label htmlFor="emailAddress" className="form-label">
                          Email Address
                        </label>
                        <input
                          type="emailAddress"
                          id="emailAddress"
                          name="emailAddress"
                          readOnly={clientType === 'Client'}
                          className="form-control form-control-sm "
                          value={post.email}
                          onChange={handleChange}
                          style={{
                            fontSize: '14px',
                          }}
                        />
                        {formErrors.emailAddress && (
                          <p className="text-danger">
                            {formErrors.emailAddress}
                          </p>
                        )}
                      </div>

                      <div className="col-md-6 ps-2">
                        <label htmlFor="phone" className="form-label">
                          Phone Number
                        </label>
                        <div className="phone-number-container">
                          <PhoneInput
                            country={'ke'}
                            inputClass="form-control form-control-sm "
                            value={phone}
                            autocomplete="off"
                            disabled={clientType === 'Client'}
                            onChange={handleContact}
                            inputProps={{
                              id: 'phone',
                              name: 'phone',
                            }}
                            inputStyle={{
                              width: '100%',
                              backgroundColor: isClientOrPending
                                ? 'white'
                                : 'white',
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
                          Organisation Name{' '}
                        </label>
                        <input
                          type="text"
                          id="psCompanyName"
                          name="organisationName"
                          readOnly={clientType === 'Client'}
                          className="form-control form-control-sm"
                          value={post.organisationName}
                          onChange={handleChange}
                          style={{
                            fontSize: '14px',
                          }}
                        />
                        {formErrors.psCompanyName && (
                          <p className="text-danger">
                            {formErrors.psCompanyName}
                          </p>
                        )}
                      </div>
                    </div>
                    <h5 className="d-flex justify-content-start p-1" style={{}}>
                      Plan Details
                    </h5>
                    <div className="row">
                      <div className="col-md">
                        <select
                          id="packages"
                          disabled={clientType === 'Client'}
                          name="packageId"
                          className="form-select form-control form-control-sm"
                          value={post.packageId || ''}
                          style={{
                            fontSize: '14px',
                            backgroundColor: 'white',
                          }}
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
                          <option value="MONTHLY">Monthly</option>
                          <option value="QUARTERLY">Quarterly</option>
                          <option value="ANNUAL">Annual</option>
                        </select>
                        {formErrors.billingCycle && (
                          <p className="text-danger">
                            {formErrors.billingCycle}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="row mb-2">
                      <div className="col-md-4 pe-0">
                        <label htmlFor="psBranchCount" className="form-label">
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
                          style={{
                            fontSize: '14px',
                          }}
                        />
                        {formErrors.branchCount && (
                          <p className="text-danger">
                            {formErrors.branchCount}
                          </p>
                        )}
                      </div>

                      <div className="col-md-4 ">
                        <label htmlFor="psUserCount" className="form-label">
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
                          style={{
                            fontSize: '14px',
                          }}
                        />
                        {formErrors.userCount && (
                          <p className="text-danger">{formErrors.userCount}</p>
                        )}
                      </div>

                      <div className="col-md-4  ps-0 ">
                        <label htmlFor="trainingDays" className="form-label">
                          Training Sessions{' '}
                        </label>
                        <input
                          type="number"
                          id="trainingDays"
                          name="trainingDays"
                          className="form-control form-control-sm "
                          style={{
                            fontSize: '14px',
                          }}
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
                          style={{
                            fontSize: '14px',
                            height: '200px',
                          }}
                        />
                        {formErrors.additionalNotes && (
                          <p className="text-danger">
                            {formErrors.additionalNotes}
                          </p>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-md-6 ps-2">
              <div
                className="card shadow h-100"
                style={{
                  maxWidth: '600px',
                  margin: '0 ',

                  borderRadius: '10px',
                  overflow: 'hidden',
                }}
              >
                <div className="card-body">
                  <h5 className="d-flex justify-content-start p-1" style={{}}>
                    Purchase Summary
                  </h5>

                  <div className="d-flex justify-content-center">
                    <div
                      className="card shadow mb-1 "
                      style={{
                        maxWidth: '1000px',
                        width: '100%',
                        margin: '0',
                        borderRadius: '10px',
                        overflow: 'hidden',
                      }}
                    >
                      <div className="card-body">
                        <div className="row  g-0">
                          <h6
                            className="d-flex justify-content-center p-0"
                            style={{
                              color: '#C58C4F',
                            }}
                          >
                            {selectedPackage}
                          </h6>
                          <div className="col text-center mb-1">
                            <p className="card-title ">Branches</p>
                            <p
                              className="card-text  mb-0"
                              style={{ color: '#C58C4F', fontSize: '14px' }}
                            >
                              {post.branchCount}
                            </p>
                          </div>
                          <div className="col text-center">
                            <p className="card-title mb-1">Users</p>
                            <p
                              className="card-text  mb-0"
                              style={{ color: '#C58C4F', fontSize: '14px' }}
                            >
                              {post.userCount}
                            </p>
                          </div>
                          <div className="col text-center">
                            <p className="card-title mb-1">Training Sessions</p>
                            <p
                              className="card-text mb-0"
                              style={{ color: '#C58C4F', fontSize: '14px' }}
                            >
                              {maxTrainingDays[selectedPackage] || ''}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="my-3" />

                  <div>
                    <div style={{ padding: '10px' }}>
                      <div className="table-container">
                        <table className="table table-bordered">
                          <thead className="table-light">
                            <tr>
                              <th
                                scope="col"
                                className="text-start"
                                style={{
                                  fontSize: '14px',

                                  lineHeight: '1.0',
                                  fontWeight: '600',
                                  color: 'black',
                                  padding: '10px',
                                }}
                              >
                                Pricing Plan
                              </th>
                              <th
                                scope="col"
                                className="text-center"
                                style={{
                                  fontSize: '14px',

                                  lineHeight: '1.0',
                                  fontWeight: '600',
                                  color: 'black',
                                  padding: '10px',
                                }}
                              >
                                Amount (Ksh)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              {
                                label: 'Branch Configuration',
                                key: 'totalConfiguration',
                              },
                              {
                                label: 'Training Sessions',
                                key: 'totalTraining',
                              },
                              {
                                label: 'User Subscription',
                                key: 'totalUserAccess',
                              },
                              { label: 'Hosting Fee', key: 'totalHosting' },
                              {
                                label: 'Annual Maintenance',
                                key: 'totalSupport',
                              },
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
                        <div
                          className="table-container"
                          style={{ width: '100%' }}
                        >
                          <table className="table table-bordered">
                            <thead className="table-light">
                              <tr>
                                <th
                                  scope="col"
                                  className="text-start"
                                  style={{
                                    fontSize: '14px',

                                    lineHeight: '1.0',
                                    fontWeight: '600',
                                    color: 'black',
                                    padding: '10px',
                                  }}
                                >
                                  Cost Summary
                                </th>
                                <th
                                  scope="col"
                                  className="text-center"
                                  style={{
                                    fontSize: '14px',

                                    lineHeight: '1.0',
                                    fontWeight: '600',
                                    color: 'black',
                                    padding: '10px',
                                  }}
                                >
                                  Amount (Ksh)
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="text-start">
                                  <strong>
                                    <p>Total</p>
                                  </strong>
                                </td>
                                <td className="text-center">
                                  <strong>
                                    <p>
                                      {new Intl.NumberFormat('en-GB').format(
                                        Number(
                                          Object.values(data).reduce(
                                            (acc, curr) => acc + curr,
                                            0
                                          )
                                        ) || 0
                                      )}{' '}
                                      Ksh
                                    </p>
                                  </strong>
                                </td>
                              </tr>

                              <tr>
                                <td className="text-start">
                                  <strong>
                                    <p>VAT (16%)</p>
                                  </strong>
                                </td>
                                <td className="text-center">
                                  <strong>
                                    <p>
                                      {new Intl.NumberFormat('en-GB').format(
                                        Number(
                                          0.16 *
                                            Object.values(data).reduce(
                                              (acc, curr) => acc + curr,
                                              0
                                            )
                                        )
                                      )}{' '}
                                      Ksh
                                    </p>
                                  </strong>
                                </td>
                              </tr>

                              <tr>
                                <td className="text-start">
                                  <strong>
                                    <p>Inclusive </p>
                                  </strong>
                                </td>
                                <td className="text-center">
                                  <strong>
                                    <p>
                                      {new Intl.NumberFormat('en-GB').format(
                                        Number(
                                          0.16 *
                                            Object.values(data).reduce(
                                              (acc, curr) => acc + curr,
                                              0
                                            ) +
                                            Object.values(data).reduce(
                                              (acc, curr) => acc + curr,
                                              0
                                            )
                                        )
                                      )}{' '}
                                      Ksh
                                    </p>
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="d-flex justify-content-start">
                        <div
                          className="table-container"
                          style={{ width: '100%' }}
                        >
                          <table className="table table-bordered">
                            <thead className="table-light">
                              <tr>
                                <th
                                  scope="col"
                                  className="text-center"
                                  style={{
                                    fontSize: '14px',

                                    lineHeight: '1.0',
                                    fontWeight: '600',
                                    color: 'black',
                                    padding: '10px',
                                  }}
                                >
                                  One Off (Ksh)
                                </th>
                                <th
                                  scope="col"
                                  className="text-center"
                                  style={{
                                    fontSize: '14px',

                                    lineHeight: '1.0',
                                    fontWeight: '600',
                                    color: 'black',
                                    padding: '10px',
                                  }}
                                >
                                  Annual (Ksh)
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="text-start">
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
                                      {new Intl.NumberFormat('en-GB').format(
                                        totalAnnual
                                      )}{' '}
                                      Ksh
                                    </p>
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {clientType !== 'Client' && (
                        <div className="d-flex justify-content-center">
                          <button
                            type="submit"
                            className="btn text-white custom-btn"
                            onClick={handleButtonClick}
                            disabled={isLoading}
                            style={{
                              backgroundColor: '#C58C4F',
                              borderColor: '#C58C4F',
                              color: '#FFF',
                              fontSize: '14px',
                            }}
                          >
                            {isLoading ? (
                              <div
                                className="spinner-border text-primary"
                                role="status"
                              ></div>
                            ) : (
                              'Place Order'
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
