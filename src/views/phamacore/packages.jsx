import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../components/Card';

const packagesList = [
  {
    packageId: 'lite',
    packageNum: '001',
    packageName: 'phAMACore Lite',
    description: 'phAMACore Lite',
  },
  {
    packageId: 'standard',
    packageNum: '002',
    packageName: 'phAMACore Standard',
    description: 'phAMACore Standard',
  },
  {
    packageId: 'enterprise',
    packageNum: '003',
    packageName: 'phAMACore Enterprise',
    description: 'phAMACore Enterprise',
  },
];

export default function Packages() {
  const location = useLocation();
  const navigate = useNavigate();
  const [packagess, setPackages] = useState([]);
  const [packageCode, setPackageCode] = useState('');
  const [showToast] = useState(false);
  const [toastMessage] = useState('');
  const [toastVariant] = useState('danger');

  const [selectedPackage, setSelectedPackage] = useState(
    JSON.parse(localStorage.getItem('packages'))?.selectedPackage ||
      'phAMACore Standard'
  );

  const packageTrainingDays = {
    'phAMACore Lite': '6 to 8',
    'phAMACore Standard': '8 to 10',
    'phAMACore Enterprise': '8 to 10',
  };

  useEffect(() => {
    const savedPackage = JSON.parse(localStorage.getItem('packages'));
    if (savedPackage) {
      setSelectedPackage(savedPackage.selectedPackage);
      setPackageCode(savedPackage.packageID);
    }
    setPackages(packagesList);
  }, []);

  const handleCardClick2 = (packageItem) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.userType === 'Client') {
      return;
    }

    const updatedPackageCode = packagesList.find(
      (pkg) => pkg.description === packageItem.packageName
    )?.packageNum;

    setPackageCode(updatedPackageCode);
    setSelectedPackage(packageItem.packageName);

    localStorage.setItem(
      'packages',
      JSON.stringify({
        selectedPackage: packageItem.packageName,
        packageID: packageItem.packageId,
      })
    );
  };

  const handleNextClick = () => {
    console.log('Next button clicked');
    const maxTrainingDays =
      packageTrainingDays[selectedPackage]?.split(' to ')[1];
    navigate('/login', {
      replace: true,
      state: {
        selectedPackage,
        maxTrainingDays,
        from: location.pathname,
        packageCode,
      },
    });

    localStorage.setItem(
      'packages',
      JSON.stringify({
        selectedPackage,
        packageCode,
        packageID: packageCode,
      })
    );
  };

  return (
    <Card
      packagess={packagess}
      selectedPackage={selectedPackage}
      packageTrainingDays={packageTrainingDays}
      showToast={showToast}
      toastMessage={toastMessage}
      toastVariant={toastVariant}
      handleCardClick2={handleCardClick2}
      handleNextClick={handleNextClick}
    />
  );
}
