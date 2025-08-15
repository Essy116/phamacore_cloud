import { useState, useEffect, useRef } from 'react';
import Header from '../UI/header';
import UserForm from '../components/UserForm.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { Toast, ToastContainer } from 'react-bootstrap';
import DisplayCard from '../components/DisplayCard.jsx';
import { getAllPackages } from '../APIS/packageApi.js';
import TableData from '../components/TableData.jsx';
import {
  getCurrentUser,
  createClient,
  getPhamacorePricing,
  updateSelectionAPI,
  getSelections,
} from '../APIS/formApi';

export default function Form() {
  const location = useLocation();
  const formRef = useRef(null);
  const navigate = useNavigate();

  const [maxTrainingDays, setMaxTrainingDays] = useState({});
  const [phone, setPhone] = useState('');
  const [packages, setPackages] = useState([]);
  const [clientType, setClientType] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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
    const { name, value } = e.target;

    const processedValue =
      name === 'billingCycle' ? parseInt(value, 10) : value;

    setPost((prev) => ({ ...prev, [name]: processedValue }));

    const updatedData = { ...post, [name]: processedValue };

    if (
      name === 'additionalNotes' ||
      name === 'userCount' ||
      name === 'branchCount' ||
      name === 'billingCycle'
    ) {
      updateSelection(updatedData);
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

    if (!values.organisationName) errors.organisationName = 'Required';
    if (!values.userCount) errors.userCount = 'Required';
    if (!values.phone) errors.phone = 'Required';
    if (!values.email) errors.email = 'Required';
    if (!values.packageId) errors.packageId = 'Required';
    if (!values.branchCount) errors.branchCount = 'Required';
    if (!values.fullname) errors.fullname = 'Required';
    if (!values.additionalNotes) errors.additionalNotes = 'Required';

    setFormErrors(errors);
    return Object.keys(errors).length > 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (handleErrors(post)) return;

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

  function capitalize(str) {
    if (typeof str !== 'string' || !str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

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
        roleId: roleId ?? 0,
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
        billingCycle: selections?.billingCycle ?? 0,
        additionalNotes: selections?.additionalInfo ?? '',
      }));

      setClientType(userType ?? '');
      setPhone(phoneNo ?? '');
    } catch (error) {
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
        billingCycle: billingCycle ?? 0,
        additionalNotes: additionalInfo ?? '',
      }));
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

    const payload = {
      packageId: Number(
        data.packageId ||
          JSON.parse(localStorage.getItem('packages'))?.selectedPackageId ||
          2
      ),
      userCount: Number(data.userCount) || 0,
      branchCount: Number(data.branchCount) || 0,
      billingCycle: Number(data.billingCycle || 0),
      additionalInfo: data.additionalNotes || '',
    };

    try {
      await updateSelectionAPI(payload, token);
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
    const { userCount, branchCount } = post;
    if (userCount && branchCount) {
      getPhamacorePricing(userCount, branchCount)
        .then((response) => {
          const pricingData = Array.isArray(response.data)
            ? response.data[0] || {}
            : response.data || {};

          const packageKey = String(
            selectedPackage.split(' ')[1] || ''
          ).toLowerCase();

          const filteredData = {};
          for (let [key, value] of Object.entries(pricingData)) {
            if (key.toLowerCase().includes(packageKey)) {
              filteredData[key] = value;
            }
          }
          setData(filteredData);
        })
        .catch((err) => {
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
                  <h5 className="d-flex justify-content-start p-1">Biodata</h5>
                  <UserForm
                    formRef={formRef}
                    handleSubmit={handleSubmit}
                    clientType={clientType}
                    post={post}
                    handleChange={handleChange}
                    formErrors={formErrors}
                    phone={phone}
                    handleContact={handleContact}
                    isClientOrPending={isClientOrPending}
                    packages={packages}
                    handlePackageSelection={handlePackageSelection}
                    maxTrainingDays={maxTrainingDays}
                    selectedPackage={selectedPackage}
                  />
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
                  <h5 className="d-flex justify-content-start p-1">
                    Purchase Summary
                  </h5>

                  <div className="d-flex justify-content-center">
                    <div
                      className="card shadow mb-1"
                      style={{
                        maxWidth: '1000px',
                        width: '100%',
                        margin: '0',
                        borderRadius: '10px',
                        overflow: 'hidden',
                      }}
                    >
                      <div className="card-body">
                        <DisplayCard
                          selectedPackage={selectedPackage}
                          post={post}
                          maxTrainingDays={maxTrainingDays}
                        />
                      </div>
                    </div>
                  </div>
                  <hr className="my-3" />

                  <div style={{ padding: '10px' }}>
                    <TableData
                      data={data}
                      selectedPackage={selectedPackage}
                      capitalize={capitalize}
                      totalAnnual={totalAnnual}
                    />

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
    </>
  );
}
