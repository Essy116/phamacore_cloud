import Header from '../UI/header';
import PropTypes from 'prop-types';

export default function Card({
  packagess,
  selectedPackage,
  packageTrainingDays,

  handleCardClick2,
  handleNextClick,
}) {
  const cardStyle = (packageId) => ({
    border: selectedPackage === packageId ? '5px solid #C58C4F' : 'none',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transform: selectedPackage === packageId ? 'scale(1.05)' : 'none',
    position: 'relative',
  });

  return (
    <>
      <Header locationpath={'/'} />
      <div className="background-style"></div>
      <div className="container custom-container">
        <h4 className="heading-text">SELECT THE PLAN THAT SUITS YOU</h4>

        <div className="row justify-content-center">
          {Array.isArray(packagess) &&
            packagess.map((item) => (
              <div className="col-md-4" key={item.packageId}>
                <div
                  className="card h-100 w-80 shadow-lg package-card"
                  style={cardStyle(item.packageName)}
                  onClick={() => handleCardClick2(item)}
                >
                  {item.packageName === 'phAMACore Standard' && (
                    <div className="popular-badge">Most Popular</div>
                  )}

                  <div className="card-text-top shadow d-flex justify-content-center align-items-center">
                    <h5 className="mb-0">{item.packageName}</h5>
                    <input
                      type="radio"
                      name="package"
                      className={`radio-button ${
                        selectedPackage === item.packageName
                          ? 'radio-button-checked'
                          : ''
                      }`}
                      checked={selectedPackage === item.packageName}
                      onChange={() => handleCardClick2(item)}
                    />
                  </div>
                  <div className="card-body d-flex flex-column">
                    <p className="package-desc">
                      {item.packageName} characteristics include:
                    </p>
                    <ul className="list-unstyled">
                      {(item.features || []).map((feature, index) => (
                        <li key={index}>
                          <i className="bi bi-check-lg"></i> {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="footnote">
                      Training Sessions: {packageTrainingDays[item.packageName]}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="d-flex justify-content-end">
          <button
            className="btn btn-sm my-5 next-btn"
            onClick={() => {
              console.log('Button clicked inside Card');
              handleNextClick();
            }}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

Card.propTypes = {
  packagess: PropTypes.array,
  selectedPackage: PropTypes.string,
  packageTrainingDays: PropTypes.object,
  toastMessage: PropTypes.string,
  toastVariant: PropTypes.string,
  handleCardClick2: PropTypes.func,
  handleNextClick: PropTypes.func.isRequired,
};
