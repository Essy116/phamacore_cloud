import React, { useState, useEffect, useRef } from 'react';
import Header from '../UI/header';
import PhoneInput from 'react-phone-input-2';
import axios from 'axios';
import { Navigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

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

  const user = JSON.parse(localStorage.getItem('user'));

  

 const isClientOrPending = user?.userType === 'Client' || user?.userType === 'Pending';

const [selectedPackage, setSelectedPackage] = useState(() => {
  if (!isClientOrPending) {
    const stored = JSON.parse(localStorage.getItem('packages'));
    return stored?.selectedPackage || 'phAMACore Standard';
  }
  return '';
});

  const [phone, setPhone] = useState('');

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [clientType, setClientType] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('danger');
const [packageList, setPackageList] = useState([]);

  const [packageDetails, setPackageDetails] = useState({
    trainingDaysMin: 0,
    trainingDaysMax: 0,
    characteristics: [],
  });

  const [post, setPost] = useState({
    psUserCount: '',
    psBranchCount: '',
    packageId:'',
    additionalNotes: '',
    billingCycle: '',
    phone: '',
    email: '',
    organisationName: '',
    fullname: '',
  });

  const [data, setData] = useState([]);
  useEffect(() => {
    const { psUserCount, psBranchCount } = post;

    if (psUserCount && psBranchCount) {
      getPhamacorePricing(psUserCount, psBranchCount)
        .then((response) => {
          const pricingData = response.data?.[0] || {};
          const packageKey = String(
            selectedPackage.split(' ')[1]
          ).toLowerCase();

          const filteredData = {};
          for (let [key, value] of Object.entries(pricingData)) {
            if (key.toLowerCase().includes(packageKey)) {
              filteredData[key] = value;
            }
          }

          console.log('Filtered Data:', filteredData);
          setData(filteredData);
        })
        .catch((err) => {
          console.error('Pricing Fetch Error:', err);
          setToastMessage(
            err.response?.data?.message ||
              'An error occurred while fetching pricing.'
          );
          setToastVariant('danger');
          setShowToast(true);
        });
    }
  }, [post.psUserCount, post.psBranchCount, selectedPackage]);
  
  const handleSelect = (pkg) => {
    setSelectedPackage(pkg);
  };
useEffect(() => {
  const saved = JSON.parse(localStorage.getItem('packages'));

  if (saved) {
    setSelectedPackage(saved.selectedPackage || 'phAMACore Standard');
    setPost((prev) => ({
      ...prev,
      packageId: saved.selectedPackageId || '',
    }));
    setPackageList(saved.packageList || []);
  }
}, []);



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
      name === 'psUserCount' ||
      name === 'psBranchCount' ||
      name === 'billingCycle'
    ) {
      updateSelection(data);
    }
  };
 const handlePackageSelect = (e) => {
  const selectedId = e.target.value;
  const selectedPkg = packageList.find((p) => p.packageId === Number(selectedId));

  const pkgName = selectedPkg?.packageName || 'phAMACore Standard';

  // Update local state
  setSelectedPackage(pkgName);
  setPost((prev) => ({
    ...prev,
    packageId: selectedId,
  }));

  // Sync to localStorage
  const stored = JSON.parse(localStorage.getItem('packages')) || {};
  localStorage.setItem(
    'packages',
    JSON.stringify({
      ...stored,
      selectedPackage: pkgName,
      selectedPackageId: selectedId,
      packageList: stored.packageList || packageList,
    })
  );

  console.log('📦 Selected package:', pkgName);
  console.log('📦 Selected ID:', selectedId);
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
    // ;
    if (!isClientOrPending) return `Phamacore ${str}`;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleRadioChange = (event) => {
    handleChange(event);
    toggleDropdown();
  };

  const monthlyAmount = totalAnnual / 12;
  const quarterlyAmount = totalAnnual / 4;

const getUserData = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;
  if (!token) return;

  try {
    const response = await getCurrentUser(token);

    // ✅ Add this to see the full API response in console
    console.log('👤 getCurrentUser response:', response);

    const {
      phone,
      organisationName,
      fullname,
      userType,
      email,
      userId,
      roleId,
      clientPackage,
      packageId,
      userCount,
      branchCount,
      billingCycle,
      additionalInfo,
    } = response.data;

    const phoneNo = phone?.startsWith('0') ? '254' + phone.slice(1) : phone;

    const savedPackage = JSON.parse(localStorage.getItem('packages'));
    const selectedPackageName = savedPackage?.selectedPackage || clientPackage || 'phAMACore Standard';
    const selectedPackageId = savedPackage?.selectedPackageId || packageId || '';

    setPost((prev) => ({
      ...prev,
      organisationName,
      fullname,
      email,
      clientPackage: selectedPackageName,
      phone: phoneNo || '',
      userId: userId || '',
      roleId: roleId || '',
      psUserCount: userCount,
      psBranchCount: branchCount,
      packageId: selectedPackageId,
      billingCycle,
      additionalNotes: additionalInfo || '',
    }));

    setClientType(userType);
    setPhone(phoneNo);
    setSelectedPackage(selectedPackageName);

    // 🔍 Log selected values for confirmation
    console.log('📦 Selected Package Name:', selectedPackageName);
    console.log('📦 Selected Package ID:', selectedPackageId);

  } catch (error) {
    console.error('❌ getCurrentUser error:', error); // 🔍 show full error
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
  const isClientOrPending =
    user?.userType === 'Client' || user?.userType === 'Pending';

  if (!token || !isClientOrPending) return;

  try {
    const response = await getSelections(token);
    const {
      userCount,
      branchCount,
      billingCycle,
      additionalInfo,
      clientPackage,
    } = response.data.selections || {};

    const savedPackage = JSON.parse(localStorage.getItem('packages'));
    const selectedPackageName =
      savedPackage?.selectedPackage || clientPackage || 'phAMACore Standard';
    const selectedPackageId = savedPackage?.selectedPackageId || '';

    setPost((prev) => ({
      ...prev,
      psUserCount: userCount,
      psBranchCount: branchCount,
      billingCycle,
      
      clientPackage: selectedPackageName,
      additionalNotes: additionalInfo || '',
    }));

    setSelectedPackage(selectedPackageName);
  } catch (error) {
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

  const savedPackage = JSON.parse(localStorage.getItem('packages'));
  const selectedPackageName = savedPackage?.selectedPackage || data.clientPackage || 'phAMACore Standard';

  const payload = {
    clientPackage: selectedPackageName,
    userCount: Number(data.psUserCount) || 0,
    branchCount: Number(data.psBranchCount) || 0,
    billingCycle: data.billingCycle || 'MONTHLY',
    additionalInfo: data.additionalNotes || '',
  };

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


  const handleErrors = (values) => {
    const errors = {};

    if (!values.organisationName) {
      errors.organisationName = 'Required';
    }
    if (!values.psUserCount) {
      errors.psUserCount = 'Required';
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
    if (!values.psBranchCount) {
      errors.psBranchCount = 'Required';
    }
    if (!values.fullname) {
      errors.fullname = 'Required';
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
      psUserCount: Number(post.psUserCount) || 0,
      psBranchCount: Number(post.psBranchCount) || 0,
      packageId: Number(post.packageId) || 2,
      additionalNotes: post.additionalNotes || '',
    };

    try {
      const response = await createClient(payload, token);

      const data = response.data;

      console.log('API Response:', data);

      setPhone('');
      setPost({
        psUserCount: '',
        psBranchCount: '',
        packageId:
          JSON.parse(localStorage.getItem('packages'))?.packageID || 'Standard',
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
          trainingDaysMax: packageDetails.trainingDaysMax,
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


  useEffect(() => {
    getUserData();
    fetchSelections();
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
                          autocomplete="off"
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
                          autocomplete="off"
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
                          autocomplete="off"
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
  onChange={handlePackageSelect}
  style={{
    fontSize: '14px',
    backgroundColor: 'white',
  }}
>
  {packageList.map((pkg) => (
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
                          id="psBranchCount"
                          name="psBranchCount"
                          readOnly={clientType === 'Client'}
                          className="form-control form-control-sm"
                          value={post.psBranchCount}
                          onChange={handleChange}
                          min="0"
                          style={{
                            fontSize: '14px',
                          }}
                        />
                        {formErrors.psBranchCount && (
                          <p className="text-danger">
                            {formErrors.psBranchCount}
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
                          id="psUserCount"
                          name="psUserCount"
                          className="form-control form-control-sm"
                          value={post.psUserCount}
                          onChange={handleChange}
                          min="0"
                          style={{
                            fontSize: '14px',
                          }}
                        />
                        {formErrors.psUserCount && (
                          <p className="text-danger">
                            {formErrors.psUserCount}
                          </p>
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
                          value={packageDetails.trainingDaysMax}
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
                              {post.psBranchCount}
                            </p>
                          </div>
                          <div className="col text-center">
                            <p className="card-title mb-1">Users</p>
                            <p
                              className="card-text  mb-0"
                              style={{ color: '#C58C4F', fontSize: '14px' }}
                            >
                              {post.psUserCount}
                            </p>
                          </div>
                          <div className="col text-center">
                            <p className="card-title mb-1">Training Sessions</p>
                            <p
                              className="card-text mb-0"
                              style={{ color: '#C58C4F', fontSize: '14px' }}
                            >
                              {packageDetails.trainingDaysMax}
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
                        {/* First Table */}
                        <table className="table table-bordered">
                          <thead className="table-light">
                            <tr>
                              <th
                                scope="col"
                                className="text-start"
                                style={{
                                  fontSize: '14px',
                                  // fontFamily: "Poppins",
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
                                  // fontFamily: "Poppins, sans-serif",
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
                      {/* Second Table */}
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
                                    // fontFamily: "Poppins",
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
                                    // fontFamily: "Poppins, sans-serif",
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
                                    // fontFamily: "Poppins",
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
                                    // fontFamily: "Poppins, sans-serif",
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
